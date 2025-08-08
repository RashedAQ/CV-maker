import { TailoredHTMLCVService } from '@/services/tailoredHtmlCvService';
import { CVGenerationRequest, CVGenerationResponse } from '@/types/cv';

export class CVApiService {
  static async generateTailoredCV(request: CVGenerationRequest): Promise<CVGenerationResponse> {
    try {
      // Use the existing service to generate the tailored CV
      const response = await TailoredHTMLCVService.generateTailoredHTMLCV(request);
      
      // Convert the HTML CV to a format suitable for n8n
      const cvData = response.cv;
      
      // Create a simple text version for n8n
      const textVersion = this.convertToText(cvData);
      
      return {
        ...response,
        textVersion,
        // Add any additional fields needed for n8n
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('CV API Service Error:', error);
      throw new Error(`Failed to generate tailored CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static convertToText(cvData: any): string {
    let text = '';
    
    // Add personal info
    if (cvData.personalInfo) {
      text += `${cvData.personalInfo.name}\n`;
      text += `${cvData.personalInfo.email} | ${cvData.personalInfo.phone}\n`;
      text += `${cvData.personalInfo.location}\n\n`;
    }
    
    // Add summary
    if (cvData.summary) {
      text += `PROFESSIONAL SUMMARY\n${cvData.summary}\n\n`;
    }
    
    // Add experience
    if (cvData.experience && cvData.experience.length > 0) {
      text += `EXPERIENCE\n`;
      cvData.experience.forEach((exp: any) => {
        text += `${exp.title} at ${exp.company}\n`;
        text += `${exp.start} - ${exp.end}\n`;
        if (exp.bullets) {
          exp.bullets.forEach((bullet: string) => {
            text += `• ${bullet}\n`;
          });
        }
        text += '\n';
      });
    }
    
    // Add skills
    if (cvData.skills && cvData.skills.length > 0) {
      text += `SKILLS\n${cvData.skills.join(', ')}\n\n`;
    }
    
    // Add education
    if (cvData.education && cvData.education.length > 0) {
      text += `EDUCATION\n`;
      cvData.education.forEach((edu: any) => {
        text += `${edu.degree} - ${edu.school} (${edu.years})\n`;
      });
    }
    
    return text;
  }

  // Mock method for testing without API key
  static async generateMockTailoredCV(request: CVGenerationRequest): Promise<CVGenerationResponse> {
    try {
      const response = await TailoredHTMLCVService.generateMockTailoredHTMLCV(request);
      
      const textVersion = this.convertToText(response.cv);
      
      return {
        ...response,
        textVersion,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Mock CV API Service Error:', error);
      throw new Error(`Failed to generate mock tailored CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
