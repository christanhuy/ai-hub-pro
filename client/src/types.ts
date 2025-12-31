/**
 * Core Data Types for AI Hub Pro
 * Defines structures for AI tools, pricing tiers, and API key management
 */

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
}

export interface APIProvider {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'cohere' | 'mistral' | 'custom';
  apiKey: string;
  isDefault?: boolean;
  createdAt: Date;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  description?: string;
  isPopular?: boolean;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  provider: string;
  website?: string;
  advantages?: string[];
  disadvantages?: string[];
  highlights?: string[];
  pricingTiers: PricingTier[];
  version?: string;
  supportVietnamese?: boolean;
  lastUpdatedDate?: Date;
  notes?: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface APIKeyConfig {
  id: string;
  aiToolId: string;
  provider: string;
  keyName?: string;
  isEncrypted: boolean;
  lastUsed?: Date;
  status: 'active' | 'inactive' | 'expired';
  quotaLimit?: number;
  quotaUsed?: number;
  createdAt: Date;
}

export interface AIInfoResult {
  advantages: string[];
  disadvantages: string[];
  highlights: string[];
  features: string[];
  useCases: string[];
  integrations: string[];
  pricing?: string;
  alternatives?: string[];
}

export interface FormState {
  name: string;
  description: string;
  provider: string;
  apiProvider?: string;
  website?: string;
  documentation?: string;
  advantages?: string[];
  disadvantages?: string[];
  highlights?: string[];
  pricingTiers: PricingTier[];
}

export interface SelectedAIInfo {
  [key: string]: boolean;
}
