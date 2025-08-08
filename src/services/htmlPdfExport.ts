export class HTMLPDFExportService {
  static async exportHTMLToPDF(htmlContent: string, filename: string = 'resume.pdf'): Promise<void> {
    try {
      // Dynamic import of html2pdf.js
      const html2pdf = await import('html2pdf.js');
      
      // Create a temporary container for the HTML content
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

      // Configure html2pdf options
      const options = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      // Generate PDF
      await html2pdf.default().from(container).set(options).save();

      // Clean up
      document.body.removeChild(container);
    } catch (error) {
      console.error('HTML PDF Export Error:', error);
      throw new Error(`Failed to export HTML to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async exportHTMLToPDFSimple(htmlContent: string, filename: string = 'resume.pdf'): Promise<void> {
    try {
      // Create a new window with the HTML content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      // Write the HTML content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load
      await new Promise(resolve => {
        printWindow.onload = resolve;
        setTimeout(resolve, 1000); // Fallback timeout
      });

      // Trigger print dialog
      printWindow.print();
      
      // Close the window after a delay
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    } catch (error) {
      console.error('Simple HTML PDF Export Error:', error);
      throw new Error(`Failed to export HTML to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static downloadHTML(htmlContent: string, filename: string = 'resume.html'): void {
    try {
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('HTML Download Error:', error);
      throw new Error(`Failed to download HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static previewInNewTab(htmlContent: string): void {
    try {
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        throw new Error('Failed to open new window');
      }
      
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    } catch (error) {
      console.error('HTML Preview Error:', error);
      throw new Error(`Failed to preview HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 