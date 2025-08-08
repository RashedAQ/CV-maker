import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const ApiTest: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [cvText, setCvText] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testApi = async () => {
    if (!jobDescription || !cvText) {
      toast({
        title: "Error",
        description: "Please fill in both job description and CV text",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:3001/api/generate-cv'
        : 'https://cv-maker-lemon-beta.vercel.app/api/generate-cv';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          cvText,
        }),
      });

      const data = await response.json();
      setResponse(data);

      if (response.ok) {
        toast({
          title: "Success",
          description: "API call successful!",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "API call failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('API Test Error:', error);
      toast({
        title: "Error",
        description: "Failed to call API",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Test for n8n Integration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Description</label>
              <Textarea
                placeholder="Enter job description..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">CV Text</label>
              <Textarea
                placeholder="Enter CV text..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={8}
              />
            </div>
            
            <Button 
              onClick={testApi} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing API...' : 'Test API Endpoint'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            {response ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Generated CV Text:</h3>
                  <pre className="text-sm whitespace-pre-wrap">{response.data?.cvText}</pre>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Analysis:</h3>
                  <p>Match Score: {response.data?.analysis?.matchScore}%</p>
                  <p>Strengths: {response.data?.analysis?.strengths?.join(', ')}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Raw Response:</h3>
                  <pre className="text-xs overflow-auto">{JSON.stringify(response, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No response yet. Test the API to see results.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>n8n Integration Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">API Endpoint:</h3>
              <code className="bg-gray-100 px-2 py-1 rounded">
                https://cv-maker-lemon-beta.vercel.app/api/generate-cv
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold">Method:</h3>
              <code className="bg-gray-100 px-2 py-1 rounded">POST</code>
            </div>
            
            <div>
              <h3 className="font-semibold">Request Body:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
{`{
  "jobDescription": "Your job description here",
  "cvText": "Your CV text here"
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold">Response Format:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
{`{
  "success": true,
  "data": {
    "cvText": "Generated tailored CV text",
    "htmlContent": "HTML version of CV",
    "analysis": {
      "matchScore": 85,
      "strengths": ["..."],
      "improvements": ["..."]
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "message": "CV generated successfully"
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
