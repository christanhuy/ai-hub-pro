/**
 * Home Page - AI Hub Pro
 * Main dashboard displaying AI tools with pricing tiers and management features
 * Design: Modern Minimalist with sidebar navigation and card-based layout
 */

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { AITool } from '@/types';
import { Button } from '@/components/ui/button';
import AIFormModal from '@/components/AIFormModal';
import { toast } from 'sonner';

const STORAGE_KEY = 'ai-hub-tools';

export default function Home() {
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | undefined>();
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  // Load AI tools from localStorage
  useEffect(() => {
    const loadTools = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const tools = JSON.parse(stored);
          setAiTools(tools);
        }
      } catch (error) {
        console.error('Failed to load AI tools:', error);
      }
    };

    loadTools();
  }, []);

  // Save AI tools to localStorage
  const saveTools = (tools: AITool[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
      setAiTools(tools);
    } catch (error) {
      console.error('Failed to save AI tools:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleAddTool = () => {
    setEditingTool(undefined);
    setIsModalOpen(true);
  };

  const handleEditTool = (tool: AITool) => {
    setEditingTool(tool);
    setIsModalOpen(true);
  };

  const handleSaveTool = (tool: AITool) => {
    const existingIndex = aiTools.findIndex((t) => t.id === tool.id);

    if (existingIndex >= 0) {
      const updated = [...aiTools];
      updated[existingIndex] = tool;
      saveTools(updated);
    } else {
      saveTools([...aiTools, tool]);
    }

    setIsModalOpen(false);
    setEditingTool(undefined);
  };

  const handleDeleteTool = (toolId: string) => {
    if (confirm('Are you sure you want to delete this AI tool?')) {
      saveTools(aiTools.filter((t) => t.id !== toolId));
      toast.success('AI tool deleted');
    }
  };

  const toggleExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Hub Pro</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your AI tools, pricing tiers, and API keys in one place
              </p>
            </div>
            <Button
              onClick={handleAddTool}
              className="btn-primary px-6 py-2 rounded flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add AI Tool
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {aiTools.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No AI Tools Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start by adding your first AI tool to get started
            </p>
            <Button
              onClick={handleAddTool}
              className="btn-primary px-6 py-2 rounded inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First AI Tool
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {aiTools.map((tool) => (
              <div key={tool.id} className="card-elevated">
                {/* Tool Header */}
                <div className="flex items-center justify-between p-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tool.provider}
                    </p>
                    {tool.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {tool.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpanded(tool.id)}
                      className="p-2 hover:bg-muted rounded transition-colors"
                      title="Toggle details"
                    >
                      {expandedTools.has(tool.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditTool(tool)}
                      className="p-2 hover:bg-muted rounded transition-colors"
                      title="Edit tool"
                    >
                      <Edit2 className="w-5 h-5 text-accent" />
                    </button>
                    <button
                      onClick={() => handleDeleteTool(tool.id)}
                      className="p-2 hover:bg-destructive/10 rounded transition-colors"
                      title="Delete tool"
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedTools.has(tool.id) && (
                  <div className="border-t border-border px-6 py-4 space-y-4">
                    {/* Tool Information */}
                    {(tool.advantages ||
                      tool.disadvantages ||
                      tool.highlights) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {tool.advantages && tool.advantages.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">
                              Advantages
                            </h4>
                            <ul className="space-y-1">
                              {tool.advantages.map((adv, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-accent mt-1">+</span>
                                  <span>{adv}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {tool.disadvantages &&
                          tool.disadvantages.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">
                                Disadvantages
                              </h4>
                              <ul className="space-y-1">
                                {tool.disadvantages.map((dis, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-muted-foreground flex items-start gap-2"
                                  >
                                    <span className="text-destructive mt-1">
                                      -
                                    </span>
                                    <span>{dis}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {tool.highlights && tool.highlights.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">
                              Highlights
                            </h4>
                            <ul className="space-y-1">
                              {tool.highlights.map((highlight, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-accent mt-1">★</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pricing Tiers */}
                    {tool.pricingTiers && tool.pricingTiers.length > 0 && (
                      <div className="border-t border-border pt-4">
                        <h4 className="font-semibold text-foreground mb-3">
                          Pricing Tiers
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {tool.pricingTiers.map((tier) => (
                            <div
                              key={tier.id}
                              className="border border-border rounded p-3 bg-muted/30"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-foreground">
                                  {tier.name}
                                </h5>
                                <span className="text-sm font-bold text-accent">
                                  {tier.currency} {tier.price}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {tier.billingCycle === 'monthly'
                                  ? 'per month'
                                  : 'per year'}
                              </p>
                              {tier.description && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  {tier.description}
                                </p>
                              )}
                              {tier.features.length > 0 && (
                                <ul className="space-y-1">
                                  {tier.features.slice(0, 3).map((feat, idx) => (
                                    <li
                                      key={idx}
                                      className="text-xs text-muted-foreground flex items-start gap-1"
                                    >
                                      <span className="text-accent">•</span>
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                  {tier.features.length > 3 && (
                                    <li className="text-xs text-muted-foreground">
                                      +{tier.features.length - 3} more
                                    </li>
                                  )}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <AIFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTool(undefined);
        }}
        onSave={handleSaveTool}
        initialData={editingTool}
      />
    </div>
  );
}
