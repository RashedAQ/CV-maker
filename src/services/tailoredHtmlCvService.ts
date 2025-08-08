import { CVGenerationRequest, CVGenerationResponse } from '@/types/cv';

export class TailoredHTMLCVService {
  private static readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private static readonly MODEL = 'gemini-pro';
  private static readonly MAX_TOKENS = 4000;
  private static readonly TEMPERATURE = 0.3;

  static async generateTailoredHTMLCV(request: CVGenerationRequest): Promise<CVGenerationResponse> {
    try {
      const prompt = this.buildTailoredPrompt(request.originalCV, request.jobDescription);
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCAKI6d_Bid_FNRxfQKqHYLAqVoRkDcVSs';
      const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a professional resume generator. Your task is to analyze a job description and a candidate's CV, then generate a tailored HTML resume that emphasizes relevant skills and experience without exaggeration. Return only valid HTML with class names, no inline styles or CSS.

${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: this.TEMPERATURE,
            maxOutputTokens: this.MAX_TOKENS,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error('No content received from AI service');
      }

      // Extract JSON content from the response
      const cvData = this.extractJSONContent(content);
      
      return {
        cv: cvData,
        analysis: {
          matchScore: 85, // Default score for HTML generation
          strengths: [
            "Professional HTML formatting",
            "Clean and modern design",
            "Well-structured content"
          ],
          improvements: [
            "Consider adding more specific achievements",
            "Include quantifiable results where possible"
          ],
          tailoredSummary: "Generated professional HTML resume with modern styling and clean structure."
        }
      };
    } catch (error) {
      console.error('Tailored HTML CV Service Error:', error);
      throw new Error(`Failed to generate tailored HTML CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static buildTailoredPrompt(originalCV: string, jobDescription: string): string {
    return `You are a professional resume builder.

Given the following job description and applicant CV, analyze and generate structured CV data that matches the job requirements. Focus on relevant experience and skills without exaggeration.

Output ONLY valid JSON in this exact format:
{
  "name": "Full Name",
  "jobTitle": "Professional Title",
  "contact": {
    "phone": "Phone Number",
    "email": "Email Address", 
    "location": "City, Country",
    "linkedin": "LinkedIn URL"
  },
  "summary": "Professional summary tailored to the job description",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "start": "Start Year",
      "end": "End Year or 'Present'",
      "bullets": [
        "Achievement or responsibility 1",
        "Achievement or responsibility 2"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "url": "github.com/username/project",
      "description": [
        "Project achievement or feature 1",
        "Project achievement or feature 2"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name", 
      "years": "Year Range",
      "location": "Location"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Year"
    }
  ],
  "strengths": [
    {
      "title": "Strength Title",
      "desc": "Description of the strength"
    }
  ],
  "languages": [
    {
      "name": "Language Name",
      "level": "Proficiency Level"
    }
  ]
}

Job Description:
${jobDescription}

Applicant CV:
${originalCV}

Generate the JSON data:`;
  }

  private static extractJSONContent(content: string): any {
    // Look for JSON content in the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        throw new Error('Invalid JSON response from AI service');
      }
    }
    
    // If no JSON found, throw error
    throw new Error('No valid JSON found in AI response');
  }

  private static parseHTMLToCV(htmlContent: string): any {
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract basic information from the HTML
    const name = doc.querySelector('h1')?.textContent || 'Professional Resume';
    const email = doc.querySelector('a[href^="mailto:"]')?.getAttribute('href')?.replace('mailto:', '') || '';
    const phone = doc.querySelector('a[href^="tel:"]')?.getAttribute('href')?.replace('tel:', '') || '';
    
    // Extract sections
    const sections = Array.from(doc.querySelectorAll('section, div.section, h2'));
    
    return {
      personalInfo: {
        name: name,
        email: email,
        phone: phone,
        location: '',
        linkedin: '',
        website: ''
      },
      summary: doc.querySelector('p')?.textContent || 'Professional summary',
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      languages: [],
      htmlContent: htmlContent // Store the original HTML for preview
    };
  }

  // Mock method for development/testing when API key is not available
  static async generateMockTailoredHTMLCV(request: CVGenerationRequest): Promise<CVGenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract basic info from the CV text
    const cvLines = request.originalCV.split('\n').filter(line => line.trim());
    const name = cvLines.find(line => line.toLowerCase().includes('name'))?.split(':')[1]?.trim() || 'Your Name';
    const email = cvLines.find(line => line.toLowerCase().includes('email'))?.split(':')[1]?.trim() || 'your.email@example.com';
    const phone = cvLines.find(line => line.toLowerCase().includes('phone'))?.split(':')[1]?.trim() || 'Your Phone';

    // Create a basic HTML CV using the actual input
    const mockHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${name} - Tailored CV</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            max-width: 800px;
            margin: 2rem auto;
            padding: 1rem 2rem;
            color: #222;
            background-color: #f9f9f9;
        }
        h1, h2, h3 {
            color: #0a3d62;
            margin-bottom: 0.3rem;
        }
        h1 {
            font-size: 2.2rem;
            margin-bottom: 0.5rem;
        }
        h2 {
            font-size: 1.4rem;
            border-bottom: 2px solid #0a3d62;
            padding-bottom: 0.3rem;
            margin-top: 2rem;
        }
        p, li {
            font-size: 1rem;
            line-height: 1.5;
            margin-bottom: 0.4rem;
        }
        ul {
            list-style-type: disc;
            margin-left: 1.5rem;
        }
        .contact-info {
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #555;
        }
        .section {
            margin-bottom: 1.5rem;
        }
        .job-description {
            background: #f0f8ff;
            padding: 1rem;
            border-left: 4px solid #0a3d62;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <h1>${name}</h1>
    <div class="contact-info">
        <p>Email: ${email} | Phone: ${phone}</p>
        <p>Tailored for the job requirements</p>
    </div>

    <div class="job-description">
        <h3>Job Description Summary:</h3>
        <p>${request.jobDescription.substring(0, 200)}${request.jobDescription.length > 200 ? '...' : ''}</p>
    </div>

    <h2>Professional Summary</h2>
    <p>
        This is a mock CV generated for demonstration purposes. In a real scenario with OpenAI API, this would contain your actual CV content intelligently tailored to match the job description you provided.
    </p>

    <h2>Your CV Content (First 500 characters):</h2>
    <div class="section">
        <p>${request.originalCV.substring(0, 500)}${request.originalCV.length > 500 ? '...' : ''}</p>
    </div>

    <h2>Key Skills (Would be extracted from your CV)</h2>
    <ul>
        <li>Relevant skills based on job requirements</li>
        <li>Experience matching the position</li>
        <li>Professional achievements</li>
    </ul>

    <h2>Work Experience (Would be prioritized by relevance)</h2>
    <div class="section">
        <h3>Your Experience</h3>
        <p>Your actual work experience would be displayed here, prioritized based on relevance to the job description.</p>
    </div>

    <h2>Education</h2>
    <p>Your educational background and relevant certifications.</p>

    <div class="job-description">
        <p><strong>Note:</strong> This is a mock version. With a valid OpenAI API key, the AI would analyze your CV and the job description to create a truly tailored HTML CV.</p>
    </div>
</body>
</html>`;

    return {
      cv: {
        personalInfo: {
          name: name,
          email: email,
          phone: phone,
          location: "Your Location",
          linkedin: "",
          website: ""
        },
        summary: "This is a mock CV generated for demonstration purposes. With OpenAI API, this would be intelligently tailored.",
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        htmlContent: mockHTML
      },
      analysis: {
        matchScore: 85,
        strengths: [
          "Professional HTML formatting",
          "Clean and modern design",
          "Well-structured content"
        ],
        improvements: [
          "Consider adding more specific achievements",
          "Include quantifiable results where possible"
        ],
        tailoredSummary: "Generated professional HTML resume with modern styling and clean structure."
      }
    };
  }

  // Utility to fill a template with data from JSON
  static fillTemplate(template: string, data: any): string {
    let result = template;
    // Simple replacements for top-level fields
    const flatFields = [
      'name', 'jobTitle', 'location', 'phone', 'email', 'linkedinUrl', 'githubUrl', 'summary'
    ];
    flatFields.forEach(key => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), data[key] || '');
    });

    // Experience (repeat block)
    if (Array.isArray(data.experience)) {
      const expTemplateMatch = result.match(/{{#experience}}([\s\S]*?){{\/experience}}/);
      if (expTemplateMatch) {
        const expBlock = expTemplateMatch[1];
        const expFilled = data.experience.map((exp: any) => {
          let block = expBlock;
          block = block.replace(/{{title}}/g, exp.title || '');
          block = block.replace(/{{company}}/g, exp.company || '');
          block = block.replace(/{{location}}/g, exp.location || '');
          block = block.replace(/{{startDate}}/g, exp.startDate || '');
          block = block.replace(/{{endDate}}/g, exp.endDate || '');
          if (Array.isArray(exp.description)) {
            block = block.replace(/{{#description}}([\s\S]*?){{\/description}}/, exp.description.map((d: string) => `<li>${d}</li>`).join(''));
          }
          return block;
        }).join('');
        result = result.replace(/{{#experience}}([\s\S]*?){{\/experience}}/, expFilled);
      }
    }

    // Projects (repeat block)
    if (Array.isArray(data.projects)) {
      const projTemplateMatch = result.match(/{{#projects}}([\s\S]*?){{\/projects}}/);
      if (projTemplateMatch) {
        const projBlock = projTemplateMatch[1];
        const projFilled = data.projects.map((proj: any) => {
          let block = projBlock;
          block = block.replace(/{{name}}/g, proj.name || '');
          block = block.replace(/{{url}}/g, proj.url || '');
          if (Array.isArray(proj.description)) {
            block = block.replace(/{{#description}}([\s\S]*?){{\/description}}/, proj.description.map((d: string) => `<li>${d}</li>`).join(''));
          }
          return block;
        }).join('');
        result = result.replace(/{{#projects}}([\s\S]*?){{\/projects}}/, projFilled);
      }
    }

    // Skills (simple list)
    if (Array.isArray(data.skills)) {
      result = result.replace(/{{#skills}}([\s\S]*?){{\/skills}}/, data.skills.map((s: string) => `<li>${s}</li>`).join(''));
    }

    // Education (repeat block)
    if (Array.isArray(data.education)) {
      const eduTemplateMatch = result.match(/{{#education}}([\s\S]*?){{\/education}}/);
      if (eduTemplateMatch) {
        const eduBlock = eduTemplateMatch[1];
        const eduFilled = data.education.map((edu: any) => {
          let block = eduBlock;
          block = block.replace(/{{degree}}/g, edu.degree || '');
          block = block.replace(/{{school}}/g, edu.school || '');
          block = block.replace(/{{years}}/g, edu.years || '');
          block = block.replace(/{{details}}/g, edu.details || '');
          return block;
        }).join('');
        result = result.replace(/{{#education}}([\s\S]*?){{\/education}}/, eduFilled);
      }
    }

    // Certifications (repeat block)
    if (Array.isArray(data.certifications)) {
      const certTemplateMatch = result.match(/{{#certifications}}([\s\S]*?){{\/certifications}}/);
      if (certTemplateMatch) {
        const certBlock = certTemplateMatch[1];
        const certFilled = data.certifications.map((cert: any) => {
          let block = certBlock;
          block = block.replace(/{{name}}/g, cert.name || '');
          block = block.replace(/{{issuer}}/g, cert.issuer || '');
          block = block.replace(/{{date}}/g, cert.date || '');
          return block;
        }).join('');
        result = result.replace(/{{#certifications}}([\s\S]*?){{\/certifications}}/, certFilled);
      }
    }

    // Languages (repeat block)
    if (Array.isArray(data.languages)) {
      const langTemplateMatch = result.match(/{{#languages}}([\s\S]*?){{\/languages}}/);
      if (langTemplateMatch) {
        const langBlock = langTemplateMatch[1];
        const langFilled = data.languages.map((lang: any) => {
          let block = langBlock;
          block = block.replace(/{{name}}/g, lang.name || '');
          block = block.replace(/{{level}}/g, lang.level || '');
          return block;
        }).join('');
        result = result.replace(/{{#languages}}([\s\S]*?){{\/languages}}/, langFilled);
      }
    }

    // Soft Skills (simple list)
    if (Array.isArray(data.softSkills)) {
      result = result.replace(/{{#softSkills}}([\s\S]*?){{\/softSkills}}/, data.softSkills.map((s: string) => `<li>${s}</li>`).join(''));
    }

    return result;
  }
} 