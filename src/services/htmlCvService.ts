import { CVGenerationRequest, CVGenerationResponse } from '@/types/cv';

export class HTMLCVService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private static readonly MODEL = 'gpt-4o';
  private static readonly MAX_TOKENS = 4000;
  private static readonly TEMPERATURE = 0.3;

  static async generateHTMLCV(request: CVGenerationRequest): Promise<CVGenerationResponse> {
    try {
      const prompt = this.buildHTMLPrompt(request.originalCV, request.jobDescription);
      
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
              content: 'You are a professional CV-to-HTML converter. Your task is to read raw CV content, extract relevant sections, and generate a well-structured, professional HTML5 resume with inline CSS styles.'
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

      // Extract HTML content from the response
      const htmlContent = this.extractHTMLContent(content);
      
      // Convert HTML to structured CV data for compatibility
      const cvData = this.parseHTMLToCV(htmlContent);
      
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
      console.error('HTML CV Service Error:', error);
      throw new Error(`Failed to generate HTML CV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static buildHTMLPrompt(originalCV: string, jobDescription: string): string {
    return `
You are a professional CV-to-HTML converter.

Your task is to:
1. Read the user's raw CV or resume content (even if it's in a loose, unstructured format).
2. Extract relevant sections: name, contact info, education, skills, certifications, languages, work experience, and personal projects.
3. Reorganize and rewrite the content into a well-structured, clean HTML5 layout that looks professional and modern, using good headings, clean spacing, and sections.
4. Add light and readable inline CSS styles for visual polish.
5. Ensure it is tailored for a junior developer role, without exaggerating or lying. Highlight real skills and ongoing projects clearly.
6. Use semantic HTML: <section>, <h1>, <ul>, etc.

Format the output as a **full standalone HTML document**.

--- EXAMPLE INPUT FORMAT ---

Raw CV:
"Name: Mohamed Afify  
Email: mahmdafifi9942@gmail.com  
Phone: +965 9907 4844  
...  
Project: Job Scraper App using React/TS, FastAPI, Playwright, Chromium"  
[User continues with experience, skills, etc.]

--- END INPUT ---

Now output a beautiful HTML resume that represents the above content professionally.

JOB DESCRIPTION:
${jobDescription}

ORIGINAL CV:
${originalCV}

Generate a complete HTML document with:
- Modern, clean design
- Professional typography
- Responsive layout
- Inline CSS for styling
- Semantic HTML structure
- Focus on developer skills and projects
- Clear sections for experience, skills, education, etc.

Return only the complete HTML document, no additional text or explanations.
`;
  }

  private static extractHTMLContent(content: string): string {
    // Look for HTML content in the response
    const htmlMatch = content.match(/<!DOCTYPE html>[\s\S]*<\/html>/i) || 
                     content.match(/<html[\s\S]*<\/html>/i) ||
                     content.match(/<body[\s\S]*<\/body>/i);
    
    if (htmlMatch) {
      return htmlMatch[0];
    }
    
    // If no HTML tags found, wrap the content in basic HTML structure
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Resume</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .section { margin-bottom: 25px; }
        .contact-info { text-align: center; margin-bottom: 30px; }
        .experience-item { margin-bottom: 20px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-tag { background: #3498db; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="contact-info">
        <h1>Professional Resume</h1>
        <p>Generated from your input</p>
    </div>
    <div class="section">
        <h2>Summary</h2>
        <p>${content}</p>
    </div>
</body>
</html>`;
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
  static async generateMockHTMLCV(request: CVGenerationRequest): Promise<CVGenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Resume</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f8f9fa;
        }
        .resume-container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #2c3e50; 
            border-bottom: 3px solid #3498db; 
            padding-bottom: 10px; 
            text-align: center;
            margin-bottom: 30px;
        }
        h2 { 
            color: #34495e; 
            margin-top: 30px; 
            border-left: 4px solid #3498db;
            padding-left: 15px;
        }
        .section { margin-bottom: 25px; }
        .contact-info { 
            text-align: center; 
            margin-bottom: 30px; 
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
        }
        .contact-item {
            display: inline-block;
            margin: 0 15px;
            color: #666;
        }
        .experience-item { 
            margin-bottom: 25px; 
            padding: 15px;
            border-left: 3px solid #e9ecef;
            background: #f8f9fa;
            border-radius: 0 5px 5px 0;
        }
        .experience-title {
            font-weight: bold;
            color: #2c3e50;
            font-size: 1.1em;
        }
        .experience-company {
            color: #3498db;
            font-weight: 500;
        }
        .experience-date {
            color: #666;
            font-size: 0.9em;
        }
        .skills { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 10px; 
        }
        .skill-tag { 
            background: #3498db; 
            color: white; 
            padding: 8px 15px; 
            border-radius: 20px; 
            font-size: 0.9em;
            font-weight: 500;
        }
        .summary {
            background: #e8f4fd;
            padding: 20px;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="contact-info">
            <h1>John Doe</h1>
            <div class="contact-item">📧 john.doe@email.com</div>
            <div class="contact-item">📱 +1 (555) 123-4567</div>
            <div class="contact-item">📍 San Francisco, CA</div>
            <div class="contact-item">🔗 linkedin.com/in/johndoe</div>
        </div>

        <div class="section">
            <h2>Professional Summary</h2>
            <div class="summary">
                Experienced software developer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading development teams. Passionate about clean code, user experience, and continuous learning.
            </div>
        </div>

        <div class="section">
            <h2>Professional Experience</h2>
            
            <div class="experience-item">
                <div class="experience-title">Senior Software Engineer</div>
                <div class="experience-company">Tech Corp</div>
                <div class="experience-date">January 2022 - Present</div>
                <div style="margin-top: 10px;">
                    Lead full-stack development team of 6 engineers, delivering high-impact features for SaaS platform serving 100K+ users.
                </div>
                <ul>
                    <li>Reduced API response time by 40% through optimization and caching strategies</li>
                    <li>Implemented CI/CD pipeline reducing deployment time by 60%</li>
                    <li>Mentored 3 junior developers and conducted regular code reviews</li>
                </ul>
                <div class="skills">
                    <span class="skill-tag">React</span>
                    <span class="skill-tag">Node.js</span>
                    <span class="skill-tag">TypeScript</span>
                    <span class="skill-tag">AWS</span>
                    <span class="skill-tag">Docker</span>
                </div>
            </div>

            <div class="experience-item">
                <div class="experience-title">Full Stack Developer</div>
                <div class="experience-company">Startup Inc</div>
                <div class="experience-date">March 2020 - December 2021</div>
                <div style="margin-top: 10px;">
                    Developed and maintained web applications using modern JavaScript frameworks and cloud services.
                </div>
                <ul>
                    <li>Built responsive web application serving 50K+ monthly users</li>
                    <li>Integrated third-party APIs and payment systems</li>
                    <li>Optimized database queries improving performance by 30%</li>
                </ul>
                <div class="skills">
                    <span class="skill-tag">JavaScript</span>
                    <span class="skill-tag">React</span>
                    <span class="skill-tag">Express.js</span>
                    <span class="skill-tag">MongoDB</span>
                    <span class="skill-tag">Heroku</span>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Education</h2>
            <div class="experience-item">
                <div class="experience-title">Bachelor of Science in Computer Science</div>
                <div class="experience-company">University of Technology</div>
                <div class="experience-date">September 2016 - May 2020</div>
                <div style="margin-top: 10px;">
                    GPA: 3.8/4.0<br>
                    Relevant Courses: Data Structures, Algorithms, Software Engineering, Database Systems
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Skills</h2>
            <div class="skills">
                <span class="skill-tag">React (Expert)</span>
                <span class="skill-tag">Node.js (Advanced)</span>
                <span class="skill-tag">TypeScript (Advanced)</span>
                <span class="skill-tag">AWS (Intermediate)</span>
                <span class="skill-tag">Leadership (Advanced)</span>
                <span class="skill-tag">Problem Solving (Expert)</span>
                <span class="skill-tag">Git (Advanced)</span>
                <span class="skill-tag">Docker (Intermediate)</span>
            </div>
        </div>

        <div class="section">
            <h2>Certifications</h2>
            <div class="experience-item">
                <div class="experience-title">AWS Certified Developer</div>
                <div class="experience-company">Amazon Web Services</div>
                <div class="experience-date">June 2023 - June 2026</div>
                <div style="margin-top: 10px;">
                    Credential ID: AWS-DEV-123456
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Languages</h2>
            <div class="skills">
                <span class="skill-tag">English (Native)</span>
                <span class="skill-tag">Spanish (Conversational)</span>
            </div>
        </div>
    </div>
</body>
</html>`;

    return {
      cv: {
        personalInfo: {
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          linkedin: "linkedin.com/in/johndoe",
          website: ""
        },
        summary: "Experienced software developer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.",
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
} 