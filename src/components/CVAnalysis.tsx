import React from 'react';
import { CVGenerationResponse } from '@/types/cv';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, TrendingUp, Target } from 'lucide-react';

interface CVAnalysisProps {
  analysis: CVGenerationResponse['analysis'];
}

export const CVAnalysis: React.FC<CVAnalysisProps> = ({ analysis }) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Match Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Job Match Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Match Score</span>
              <div className="flex items-center gap-2">
                <Badge 
                  className={`${getMatchScoreBgColor(analysis.matchScore)} ${getMatchScoreColor(analysis.matchScore)}`}
                >
                  {analysis.matchScore}%
                </Badge>
              </div>
            </div>
            <Progress value={analysis.matchScore} className="h-2" />
            <p className="text-sm text-gray-600">
              {analysis.matchScore >= 80 
                ? "Excellent match! Your qualifications align very well with the job requirements."
                : analysis.matchScore >= 60
                ? "Good match. There are some areas where you can improve your alignment."
                : "Moderate match. Consider highlighting more relevant skills and experiences."
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Key Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{strength}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{improvement}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tailored Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Tailored Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">
            {analysis.tailoredSummary}
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-gray-700">
              <p className="mb-2">To improve your application:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Highlight specific achievements with measurable results</li>
                <li>Emphasize skills that directly match the job requirements</li>
                <li>Include relevant certifications or training</li>
                <li>Use action verbs and quantify your impact</li>
                <li>Customize your summary for each application</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 