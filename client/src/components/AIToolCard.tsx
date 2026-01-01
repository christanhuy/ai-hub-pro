/**
 * AIToolCard Component
 * Displays AI tool information in compact card format
 * Design: Gradient Modern with compact layout
 */

import { Edit2, Trash2, ExternalLink, Star } from 'lucide-react';
import { AITool } from '@/types';

interface AIToolCardProps {
  tool: AITool;
  index: number;
  onEdit: (tool: AITool) => void;
  onDelete: (toolId: string) => void;
  onToggleFavorite: (toolId: string) => void;
}

export default function AIToolCard({
  tool,
  index,
  onEdit,
  onDelete,
  onToggleFavorite,
}: AIToolCardProps) {
  return (
    <div className="card-elevated p-5 space-y-4 hover:shadow-lg transition-all duration-200">
      {/* Header: Name, Version, ID */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-foreground truncate">
              {tool.name}
            </h3>
            {tool.version && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded whitespace-nowrap">
                {tool.version}
              </span>
            )}
          </div>
        </div>
        <span className="text-sm font-semibold text-accent flex-shrink-0">
          #{index + 1}
        </span>
      </div>

      {/* Notes */}
      {tool.notes && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {tool.notes}
        </p>
      )}

      {/* Pricing Tiers & Support */}
      <div className="flex flex-wrap gap-2">
        {tool.pricingTiers && tool.pricingTiers.length > 0 && (
          <>
            {tool.pricingTiers.slice(0, 2).map((tier) => (
              <span
                key={tier.id}
                className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-medium"
              >
                {tier.name}
              </span>
            ))}
            {tool.pricingTiers.length > 2 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{tool.pricingTiers.length - 2} more
              </span>
            )}
          </>
        )}

        {tool.supportVietnamese && (
          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded font-medium">
            Tiếng Việt: good
          </span>
        )}
      </div>

      {/* Website Link */}
      {tool.website && (
        <div className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline truncate"
          >
            Website
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button
          onClick={() => onToggleFavorite(tool.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors text-sm font-medium ${
            tool.isFavorite
              ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <Star className="w-4 h-4" />
          {tool.isFavorite ? 'Favorited' : 'Favorite'}
        </button>
        <button
          onClick={() => onEdit(tool)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-muted text-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
          Chỉnh sửa
        </button>
        <button
          onClick={() => onDelete(tool.id)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
          Xóa
        </button>
      </div>
    </div>
  );
}
