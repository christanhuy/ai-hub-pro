/**
 * ExportImportData Component
 * Handles exporting and importing AI tools and settings data
 * Design: Modern Minimalist with file operations
 */

import { useState, useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ExportImportDataProps {
  onImport?: (data: any) => void;
}

export default function ExportImportData({ onImport }: ExportImportDataProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const aiTools = localStorage.getItem('ai-hub-tools') || '[]';
      const apiKeys = localStorage.getItem('ai-hub-api-keys') || '{}';
      const rememberKeys = localStorage.getItem('ai-hub-remember-keys') || '[]';

      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        aiTools: JSON.parse(aiTools),
        apiKeys,
        rememberKeys: JSON.parse(rememberKeys),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsImporting(true);
      const file = event.target.files?.[0];

      if (!file) {
        toast.error('No file selected');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedData = JSON.parse(content);

          // Validate structure
          if (!importedData.version || !importedData.aiTools) {
            throw new Error('Invalid backup file format');
          }

          // Import data
          localStorage.setItem('ai-hub-tools', JSON.stringify(importedData.aiTools));
          if (importedData.apiKeys) {
            localStorage.setItem('ai-hub-api-keys', importedData.apiKeys);
          }
          if (importedData.rememberKeys) {
            localStorage.setItem('ai-hub-remember-keys', JSON.stringify(importedData.rememberKeys));
          }

          toast.success('Data imported successfully. Please refresh the page.');
          onImport?.(importedData);
        } catch (error) {
          toast.error('Failed to parse backup file');
          console.error('Parse error:', error);
        } finally {
          setIsImporting(false);
        }
      };

      reader.readAsText(file);
    } catch (error) {
      toast.error('Failed to import data');
      console.error('Import error:', error);
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={handleExport}
          disabled={isExporting || isImporting}
          className="btn-secondary px-4 py-2 rounded flex items-center gap-2 flex-1"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>

        <Button
          onClick={handleImportClick}
          disabled={isExporting || isImporting}
          className="btn-secondary px-4 py-2 rounded flex items-center gap-2 flex-1"
        >
          <Upload className="w-4 h-4" />
          {isImporting ? 'Importing...' : 'Import Data'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Export creates a JSON backup of all your AI tools and settings. Import to restore from a backup.
      </p>
    </div>
  );
}
