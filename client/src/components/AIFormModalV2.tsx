/**
 * AIFormModalV2 Component
 * Enhanced form for adding/editing AI tools with all fields
 * Design: Gradient Modern with inline AI suggestion
 */

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import { AITool, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAIInfoFetcher } from '@/hooks/useAIInfoFetcher';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/ErrorAlert';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

interface AIFormModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: AITool) => void;
  initialData?: AITool;
  categories: Category[];
}

interface FormData {
  name: string;
  description: string;
  provider: string;
  website: string;
  advantages: string[];
  disadvantages: string[];
  version: string;
  supportVietnamese: boolean;
  lastUpdatedDate: string;
  notes: string;
  categoryId: string;
  pricingTiers: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly';
    features?: string[];
  }>;
}

const DEFAULT_FORM_STATE: FormData = {
  name: '',
  description: '',
  provider: '',
  website: '',
  advantages: [],
  disadvantages: [],
  version: '',
  supportVietnamese: false,
  lastUpdatedDate: '',
  notes: '',
  categoryId: '',
  pricingTiers: [],
};

export default function AIFormModalV2({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}: AIFormModalV2Props) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_STATE);
  const [newPrice, setNewPrice] = useState('');
  const [newPriceName, setNewPriceName] = useState('');
  const [newPriceCurrency, setNewPriceCurrency] = useState('USD');
  const [newPriceBilling, setNewPriceBilling] = useState<'monthly' | 'yearly'>('monthly');

  const { isLoading: isFetching, error: fetchError, data: aiInfo, fetchAIInfo, reset: resetFetcher } = useAIInfoFetcher();
  const [suggestionsFor, setSuggestionsFor] = useState<string | null>(null);

  // Initialize form
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        provider: initialData.provider,
        website: initialData.website || '',
        advantages: initialData.advantages || [],
        disadvantages: initialData.disadvantages || [],
        version: initialData.version || '',
        supportVietnamese: initialData.supportVietnamese || false,
        lastUpdatedDate: initialData.lastUpdatedDate?.toString().split('T')[0] || '',
        notes: initialData.notes || '',
        categoryId: initialData.categoryId || '',
        pricingTiers: initialData.pricingTiers || [],
      });
    } else {
      setFormData(DEFAULT_FORM_STATE);
    }
    resetFetcher();
  }, [isOpen, initialData, resetFetcher]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddAdvantage = () => {
    setFormData((prev) => ({
      ...prev,
      advantages: [...prev.advantages, ''],
    }));
  };

  const handleUpdateAdvantage = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.advantages];
      updated[index] = value;
      return { ...prev, advantages: updated };
    });
  };

  const handleRemoveAdvantage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index),
    }));
  };

  const handleAddDisadvantage = () => {
    setFormData((prev) => ({
      ...prev,
      disadvantages: [...prev.disadvantages, ''],
    }));
  };

  const handleUpdateDisadvantage = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.disadvantages];
      updated[index] = value;
      return { ...prev, disadvantages: updated };
    });
  };

  const handleRemoveDisadvantage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      disadvantages: prev.disadvantages.filter((_, i) => i !== index),
    }));
  };

  const handleAddPrice = () => {
    if (!newPriceName.trim() || !newPrice.trim()) {
      toast.error('Please fill in price name and amount');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      pricingTiers: [
        ...prev.pricingTiers,
        {
          id: nanoid(),
          name: newPriceName,
          price: parseFloat(newPrice),
          currency: newPriceCurrency,
          billingCycle: newPriceBilling,
          features: [],
        },
      ],
    }));

    setNewPriceName('');
    setNewPrice('');
    setNewPriceCurrency('USD');
    setNewPriceBilling('monthly');
  };

  const handleRemovePrice = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((p) => p.id !== id),
    }));
  };

  const handleFetchAIInfo = async (field: string) => {
    if (!formData.name.trim()) {
      toast.error('Please enter AI name first');
      return;
    }

    setSuggestionsFor(field);
    // TODO: Implement API provider selection
    toast.info('API Provider selection coming soon');
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.provider.trim()) {
      toast.error('Please fill in AI name and provider');
      return;
    }

    const newTool: AITool = {
      id: initialData?.id || nanoid(),
      name: formData.name,
      description: formData.description,
      provider: formData.provider,
      website: formData.website,
      advantages: formData.advantages.filter((a) => a.trim()),
      disadvantages: formData.disadvantages.filter((d) => d.trim()),
      version: formData.version,
      supportVietnamese: formData.supportVietnamese,
      lastUpdatedDate: formData.lastUpdatedDate ? new Date(formData.lastUpdatedDate) : undefined,
      notes: formData.notes,
      categoryId: formData.categoryId,
      pricingTiers: formData.pricingTiers.map((tier) => ({
        ...tier,
        features: tier.features || [],
      })),
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(newTool);
    toast.success(`AI tool ${initialData ? 'updated' : 'created'} successfully`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-elevated w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-gradient-to-r from-purple-600/10 to-cyan-500/10">
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  AI Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., ChatGPT"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Provider
                </label>
                <Input
                  value={formData.provider}
                  onChange={(e) => handleInputChange('provider', e.target.value)}
                  placeholder="e.g., OpenAI"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Website
                </label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Version
                </label>
                <Input
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  placeholder="e.g., 4.0"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="input-field bg-white text-gray-900 border border-gray-300"
                >
                  <option value="" className="bg-white text-gray-900">Select Category</option>
                  {categories
                    .filter((cat) => cat.id !== 'home')
                    .map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-white text-gray-900">
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Last Updated
                </label>
                <Input
                  type="date"
                  value={formData.lastUpdatedDate}
                  onChange={(e) => handleInputChange('lastUpdatedDate', e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="supportViet"
                  checked={formData.supportVietnamese}
                  onChange={(e) => handleInputChange('supportVietnamese', e.target.checked)}
                  className="w-4 h-4 rounded border-border cursor-pointer"
                />
                <label htmlFor="supportViet" className="text-sm font-medium text-foreground cursor-pointer">
                  Support Vietnamese
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Description
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe this AI tool..."
                className="input-field min-h-24 resize-none"
              />
              <button
                onClick={() => handleFetchAIInfo('description')}
                disabled={isFetching && suggestionsFor === 'description'}
                className="absolute top-2 right-2 p-2 hover:bg-muted rounded transition-colors"
                title="Get AI suggestions"
              >
                <Sparkles className="w-4 h-4 text-accent" />
              </button>
            </div>
          </div>

          {/* Advantages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Advantages</label>
              <button
                onClick={handleAddAdvantage}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.advantages.map((adv, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={adv}
                    onChange={(e) => handleUpdateAdvantage(idx, e.target.value)}
                    placeholder="Advantage..."
                  />
                  <button
                    onClick={() => handleRemoveAdvantage(idx)}
                    className="p-2 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                  <button
                    onClick={() => handleFetchAIInfo('advantages')}
                    disabled={isFetching && suggestionsFor === 'advantages'}
                    className="p-2 hover:bg-muted rounded transition-colors"
                    title="Get AI suggestions"
                  >
                    <Sparkles className="w-4 h-4 text-accent" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Disadvantages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Disadvantages</label>
              <button
                onClick={handleAddDisadvantage}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.disadvantages.map((dis, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={dis}
                    onChange={(e) => handleUpdateDisadvantage(idx, e.target.value)}
                    placeholder="Disadvantage..."
                  />
                  <button
                    onClick={() => handleRemoveDisadvantage(idx)}
                    className="p-2 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                  <button
                    onClick={() => handleFetchAIInfo('disadvantages')}
                    disabled={isFetching && suggestionsFor === 'disadvantages'}
                    className="p-2 hover:bg-muted rounded transition-colors"
                    title="Get AI suggestions"
                  >
                    <Sparkles className="w-4 h-4 text-accent" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Pricing Tiers</label>
              <button
                onClick={handleAddPrice}
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Price
              </button>
            </div>

            {/* Add Price Form */}
            <div className="bg-muted/30 p-3 rounded-lg mb-3 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input
                  value={newPriceName}
                  onChange={(e) => setNewPriceName(e.target.value)}
                  placeholder="Plan name"
                />
                <Input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Price"
                />
                <select
                  value={newPriceCurrency}
                  onChange={(e) => setNewPriceCurrency(e.target.value)}
                  className="input-field bg-white text-gray-900 border border-gray-300"
                >
                  <option value="USD" className="bg-white text-gray-900">USD</option>
                  <option value="EUR" className="bg-white text-gray-900">EUR</option>
                  <option value="VND" className="bg-white text-gray-900">VND</option>
                </select>
                <select
                  value={newPriceBilling}
                  onChange={(e) => setNewPriceBilling(e.target.value as 'monthly' | 'yearly')}
                  className="input-field bg-white text-gray-900 border border-gray-300"
                >
                  <option value="monthly" className="bg-white text-gray-900">Monthly</option>
                  <option value="yearly" className="bg-white text-gray-900">Yearly</option>
                </select>
              </div>
              <Button onClick={handleAddPrice} className="btn-primary w-full px-3 py-2 rounded text-sm">
                Add Tier
              </Button>
            </div>

            {/* Pricing List */}
            <div className="space-y-2">
              {formData.pricingTiers.map((tier) => (
                <div key={tier.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{tier.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tier.currency} {tier.price} / {tier.billingCycle}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemovePrice(tier.id)}
                    className="p-2 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
              className="input-field min-h-20 resize-none"
            />
          </div>

          {/* AI Fetch Error */}
          {fetchError && (
            <ErrorAlert
              message={fetchError}
              title="AI Fetch Error"
              onDismiss={resetFetcher}
              onRetry={() => handleFetchAIInfo(suggestionsFor || 'description')}
            />
          )}

          {/* AI Suggestions */}
          {isFetching && suggestionsFor && (
            <LoadingSpinner message={`Fetching ${suggestionsFor}...`} size="sm" />
          )}

          {aiInfo && suggestionsFor && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Suggestions for {suggestionsFor}</h4>
              <div className="space-y-2">
                {Array.isArray(aiInfo) ? (
                  aiInfo.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-border cursor-pointer" />
                      <p className="text-sm text-foreground">{item}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground">{JSON.stringify(aiInfo)}</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button onClick={handleSave} className="flex-1 btn-primary px-4 py-2 rounded">
              Save AI Tool
            </Button>
            <Button onClick={onClose} className="flex-1 btn-secondary px-4 py-2 rounded">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
