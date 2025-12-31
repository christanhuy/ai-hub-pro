/**
 * AIToolCard Component
 * Displays detailed information about an AI tool with expandable pricing tiers
 * Design: Modern Minimalist with clean card layout and smooth interactions
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { AITool } from '@/types';

interface AIToolCardProps {
  tool: AITool;
  onEdit: (tool: AITool) => void;
  onDelete: (toolId: string) => void;
}

export default function AIToolCard({ tool, onEdit, onDelete }: AIToolCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card-elevated overflow-hidden transition-all duration-200 hover:shadow-lg">
      {/* Card Header */}
      <div className="p-6 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-foreground truncate">
              {tool.name}
            </h3>
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded whitespace-nowrap">
              {tool.provider}
            </span>
          </div>

          {tool.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {tool.description}
            </p>
          )}

          {/* Quick Stats */}
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            {tool.pricingTiers.length > 0 && (
              <span>📊 {tool.pricingTiers.length} pricing tier(s)</span>
            )}
            {tool.advantages && tool.advantages.length > 0 && (
              <span>✓ {tool.advantages.length} advantage(s)</span>
            )}
            {tool.highlights && tool.highlights.length > 0 && (
              <span>★ {tool.highlights.length} highlight(s)</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-muted rounded transition-colors"
            title="Toggle details"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => onEdit(tool)}
            className="p-2 hover:bg-muted rounded transition-colors"
            title="Edit tool"
          >
            <Edit2 className="w-5 h-5 text-accent" />
          </button>
          <button
            onClick={() => onDelete(tool.id)}
            className="p-2 hover:bg-destructive/10 rounded transition-colors"
            title="Delete tool"
          >
            <Trash2 className="w-5 h-5 text-destructive" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Tool Information */}
          {(tool.advantages ||
            tool.disadvantages ||
            tool.highlights ||
            tool.website) && (
            <div className="border-t border-border px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {tool.advantages && tool.advantages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="text-accent">+</span> Advantages
                      </h4>
                      <ul className="space-y-1">
                        {tool.advantages.map((adv, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-accent mt-1 flex-shrink-0">
                              ✓
                            </span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tool.highlights && tool.highlights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="text-accent">★</span> Highlights
                      </h4>
                      <ul className="space-y-1">
                        {tool.highlights.map((highlight, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-accent mt-1 flex-shrink-0">
                              •
                            </span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {tool.disadvantages && tool.disadvantages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="text-destructive">-</span> Disadvantages
                      </h4>
                      <ul className="space-y-1">
                        {tool.disadvantages.map((dis, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-destructive mt-1 flex-shrink-0">
                              ✕
                            </span>
                            <span>{dis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tool.website && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Resources
                      </h4>
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline flex items-center gap-1"
                      >
                        🌐 Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tiers */}
          {tool.pricingTiers && tool.pricingTiers.length > 0 && (
            <div className="border-t border-border px-6 py-4">
              <h4 className="font-semibold text-foreground mb-3">
                Pricing Tiers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tool.pricingTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="border border-border rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="mb-2">
                      <h5 className="font-semibold text-foreground">
                        {tier.name}
                      </h5>
                      <p className="text-sm font-bold text-accent mt-1">
                        {tier.currency} {tier.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tier.billingCycle === 'monthly'
                          ? 'per month'
                          : 'per year'}
                      </p>
                    </div>

                    {tier.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {tier.description}
                      </p>
                    )}

                    {tier.features.length > 0 && (
                      <div className="border-t border-border pt-2 mt-2">
                        <ul className="space-y-1">
                          {tier.features.slice(0, 3).map((feat, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-muted-foreground flex items-start gap-1"
                            >
                              <span className="text-accent flex-shrink-0">
                                •
                              </span>
                              <span className="line-clamp-1">{feat}</span>
                            </li>
                          ))}
                          {tier.features.length > 3 && (
                            <li className="text-xs text-accent font-semibold">
                              +{tier.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-border px-6 py-3 bg-muted/20 text-xs text-muted-foreground flex justify-between">
            <span>Created: {new Date(tool.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(tool.updatedAt).toLocaleDateString()}</span>
          </div>
        </>
      )}
    </div>
  );
}
