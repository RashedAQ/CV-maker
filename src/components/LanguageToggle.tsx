import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageToggleProps {
  variant?: 'default' | 'landing' | 'builder';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'default' }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  if (variant === 'landing') {
    return (
      <Button
        onClick={toggleLanguage}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-sm font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5"
      >
        <Globe className="h-4 w-4" />
        {language === 'en' ? 'العربية' : 'English'}
      </Button>
    );
  }

  if (variant === 'builder') {
    return (
      <Button
        onClick={toggleLanguage}
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50 flex items-center gap-2 text-sm font-medium hover:bg-primary/10"
      >
        <Globe className="h-4 w-4" />
        {language === 'en' ? 'العربية' : 'English'}
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'AR' : 'EN'}
    </Button>
  );
};