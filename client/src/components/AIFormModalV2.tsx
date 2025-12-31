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
  const [suggestionsFor, setSuggestionsFor] = useState<string | null>(null);
  const [aiInfo, setAIInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        lastUpdatedDate: initialData.lastUpdatedDate
          ? new Date(initialData.lastUpdatedDate).toISOString().split('T')[0]
          : '',
        notes: initialData.notes || '',
        categoryId: initialData.categoryId || '',
        pricingTiers: initialData.pricingTiers || [],
      });
    } else {
      setFormData(DEFAULT_FORM_STATE);
    }
  }, [initialData, isOpen]);

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
    setFormData((prev) => ({
      ...prev,
      advantages: prev.advantages.map((a, i) => (i === index ? value : a)),
    }));
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
    setFormData((prev) => ({
      ...prev,
      disadvantages: prev.disadvantages.map((d, i) => (i === index ? value : d)),
    }));
  };

  const handleRemoveDisadvantage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      disadvantages: prev.disadvantages.filter((_, i) => i !== index),
    }));
  };

  const handleAddPricingTier = () => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: [
        ...prev.pricingTiers,
        {
          id: nanoid(),
          name: '',
          price: 0,
          currency: 'USD',
          billingCycle: 'monthly',
          features: [],
        },
      ],
    }));
  };

  const handleUpdatePricingTier = (id: string, updates: any) => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((tier) =>
        tier.id === id ? { ...tier, ...updates } : tier
      ),
    }));
  };

  const handleRemovePricingTier = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((p) => p.id !== id),
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter AI tool name');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Please select a category');
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
                  AI Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., ChatGPT"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Provider (Optional)
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
                  Last Updated Date
                </label>
                <Input
                  type="date"
                  value={formData.lastUpdatedDate}
                  onChange={(e) => handleInputChange('lastUpdatedDate', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((c) => c.id !== 'home')
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="supportVietnamese"
                  checked={formData.supportVietnamese}
                  onChange={(e) => handleInputChange('supportVietnamese', e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="supportVietnamese" className="text-sm font-medium text-foreground">
                  Supports Vietnamese
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the AI tool..."
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none h-24"
            />
          </div>

          {/* Advantages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Advantages</label>
              <button
                onClick={handleAddAdvantage}
                className="flex items-center gap-1 text-accent hover:text-accent/80 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.advantages.map((adv, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={adv}
                    onChange={(e) => handleUpdateAdvantage(idx, e.target.value)}
                    placeholder="e.g., Fast responses"
                  />
                  <button
                    onClick={() => handleRemoveAdvantage(idx)}
                    className="p-2 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Disadvantages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Disadvantages</label>
              <button
                onClick={handleAddDisadvantage}
                className="flex items-center gap-1 text-accent hover:text-accent/80 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.disadvantages.map((dis, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={dis}
                    onChange={(e) => handleUpdateDisadvantage(idx, e.target.value)}
                    placeholder="e.g., Limited context"
                  />
                  <button
                    onClick={() => handleRemoveDisadvantage(idx)}
                    className="p-2 hover:bg-destructive/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Pricing Tiers</label>
              <button
                onClick={handleAddPricingTier}
                className="flex items-center gap-1 text-accent hover:text-accent/80 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Tier
              </button>
            </div>
            <div className="space-y-4">
              {formData.pricingTiers.map((tier) => (
                <div key={tier.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      value={tier.name}
                      onChange={(e) => handleUpdatePricingTier(tier.id, { name: e.target.value })}
                      placeholder="Tier name"
                    />
                    <Input
                      type="number"
                      value={tier.price}
                      onChange={(e) =>
                        handleUpdatePricingTier(tier.id, { price: parseFloat(e.target.value) })
                      }
                      placeholder="Price"
                    />
                    <select
                      value={tier.currency}
                      onChange={(e) => handleUpdatePricingTier(tier.id, { currency: e.target.value })}
                      className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="VND">VND</option>
                    </select>
                    <select
                      value={tier.billingCycle}
                      onChange={(e) =>
                        handleUpdatePricingTier(tier.id, {
                          billingCycle: e.target.value as 'monthly' | 'yearly',
                        })
                      }
                      className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemovePricingTier(tier.id)}
                    className="w-full p-2 hover:bg-destructive/20 rounded transition-colors text-destructive text-sm"
                  >
                    Remove Tier
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none h-20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border justify-end">
          <Button onClick={onClose} className="btn-secondary px-6 py-2 rounded">
            Cancel
          </Button>
          <Button onClick={handleSave} className="btn-primary px-6 py-2 rounded">
            {initialData ? 'Update' : 'Add'} AI Tool
          </Button>
        </div>
      </div>
    </div>
  );
}
