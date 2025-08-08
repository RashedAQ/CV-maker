# n8n Integration Guide for CV Maker

This guide explains how to connect your CV maker application to your n8n workflow.

## Overview

Your CV maker application now includes an API endpoint that can be called from n8n to generate tailored CVs based on job descriptions and original CV text.

## API Endpoint

**URL:** `https://cv-maker-lemon-beta.vercel.app/api/generate-cv`

**Method:** `POST`

**Content-Type:** `application/json`

## Request Format

```json
{
  "jobDescription": "Your job description here",
  "cvText": "Your CV text here"
}
```

## Response Format

```json
{
  "success": true,
  "data": {
    "cvText": "Generated tailored CV text",
    "htmlContent": "HTML version of CV",
    "analysis": {
      "matchScore": 85,
      "strengths": ["Relevant experience highlighted", "Skills aligned with job requirements"],
      "improvements": ["Add more specific achievements", "Include quantifiable results"]
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "message": "CV generated successfully"
}
```

## n8n Configuration

### 1. Update Your HTTP Request Node

In your n8n workflow, update the "Generate Tailored CV" node with these settings:

**Method:** `POST`
**URL:** `https://cv-maker-lemon-beta.vercel.app/api/generate-cv`
**Headers:**
- `Content-Type`: `application/json`

**Body (JSON):**
```json
{
  "jobDescription": "{{$json.jobDescription}}",
  "cvText": "{{$json.cvText}}"
}
```

### 2. Update Your Code Node

Update the "Combine Email & CV" node to handle the new response format:

```javascript
// Combine email and CV data
const emailData = $('Generate Email Content').first().json;
const cvData = $('Generate Tailored CV').first().json;
const inputData = $('Process Input Data').first().json;

return [{
  json: {
    subject: emailData.subject,
    body: emailData.body,
    hrEmail: inputData.hrEmail,
    cvAttachment: cvData.data.cvText, // Use the generated CV text
    companyName: inputData.companyName,
    analysis: cvData.data.analysis // Include analysis data
  }
}];
```

## Testing the Integration

### 1. Use the API Test Page

Visit `https://cv-maker-lemon-beta.vercel.app/api-test` to test the API endpoint directly.

### 2. Test with Sample Data

Use this sample data to test:

**Job Description:**
```
We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. The ideal candidate should have experience with cloud platforms like AWS and be familiar with CI/CD pipelines.
```

**CV Text:**
```
John Doe
Software Engineer
john.doe@email.com
+1-555-0123

EXPERIENCE:
Software Engineer at TechCorp (2020-2023)
- Developed React applications using TypeScript
- Implemented CI/CD pipelines with GitHub Actions
- Worked with AWS services including EC2 and S3

EDUCATION:
Bachelor of Science in Computer Science
University of Technology (2016-2020)

SKILLS:
React, TypeScript, Node.js, AWS, Git, Docker
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Missing required fields
- `405`: Method not allowed
- `500`: Internal server error

## Environment Variables

To enable AI-powered CV generation, set these environment variables in your Vercel deployment:

- `VITE_OPENAI_API_KEY` or `OPENAI_API_KEY`: Your OpenAI API key

If no API key is provided, the system will fall back to a mock response.

## Deployment

1. Push your changes to your repository
2. Vercel will automatically deploy the new API endpoint
3. The API will be available at `https://cv-maker-lemon-beta.vercel.app/api/generate-cv`

## Troubleshooting

### Common Issues

1. **CORS Errors**: The API includes CORS headers for cross-origin requests
2. **Missing Fields**: Ensure both `jobDescription` and `cvText` are provided
3. **API Key Issues**: Check that your OpenAI API key is properly set in Vercel environment variables

### Testing Locally

To test locally, run:
```bash
npm run dev:server
```

This will start both the frontend and the API server locally.

## Security Considerations

- The API endpoint is publicly accessible
- Consider implementing rate limiting for production use
- The OpenAI API key should be kept secure in environment variables

## Support

If you encounter issues:

1. Check the API test page for basic functionality
2. Verify your n8n workflow configuration
3. Check the Vercel deployment logs for any errors
4. Ensure all required environment variables are set
