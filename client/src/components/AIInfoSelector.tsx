/**
 * AIInfoSelector Component
 * Displays AI information fetched from LLM and allows user to select which info to use
 * Design: Modern Minimalist with checkbox selection
 */

import { useState } from 'react';
import { Check } from 'lucide-react';
import { AIInfoResult, SelectedAIInfo } from '@/types';
import { Button } from '@/components/ui/button';

interface AIInfoSelectorProps {
  data: AIInfoResult;
  onApply: (selected: SelectedAIInfo, selectedData: Partial<AIInfoResult>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AIInfoSelector({
  data,
  onApply,
  onCancel,
  isLoading = false,
}: AIInfoSelectorProps) {
  const [selected, setSelected] = useState<SelectedAIInfo>({
    advantages: true,
    disadvantages: true,
    highlights: true,
    features: true,
    useCases: false,
    integrations: false,
    pricing: false,
    alternatives: false,
  });

  const handleToggle = (key: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleApply = () => {
    const selectedData: Partial<AIInfoResult> = {};
    Object.keys(selected).forEach((key) => {
      if (selected[key as keyof SelectedAIInfo]) {
        (selectedData as any)[key] = (data as any)[key];
      }
    });
    onApply(selected, selectedData);
  };

  const renderSection = (
    title: string,
    key: keyof AIInfoResult,
    items: any
  ) => {
    if (!items) return null;

    let itemList: string[] = [];
    if (Array.isArray(items)) {
      itemList = items;
    } else if (typeof items === 'string') {
      itemList = [items];
    }

    if (itemList.length === 0) return null;

    return (
      <div key={key} className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <input
            type="checkbox"
            id={key}
            checked={selected[key as keyof SelectedAIInfo] || false}
            onChange={() => handleToggle(key)}
            className="w-4 h-4 rounded border-border cursor-pointer"
          />
          <label
            htmlFor={key}
            className="text-sm font-semibold text-foreground cursor-pointer flex-1"
          >
            {title}
          </label>
        </div>
        <div className="ml-7 space-y-1">
          {itemList.map((item: string, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              • {item}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card-elevated p-6 max-h-96 overflow-y-auto">
      <h3 className="subsection-title">Select Information to Apply</h3>

      <div className="space-y-4">
        {renderSection('Advantages', 'advantages', (data.advantages as any))}
        {renderSection('Disadvantages', 'disadvantages', (data.disadvantages as any))}
        {renderSection('Highlights', 'highlights', (data.highlights as any))}
        {renderSection('Features', 'features', (data.features as any))}
        {renderSection('Use Cases', 'useCases', (data.useCases as any))}
        {renderSection('Integrations', 'integrations', (data.integrations as any))}
        {renderSection('Pricing', 'pricing', (data.pricing as any))}
        {renderSection('Alternatives', 'alternatives', (data.alternatives as any))}
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t border-border">
        <Button
          onClick={handleApply}
          disabled={isLoading}
          className="btn-primary px-4 py-2 rounded flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Apply Selected
        </Button>
        <Button
          onClick={onCancel}
          disabled={isLoading}
          className="btn-secondary px-4 py-2 rounded"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
