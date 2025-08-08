import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">CV Fluency Builder</h1>
          </div>
          <LanguageToggle variant="landing" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground">
              AI-Powered CV Tailoring
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your CV and job description. Our AI will analyze and create a tailored HTML CV that matches the job requirements while maintaining accuracy.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              onClick={handleStart}
              size="lg"
              className="btn-primary text-lg py-6 px-8 font-semibold group"
            >
              <Sparkles className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
              Start Building Your CV
              <ArrowRight className={`h-5 w-5 ml-3 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="text-center space-y-3">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Upload CV</h3>
              <p className="text-sm text-muted-foreground">
                Upload your CV as text or PDF file
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                AI analyzes job requirements and your experience
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Download HTML</h3>
              <p className="text-sm text-muted-foreground">
                Get your tailored HTML CV ready to use
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Landing;