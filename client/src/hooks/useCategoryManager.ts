/**
 * useCategoryManager Hook
 * Manages AI tool categories/use cases
 */

import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'ai-hub-categories';

export function useCategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from localStorage
  useEffect(() => {
    const loadCategories = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCategories(parsed);
        } else {
          // Initialize with default categories
          const defaults: Category[] = [
            {
              id: 'home',
              name: 'Home',
              description: 'Favorite AI tools and recent additions',
              color: '#f59e0b',
              icon: '🏠',
              createdAt: new Date(),
            },
            {
              id: 'general',
              name: 'General Purpose',
              description: 'General-purpose AI assistants',
              color: '#8b5cf6',
              icon: '🤖',
              createdAt: new Date(),
            },
            {
              id: 'coding',
              name: 'Coding & Development',
              description: 'AI tools for programming',
              color: '#06b6d4',
              icon: '💻',
              createdAt: new Date(),
            },
            {
              id: 'content',
              name: 'Content Creation',
              description: 'AI for writing and content',
              color: '#ec4899',
              icon: '✍️',
              createdAt: new Date(),
            },
          ];
          setCategories(defaults);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const addCategory = useCallback((name: string, description?: string, color?: string, icon?: string) => {
    // Prevent adding if it's a reserved category
    if (name.toLowerCase() === 'home') {
      console.warn('Cannot create a category named Home - it is reserved');
      return null;
    }

    const newCategory: Category = {
      id: nanoid(),
      name,
      description,
      color,
      icon,
      createdAt: new Date(),
    };

    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newCategory;
  }, [categories]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    // Prevent editing Home category
    if (id === 'home') {
      console.warn('Cannot edit Home category - it is reserved');
      return;
    }

    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, ...updates } : cat
    );
    setCategories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [categories]);

  const deleteCategory = useCallback((id: string) => {
    // Prevent deleting Home category
    if (id === 'home') {
      console.warn('Cannot delete Home category - it is reserved');
      return;
    }

    const updated = categories.filter((cat) => cat.id !== id);
    setCategories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [categories]);

  const getCategoryById = useCallback((id: string) => {
    return categories.find((cat) => cat.id === id);
  }, [categories]);

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
}
