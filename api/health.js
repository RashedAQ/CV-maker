export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Return health status
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'CV Maker API is running',
    endpoints: {
      health: '/api/health',
      generateCV: '/api/generate-cv'
    }
  });
}
