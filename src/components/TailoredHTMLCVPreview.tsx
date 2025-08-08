import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import DOMPurify from 'dompurify';
import { HTMLPDFExportService } from '@/services/htmlPdfExport';
import { useToast } from '@/hooks/use-toast';

interface TailoredHTMLCVPreviewProps {
  htmlContent: string;
}

export const TailoredHTMLCVPreview: React.FC<TailoredHTMLCVPreviewProps> = ({
  htmlContent
}) => {
  const { toast } = useToast();
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);

  const downloadHTML = () => {
    try {
      HTMLPDFExportService.downloadHTML(sanitizedHTML, 'tailored-cv.html');
      toast({
        title: "HTML downloaded",
        description: "Your tailored CV has been downloaded as HTML file",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download HTML",
        variant: "destructive",
      });
    }
  };

  // CSS for two-column CV layout
  const cvStyles = `
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        margin: 0;
        padding: 2rem;
        background-color: #f9f9f9;
        color: #222;
        line-height: 1.6;
      }

      .cv-container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }

      .cv-header {
        background: #0a3d62;
        color: white;
        padding: 2rem;
        text-align: center;
      }

      .cv-header h1 {
        font-size: 2.5rem;
        margin: 0 0 0.5rem 0;
        font-weight: 700;
      }

      .contact-info {
        font-size: 0.9rem;
        opacity: 0.9;
      }

      .contact-info span {
        margin: 0 0.5rem;
      }

      .cv-content {
        display: flex;
        min-height: 600px;
      }

      .left-column {
        flex: 2;
        padding: 2rem;
        border-right: 1px solid #e5e7eb;
      }

      .right-column {
        flex: 1;
        padding: 2rem;
        background: #f8f9fa;
      }

      .section {
        margin-bottom: 2rem;
      }

      .section:last-child {
        margin-bottom: 0;
      }

      .section h2 {
        color: #0a3d62;
        font-size: 1.4rem;
        margin: 0 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #0a3d62;
        font-weight: 600;
      }

      .section h3 {
        color: #0a3d62;
        font-size: 1.1rem;
        margin: 0 0 0.5rem 0;
        font-weight: 600;
      }

      .job-title {
        font-weight: 600;
        color: #0a3d62;
        margin-bottom: 0.25rem;
      }

      .job-company {
        font-weight: 500;
        color: #555;
        margin-bottom: 0.25rem;
      }

      .job-date {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 0.5rem;
      }

      .job-description {
        margin-bottom: 1rem;
      }

      .job-description ul {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
      }

      .job-description li {
        margin-bottom: 0.25rem;
      }

      .skills-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .skills-list li {
        margin-bottom: 0.5rem;
        padding: 0.25rem 0;
      }

      .skills-category {
        font-weight: 600;
        color: #0a3d62;
        margin-bottom: 0.5rem;
      }

      .education-item {
        margin-bottom: 1rem;
      }

      .education-degree {
        font-weight: 600;
        color: #0a3d62;
      }

      .education-school {
        color: #555;
      }

      .education-date {
        font-size: 0.9rem;
        color: #666;
      }

      .certification-item {
        margin-bottom: 0.75rem;
      }

      .certification-name {
        font-weight: 600;
        color: #0a3d62;
      }

      .certification-issuer {
        color: #555;
        font-size: 0.9rem;
      }

      .certification-date {
        font-size: 0.8rem;
        color: #666;
      }

      .summary {
        font-size: 1rem;
        line-height: 1.6;
        color: #333;
        margin-bottom: 1.5rem;
      }

      @media (max-width: 768px) {
        .cv-content {
          flex-direction: column;
        }

        .left-column {
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
        }

        .cv-header h1 {
          font-size: 2rem;
        }
      }
    </style>
  `;

  // Inject the styles into the HTML content
  const htmlWithStyles = sanitizedHTML.replace('</head>', `${cvStyles}</head>`);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header Actions */}
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Your Tailored HTML CV</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={downloadHTML}>
          <Download className="h-4 w-4 mr-2" />
          Download HTML
        </Button>
      </div>

      {/* CV Content */}
      <div className="relative">
        {/* Preview Container */}
        <div
          className="p-4 border rounded shadow bg-white overflow-auto max-h-[80vh]"
          style={{
            minHeight: '600px',
            backgroundColor: '#f8f9fa'
          }}
        >
          <div
            className="bg-white rounded-lg shadow-sm"
            dangerouslySetInnerHTML={{ __html: htmlWithStyles }}
          />
        </div>
      </div>

      {/* Download Info */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Your CV has been tailored to match the job description while maintaining accuracy.
          </p>
          <Button
            variant="outline"
            onClick={downloadHTML}
            className="w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Download HTML File
          </Button>
        </div>
      </div>
    </div>
  );
}; 