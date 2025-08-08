import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Sparkles, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TailoredHTMLCVService } from '@/services/tailoredHtmlCvService';
import { useToast } from '@/hooks/use-toast';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { CVPdfDocument } from '@/components/CVPdfDocument';

// Sample template with placeholders and repeat blocks
const sampleTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{{name}} - {{jobTitle}}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800">
  <div class="max-w-6xl mx-auto bg-white shadow-lg mt-10 p-10 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Left Column -->
    <div class="md:col-span-2 space-y-6">
      <div>
        <h1 class="text-4xl font-bold text-blue-800">{{name}}</h1>
        <p class="text-sm mt-1 text-gray-600">
          {{location}} • {{phone}} • {{email}} • 
          <a href="{{linkedinUrl}}" class="text-blue-600 hover:underline">LinkedIn</a>
        </p>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-1">Professional Summary</h2>
        <p class="mt-2 text-sm">{{summary}}</p>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-1">Career Experience</h2>
        {{#experience}}
        <div class="mt-2">
          <h3 class="font-semibold">{{title}} <span class="text-gray-500 text-sm">{{startDate}} – {{endDate}}</span></h3>
          <p class="text-sm italic">{{company}} – {{location}}</p>
          <ul class="list-disc ml-5 text-sm mt-1 space-y-1">
            {{#description}}<li>{{.}}</li>{{/description}}
          </ul>
        </div>
        {{/experience}}
      </div>
      <div>
        <h2 class="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-1">Projects</h2>
        {{#projects}}
        <div class="mt-2">
          <h3 class="font-semibold">{{name}}</h3>
          <a href="{{url}}" class="text-blue-600 text-sm hover:underline">GitHub Repo</a>
          <ul class="list-disc ml-5 text-sm mt-1 space-y-1">
            {{#description}}<li>{{.}}</li>{{/description}}
          </ul>
        </div>
        {{/projects}}
      </div>
      <div>
        <h2 class="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-1">Education</h2>
        {{#education}}
        <p class="text-sm mt-2">
          <strong>{{degree}}</strong> – {{school}} ({{years}})<br/>
          {{details}}
        </p>
        {{/education}}
      </div>
    </div>
    <!-- Right Column -->
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-1">Skills</h2>
        <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
          {{#skills}}<li>{{.}}</li>{{/skills}}
        </ul>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-1">Certifications</h2>
        <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
          {{#certifications}}<li>{{name}} – {{issuer}} ({{date}})</li>{{/certifications}}
        </ul>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-1">Languages</h2>
        <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
          {{#languages}}<li>{{name}} – {{level}}</li>{{/languages}}
        </ul>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-1">Soft Skills</h2>
        <ul class="list-disc ml-5 text-sm mt-2 space-y-1">
          {{#softSkills}}<li>{{.}}</li>{{/softSkills}}
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
`;

type BuilderStep = 'input' | 'processing' | 'preview';

export const CVBuilder: React.FC = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobDescription, setJobDescription] = useState('');
  const [applicantCV, setApplicantCV] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<BuilderStep>('input');
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const canAnalyze = jobDescription.trim() && applicantCV.trim();

  useEffect(() => {
    setJobDescription('');
    setApplicantCV('');
    setGeneratedData(null);
    setCurrentStep('input');
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!canAnalyze) return;
    setIsAnalyzing(true);
    setError(null);
    setCurrentStep('processing');
    try {
      // 1. Call OpenAI for JSON
      const response = await TailoredHTMLCVService.generateTailoredHTMLCV({
        originalCV: applicantCV,
        jobDescription: jobDescription,
      });
      let jsonData;
      try {
        jsonData = typeof response === 'string' ? JSON.parse(response) : response.cv;
        if (typeof jsonData === 'string') jsonData = JSON.parse(jsonData);
      } catch (err) {
        throw new Error('Failed to parse JSON from OpenAI.');
      }
      // 2. Set the data for PDF generation
      setGeneratedData(jsonData);
      setCurrentStep('preview');
      toast({
        title: 'CV generated successfully',
        description: 'Your tailored PDF CV is ready for download',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate CV');
      setCurrentStep('input');
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'preview') {
      setCurrentStep('input');
    } else {
      navigate('/');
    }
  };

  const handleNewCV = () => {
    setJobDescription('');
    setApplicantCV('');
    setGeneratedData(null);
    setCurrentStep('input');
    setError(null);
  };

  if (currentStep === 'preview' && generatedData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className={`h-4 w-4 mr-2 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                Back to Builder
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">Tailored PDF CV</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleNewCV}>
                Create New CV
              </Button>
              <LanguageToggle variant="builder" />
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="card-elegant p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your CV is Ready!</h2>
                             <Button 
                 onClick={async () => {
                   setIsGeneratingPdf(true);
                   try {
                     const blob = await pdf(<CVPdfDocument data={generatedData} />).toBlob();
                     const url = URL.createObjectURL(blob);
                     const link = document.createElement('a');
                     link.href = url;
                     link.download = 'tailored-cv.pdf';
                     link.click();
                     URL.revokeObjectURL(url);
                     toast({
                       title: 'PDF downloaded successfully',
                       description: 'Your CV has been saved to your downloads folder.',
                     });
                   } catch (error) {
                     console.error('PDF generation failed:', error);
                     toast({
                       title: 'PDF generation failed',
                       description: 'Failed to generate PDF. Please try again.',
                       variant: 'destructive',
                     });
                   } finally {
                     setIsGeneratingPdf(false);
                   }
                 }}
                 disabled={isGeneratingPdf}
                 className="btn-primary"
               >
                 {isGeneratingPdf ? (
                   <>
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                     Generating PDF...
                   </>
                 ) : (
                   <>
                     <Download className="h-4 w-4 mr-2" />
                     Download PDF
                   </>
                 )}
               </Button>
            </div>
            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Generated CV Data:</h3>
              <pre className="text-sm overflow-auto max-h-96">
                {JSON.stringify(generatedData, null, 2)}
              </pre>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className={`h-4 w-4 mr-2 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">CV Builder</h1>
            </div>
          </div>
          <LanguageToggle variant="builder" />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <section className="card-elegant p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-2">Job Description</h2>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] resize-none border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 text-base"
          />
        </section>
        <section className="card-elegant p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-2">Your CV</h2>
          <Textarea
            placeholder="Paste your CV here..."
            value={applicantCV}
            onChange={(e) => setApplicantCV(e.target.value)}
            className="min-h-[250px] resize-none border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 text-base"
          />
        </section>
        {error && (
          <div className="card-elegant p-4 border-l-4 border-destructive bg-destructive/5">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
        <section className="pt-4">
          <Button
            onClick={handleGenerate}
            disabled={!canAnalyze || isAnalyzing}
            className="w-full btn-primary text-lg py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                Generating Tailored CV...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                Generate Tailored PDF CV
              </>
            )}
          </Button>
          {!canAnalyze && (
            <p className="text-sm text-muted-foreground text-center mt-3">
              Please fill in both the job description and your CV to continue
            </p>
          )}
        </section>
      </main>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default CVBuilder;