import React, { useCallback, useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { FileParser } from '@/services/fileParser';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  accept = '.pdf,.docx,.txt',
  className
}) => {
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFile = useCallback(async (file: File) => {
    setUploading(true);
    setUploadStatus('idle');

    try {
      // Use the FileParser service to parse the file
      await FileParser.parseFile(file);
      
      // Pass the file to the parent component for processing
      onFileUpload(file);
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200",
        isDragOver 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50",
        uploading && "opacity-50 pointer-events-none",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
        aria-label="Upload CV file"
        title="Upload CV file"
      />
      
      <div className="flex flex-col items-center gap-3">
        {uploading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        ) : uploadStatus === 'success' ? (
          <CheckCircle className="h-8 w-8 text-success" />
        ) : uploadStatus === 'error' ? (
          <AlertCircle className="h-8 w-8 text-destructive" />
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground" />
        )}
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {uploading ? t('builder.uploading') : 
             uploadStatus === 'success' ? t('builder.fileUploaded') :
             uploadStatus === 'error' ? t('common.error') :
             t('builder.dragDrop')}
          </p>
          {!uploading && uploadStatus === 'idle' && (
            <p className="text-xs text-muted-foreground">
              {t('builder.supportedFormats')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};