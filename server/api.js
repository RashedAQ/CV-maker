import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for n8n
app.use(cors());
app.use(express.json());

// CV Generation endpoint for n8n
app.post('/api/generate-cv', async (req, res) => {
  try {
    const { jobDescription, cvText } = req.body;

    // Validate required fields
    if (!jobDescription || !cvText) {
      return res.status(400).json({
        error: 'Missing required fields: jobDescription and cvText are required'
      });
    }

    // For now, we'll return a mock response
    // In production, you would integrate with your CV generation service
    const mockResponse = {
      success: true,
      data: {
        cvText: `TAILORED CV FOR JOB APPLICATION

${cvText.split('\n').slice(0, 10).join('\n')}

TAILORED SUMMARY:
This CV has been customized to match the job requirements: ${jobDescription.substring(0, 100)}...

KEY SKILLS (RELEVANT TO POSITION):
• Skill 1
• Skill 2
• Skill 3

EXPERIENCE (PRIORITIZED BY RELEVANCE):
• Experience relevant to the job description
• Additional relevant experience

EDUCATION:
• Relevant educational background

This CV has been tailored to emphasize skills and experience that match the job requirements.`,
        htmlContent: `<html><body><h1>Tailored CV</h1><p>Generated for: ${jobDescription.substring(0, 50)}...</p></body></html>`,
        analysis: {
          matchScore: 85,
          strengths: ["Relevant experience highlighted", "Skills aligned with job requirements"],
          improvements: ["Add more specific achievements", "Include quantifiable results"]
        },
        timestamp: new Date().toISOString()
      },
      message: 'CV generated successfully'
    };

    res.json(mockResponse);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Unknown error occurred'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/generate-cv`);
});
