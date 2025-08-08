import React, { useState, useCallback } from 'react';
import { Camera, User, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  onPhotoUpload: (photo: File | null) => void;
  className?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoUpload, className }) => {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onPhotoUpload(file);
    } catch (error) {
      console.error('Photo upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [onPhotoUpload]);

  const removePhoto = useCallback(() => {
    setPreview(null);
    onPhotoUpload(null);
  }, [onPhotoUpload]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <div className={cn(
          "w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden",
          "hover:border-primary/50 transition-colors duration-200",
          preview && "border-solid border-primary"
        )}>
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        
        {preview && (
          <button
            onClick={removePhoto}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      
      <div className="text-center">
        <label className={cn(
          "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer",
          "border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200",
          uploading && "opacity-50 pointer-events-none"
        )}>
          <Camera className="h-4 w-4" />
          {t('builder.uploadPhoto')}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};