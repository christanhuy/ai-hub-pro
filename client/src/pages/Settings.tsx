/**
 * Settings Page
 * Manage application settings, API keys, and preferences
 * Design: Modern Minimalist with tabbed interface
 */

import { useState } from 'react';
import { Key, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import APIKeyManager from '@/components/APIKeyManager';
import ExportImportData from '@/components/ExportImportData';
import { useAPIKeyManager } from '@/hooks/useAPIKeyManager';
import { toast } from 'sonner';

type SettingsTab = 'api-keys' | 'preferences' | 'data';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('api-keys');
  const { clearAllKeys } = useAPIKeyManager();

  const handleClearAllData = () => {
    if (
      confirm(
        'Are you sure you want to delete all AI tools and API keys? This action cannot be undone.'
      )
    ) {
      try {
        localStorage.removeItem('ai-hub-tools');
        clearAllKeys();
        toast.success('All data cleared successfully');
      } catch (error) {
        toast.error('Failed to clear data');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your API keys and application preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'api-keys'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="w-4 h-4 inline mr-2" />
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'preferences'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <SettingsIcon className="w-4 h-4 inline mr-2" />
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'data'
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            Data Management
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl">
          {activeTab === 'api-keys' && (
            <div>
              <APIKeyManager />
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card-elevated p-6 space-y-6">
              <div>
                <h3 className="subsection-title">Display Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Show Pricing Tiers by Default
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically expand pricing tiers when viewing AI tools
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-border cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Show Advanced Options
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Display additional configuration options in forms
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-border cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Enable Notifications
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Receive notifications for important actions
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-border cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="subsection-title">API Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Default API Provider
                    </label>
                    <select className="input-field bg-background text-foreground">
                      <option value="">Auto-detect</option>
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      API Timeout (seconds)
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      min="5"
                      max="300"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-6 border-t border-border">
                <Button className="btn-primary px-6 py-2 rounded">
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="card-elevated p-6 space-y-6">
              <div>
                <h3 className="subsection-title">Data Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your application data and storage
                </p>

                <div className="border border-border rounded-lg p-4">
                  <ExportImportData />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="subsection-title text-destructive">
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These actions cannot be undone
                </p>

                <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/5">
                  <h4 className="font-semibold text-foreground mb-2">
                    Clear All Data
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Delete all AI tools, pricing tiers, and saved API keys
                  </p>
                  <Button
                    onClick={handleClearAllData}
                    className="bg-destructive text-white hover:bg-destructive/90 px-4 py-2 rounded flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
