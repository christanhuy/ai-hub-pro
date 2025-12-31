/**
 * ConfirmDialog Component
 * Confirmation dialog for destructive actions
 */

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-elevated w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-foreground">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border justify-end">
          <Button onClick={onCancel} className="btn-secondary px-6 py-2 rounded">
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`px-6 py-2 rounded ${
              isDangerous ? 'bg-destructive hover:bg-destructive/90 text-white' : 'btn-primary'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
