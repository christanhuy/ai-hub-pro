/**
 * useAPIProviderManager Hook
 * Manages API Providers for AI tools
 */

import { useState, useEffect, useCallback } from 'react';
import { APIProvider } from '@/types';
import { nanoid } from 'nanoid';
import { encryptData, decryptData } from '@/lib/encryption';

const STORAGE_KEY = 'ai-hub-api-providers';

export function useAPIProviderManager() {
  const [providers, setProviders] = useState<APIProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load providers from localStorage
  useEffect(() => {
    const loadProviders = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const decrypted = decryptData(stored);
          const parsed = JSON.parse(decrypted);
          setProviders(parsed);
        }
      } catch (error) {
        console.error('Failed to load API providers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, []);

  const saveProvider = useCallback(
    (
      name: string,
      provider: 'openai' | 'anthropic' | 'google' | 'cohere' | 'mistral' | 'custom',
      apiKey: string,
      isDefault?: boolean
    ) => {
      try {
        const newProvider: APIProvider = {
          id: nanoid(),
          name,
          provider,
          apiKey,
          isDefault: isDefault || false,
          createdAt: new Date(),
        };

        const updated = isDefault
          ? [
              ...providers.map((p) => ({ ...p, isDefault: false })),
              newProvider,
            ]
          : [...providers, newProvider];

        const encrypted = encryptData(JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEY, encrypted);
        setProviders(updated);
        return true;
      } catch (error) {
        console.error('Failed to save API provider:', error);
        return false;
      }
    },
    [providers]
  );

  const updateProvider = useCallback(
    (id: string, updates: Partial<APIProvider>) => {
      try {
        const updated = providers.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        );

        const encrypted = encryptData(JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEY, encrypted);
        setProviders(updated);
        return true;
      } catch (error) {
        console.error('Failed to update API provider:', error);
        return false;
      }
    },
    [providers]
  );

  const deleteProvider = useCallback(
    (id: string) => {
      try {
        const updated = providers.filter((p) => p.id !== id);
        const encrypted = encryptData(JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEY, encrypted);
        setProviders(updated);
        return true;
      } catch (error) {
        console.error('Failed to delete API provider:', error);
        return false;
      }
    },
    [providers]
  );

  const getProviderById = useCallback(
    (id: string) => {
      return providers.find((p) => p.id === id);
    },
    [providers]
  );

  const getDefaultProvider = useCallback(() => {
    return providers.find((p) => p.isDefault);
  }, [providers]);

  const getProvidersByType = useCallback(
    (type: string) => {
      return providers.filter((p) => p.provider === type);
    },
    [providers]
  );

  return {
    providers,
    isLoading,
    saveProvider,
    updateProvider,
    deleteProvider,
    getProviderById,
    getDefaultProvider,
    getProvidersByType,
  };
}
