/**
 * APIKeyManager Component
 * Standalone component for managing API keys across different providers
 * Design: Modern Minimalist with secure key display and management
 */

import { useState } from 'react';
import { Eye, EyeOff, Trash2, Plus, Copy, Check } from 'lucide-react';
import { useAPIKeyManager } from '@/hooks/useAPIKeyManager';
import { maskAPIKey } from '@/lib/encryption';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', color: 'bg-green-100 text-green-800' },
  { id: 'anthropic', name: 'Anthropic', color: 'bg-blue-100 text-blue-800' },
  { id: 'google', name: 'Google', color: 'bg-red-100 text-red-800' },
  { id: 'cohere', name: 'Cohere', color: 'bg-purple-100 text-purple-800' },
];

export default function APIKeyManager() {
  const {
    apiKeys,
    rememberKeys,
    isLoading,
    saveAPIKey,
    getAPIKey,
    deleteAPIKey,
    hasAPIKey,
    isKeyRemembered,
  } = useAPIKeyManager();

  const [newProvider, setNewProvider] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [rememberNewKey, setRememberNewKey] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleAddKey = () => {
    if (!newProvider || !newApiKey) {
      toast.error('Please select provider and enter API key');
      return;
    }

    if (saveAPIKey(newProvider, newApiKey, rememberNewKey)) {
      toast.success(`API key for ${newProvider} saved successfully`);
      setNewProvider('');
      setNewApiKey('');
      setRememberNewKey(false);
    } else {
      toast.error('Failed to save API key');
    }
  };

  const handleDeleteKey = (provider: string) => {
    if (confirm(`Delete API key for ${provider}?`)) {
      if (deleteAPIKey(provider)) {
        toast.success(`API key for ${provider} deleted`);
        setVisibleKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(provider);
          return newSet;
        });
      } else {
        toast.error('Failed to delete API key');
      }
    }
  };

  const toggleKeyVisibility = (provider: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(provider)) {
        newSet.delete(provider);
      } else {
        newSet.add(provider);
      }
      return newSet;
    });
  };

  const handleCopyKey = (provider: string) => {
    const apiKey = getAPIKey(provider);
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopiedKey(provider);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const getProviderInfo = (providerId: string) => {
    return PROVIDERS.find((p) => p.id === providerId);
  };

  if (isLoading) {
    return (
      <div className="card-elevated p-6 text-center">
        <p className="text-muted-foreground">Loading API keys...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New API Key */}
      <div className="card-elevated p-6">
        <h3 className="subsection-title">Add New API Key</h3>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Provider
              </label>
              <select
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                className="input-field bg-background text-foreground"
              >
                <option value="">Select Provider</option>
                {PROVIDERS.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                API Key
              </label>
              <Input
                type="password"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember-new"
              checked={rememberNewKey}
              onChange={(e) => setRememberNewKey(e.target.checked)}
              className="w-4 h-4 rounded border-border cursor-pointer"
            />
            <label
              htmlFor="remember-new"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember this API key
            </label>
          </div>

          <Button
            onClick={handleAddKey}
            className="btn-primary px-4 py-2 rounded w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add API Key
          </Button>
        </div>
      </div>

      {/* Saved API Keys */}
      <div className="card-elevated p-6">
        <h3 className="subsection-title">Saved API Keys</h3>

        {apiKeys.size === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No API keys saved yet. Add one above to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {Array.from(apiKeys.keys()).map((provider) => {
              const providerInfo = getProviderInfo(provider);
              const apiKey = getAPIKey(provider);
              const isVisible = visibleKeys.has(provider);
              const isCopied = copiedKey === provider;

              return (
                <div
                  key={provider}
                  className="border border-border rounded-lg p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 flex items-center gap-3">
                    {providerInfo && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${providerInfo.color}`}
                      >
                        {providerInfo.name}
                      </span>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-mono text-foreground">
                        {isVisible ? apiKey : maskAPIKey(apiKey || '')}
                      </p>
                      {isKeyRemembered(provider) && (
                        <p className="text-xs text-accent mt-1">
                          ✓ Remembered
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleKeyVisibility(provider)}
                      className="p-2 hover:bg-muted rounded transition-colors"
                      title={isVisible ? 'Hide' : 'Show'}
                    >
                      {isVisible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleCopyKey(provider)}
                      className="p-2 hover:bg-muted rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteKey(provider)}
                      className="p-2 hover:bg-destructive/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>🔒 Security Notice:</strong> API keys are encrypted and stored
          locally in your browser. Never share your API keys with anyone. We
          recommend using environment variables in production.
        </p>
      </div>
    </div>
  );
}
