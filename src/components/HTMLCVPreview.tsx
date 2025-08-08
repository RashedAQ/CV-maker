import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, ExternalLink, FileText } from 'lucide-react';
import DOMPurify from 'dompurify';
import { HTMLPDFExportService } from '@/services/htmlPdfExport';
import { useToast } from '@/hooks/use-toast';

interface HTMLCVPreviewProps {
  htmlContent: string;
  onExport?: () => void;
  onEdit?: () => void;
}

export const HTMLCVPreview: React.FC<HTMLCVPreviewProps> = ({ 
  htmlContent, 
  onExport, 
  onEdit 
}) => {
  const { toast } = useToast();
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);

  const previewInNewTab = () => {
    try {
      HTMLPDFExportService.previewInNewTab(sanitizedHTML);
      toast({
        title: "Preview opened",
        description: "CV preview opened in new tab",
      });
    } catch (error) {
      toast({
        title: "Preview failed",
        description: error instanceof Error ? error.message : "Failed to open preview",
        variant: "destructive",
      });
    }
  };

  const downloadHTML = () => {
    try {
      HTMLPDFExportService.downloadHTML(sanitizedHTML, 'resume.html');
      toast({
        title: "HTML downloaded",
        description: "CV has been downloaded as HTML file",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download HTML",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = async () => {
    try {
      await HTMLPDFExportService.exportHTMLToPDF(sanitizedHTML, 'resume.pdf');
      toast({
        title: "PDF exported successfully",
        description: "Your CV has been exported as PDF",
      });
    } catch (error) {
      console.log('Main PDF export failed, trying simple method:', error);
      
      try {
        // Fallback to simple export method
        await HTMLPDFExportService.exportHTMLToPDFSimple(sanitizedHTML, 'resume.pdf');
        toast({
          title: "PDF exported successfully",
          description: "Your CV has been exported as PDF (using print method)",
        });
      } catch (fallbackError) {
        console.error('Both PDF export methods failed:', fallbackError);
        toast({
          title: "Export failed",
          description: "Both export methods failed. Please try again or use the print function.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header Actions */}
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h1 className="text-xl font-semibold">HTML CV Preview</h1>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={previewInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Tab
          </Button>
          <Button variant="secondary" size="sm" onClick={downloadHTML}>
            <Download className="h-4 w-4 mr-2" />
            Download HTML
          </Button>
          <Button variant="secondary" size="sm" onClick={exportToPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          {onExport && (
            <Button variant="secondary" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
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
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        </div>

        {/* Floating Preview Button */}
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={previewInNewTab}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Full Preview
          </Button>
        </div>
      </div>

      {/* Action Cards */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={previewInNewTab}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Download</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadHTML}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Export</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToPDF}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 