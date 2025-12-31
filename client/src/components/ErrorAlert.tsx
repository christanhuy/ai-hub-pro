/**
 * ErrorAlert Component
 * Displays error messages with optional retry action
 * Design: Modern Minimalist with clear error indication
 */

import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorAlert({
  message,
  onDismiss,
  onRetry,
  title = 'Error',
}: ErrorAlertProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-destructive mb-1">{title}</h4>
        <p className="text-sm text-destructive/80">{message}</p>
        
        {(onRetry || onDismiss) && (
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm font-medium text-destructive hover:underline"
              >
                Retry
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm font-medium text-destructive hover:underline"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-destructive/20 rounded transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-destructive" />
        </button>
      )}
    </div>
  );
}
