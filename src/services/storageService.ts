import { CV, CVGenerationResponse } from '@/types/cv';

export class StorageService {
  private static readonly CV_DRAFT_KEY = 'cv_draft';
  private static readonly CV_GENERATED_KEY = 'cv_generated';
  private static readonly JOB_DESCRIPTION_KEY = 'job_description';
  private static readonly ORIGINAL_CV_KEY = 'original_cv';

  // Save draft data
  static saveDraft(jobDescription: string, originalCV: string): void {
    try {
      localStorage.setItem(this.JOB_DESCRIPTION_KEY, jobDescription);
      localStorage.setItem(this.ORIGINAL_CV_KEY, originalCV);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  // Load draft data
  static loadDraft(): { jobDescription: string; originalCV: string } {
    try {
      const jobDescription = localStorage.getItem(this.JOB_DESCRIPTION_KEY) || '';
      const originalCV = localStorage.getItem(this.ORIGINAL_CV_KEY) || '';
      return { jobDescription, originalCV };
    } catch (error) {
      console.error('Failed to load draft:', error);
      return { jobDescription: '', originalCV: '' };
    }
  }

  // Save generated CV
  static saveGeneratedCV(response: CVGenerationResponse): void {
    try {
      localStorage.setItem(this.CV_GENERATED_KEY, JSON.stringify(response));
    } catch (error) {
      console.error('Failed to save generated CV:', error);
    }
  }

  // Load generated CV
  static loadGeneratedCV(): CVGenerationResponse | null {
    try {
      const data = localStorage.getItem(this.CV_GENERATED_KEY);
      if (!data) return null;
      return JSON.parse(data) as CVGenerationResponse;
    } catch (error) {
      console.error('Failed to load generated CV:', error);
      return null;
    }
  }

  // Clear all data
  static clearAll(): void {
    try {
      localStorage.removeItem(this.CV_DRAFT_KEY);
      localStorage.removeItem(this.CV_GENERATED_KEY);
      localStorage.removeItem(this.JOB_DESCRIPTION_KEY);
      localStorage.removeItem(this.ORIGINAL_CV_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  // Check if there's saved data
  static hasSavedData(): boolean {
    try {
      return !!(localStorage.getItem(this.CV_GENERATED_KEY) || 
                localStorage.getItem(this.JOB_DESCRIPTION_KEY) || 
                localStorage.getItem(this.ORIGINAL_CV_KEY));
    } catch (error) {
      console.error('Failed to check saved data:', error);
      return false;
    }
  }

  // Auto-save with throttling
  private static autoSaveTimeout: NodeJS.Timeout | null = null;
  
  static autoSave(jobDescription: string, originalCV: string): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = setTimeout(() => {
      this.saveDraft(jobDescription, originalCV);
    }, 2000); // Save after 2 seconds of inactivity
  }
} 