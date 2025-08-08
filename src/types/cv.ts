export interface CV {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications?: Certification[];
  languages?: Language[];
  photo?: string; // base64 encoded image
  htmlContent?: string; // Generated HTML resume content
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  relevanceScore?: number; // 1-10 score for internal use
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  relevantCourses?: string[];
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'core' | 'relevant' | 'additional' | 'technical' | 'soft' | 'language' | 'tool';
  priority?: 'high' | 'medium' | 'low'; // based on job requirements
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface Language {
  name: string;
  level: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface JobAnalysis {
  jobDescription: string;
  extractedSkills: string[];
  requiredExperience: string;
  keyResponsibilities: string[];
  preferredQualifications: string[];
}

export interface CVGenerationRequest {
  originalCV: string;
  jobDescription: string;
  photo?: File;
}

export interface CVGenerationResponse {
  cv: CV;
  analysis: {
    matchScore: number;
    strengths: string[];
    improvements: string[];
    tailoredSummary: string;
  };
}

export interface FileUploadResult {
  text: string;
  fileName: string;
  fileType: string;
} 