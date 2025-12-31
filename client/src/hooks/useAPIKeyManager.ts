/**
 * Custom hook for managing API keys with encryption and localStorage
 */

import { useState, useCallback, useEffect } from 'react';
import { encryptAPIKey, decryptAPIKey, maskAPIKey } from '@/lib/encryption';
import { APIKeyConfig } from '@/types';

const STORAGE_KEY = 'ai-hub-api-keys';
const REMEMBER_KEY = 'ai-hub-remember-keys';

export function useAPIKeyManager() {
  const [apiKeys, setApiKeys] = useState<Map<string, string>>(new Map());
  const [rememberKeys, setRememberKeys] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load API keys from localStorage on mount
  useEffect(() => {
    const loadKeys = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const remember = localStorage.getItem(REMEMBER_KEY);

        if (stored) {
          const parsed = JSON.parse(stored) as Record<string, string>;
          const keysMap = new Map(Object.entries(parsed));
          setApiKeys(keysMap);
        }

        if (remember) {
          const rememberArray = JSON.parse(remember) as string[];
          const rememberSet = new Set(rememberArray);
          setRememberKeys(rememberSet);
        }
      } catch (error) {
        console.error('Failed to load API keys:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadKeys();
  }, []);

  /**
   * Save API key with optional remember functionality
   */
  const saveAPIKey = useCallback(
    (provider: string, apiKey: string, remember: boolean = false) => {
      try {
        const encrypted = encryptAPIKey(apiKey);
        const newKeys = new Map(apiKeys);
        newKeys.set(provider, encrypted);
        setApiKeys(newKeys);

        // Save to localStorage
        const keysObj = Object.fromEntries(newKeys);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(keysObj));

        // Update remember set
        const newRemember = new Set(rememberKeys);
        if (remember) {
          newRemember.add(provider);
        } else {
          newRemember.delete(provider);
        }
        setRememberKeys(newRemember);
        localStorage.setItem(REMEMBER_KEY, JSON.stringify(Array.from(newRemember)));

        return true;
      } catch (error) {
        console.error('Failed to save API key:', error);
        return false;
      }
    },
    [apiKeys, rememberKeys]
  );

  /**
   * Get decrypted API key
   */
  const getAPIKey = useCallback(
    (provider: string): string | null => {
      try {
        const encrypted = apiKeys.get(provider);
        if (!encrypted) return null;
        return decryptAPIKey(encrypted);
      } catch (error) {
        console.error('Failed to decrypt API key:', error);
        return null;
      }
    },
    [apiKeys]
  );

  /**
   * Get masked API key for display
   */
  const getMaskedAPIKey = useCallback(
    (provider: string): string | null => {
      const apiKey = getAPIKey(provider);
      return apiKey ? maskAPIKey(apiKey) : null;
    },
    [getAPIKey]
  );

  /**
   * Delete API key
   */
  const deleteAPIKey = useCallback(
    (provider: string) => {
      try {
        const newKeys = new Map(apiKeys);
        newKeys.delete(provider);
        setApiKeys(newKeys);

        const keysObj = Object.fromEntries(newKeys);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(keysObj));

        const newRemember = new Set(rememberKeys);
        newRemember.delete(provider);
        setRememberKeys(newRemember);
        localStorage.setItem(REMEMBER_KEY, JSON.stringify(Array.from(newRemember)));

        return true;
      } catch (error) {
        console.error('Failed to delete API key:', error);
        return false;
      }
    },
    [apiKeys, rememberKeys]
  );

  /**
   * Check if API key exists
   */
  const hasAPIKey = useCallback(
    (provider: string): boolean => {
      return apiKeys.has(provider);
    },
    [apiKeys]
  );

  /**
   * Check if API key should be remembered
   */
  const isKeyRemembered = useCallback(
    (provider: string): boolean => {
      return rememberKeys.has(provider);
    },
    [rememberKeys]
  );

  /**
   * Clear all API keys
   */
  const clearAllKeys = useCallback(() => {
    try {
      setApiKeys(new Map());
      setRememberKeys(new Set());
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(REMEMBER_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear API keys:', error);
      return false;
    }
  }, []);

  return {
    apiKeys,
    rememberKeys,
    isLoading,
    saveAPIKey,
    getAPIKey,
    getMaskedAPIKey,
    deleteAPIKey,
    hasAPIKey,
    isKeyRemembered,
    clearAllKeys,
  };
}
