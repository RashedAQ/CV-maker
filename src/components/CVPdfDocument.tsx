import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    fontSize: 11,
    color: '#222',
    padding: 40,
  },
  leftColumn: {
    flex: 2,
    marginRight: 20,
  },
  rightColumn: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#2563eb',
    borderBottom: '2px solid #bfdbfe',
    marginBottom: 8,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: 700,
    color: '#1d4ed8',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  contact: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 12,
  },
  list: {
    marginLeft: 12,
    marginTop: 6,
  },
  listItem: {
    marginBottom: 3,
  },
  bold: {
    fontWeight: 700,
  },
  small: {
    fontSize: 9,
    color: '#64748b',
  },
  projectItem: {
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1d4ed8',
    marginBottom: 2,
  },
  projectUrl: {
    fontSize: 9,
    color: '#2563eb',
    marginBottom: 4,
  },
  skillTag: {
    marginRight: 8,
    marginBottom: 6,
    backgroundColor: '#e0e7ff',
    color: '#1d4ed8',
    padding: 4,
    borderRadius: 4,
    fontSize: 9,
  },
});

// Placeholder data structure
const sampleData = {
  name: 'John Aarts',
  jobTitle: 'Customer Success Manager',
  contact: {
    phone: '+1-952-140-6600',
    email: 'john.xander@gmail.com',
    location: 'Amsterdam, Netherlands',
    linkedin: 'linkedin.com/johnaarts',
  },
  summary:
    'Enthusiastic Customer Success Manager with seven years of experience coordinating Customer Success staff and analyzing complaints, developing new procedures, and implementing customer retention campaigns. Proven project team leader and client service manager. Focused on building excellent productive client relationships, quickly resolving issues to assure their business needs are met.',
  experience: [
    {
      title: 'Senior Customer Success Manager',
      company: 'Blanchette',
      location: 'Amsterdam, Netherlands',
      start: '2017',
      end: 'Ongoing',
      bullets: [
        'Achieved an average 115% Net Retention Rate (NRR) on a target of 102%, for five consecutive quarters',
        'Developed an end user training curriculum for Microsoft Office 365',
        'Partnered with AE to grow book of business 25% YoY',
        'Managed an EMEA book of business of USD $2-2.5M in ARR - achieved and exceeded renewal and up-sell targets',
      ],
    },
    {
      title: 'Customer Success Manager',
      company: 'Dufour',
      location: 'Amsterdam, Netherlands',
      start: '2015',
      end: '2017',
      bullets: [
        'Achieved 100% retention rate and restore the relationship for at-risk accounts',
        'Proactively managed customer relationships and lifetime value; drove the recurring revenue up by 25%',
        'Created strategic success plans for my client base that resulted in 100% customer outreach',
        'Negotiate renewal contracts with a combined retention rate of 102% of monthly reoccurring revenue',
        'Improved Customer Retention Rate from 65% to 78%',
      ],
    },
    {
      title: 'Sr. Customer Success Manager',
      company: 'Bernier',
      location: 'Amsterdam, Netherlands',
      start: '2011',
      end: '2015',
      bullets: [
        'Joined the company as employee #7 and reported directly to the CEO',
        'Managed book of business with 250 clients and over $2M ARR',
        'Converted 34% of all accounts into sales reference customers and surpassing team goals on a consistent basis',
      ],
    },
  ],
  projects: [
    {
      name: 'Customer Portal Redesign',
      url: 'github.com/johnaarts/customer-portal',
      description: [
        'Led redesign of customer self-service portal',
        'Improved customer satisfaction scores by 35%',
        'Reduced support tickets by 40%',
      ],
    },
    {
      name: 'Automated Onboarding System',
      url: 'github.com/johnaarts/onboarding-automation',
      description: [
        'Built automated customer onboarding workflow',
        'Reduced onboarding time from 2 weeks to 3 days',
        'Implemented customer success metrics dashboard',
      ],
    },
  ],
  education: [
    {
      degree: 'Master of Sociology',
      school: 'University of Amsterdam',
      years: '2013 - 2014',
      location: 'Amsterdam',
    },
    {
      degree: 'Bachelor of Economics',
      school: 'University of Amsterdam',
      years: '2009 - 2012',
      location: 'Amsterdam',
    },
  ],
  skills: [
    'CRM',
    'Salesforce',
    'NetSuite',
    'MS Excel',
    'Hubspot',
    'Mailchimp',
    'CI Tools',
    'SimilarWeb',
  ],
  certifications: [
    {
      name: 'Customer Success Manager Certification',
      issuer: 'Gainsight',
      date: '2023',
    },
    {
      name: 'Salesforce Administrator',
      issuer: 'Salesforce',
      date: '2022',
    },
    {
      name: 'Project Management Professional',
      issuer: 'PMI',
      date: '2021',
    },
  ],
  strengths: [
    {
      title: 'Negotiation and presentation',
      desc: 'Understanding negotiation dynamics and presenting information in a clear and effective way.',
    },
    {
      title: 'Research',
      desc: 'Always prepared for the customer & his industry specifics',
    },
    {
      title: 'Customer Relationship',
      desc: 'Always providing support to both prospective and existing customers.',
    },
  ],
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Dutch', level: 'Proficient' },
  ],
};

export const CVPdfDocument = ({ data = sampleData }: { data?: typeof sampleData }) => {
  // Ensure data has all required fields with fallbacks
  const safeData = {
    name: data?.name || 'Your Name',
    jobTitle: data?.jobTitle || 'Professional Title',
    contact: {
      phone: data?.contact?.phone || 'Phone',
      email: data?.contact?.email || 'email@example.com',
      location: data?.contact?.location || 'Location',
      linkedin: data?.contact?.linkedin || 'linkedin.com/profile',
    },
    summary: data?.summary || 'Professional summary',
    experience: data?.experience || [],
    projects: data?.projects || [],
    education: data?.education || [],
    skills: data?.skills || [],
    certifications: data?.certifications || [],
    strengths: data?.strengths || [],
    languages: data?.languages || [],
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          <View style={styles.section}>
            <Text style={styles.name}>{safeData.name}</Text>
            <Text style={styles.jobTitle}>{safeData.jobTitle}</Text>
            <Text style={styles.contact}>
              {safeData.contact.phone} • {safeData.contact.email} • {safeData.contact.location} • {safeData.contact.linkedin}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{safeData.summary}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {safeData.experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Text style={styles.bold}>{exp.title}</Text>
                <Text style={styles.small}>{exp.company} • {exp.start} - {exp.end} • {exp.location}</Text>
                <View style={styles.list}>
                  {exp.bullets?.map((b, j) => (
                    <Text key={j} style={styles.listItem}>• {b}</Text>
                  )) || []}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {safeData.projects.map((project, i) => (
              <View key={i} style={styles.projectItem}>
                <Text style={styles.projectTitle}>{project.name}</Text>
                <Text style={styles.projectUrl}>{project.url}</Text>
                <View style={styles.list}>
                  {project.description?.map((desc, j) => (
                    <Text key={j} style={styles.listItem}>• {desc}</Text>
                  )) || []}
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* Right Column */}
        <View style={styles.rightColumn}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {safeData.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={styles.bold}>{edu.degree}</Text>
                <Text style={styles.small}>{edu.school} • {edu.years} • {edu.location}</Text>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {safeData.skills.map((s, i) => (
                <Text key={i} style={styles.skillTag}>{s}</Text>
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {safeData.certifications.map((cert, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.bold}>{cert.name}</Text>
                <Text style={styles.small}>{cert.issuer} • {cert.date}</Text>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soft Skills</Text>
            {safeData.strengths.map((s, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.bold}>{s.title}</Text>
                <Text style={styles.small}>{s.desc}</Text>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {safeData.languages.map((l, i) => (
              <Text key={i} style={styles.small}>{l.name} – {l.level}</Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};