/**
 * Custom hook for fetching AI information from external APIs
 * Supports OpenAI, Anthropic, and other LLM providers
 */

import { useState, useCallback } from 'react';
import { AIInfoResult } from '@/types';

interface FetcherConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'custom';
  apiKey: string;
  aiToolName: string;
}

interface FetcherState {
  isLoading: boolean;
  error: string | null;
  data: AIInfoResult | null;
}

export function useAIInfoFetcher() {
  const [state, setState] = useState<FetcherState>({
    isLoading: false,
    error: null,
    data: null,
  });

  /**
   * Build prompt for fetching AI tool information
   */
  const buildPrompt = useCallback((toolName: string): string => {
    return `Please provide detailed information about the "${toolName}" AI tool in JSON format with the following structure:
{
  "advantages": ["advantage1", "advantage2", ...],
  "disadvantages": ["disadvantage1", "disadvantage2", ...],
  "highlights": ["highlight1", "highlight2", ...],
  "features": ["feature1", "feature2", ...],
  "useCases": ["useCase1", "useCase2", ...],
  "integrations": ["integration1", "integration2", ...],
  "pricing": "pricing information",
  "alternatives": ["alternative1", "alternative2", ...]
}

Be concise and factual. Return only valid JSON.`;
  }, []);

  /**
   * Fetch information from OpenAI API
   */
  const fetchFromOpenAI = useCallback(
    async (apiKey: string, toolName: string): Promise<AIInfoResult> => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: buildPrompt(toolName),
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch {
        throw new Error('Failed to parse AI response');
      }
    },
    [buildPrompt]
  );

  /**
   * Fetch information from Anthropic API
   */
  const fetchFromAnthropic = useCallback(
    async (apiKey: string, toolName: string): Promise<AIInfoResult> => {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: buildPrompt(toolName),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      try {
        return JSON.parse(content);
      } catch {
        throw new Error('Failed to parse AI response');
      }
    },
    [buildPrompt]
  );

  /**
   * Main fetch function that routes to appropriate provider
   */
  const fetchAIInfo = useCallback(
    async (config: FetcherConfig): Promise<void> => {
      setState({ isLoading: true, error: null, data: null });

      try {
        let result: AIInfoResult;

        switch (config.provider) {
          case 'openai':
            result = await fetchFromOpenAI(config.apiKey, config.aiToolName);
            break;
          case 'anthropic':
            result = await fetchFromAnthropic(config.apiKey, config.aiToolName);
            break;
          default:
            throw new Error(`Unsupported provider: ${config.provider}`);
        }

        setState({ isLoading: false, error: null, data: result });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState({ isLoading: false, error: errorMessage, data: null });
      }
    },
    [fetchFromOpenAI, fetchFromAnthropic]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    fetchAIInfo,
    reset,
  };
}
