import React from 'react';
import { CV } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Mail, Phone, Globe, Linkedin, Download, Edit } from 'lucide-react';

interface CVPreviewProps {
  cv: CV;
  onEdit?: () => void;
  onExport?: () => void;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cv, onEdit, onExport }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'beginner': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-green-100 text-green-800';
      case 'relevant': return 'bg-blue-100 text-blue-800';
      case 'additional': return 'bg-gray-100 text-gray-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'soft': return 'bg-orange-100 text-orange-800';
      case 'language': return 'bg-pink-100 text-pink-800';
      case 'tool': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header Actions */}
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CV Preview</h1>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {onExport && (
            <Button variant="secondary" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          )}
        </div>
      </div>

      {/* CV Content */}
      <div className="p-8 space-y-6" id="cv-preview">
        {/* Personal Information */}
        <div className="text-center border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{cv.personalInfo.name}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {cv.personalInfo.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {cv.personalInfo.phone}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {cv.personalInfo.location}
            </div>
          </div>
          <div className="flex justify-center gap-4 text-sm">
            {cv.personalInfo.linkedin && (
              <div className="flex items-center gap-1 text-blue-600">
                <Linkedin className="h-4 w-4" />
                {cv.personalInfo.linkedin}
              </div>
            )}
            {cv.personalInfo.website && (
              <div className="flex items-center gap-1 text-blue-600">
                <Globe className="h-4 w-4" />
                {cv.personalInfo.website}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{cv.summary}</p>
        </div>

        <Separator />

        {/* Experience */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Experience</h2>
          <div className="space-y-6">
            {cv.experience.map((exp, index) => (
              <div 
                key={exp.id} 
                className={`border-l-4 pl-4 ${
                  exp.relevanceScore && exp.relevanceScore >= 8 
                    ? 'border-green-500 bg-green-50/30' 
                    : exp.relevanceScore && exp.relevanceScore >= 5 
                    ? 'border-blue-500 bg-blue-50/30' 
                    : 'border-gray-300 bg-gray-50/30'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{exp.description}</p>
                
                {exp.achievements.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-2">Key Achievements:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Education */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
          <div className="space-y-4">
            {cv.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                  <p className="text-primary font-medium">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Relevant Courses: {edu.relevantCourses.join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate || '')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Skills */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="space-y-4">
            {/* Core Skills (Most Relevant) */}
            {(() => {
              const coreSkills = cv.skills.filter(skill => skill.category === 'core');
              if (coreSkills.length > 0) {
                return (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Core Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {coreSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge className={getSkillCategoryColor(skill.category)}>
                            {skill.name}
                          </Badge>
                          <Badge variant="outline" className={getSkillLevelColor(skill.level)}>
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Relevant Skills */}
            {(() => {
              const relevantSkills = cv.skills.filter(skill => skill.category === 'relevant');
              if (relevantSkills.length > 0) {
                return (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Relevant Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {relevantSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge className={getSkillCategoryColor(skill.category)}>
                            {skill.name}
                          </Badge>
                          <Badge variant="outline" className={getSkillLevelColor(skill.level)}>
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Additional Skills (Less Relevant) */}
            {(() => {
              const additionalSkills = cv.skills.filter(skill => skill.category === 'additional');
              if (additionalSkills.length > 0) {
                return (
                  <div>
                    <h3 className="font-medium text-gray-600 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      Additional Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 opacity-75">
                      {additionalSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge className={getSkillCategoryColor(skill.category)}>
                            {skill.name}
                          </Badge>
                          <Badge variant="outline" className={getSkillLevelColor(skill.level)}>
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Legacy Categories */}
            {['technical', 'soft', 'language', 'tool'].map((category) => {
              const categorySkills = cv.skills.filter(skill => 
                skill.category === category && 
                !['core', 'relevant', 'additional'].includes(skill.category)
              );
              if (categorySkills.length === 0) return null;
              
              return (
                <div key={category}>
                  <h3 className="font-medium text-gray-900 mb-2 capitalize">{category} Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge className={getSkillCategoryColor(skill.category)}>
                          {skill.name}
                        </Badge>
                        <Badge variant="outline" className={getSkillLevelColor(skill.level)}>
                          {skill.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        {cv.certifications && cv.certifications.length > 0 && (
          <>
            <Separator />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
              <div className="space-y-3">
                {cv.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      {cert.credentialId && (
                        <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>Issued: {formatDate(cert.date)}</div>
                      {cert.expiryDate && (
                        <div>Expires: {formatDate(cert.expiryDate)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Languages */}
        {cv.languages && cv.languages.length > 0 && (
          <>
            <Separator />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Languages</h2>
              <div className="flex flex-wrap gap-3">
                {cv.languages.map((lang, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline">{lang.name}</Badge>
                    <Badge variant="secondary" className="text-xs">
                      {lang.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 