export default async function handler(req, res) {
  // Enable CORS for n8n
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

    // Check if OpenAI API key is available
    const hasOpenAIKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    let response;
    if (hasOpenAIKey) {
      // Use OpenAI to generate tailored CV
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hasOpenAIKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume generator. Analyze the job description and CV, then generate a tailored version that emphasizes relevant skills and experience. Return a structured text format.'
            },
            {
              role: 'user',
              content: `Job Description: ${jobDescription}\n\nOriginal CV: ${cvText}\n\nGenerate a tailored CV that matches the job requirements.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!openaiResponse.ok) {
        throw new Error(`OpenAI API request failed: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      const tailoredContent = openaiData.choices[0]?.message?.content || '';

      response = {
        success: true,
        data: {
          cvText: tailoredContent,
          htmlContent: `<html><body><h1>Tailored CV</h1><p>${tailoredContent.replace(/\n/g, '<br>')}</p></body></html>`,
          analysis: {
            matchScore: 90,
            strengths: ["AI-generated tailored content", "Relevant skills highlighted"],
            improvements: ["Review for accuracy", "Add specific achievements"]
          },
          timestamp: new Date().toISOString()
        },
        message: 'CV generated successfully using AI'
      };
    } else {
      // Fallback to mock response
      response = {
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
        message: 'CV generated successfully (mock mode - no OpenAI key)'
      };
    }

    res.json(response);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Unknown error occurred'
    });
  }
}
