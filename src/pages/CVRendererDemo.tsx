import React from 'react';
import { CVRenderer } from '@/components/CVRenderer';
import { CV } from '@/types/cv';

const sampleCV: CV = {
  personalInfo: {
    name: "Mohamed Afify Abdelrahim Mohamed",
    email: "mahmdafifi9942@gmail.com",
    phone: "+965 9907 4844",
    location: "Kuwait (Open for Relocation)",
    linkedin: "linkedin.com/in/mohamedafify",
    website: "mohamedafify.dev"
  },
  summary: "Skilled software developer with foundational experience in Python, SQL, Git, and web technologies including HTML, CSS, and JavaScript. Strong understanding of software engineering principles with academic projects involving machine learning and automation. Eager to apply technical and communication skills to develop scalable solutions.",
  experience: [
    {
      id: "1",
      company: "Eduldea",
      position: "Online English Tutor",
      location: "Remote",
      startDate: "2023-01",
      endDate: "2024-12",
      current: false,
      description: "Delivered customized English lessons to non-native speakers.",
      achievements: [
        "Delivered customized English lessons to non-native speakers.",
        "Developed adaptable communication skills and managed scheduling tools."
      ],
      technologies: ["Teaching Platforms", "Communication Tools"]
    },
    {
      id: "2",
      company: "2bspecial Co.",
      position: "Shopify Developer (Freelance)",
      location: "Remote",
      startDate: "2022-01",
      endDate: "2023-12",
      current: false,
      description: "Maintained Shopify storefronts with HTML, CSS customization.",
      achievements: [
        "Maintained Shopify storefronts with HTML, CSS customization.",
        "Optimized product pages and implemented theme adjustments."
      ],
      technologies: ["HTML", "CSS", "Shopify", "JavaScript"]
    },
    {
      id: "3",
      company: "ALDAWEYA Pharmaceutical CO.",
      position: "Graphic Designer",
      location: "Kuwait",
      startDate: "2021-01",
      endDate: "2022-12",
      current: false,
      description: "Created visual content for marketing and collaborated with sales teams.",
      achievements: [
        "Created visual content for marketing and collaborated with sales teams.",
        "Worked under deadlines to maintain consistent branding."
      ],
      technologies: ["Adobe Creative Suite", "Design Tools"]
    },
    {
      id: "4",
      company: "Aldyar Company",
      position: "IT/Network Intern",
      location: "Kuwait",
      startDate: "2025-01",
      endDate: "2025-06",
      current: false,
      description: "Handled ticketing system and troubleshooting customer computers.",
      achievements: [
        "Handled ticketing system and troubleshooting customer computers."
      ],
      technologies: ["IT Support", "Network Troubleshooting"]
    }
  ],
  education: [
    {
      id: "1",
      institution: "Karabuk University",
      degree: "Bachelor of Engineering",
      field: "Computer Science",
      startDate: "2018-09",
      endDate: "2022-05",
      current: false,
      gpa: "3.17/4",
      relevantCourses: ["Data Structures", "Algorithms", "Software Engineering", "Database Systems"]
    }
  ],
  skills: [
    { name: "Python", level: "intermediate", category: "core" },
    { name: "SQL", level: "intermediate", category: "core" },
    { name: "Git", level: "intermediate", category: "core" },
    { name: "JavaScript", level: "beginner", category: "relevant" },
    { name: "HTML5", level: "intermediate", category: "relevant" },
    { name: "CSS3", level: "intermediate", category: "relevant" },
    { name: "Java", level: "beginner", category: "additional" },
    { name: "C", level: "beginner", category: "additional" },
    { name: "Keras", level: "beginner", category: "technical" },
    { name: "NumPy", level: "beginner", category: "technical" },
    { name: "Pandas", level: "beginner", category: "technical" },
    { name: "REST APIs", level: "beginner", category: "technical" },
    { name: "Shopify Development", level: "intermediate", category: "technical" },
    { name: "Problem Solving", level: "advanced", category: "soft" },
    { name: "Communication", level: "advanced", category: "soft" },
    { name: "Time Management", level: "intermediate", category: "soft" },
    { name: "Arabic", level: "native", category: "language" },
    { name: "English", level: "fluent", category: "language" },
    { name: "Turkish", level: "conversational", category: "language" }
  ],
  certifications: [
    {
      name: "Machine Learning with Python",
      issuer: "IBM",
      date: "2023-06",
      credentialId: "IBM-ML-001"
    },
    {
      name: "Introduction to Deep Learning & Neural Networks with Keras",
      issuer: "IBM",
      date: "2023-08",
      credentialId: "IBM-DL-001"
    },
    {
      name: "Database Programming with SQL",
      issuer: "Oracle",
      date: "2023-04",
      credentialId: "ORACLE-SQL-001"
    },
    {
      name: "Database Design",
      issuer: "Oracle",
      date: "2023-03",
      credentialId: "ORACLE-DB-001"
    }
  ],
  languages: [
    { name: "Arabic", level: "native" },
    { name: "English", level: "fluent" },
    { name: "Turkish", level: "conversational" }
  ]
};

export const CVRendererDemo: React.FC = () => {
  const handleExport = () => {
    // Demo export function
    console.log('Export clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Renderer Demo</h1>
          <p className="text-gray-600">Clean, professional CV design matching your HTML template</p>
        </div>
        
        <CVRenderer cv={sampleCV} onExport={handleExport} />
      </div>
    </div>
  );
}; 