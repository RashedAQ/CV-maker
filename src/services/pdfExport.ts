import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export class PDFExportService {
  static async exportToPDF(elementId: string, filename: string = 'generated-cv.pdf'): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('CV preview element not found');
      }

      // Show loading state
      const loadingElement = document.createElement('div');
      loadingElement.innerHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: Arial, sans-serif;
        ">
          <div style="text-align: center;">
            <div style="
              width: 40px;
              height: 40px;
              border: 4px solid #f3f3f3;
              border-top: 4px solid #3498db;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto 10px;
            "></div>
            <p>Generating PDF...</p>
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(loadingElement);

      // Wait a bit for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(element, {
        scale: 2, // Reduced scale for better compatibility
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        logging: true, // Enable logging for debugging
        removeContainer: false, // Changed to false
        foreignObjectRendering: false, // Changed to false for better compatibility
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Ensure fonts are loaded in the cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; 
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
            }
            body { margin: 0 !important; padding: 0 !important; }
            .cv-preview { 
              background: white !important; 
              color: black !important;
              font-size: 14px !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Remove loading element
      document.body.removeChild(loadingElement);

      // Debug: Check if canvas has content
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      console.log('Canvas data URL length:', canvas.toDataURL('image/png').length);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log('PDF dimensions:', pdfWidth, 'x', pdfHeight);
      console.log('Image dimensions:', imgWidth, 'x', imgHeight);

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Save the PDF
      pdf.save(filename);

    } catch (error) {
      console.error('PDF Export Error:', error);
      throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Alternative method using browser's print functionality
  static async printCV(elementId: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('CV preview element not found');
      }

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      // Get the element's HTML
      const htmlContent = element.outerHTML;

      // Create the print document
      const printDocument = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>CV - Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            @media print {
              body { margin: 0; }
              * { -webkit-print-color-adjust: exact; }
            }
            ${this.getPrintStyles()}
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;

      printWindow.document.write(printDocument);
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

    } catch (error) {
      console.error('Print Error:', error);
      throw new Error(`Failed to print CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Alternative PDF export method using a simpler approach
  static async exportToPDFSimple(elementId: string, filename: string = 'generated-cv.pdf'): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('CV preview element not found');
      }

      // Show loading state
      const loadingElement = document.createElement('div');
      loadingElement.innerHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: Arial, sans-serif;
        ">
          <div style="text-align: center;">
            <div style="
              width: 40px;
              height: 40px;
              border: 4px solid #f3f3f3;
              border-top: 4px solid #3498db;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 0 auto 10px;
            "></div>
            <p>Generating PDF...</p>
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(loadingElement);

      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use simpler html2canvas configuration
      const canvas = await html2canvas(element, {
        scale: 1, // Use scale 1 for better compatibility
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        onclone: (clonedDoc) => {
          // Add basic styling to cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * { 
              font-family: Arial, sans-serif !important; 
              color: black !important;
            }
            body { 
              margin: 0 !important; 
              padding: 20px !important; 
              background: white !important;
            }
            .cv-preview { 
              background: white !important; 
              color: black !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Remove loading element
      document.body.removeChild(loadingElement);

      // Debug logging
      console.log('Simple Canvas dimensions:', canvas.width, 'x', canvas.height);

      // Create PDF with simpler approach
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log('Simple PDF dimensions:', pdfWidth, 'x', pdfHeight);
      console.log('Simple Image dimensions:', imgWidth, 'x', imgHeight);

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(filename);

    } catch (error) {
      console.error('Simple PDF Export Error:', error);
      throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static getPrintStyles(): string {
    return `
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          line-height: 1.6 !important;
          color: #1f2937 !important;
          background: white !important;
          margin: 0 !important;
          padding: 20px !important;
          font-size: 14px !important;
        }
        
        .cv-preview {
          max-width: 800px !important;
          margin: 0 auto !important;
          background: white !important;
          padding: 40px !important;
          box-shadow: none !important;
          border: 1px solid #e5e7eb !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .cv-header {
          text-align: center !important;
          margin-bottom: 30px !important;
          padding-bottom: 20px !important;
          border-bottom: 2px solid #3b82f6 !important;
        }
        
        .cv-header h1 {
          font-size: 28px !important;
          font-weight: 700 !important;
          color: #1f2937 !important;
          margin: 0 0 8px 0 !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .cv-header .contact-info {
          font-size: 14px !important;
          color: #6b7280 !important;
          margin-bottom: 8px !important;
        }
        
        .cv-header .links {
          font-size: 14px !important;
          color: #3b82f6 !important;
        }
        
        .cv-section {
          margin-bottom: 25px !important;
          page-break-inside: avoid !important;
        }
        
        .cv-section h2 {
          font-size: 18px !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin: 0 0 15px 0 !important;
          padding-bottom: 5px !important;
          border-bottom: 1px solid #e5e7eb !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .cv-section h3 {
          font-size: 16px !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin: 0 0 8px 0 !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .cv-section p {
          font-size: 14px !important;
          color: #374151 !important;
          margin: 0 0 10px 0 !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .experience-item, .education-item {
          margin-bottom: 20px !important;
          page-break-inside: avoid !important;
        }
        
        .experience-header, .education-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 8px !important;
        }
        
        .experience-title, .education-title {
          font-weight: 600 !important;
          color: #1f2937 !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .experience-company, .education-institution {
          color: #3b82f6 !important;
          font-weight: 500 !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .experience-dates, .education-dates {
          color: #6b7280 !important;
          font-size: 14px !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .experience-location, .education-location {
          color: #6b7280 !important;
          font-size: 14px !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .experience-description, .education-description {
          color: #374151 !important;
          margin-bottom: 10px !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .achievements-list, .technologies-list {
          margin: 8px 0 !important;
          padding-left: 20px !important;
        }
        
        .achievements-list li, .technologies-list li {
          color: #374151 !important;
          margin-bottom: 4px !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .skills-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
          gap: 15px !important;
          margin-top: 15px !important;
        }
        
        .skill-category {
          margin-bottom: 20px !important;
        }
        
        .skill-category h4 {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin: 0 0 10px 0 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .skill-item {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 8px 0 !important;
          border-bottom: 1px solid #f3f4f6 !important;
        }
        
        .skill-name {
          font-weight: 500 !important;
          color: #1f2937 !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .skill-level {
          color: #6b7280 !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .certifications-list, .languages-list {
          margin-top: 15px !important;
        }
        
        .certification-item, .language-item {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 8px 0 !important;
          border-bottom: 1px solid #f3f4f6 !important;
        }
        
        .certification-name, .language-name {
          font-weight: 500 !important;
          color: #1f2937 !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .certification-details, .language-level {
          color: #6b7280 !important;
          font-size: 12px !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        .profile-photo {
          width: 80px !important;
          height: 80px !important;
          border-radius: 50% !important;
          object-fit: cover !important;
          border: 3px solid #3b82f6 !important;
          margin: 0 auto 20px !important;
          display: block !important;
        }
        
        /* Hide non-printable elements */
        .no-print {
          display: none !important;
        }
        
        /* Ensure proper page breaks */
        .page-break {
          page-break-before: always !important;
        }
        
        /* Force background colors and borders */
        .bg-white { background-color: white !important; }
        .bg-gray-50 { background-color: #f9fafb !important; }
        .border { border: 1px solid #e5e7eb !important; }
        .border-b { border-bottom: 1px solid #e5e7eb !important; }
        .border-blue-500 { border-color: #3b82f6 !important; }
        
        /* Text colors */
        .text-gray-900 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-blue-600 { color: #3b82f6 !important; }
        
        /* Font weights */
        .font-bold { font-weight: 700 !important; }
        .font-semibold { font-weight: 600 !important; }
        .font-medium { font-weight: 500 !important; }
        
        /* Spacing */
        .p-4 { padding: 1rem !important; }
        .p-6 { padding: 1.5rem !important; }
        .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
        .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
        .mb-4 { margin-bottom: 1rem !important; }
        .mb-6 { margin-bottom: 1.5rem !important; }
        .mt-4 { margin-top: 1rem !important; }
        .mt-6 { margin-top: 1.5rem !important; }
        
        /* Tailwind utility classes for print */
        .bg-primary { background-color: #3b82f6 !important; }
        .text-primary-foreground { color: white !important; }
        .border-primary { border-color: #3b82f6 !important; }
        .text-primary { color: #3b82f6 !important; }
        .bg-green-100 { background-color: #dcfce7 !important; }
        .text-green-800 { color: #166534 !important; }
        .bg-blue-100 { background-color: #dbeafe !important; }
        .text-blue-800 { color: #1e40af !important; }
        .bg-yellow-100 { background-color: #fef3c7 !important; }
        .text-yellow-800 { color: #92400e !important; }
        .bg-purple-100 { background-color: #f3e8ff !important; }
        .text-purple-800 { color: #6b21a8 !important; }
        .bg-orange-100 { background-color: #fed7aa !important; }
        .text-orange-800 { color: #9a3412 !important; }
        .bg-pink-100 { background-color: #fce7f3 !important; }
        .text-pink-800 { color: #9d174d !important; }
        .bg-indigo-100 { background-color: #e0e7ff !important; }
        .text-indigo-800 { color: #3730a3 !important; }
        .bg-gray-100 { background-color: #f3f4f6 !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-gray-900 { color: #111827 !important; }
        .border-gray-200 { border-color: #e5e7eb !important; }
        .shadow-lg { box-shadow: none !important; }
        .rounded-lg { border-radius: 0 !important; }
        .overflow-hidden { overflow: visible !important; }
      }
    `;
  }
} 