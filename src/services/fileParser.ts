import { FileUploadResult } from '@/types/cv';

export class FileParser {
  static async parseFile(file: File): Promise<FileUploadResult> {
    const fileType = file.type;
    const fileName = file.name;

    try {
      let text = '';

      if (fileType === 'application/pdf') {
        text = await this.parsePDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await this.parseDOCX(file);
      } else if (fileType === 'text/plain') {
        text = await this.parseTXT(file);
      } else {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
      }

      return {
        text: this.cleanText(text),
        fileName,
        fileType
      };
    } catch (error) {
      throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async parsePDF(file: File): Promise<string> {
    // For now, we'll use a simple text extraction
    // In a real implementation, you'd use pdf-parse or similar library
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // This is a simplified PDF parsing - in production you'd use a proper PDF parser
          const text = e.target?.result as string;
          resolve(text || '');
        } catch (error) {
          reject(new Error('Failed to parse PDF file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsText(file);
    });
  }

  private static async parseDOCX(file: File): Promise<string> {
    // For now, we'll use a simple text extraction
    // In a real implementation, you'd use mammoth.js or similar library
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          resolve(text || '');
        } catch (error) {
          reject(new Error('Failed to parse DOCX file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read DOCX file'));
      reader.readAsText(file);
    });
  }

  private static async parseTXT(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          resolve(text || '');
        } catch (error) {
          reject(new Error('Failed to parse TXT file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read TXT file'));
      reader.readAsText(file);
    });
  }

  private static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
      .trim();
  }
} 