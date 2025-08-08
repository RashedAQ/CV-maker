import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HTMLCVPreview } from '@/components/HTMLCVPreview';
import { HTMLCVService } from '@/services/htmlCvService';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HTMLCVTest: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [rawCV, setRawCV] = useState<string>(`Name: Mohamed Afify
Email: mahmdafifi9942@gmail.com
Phone: +965 9907 4844
Location: Kuwait

Summary:
Experienced software developer with expertise in React, TypeScript, and modern web technologies. Passionate about creating scalable applications and solving complex problems.

Experience:
- Senior Developer at TechCorp (2022-Present)
  * Led development of React-based applications
  * Implemented CI/CD pipelines
  * Mentored junior developers

- Full Stack Developer at Startup Inc (2020-2022)
  * Built responsive web applications
  * Integrated third-party APIs
  * Optimized database performance

Skills:
- React (Expert)
- TypeScript (Advanced)
- Node.js (Advanced)
- AWS (Intermediate)
- Git (Advanced)

Education:
- Bachelor of Computer Science, University of Technology (2016-2020)
  GPA: 3.8/4.0

Projects:
- Job Scraper App using React/TS, FastAPI, Playwright, Chromium
- E-commerce platform with payment integration
- Real-time chat application`);

  const [jobDescription, setJobDescription] = useState<string>(`We are looking for a talented React Developer to join our team. The ideal candidate should have:

Requirements:
- 3+ years of experience with React and TypeScript
- Strong understanding of modern JavaScript
- Experience with state management (Redux, Context API)
- Knowledge of REST APIs and GraphQL
- Experience with testing frameworks (Jest, React Testing Library)
- Familiarity with CI/CD pipelines
- Experience with cloud platforms (AWS, Azure, GCP)

Nice to have:
- Experience with Next.js
- Knowledge of server-side rendering
- Experience with microservices architecture
- Understanding of Docker and Kubernetes`);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await HTMLCVService.generateMockHTMLCV({
        originalCV: rawCV,
        jobDescription: jobDescription,
      });
      
      if (response.cv.htmlContent) {
        setHtmlContent(response.cv.htmlContent);
        toast({
          title: "HTML CV Generated",
          description: "Your professional HTML resume has been created",
        });
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/builder')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Builder
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">HTML CV Test</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {!htmlContent ? (
          <div className="space-y-8">
            {/* Job Description */}
            <section className="card-elegant p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Job Description</h2>
              <Textarea
                placeholder="Enter job description..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </section>

            {/* Raw CV */}
            <section className="card-elegant p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Raw CV Content</h2>
              <Textarea
                placeholder="Enter your raw CV content..."
                value={rawCV}
                onChange={(e) => setRawCV(e.target.value)}
                className="min-h-[300px] resize-none"
              />
            </section>

            {/* Generate Button */}
            <section className="pt-4">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full btn-primary text-lg py-4 font-semibold"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                    Generating HTML CV...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-3" />
                    Generate HTML CV
                  </>
                )}
              </Button>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Generated HTML CV</h2>
              <Button
                variant="outline"
                onClick={() => setHtmlContent('')}
              >
                Generate New CV
              </Button>
            </div>
            <HTMLCVPreview htmlContent={htmlContent} />
          </div>
        )}
      </main>
    </div>
  );
};

export default HTMLCVTest; 