/**
 * PricingTierCard Component
 * Displays and manages individual pricing tiers with edit/delete capabilities
 * Design: Modern Minimalist with clean card layout
 */

import { useState } from 'react';
import { Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { PricingTier } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PricingTierCardProps {
  tier: PricingTier;
  onUpdate: (tier: PricingTier) => void;
  onDelete: (tierId: string) => void;
  isExpanded?: boolean;
}

export default function PricingTierCard({
  tier,
  onUpdate,
  onDelete,
  isExpanded = false,
}: PricingTierCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(isExpanded);
  const [editData, setEditData] = useState(tier);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(tier);
    setIsEditing(false);
  };

  const handleAddFeature = () => {
    setEditData({
      ...editData,
      features: [...editData.features, ''],
    });
  };

  const handleRemoveFeature = (index: number) => {
    setEditData({
      ...editData,
      features: editData.features.filter((_, i) => i !== index),
    });
  };

  const handleUpdateFeature = (index: number, value: string) => {
    const newFeatures = [...editData.features];
    newFeatures[index] = value;
    setEditData({
      ...editData,
      features: newFeatures,
    });
  };

  return (
    <div className="card-elevated p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Package Name
                  </label>
                  <Input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    placeholder="e.g., Starter"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Price
                    </label>
                    <Input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Currency
                    </label>
                    <Input
                      value={editData.currency}
                      onChange={(e) =>
                        setEditData({ ...editData, currency: e.target.value })
                      }
                      placeholder="USD"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Billing Cycle
                </label>
                <select
                  value={editData.billingCycle}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      billingCycle: e.target.value as 'monthly' | 'yearly',
                    })
                  }
                  className="input-field bg-background text-foreground"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Description
                </label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  placeholder="Tier description"
                  className="input-field resize-none"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="btn-primary px-4 py-2 rounded"
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  className="btn-secondary px-4 py-2 rounded"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{tier.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {tier.currency} {tier.price} / {tier.billingCycle}
                </p>
                {tier.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {tier.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 hover:bg-muted rounded transition-colors"
                  title="Toggle details"
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-muted rounded transition-colors"
                  title="Edit tier"
                >
                  <Edit2 className="w-4 h-4 text-accent" />
                </button>
                <button
                  onClick={() => onDelete(tier.id)}
                  className="p-2 hover:bg-destructive/10 rounded transition-colors"
                  title="Delete tier"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && !isEditing && (
        <div className="mt-4 pt-4 border-t border-border">
          <h5 className="text-sm font-semibold text-foreground mb-2">
            Features:
          </h5>
          <ul className="space-y-1">
            {tier.features.map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
