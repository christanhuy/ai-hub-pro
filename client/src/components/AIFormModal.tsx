/**
 * AIFormModal Component
 * Modal form for adding/editing AI tools with pricing tiers
 * Includes AI info fetching and API key management
 * Design: Modern Minimalist with clean form layout
 */

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { AITool, PricingTier, FormState } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAPIKeyManager } from '@/hooks/useAPIKeyManager';
import { useAIInfoFetcher } from '@/hooks/useAIInfoFetcher';
import PricingTierCard from '@/components/PricingTierCard';
import AIInfoSelector from '@/components/AIInfoSelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

interface AIFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: AITool) => void;
  initialData?: AITool;
}

const DEFAULT_FORM_STATE: FormState = {
  name: '',
  description: '',
  provider: '',
  pricingTiers: [],
};

export default function AIFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AIFormModalProps) {
  const [formData, setFormData] = useState<FormState>(DEFAULT_FORM_STATE);
  const [apiKey, setApiKey] = useState('');
  const [rememberKey, setRememberKey] = useState(false);
  const [showAISelector, setShowAISelector] = useState(false);
  const [newTierName, setNewTierName] = useState('');

  const { saveAPIKey, getAPIKey, isKeyRemembered } = useAPIKeyManager();
  const { isLoading: isFetching, error: fetchError, data: aiInfo, fetchAIInfo, reset: resetFetcher } = useAIInfoFetcher();

  // Initialize form with existing data or reset
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        provider: initialData.provider,
        apiProvider: initialData.apiProvider,
        website: initialData.website,
        documentation: initialData.documentation,
        advantages: initialData.advantages,
        disadvantages: initialData.disadvantages,
        highlights: initialData.highlights,
        pricingTiers: initialData.pricingTiers,
      });
    } else {
      setFormData(DEFAULT_FORM_STATE);
    }
    resetFetcher();
  }, [isOpen, initialData, resetFetcher]);

  // Load API key if available
  useEffect(() => {
    if (formData.apiProvider && isOpen) {
      const savedKey = getAPIKey(formData.apiProvider);
      if (savedKey) {
        setApiKey(savedKey);
        setRememberKey(isKeyRemembered(formData.apiProvider));
      }
    }
  }, [formData.apiProvider, isOpen, getAPIKey, isKeyRemembered]);

  const handleFetchAIInfo = async () => {
    if (!apiKey || !formData.name || !formData.apiProvider) {
      toast.error('Please enter API key, AI name, and select provider');
      return;
    }

    // Save API key
    saveAPIKey(formData.apiProvider, apiKey, rememberKey);

    await fetchAIInfo({
      provider: formData.apiProvider as any,
      apiKey,
      aiToolName: formData.name,
    });
  };

  const handleApplyAIInfo = (selected: any, selectedData: any) => {
    setFormData((prev) => ({
      ...prev,
      ...selectedData,
    }));
    setShowAISelector(false);
    resetFetcher();
    toast.success('Information applied successfully');
  };

  const handleAddPricingTier = () => {
    if (!newTierName.trim()) {
      toast.error('Please enter tier name');
      return;
    }

    const newTier: PricingTier = {
      id: nanoid(),
      name: newTierName,
      price: 0,
      currency: 'USD',
      billingCycle: 'monthly',
      features: [],
    };

    setFormData((prev) => ({
      ...prev,
      pricingTiers: [...prev.pricingTiers, newTier],
    }));
    setNewTierName('');
    toast.success('Pricing tier added');
  };

  const handleUpdatePricingTier = (updatedTier: PricingTier) => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((tier) =>
        tier.id === updatedTier.id ? updatedTier : tier
      ),
    }));
    toast.success('Pricing tier updated');
  };

  const handleDeletePricingTier = (tierId: string) => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((tier) => tier.id !== tierId),
    }));
    toast.success('Pricing tier deleted');
  };

  const handleSave = () => {
    if (!formData.name || !formData.provider) {
      toast.error('Please fill in required fields');
      return;
    }

    const tool: AITool = {
      id: initialData?.id || nanoid(),
      name: formData.name,
      description: formData.description,
      provider: formData.provider,
      apiProvider: formData.apiProvider as any,
      website: formData.website,
      documentation: formData.documentation,
      advantages: formData.advantages,
      disadvantages: formData.disadvantages,
      highlights: formData.highlights,
      pricingTiers: formData.pricingTiers,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(tool);
    toast.success(`AI tool ${initialData ? 'updated' : 'created'} successfully`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-elevated w-full max-w-2xl max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {initialData ? 'Edit AI Tool' : 'Add New AI Tool'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                AI Tool Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., ChatGPT"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Provider *
              </label>
              <Input
                value={formData.provider}
                onChange={(e) =>
                  setFormData({ ...formData, provider: e.target.value })
                }
                placeholder="e.g., OpenAI"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Tool description"
              className="input-field resize-none"
              rows={2}
            />
          </div>

          {/* API Configuration */}
          <div className="border-t border-border pt-4">
            <h3 className="subsection-title">AI Information Fetching</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  API Provider
                </label>
                <select
                  value={formData.apiProvider || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apiProvider: e.target.value as any,
                    })
                  }
                  className="input-field bg-background text-foreground"
                >
                  <option value="">Select Provider</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  API Key
                </label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                  className="w-4 h-4 rounded border-border cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember API key
                </label>
              </div>

              {fetchError && (
                <ErrorAlert
                  message={fetchError}
                  title="API Error"
                  onDismiss={resetFetcher}
                  onRetry={handleFetchAIInfo}
                />
              )}

              {isFetching ? (
                <LoadingSpinner message="Fetching AI information..." size="sm" />
              ) : (
                <Button
                  onClick={handleFetchAIInfo}
                  disabled={isFetching}
                  className="btn-primary px-4 py-2 rounded w-full"
                >
                  Fetch Information with AI
                </Button>
              )}

              {aiInfo && !showAISelector && (
                <Button
                  onClick={() => setShowAISelector(true)}
                  className="btn-secondary px-4 py-2 rounded w-full"
                >
                  Review & Apply Information
                </Button>
              )}
            </div>
          </div>

          {/* AI Info Selector */}
          {showAISelector && aiInfo && (
            <AIInfoSelector
              data={aiInfo}
              onApply={handleApplyAIInfo}
              onCancel={() => setShowAISelector(false)}
              isLoading={isFetching}
            />
          )}

          {/* Pricing Tiers */}
          <div className="border-t border-border pt-4">
            <h3 className="subsection-title">Pricing Tiers</h3>
            <div className="space-y-3">
              {formData.pricingTiers.map((tier) => (
                <PricingTierCard
                  key={tier.id}
                  tier={tier}
                  onUpdate={handleUpdatePricingTier}
                  onDelete={handleDeletePricingTier}
                />
              ))}

              <div className="flex gap-2">
                <Input
                  value={newTierName}
                  onChange={(e) => setNewTierName(e.target.value)}
                  placeholder="New tier name"
                />
                <Button
                  onClick={handleAddPricingTier}
                  className="btn-primary px-4 py-2 rounded flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Tier
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-6 border-t border-border">
          <Button
            onClick={handleSave}
            className="btn-primary px-6 py-2 rounded flex-1"
          >
            Save AI Tool
          </Button>
          <Button
            onClick={onClose}
            className="btn-secondary px-6 py-2 rounded flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
