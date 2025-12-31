/**
 * StatisticsCard Component
 * Displays statistics about AI tools, pricing tiers, and API keys
 * Design: Modern Minimalist with card-based layout
 */

import { AITool } from '@/types';

interface StatisticsCardProps {
  tools: AITool[];
  savedAPIKeysCount: number;
}

export default function StatisticsCard({
  tools,
  savedAPIKeysCount,
}: StatisticsCardProps) {
  const totalPricingTiers = tools.reduce(
    (sum, tool) => sum + tool.pricingTiers.length,
    0
  );

  const toolsWithAdvantages = tools.filter(
    (tool) => tool.advantages && tool.advantages.length > 0
  ).length;

  const stats = [
    {
      label: 'AI Tools',
      value: tools.length,
      icon: '🤖',
    },
    {
      label: 'Pricing Tiers',
      value: totalPricingTiers,
      icon: '💰',
    },
    {
      label: 'API Keys',
      value: savedAPIKeysCount,
      icon: '🔑',
    },
    {
      label: 'Tools with Info',
      value: toolsWithAdvantages,
      icon: '📊',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="card-elevated p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl">{stat.icon}</div>
          <div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
