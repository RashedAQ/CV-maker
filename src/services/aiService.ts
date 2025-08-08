import { CVGenerationRequest, CVGenerationResponse, CV } from '@/types/cv';

export class AIService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private static readonly MODEL = 'gpt-4o';
  private static readonly MAX_TOKENS = 4000;
  private static readonly TEMPERATURE = 0.3;

  static async generateCV(request: CVGenerationRequest): Promise<CVGenerationResponse> {
    try {
      const prompt = this.buildPrompt(request.originalCV, request.jobDescription);
      
              const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
          },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert CV writer and career consultant. Your task is to analyze a job description and an original CV, then generate a tailored CV that emphasizes relevant skills and experience without overstating qualifications. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: this.TEMPERATURE,
          max_tokens: this.MAX_TOKENS,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from AI service');
      }

      const parsedResponse = this.parseAIResponse(content);
      return parsedResponse;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static buildPrompt(originalCV: string, jobDescription: string): string {
    return `
You are an expert CV writer and career consultant specializing in creating targeted, professional resumes. Your task is to analyze a job description and an original CV, then generate a tailored CV that intelligently prioritizes and emphasizes relevant experience while de-emphasizing less relevant information.

JOB DESCRIPTION:
${jobDescription}

ORIGINAL CV:
${originalCV}

CRITICAL INSTRUCTIONS FOR INTELLIGENT PRIORITIZATION:

1. **EXPERIENCE PRIORITIZATION & REORDERING:**
   - Analyze each experience item for relevance to the job requirements
   - Score experiences from 1-10 based on relevance (10 = highly relevant, 1 = least relevant)
   - Reorder experiences by relevance score (highest first)
   - For highly relevant experiences (score 8-10): Provide full details, achievements, technologies, impact metrics
   - For moderately relevant experiences (score 5-7): Provide good details but less emphasis
   - For less relevant experiences (score 1-4): Provide brief descriptions, minimal details, move to bottom

2. **SKILL CATEGORIZATION:**
   - **Core Skills**: Skills that directly match job requirements (emphasize these)
   - **Relevant Skills**: Skills that are somewhat related to the job
   - **Additional Skills**: Skills that show versatility but aren't directly relevant (de-emphasize)
   - **Technical Skills**: Prioritize by relevance to job requirements
   - **Soft Skills**: Focus on those mentioned in job description

3. **ACHIEVEMENT PRIORITIZATION:**
   - For relevant roles: Include detailed, quantifiable achievements
   - For less relevant roles: Include only major achievements, keep descriptions brief
   - Focus on metrics, impact, and results that align with job requirements

4. **SUMMARY TAILORING:**
   - Lead with the most relevant experience and skills
   - Emphasize qualifications that match job requirements
   - Mention less relevant experience briefly to show career progression
   - Keep it concise but comprehensive

5. **SECTION EMPHASIS:**
   - Give more space to relevant experience sections
   - Condense less relevant experience
   - Prioritize education if it's highly relevant to the job
   - Emphasize certifications that match job requirements

6. **LANGUAGE & TONE:**
   - Use action verbs and professional language
   - Focus on achievements and measurable results
   - Ensure all information is accurate and not overstated
   - Maintain professional tone throughout

7. **SPECIFIC GUIDELINES:**
   - Do not remove any experience - only reorder and de-emphasize
   - Keep all dates, companies, and positions accurate
   - Focus on transferable skills from less relevant experience
   - Highlight any cross-functional skills that could be valuable
   - Ensure the CV tells a coherent career story

Please return the response in the following JSON format:
{
  "cv": {
    "personalInfo": {
      "name": "string",
      "email": "string", 
      "phone": "string",
      "location": "string",
      "linkedin": "string (optional)",
      "website": "string (optional)"
    },
    "summary": "string (tailored to job requirements, emphasizing relevant experience first)",
    "experience": [
      {
        "id": "string",
        "company": "string",
        "position": "string", 
        "location": "string",
        "startDate": "string (YYYY-MM)",
        "endDate": "string (YYYY-MM) or null",
        "current": "boolean",
        "description": "string (detailed for relevant roles, brief for less relevant)",
        "achievements": ["string (prioritized by relevance)"],
        "technologies": ["string (prioritized by relevance)"],
        "relevanceScore": "number (1-10, for internal use)"
      }
    ],
    "education": [
      {
        "id": "string",
        "institution": "string",
        "degree": "string",
        "field": "string", 
        "startDate": "string (YYYY-MM)",
        "endDate": "string (YYYY-MM) or null",
        "current": "boolean",
        "gpa": "string (optional)",
        "relevantCourses": ["string (optional, prioritize relevant courses)"]
      }
    ],
    "skills": [
      {
        "name": "string",
        "level": "beginner|intermediate|advanced|expert",
        "category": "core|relevant|additional|technical|soft|language|tool",
        "priority": "high|medium|low (based on job requirements)"
      }
    ],
    "certifications": [
      {
        "name": "string",
        "issuer": "string",
        "date": "string (YYYY-MM)",
        "expiryDate": "string (YYYY-MM) or null",
        "credentialId": "string (optional)"
      }
    ],
    "languages": [
      {
        "name": "string",
        "level": "basic|conversational|fluent|native"
      }
    ]
  },
  "analysis": {
    "matchScore": "number (0-100)",
    "strengths": ["string (focus on most relevant strengths)"],
    "improvements": ["string (suggestions for better alignment)"],
    "tailoredSummary": "string (detailed analysis of how well the CV matches the job)"
  }
}

IMPORTANT: Return only the JSON object, no additional text or formatting. Ensure all experience is included but properly prioritized by relevance to the job requirements.
`;
  }

  private static parseAIResponse(content: string): CVGenerationResponse {
    try {
      // Clean the content to extract JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (!parsed.cv || !parsed.analysis) {
        throw new Error('Invalid response structure from AI');
      }

      return parsed as CVGenerationResponse;
    } catch (error) {
      console.error('Failed to parse AI response:', content);
      throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }
  }

  // Mock method for development/testing when API key is not available
  static async generateMockCV(request: CVGenerationRequest): Promise<CVGenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockCV: CV = {
      personalInfo: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/johndoe",
        website: "johndoe.dev"
      },
      summary: "Experienced software developer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading development teams.",
      experience: [
        {
          id: "1",
          company: "Tech Corp",
          position: "Senior Software Engineer",
          location: "San Francisco, CA",
          startDate: "2022-01",
          endDate: null,
          current: true,
          description: "Lead full-stack development team of 6 engineers, delivering high-impact features for SaaS platform serving 100K+ users.",
          achievements: [
            "Reduced API response time by 40% through optimization",
            "Implemented CI/CD pipeline reducing deployment time by 60%",
            "Mentored 3 junior developers and conducted code reviews"
          ],
          technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"]
        },
        {
          id: "2",
          company: "Startup Inc",
          position: "Full Stack Developer",
          location: "Remote",
          startDate: "2020-03",
          endDate: "2021-12",
          current: false,
          description: "Developed and maintained web applications using modern JavaScript frameworks and cloud services.",
          achievements: [
            "Built responsive web application serving 50K+ monthly users",
            "Integrated third-party APIs and payment systems",
            "Optimized database queries improving performance by 30%"
          ],
          technologies: ["JavaScript", "React", "Express.js", "MongoDB", "Heroku"]
        }
      ],
      education: [
        {
          id: "1",
          institution: "University of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2016-09",
          endDate: "2020-05",
          current: false,
          gpa: "3.8/4.0",
          relevantCourses: ["Data Structures", "Algorithms", "Software Engineering", "Database Systems"]
        }
      ],
      skills: [
        { name: "React", level: "expert", category: "technical" },
        { name: "Node.js", level: "advanced", category: "technical" },
        { name: "TypeScript", level: "advanced", category: "technical" },
        { name: "AWS", level: "intermediate", category: "technical" },
        { name: "Leadership", level: "advanced", category: "soft" },
        { name: "Problem Solving", level: "expert", category: "soft" }
      ],
      certifications: [
        {
          name: "AWS Certified Developer",
          issuer: "Amazon Web Services",
          date: "2023-06",
          expiryDate: "2026-06",
          credentialId: "AWS-DEV-123456"
        }
      ],
      languages: [
        { name: "English", level: "native" },
        { name: "Spanish", level: "conversational" }
      ]
    };

    return {
      cv: mockCV,
      analysis: {
        matchScore: 85,
        strengths: [
          "Strong technical skills in React and Node.js",
          "Proven leadership experience",
          "Cloud computing knowledge with AWS",
          "Excellent problem-solving abilities"
        ],
        improvements: [
          "Could highlight more specific achievements with metrics",
          "Consider adding more recent certifications",
          "Include more details about team size and project scope"
        ],
        tailoredSummary: "Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading development teams. Strong background in modern web technologies and agile development methodologies."
      }
    };
  }
} 