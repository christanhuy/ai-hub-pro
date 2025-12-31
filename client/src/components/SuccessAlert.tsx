/**
 * SuccessAlert Component
 * Displays success messages with optional action
 * Design: Modern Minimalist with clear success indication
 */

import { CheckCircle, X } from 'lucide-react';

interface SuccessAlertProps {
  message: string;
  onDismiss?: () => void;
  title?: string;
}

export default function SuccessAlert({
  message,
  onDismiss,
  title = 'Success',
}: SuccessAlertProps) {
  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-accent mb-1">{title}</h4>
        <p className="text-sm text-accent/80">{message}</p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-accent/20 rounded transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-accent" />
        </button>
      )}
    </div>
  );
}
