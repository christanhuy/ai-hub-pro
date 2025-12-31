/**
 * Basic encryption utilities for API key management
 * Uses base64 encoding with a simple XOR cipher for client-side storage
 * Note: This is basic encryption suitable for localStorage. For production,
 * consider using more robust encryption libraries like TweetNaCl.js
 */

const ENCRYPTION_KEY = 'ai-hub-pro-secret-key-2024';

/**
 * Simple XOR cipher for basic encryption
 */
function xorEncrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}

/**
 * Encrypt API key for storage
 */
export function encryptAPIKey(apiKey: string): string {
  try {
    const encrypted = xorEncrypt(apiKey, ENCRYPTION_KEY);
    return btoa(encrypted); // Base64 encode
  } catch (error) {
    console.error('Encryption error:', error);
    return apiKey;
  }
}

/**
 * Decrypt API key from storage
 */
export function decryptAPIKey(encryptedKey: string): string {
  try {
    const decrypted = xorEncrypt(atob(encryptedKey), ENCRYPTION_KEY); // Base64 decode
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedKey;
  }
}

/**
 * Mask API key for display (show only last 4 characters)
 */
export function maskAPIKey(apiKey: string): string {
  if (apiKey.length <= 4) {
    return '****';
  }
  return '•'.repeat(apiKey.length - 4) + apiKey.slice(-4);
}

/**
 * Generate a hash of API key for validation
 */
export function hashAPIKey(apiKey: string): string {
  let hash = 0;
  for (let i = 0; i < apiKey.length; i++) {
    const char = apiKey.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
