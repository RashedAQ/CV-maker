import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar, Building, Download, FileText, Eye } from 'lucide-react';
import { CV } from '@/types/cv';
import { PDFExportService } from '@/services/pdfExport';
import { useToast } from '@/hooks/use-toast';

interface CVRendererProps {
  cv: CV;
  className?: string;
  onExport?: () => void;
}

export const CVRenderer: React.FC<CVRendererProps> = ({ cv, className = '', onExport }) => {
  const { toast } = useToast();
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getSkillCategoryColor = (category: string) => {
    switch (category) {
      case 'core':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'relevant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'technical':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'soft':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-green-500';
      case 'advanced':
        return 'bg-blue-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'beginner':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const exportToPDF = async () => {
    try {
      await PDFExportService.exportToPDF('cv-renderer', 'modern-cv.pdf');
      toast({
        title: "PDF exported successfully",
        description: "Your CV has been downloaded as PDF",
      });
    } catch (error) {
      console.log('Main PDF export failed, trying simple method:', error);
      
      try {
        // Fallback to simple export method
        await PDFExportService.exportToPDFSimple('cv-renderer', 'modern-cv.pdf');
        toast({
          title: "PDF exported successfully",
          description: "Your CV has been downloaded as PDF (using print method)",
        });
      } catch (fallbackError) {
        console.error('Both PDF export methods failed:', fallbackError);
        toast({
          title: "Export failed",
          description: "Both export methods failed. Please try again or use the print function.",
          variant: "destructive",
        });
      }
    }
  };

  const printCV = async () => {
    try {
      await PDFExportService.printCV('cv-renderer');
      toast({
        title: "Print dialog opened",
        description: "Print dialog has been opened for your CV",
      });
    } catch (error) {
      toast({
        title: "Print failed",
        description: error instanceof Error ? error.message : "Failed to open print dialog",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`max-w-4xl mx-auto bg-gray-50 min-h-screen ${className}`}>
      {/* Header Actions */}
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Modern CV Preview</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={printCV}>
            <Eye className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="secondary" size="sm" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          {onExport && (
            <Button variant="secondary" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      <Card className="m-0 rounded-t-none p-8 bg-white shadow-lg" id="cv-renderer">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            {cv.personalInfo.name}
          </h1>
          <div className="text-gray-600 text-sm space-y-1">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{cv.personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{cv.personalInfo.phone}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{cv.personalInfo.location}</span>
              </div>
              {cv.personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span>{cv.personalInfo.linkedin}</span>
                </div>
              )}
              {cv.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{cv.personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-900 pb-2 mb-3">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{cv.summary}</p>
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-900 pb-2 mb-3">
            Technical Skills
          </h2>
          <div className="space-y-3">
            {Object.entries(cv.skills.reduce((acc, skill) => {
              const category = skill.category || 'additional';
              if (!acc[category]) acc[category] = [];
              acc[category].push(skill);
              return acc;
            }, {} as Record<string, typeof cv.skills>)).map(([category, skills]) => (
              <div key={category} className="mb-4">
                <h3 className="font-medium text-gray-800 mb-2 capitalize">
                  {category === 'core' ? 'Core Skills' : 
                   category === 'relevant' ? 'Relevant Skills' :
                   category === 'technical' ? 'Technical Skills' :
                   category === 'soft' ? 'Soft Skills' :
                   category === 'language' ? 'Languages' :
                   category === 'tool' ? 'Tools' : 'Additional Skills'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`${getSkillCategoryColor(skill.category)} flex items-center gap-1`}
                    >
                      <span>{skill.name}</span>
                      <div className={`w-2 h-2 rounded-full ${getSkillLevelColor(skill.level)}`} />
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-900 pb-2 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {cv.experience.map((exp, index) => (
              <div key={exp.id || index} className="border-l-4 border-blue-200 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                  <Building className="w-4 h-4" />
                  <span>{exp.company}</span>
                  {exp.location && (
                    <>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{exp.description}</p>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {exp.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        {cv.education && cv.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-900 pb-2 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {cv.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </div>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                  )}
                  {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Relevant Courses: {edu.relevantCourses.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {cv.certifications && cv.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-900 pb-2 mb-3">
              Certifications
            </h2>
            <div className="space-y-2">
              {cv.certifications.map((cert, index) => (
                <div key={cert.id || index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(cert.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {cv.languages && cv.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-900 border-b-2 border-blue-900 pb-2 mb-3">
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {cv.languages.map((lang, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800">
                  {lang.name} ({lang.level})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}; 