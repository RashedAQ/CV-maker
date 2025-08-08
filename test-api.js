// Simple test script for the API endpoints
const testAPI = async () => {
  console.log('Testing CV Maker API...\n');

  // Test health endpoint
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('https://cv-maker-lemon-beta.vercel.app/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health endpoint:', healthData);
  } catch (error) {
    console.log('❌ Health endpoint failed:', error.message);
  }

  // Test CV generation endpoint
  try {
    console.log('\n2. Testing CV generation endpoint...');
    const testData = {
      jobDescription: "We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js.",
      cvText: "John Doe\nSoftware Engineer\njohn.doe@email.com\n+1-555-0123\n\nEXPERIENCE:\nSoftware Engineer at TechCorp (2020-2023)\n- Developed React applications using TypeScript\n- Implemented CI/CD pipelines with GitHub Actions\n- Worked with AWS services including EC2 and S3"
    };

    const cvResponse = await fetch('https://cv-maker-lemon-beta.vercel.app/api/generate-cv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const cvData = await cvResponse.json();
    console.log('✅ CV generation endpoint:', {
      success: cvData.success,
      message: cvData.message,
      hasData: !!cvData.data,
      cvTextLength: cvData.data?.cvText?.length || 0
    });
  } catch (error) {
    console.log('❌ CV generation endpoint failed:', error.message);
  }

  console.log('\nTest completed!');
};

// Run the test
testAPI();
