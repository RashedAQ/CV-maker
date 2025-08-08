# Deployment Instructions for n8n Integration

## Step 1: Deploy to Vercel

1. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Add n8n API integration"
   git push origin main
   ```

2. **Vercel will automatically deploy** your changes to `https://cv-maker-lemon-beta.vercel.app`

## Step 2: Set Environment Variables (Optional)

If you want to enable AI-powered CV generation, set these in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add:
   - `VITE_GEMINI_API_KEY` = Your Google Gemini API key
   - Or `GEMINI_API_KEY` = Your Google Gemini API key

## Step 3: Test the API

1. **Visit the API test page:**
   ```
   https://cv-maker-lemon-beta.vercel.app/api-test
   ```

2. **Test with sample data:**
   - Job Description: "We are looking for a Senior Software Engineer..."
   - CV Text: "John Doe, Software Engineer..."

## Step 4: Update Your n8n Workflow

1. **Update the "Generate Tailored CV" HTTP Request node:**
   - URL: `https://cv-maker-lemon-beta.vercel.app/api/generate-cv`
   - Method: `POST`
   - Headers: `Content-Type: application/json`
   - Body: 
     ```json
     {
       "jobDescription": "{{$json.jobDescription}}",
       "cvText": "{{$json.cvText}}"
     }
     ```

2. **Update the "Combine Email & CV" Code node:**
   ```javascript
   const emailData = $('Generate Email Content').first().json;
   const cvData = $('Generate Tailored CV').first().json;
   const inputData = $('Process Input Data').first().json;

   return [{
     json: {
       subject: emailData.subject,
       body: emailData.body,
       hrEmail: inputData.hrEmail,
       cvAttachment: cvData.data.cvText,
       companyName: inputData.companyName,
       analysis: cvData.data.analysis
     }
   }];
   ```

## Step 5: Test Your n8n Workflow

1. Send a test message to your Telegram bot with:
   - Job description in the message text
   - CV as a PDF attachment

2. Check that the workflow processes correctly and generates a tailored CV

## Troubleshooting

- **API not responding:** Check the API test page first
- **CORS errors:** The API includes proper CORS headers
- **Missing data:** Ensure both jobDescription and cvText are provided
- **Gemini errors:** Check your API key in Vercel environment variables

## API Endpoint Details

- **URL:** `https://cv-maker-lemon-beta.vercel.app/api/generate-cv`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **CORS:** Enabled for all origins
- **Response:** JSON with tailored CV data
