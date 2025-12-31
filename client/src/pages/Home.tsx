/**
 * Home Page
 * Main dashboard with sidebar categories and AI tools management
 * Design: Gradient Modern with sidebar layout
 */

import { useState, useEffect, useMemo } from 'react';
import { Plus, Settings, Star } from 'lucide-react';
import { AITool, Category } from '@/types';
import CategorySidebar from '@/components/CategorySidebar';
import AIFormModalV2 from '@/components/AIFormModalV2';
import SearchBar from '@/components/SearchBar';
import { useCategoryManager } from '@/hooks/useCategoryManager';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

const MAX_ITEMS_PER_PAGE = 6;

export default function Home() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryManager();
  const [aiTools, setAITools] = useState<AITool[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('home');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMore, setShowMore] = useState(false);

  // Load AI tools from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-hub-tools');
      if (stored) {
        setAITools(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load AI tools:', error);
    }
  }, []);

  // Set default category to Home on first load
  useEffect(() => {
    if (categories.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId('home');
    }
  }, [categories, selectedCategoryId]);

  const handleAddCategory = (name: string) => {
    const result = addCategory(name);
    if (result) {
      toast.success('Category added');
    } else {
      toast.error('Cannot create a category with that name');
    }
  };

  const handleUpdateCategory = (id: string, name: string) => {
    updateCategory(id, { name });
    toast.success('Category updated');
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    if (selectedCategoryId === id) {
      setSelectedCategoryId('home');
    }
    toast.success('Category deleted');
  };

  const handleSaveAI = (tool: AITool) => {
    const updated = editingTool
      ? aiTools.map((t) => (t.id === tool.id ? tool : t))
      : [...aiTools, tool];

    setAITools(updated);
    localStorage.setItem('ai-hub-tools', JSON.stringify(updated));
    setEditingTool(undefined);
    setIsFormOpen(false);
    toast.success(editingTool ? 'AI tool updated' : 'AI tool created');
  };

  const handleDeleteAI = (id: string) => {
    if (confirm('Delete this AI tool?')) {
      const updated = aiTools.filter((t) => t.id !== id);
      setAITools(updated);
      localStorage.setItem('ai-hub-tools', JSON.stringify(updated));
      toast.success('AI tool deleted');
    }
  };

  const handleEditAI = (tool: AITool) => {
    setEditingTool(tool);
    setIsFormOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = aiTools.map((t) =>
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    );
    setAITools(updated);
    localStorage.setItem('ai-hub-tools', JSON.stringify(updated));
    toast.success('Favorite updated');
  };

  // Filter and sort AI tools
  const filteredTools = useMemo(() => {
    let tools = aiTools;

    // Filter by category (exclude Home category from normal filtering)
    if (selectedCategoryId !== 'home') {
      tools = tools.filter((tool) => tool.categoryId === selectedCategoryId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.provider.toLowerCase().includes(query) ||
          tool.description?.toLowerCase().includes(query)
      );
    }

    // For Home category, show favorites first, then recent, then all
    if (selectedCategoryId === 'home') {
      const favorites = tools.filter((t) => t.isFavorite);
      const recent = tools
        .filter((t) => !t.isFavorite)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return [...favorites, ...recent];
    }

    // For other categories, show favorites first
    const favorites = tools.filter((t) => t.isFavorite);
    const others = tools.filter((t) => !t.isFavorite);
    return [...favorites, ...others];
  }, [aiTools, selectedCategoryId, searchQuery]);

  // Paginate tools for Home category
  const displayedTools = useMemo(() => {
    if (selectedCategoryId === 'home' && !showMore) {
      return filteredTools.slice(0, MAX_ITEMS_PER_PAGE);
    }
    return filteredTools;
  }, [filteredTools, selectedCategoryId, showMore]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const hasMoreItems = selectedCategoryId === 'home' && filteredTools.length > MAX_ITEMS_PER_PAGE;

  const renderAICard = (tool: AITool) => (
    <div
      key={tool.id}
      className="card-elevated p-6 rounded-lg hover:shadow-lg transition-all duration-300 group"
    >
      {/* Tool Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{tool.name}</h3>
          <p className="text-sm text-muted-foreground">{tool.provider}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleFavorite(tool.id)}
            className={`p-2 rounded transition-colors ${
              tool.isFavorite
                ? 'bg-accent/30 text-accent'
                : 'hover:bg-accent/20 text-muted-foreground'
            }`}
            title={tool.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className="w-4 h-4" fill={tool.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => handleEditAI(tool)}
            className="p-2 hover:bg-accent/20 rounded transition-colors opacity-0 group-hover:opacity-100"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDeleteAI(tool.id)}
            className="p-2 hover:bg-destructive/20 rounded transition-colors opacity-0 group-hover:opacity-100"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Tool Description */}
      {tool.description && (
        <p className="text-sm text-foreground mb-4 line-clamp-2">
          {tool.description}
        </p>
      )}

      {/* Tool Info */}
      <div className="space-y-2 mb-4 text-xs text-muted-foreground">
        {tool.version && <p>Version: {tool.version}</p>}
        {tool.supportVietnamese && <p>✓ Supports Vietnamese</p>}
        {tool.lastUpdatedDate && (
          <p>
            Last Updated:{' '}
            {new Date(tool.lastUpdatedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            })}
          </p>
        )}
        {tool.website && (
          <p>
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Visit Website
            </a>
          </p>
        )}
      </div>

      {/* Pricing Tiers */}
      {tool.pricingTiers && tool.pricingTiers.length > 0 && (
        <div className="mb-4 p-3 bg-muted/30 rounded">
          <p className="text-xs font-semibold text-foreground mb-2">Pricing:</p>
          <div className="space-y-1">
            {tool.pricingTiers.map((tier) => (
              <p key={tier.id} className="text-xs text-muted-foreground">
                {tier.name}: {tier.currency} {tier.price}/{tier.billingCycle}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Advantages/Disadvantages */}
      {(tool.advantages?.length || tool.disadvantages?.length) && (
        <div className="space-y-2 text-xs">
          {tool.advantages && tool.advantages.length > 0 && (
            <div>
              <p className="font-semibold text-accent">+ Advantages</p>
              <ul className="list-disc list-inside text-muted-foreground">
                {tool.advantages.slice(0, 2).map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>
            </div>
          )}
          {tool.disadvantages && tool.disadvantages.length > 0 && (
            <div>
              <p className="font-semibold text-destructive">- Disadvantages</p>
              <ul className="list-disc list-inside text-muted-foreground">
                {tool.disadvantages.slice(0, 2).map((dis, idx) => (
                  <li key={idx}>{dis}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <CategorySidebar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600/10 to-cyan-500/10 border-b border-border px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {selectedCategory?.name || 'AI Hub Pro'}
              </h1>
              <p className="text-muted-foreground">
                {selectedCategory?.description || 'Manage your AI tools, pricing tiers, and API keys in one place'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEditingTool(undefined);
                  setIsFormOpen(true);
                }}
                className="btn-primary px-4 py-2 rounded flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add AI Tool
              </Button>

              <Button
                onClick={() => {
                  // TODO: Navigate to settings
                }}
                className="btn-secondary px-4 py-2 rounded flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search AI tools by name, provider..."
          />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {displayedTools.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-xl text-muted-foreground mb-4">
                  {searchQuery
                    ? 'No AI tools found matching your search'
                    : selectedCategoryId === 'home'
                    ? 'No AI tools yet. Start by creating one!'
                    : 'No AI tools in this category yet'}
                </p>
                <Button
                  onClick={() => {
                    setEditingTool(undefined);
                    setIsFormOpen(true);
                  }}
                  className="btn-primary px-6 py-2 rounded"
                >
                  Add First AI Tool
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayedTools.map((tool) => renderAICard(tool))}
              </div>

              {/* Show More Button */}
              {hasMoreItems && !showMore && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowMore(true)}
                    className="btn-secondary px-6 py-2 rounded"
                  >
                    Show More ({filteredTools.length - MAX_ITEMS_PER_PAGE} more)
                  </Button>
                </div>
              )}

              {/* Show Less Button */}
              {hasMoreItems && showMore && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowMore(false)}
                    className="btn-secondary px-6 py-2 rounded"
                  >
                    Show Less
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Add/Edit AI Tool Modal */}
      <AIFormModalV2
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTool(undefined);
        }}
        onSave={handleSaveAI}
        initialData={editingTool}
        categories={categories}
      />
    </div>
  );
}
