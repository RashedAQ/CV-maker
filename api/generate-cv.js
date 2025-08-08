// Simple API endpoint for CV generation
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { jobDescription, cvText } = req.body;

    // Validate required fields
    if (!jobDescription || !cvText) {
      return res.status(400).json({
        error: 'Missing required fields: jobDescription and cvText are required'
      });
    }

    // For now, return a simple mock response to test the endpoint
    const response = {
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
      message: 'CV generated successfully (test mode)'
    };

    res.json(response);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Unknown error occurred'
    });
  }
}
