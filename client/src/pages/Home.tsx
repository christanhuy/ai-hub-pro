/**
 * Home Page - AI Hub Pro
 * Main dashboard displaying AI tools with pricing tiers and management features
 * Design: Modern Minimalist with sidebar navigation and card-based layout
 */

import { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Link } from 'wouter';
import { AITool } from '@/types';
import { Button } from '@/components/ui/button';
import AIFormModal from '@/components/AIFormModal';
import AIToolCard from '@/components/AIToolCard';
import { toast } from 'sonner';

const STORAGE_KEY = 'ai-hub-tools';

export default function Home() {
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | undefined>();

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
            <div className="flex items-center gap-2">
              <Link href="/settings">
                <Button className="btn-secondary px-6 py-2 rounded flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </Button>
              </Link>
              <Button
                onClick={handleAddTool}
                className="btn-primary px-6 py-2 rounded flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add AI Tool
              </Button>
            </div>
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
              <AIToolCard
                key={tool.id}
                tool={tool}
                onEdit={handleEditTool}
                onDelete={handleDeleteTool}
              />
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
