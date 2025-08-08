import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Landing Page
    'landing.title': 'AI-Powered CV Builder',
    'landing.subtitle': 'Easily tailor your CV for any job using AI analysis and personalized suggestions.',
    'landing.description': 'Our intelligent system analyzes job descriptions and helps you customize your CV to match specific requirements. Get better interview chances with AI-powered optimization.',
    'landing.getStarted': 'Get Started',
    'landing.language': 'Language',

    // CV Builder
    'builder.title': 'CV Builder',
    'builder.jobDescription': 'Job Description',
    'builder.jobDescriptionPlaceholder': 'Paste the full job description here...',
    'builder.applicantCV': 'Applicant CV',
    'builder.applicantCVPlaceholder': 'Paste your CV text here or upload a PDF/DOCX/TXT file...',
    'builder.profilePhoto': 'Profile Photo',
    'builder.uploadPhoto': 'Upload Photo',
    'builder.analyzeGenerate': 'Analyze & Generate CV',
    'builder.uploading': 'Uploading...',
    'builder.processing': 'Processing...',
    'builder.fileUploaded': 'File uploaded successfully',
    'builder.dragDrop': 'Drag and drop or click to upload',
    'builder.supportedFormats': 'Supports PDF, DOCX, TXT files',
    'builder.generatedCV': 'Generated CV',
    'builder.backToBuilder': 'Back to Builder',
    'builder.createNewCV': 'Create New CV',
    'builder.exportPDF': 'Export PDF',
    'builder.cvGenerated': 'CV generated successfully',
    'builder.generationFailed': 'Generation failed',
    'builder.pdfExported': 'PDF exported successfully',
    'builder.exportFailed': 'Export failed',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
  },
  ar: {
    // Landing Page
    'landing.title': 'منشئ السيرة الذاتية بالذكاء الاصطناعي',
    'landing.subtitle': 'قم بتخصيص سيرتك الذاتية بسهولة لأي وظيفة باستخدام التحليل الذكي والاقتراحات المخصصة.',
    'landing.description': 'يحلل نظامنا الذكي أوصاف الوظائف ويساعدك على تخصيص سيرتك الذاتية لتطابق المتطلبات المحددة. احصل على فرص أفضل للمقابلات مع التحسين المدعوم بالذكاء الاصطناعي.',
    'landing.getStarted': 'ابدأ الآن',
    'landing.language': 'اللغة',

    // CV Builder
    'builder.title': 'منشئ السيرة الذاتية',
    'builder.jobDescription': 'وصف الوظيفة',
    'builder.jobDescriptionPlaceholder': 'الصق وصف الوظيفة كاملاً هنا...',
    'builder.applicantCV': 'السيرة الذاتية للمتقدم',
    'builder.applicantCVPlaceholder': 'الصق نص سيرتك الذاتية هنا أو ارفع ملف PDF/DOCX/TXT...',
    'builder.profilePhoto': 'الصورة الشخصية',
    'builder.uploadPhoto': 'رفع صورة',
    'builder.analyzeGenerate': 'تحليل وإنشاء السيرة الذاتية',
    'builder.uploading': 'جاري الرفع...',
    'builder.processing': 'جاري المعالجة...',
    'builder.fileUploaded': 'تم رفع الملف بنجاح',
    'builder.dragDrop': 'اسحب وأفلت أو انقر للرفع',
    'builder.supportedFormats': 'يدعم ملفات PDF، DOCX، TXT',
    'builder.generatedCV': 'السيرة الذاتية المولدة',
    'builder.backToBuilder': 'العودة إلى المنشئ',
    'builder.createNewCV': 'إنشاء سيرة ذاتية جديدة',
    'builder.exportPDF': 'تصدير PDF',
    'builder.cvGenerated': 'تم إنشاء السيرة الذاتية بنجاح',
    'builder.generationFailed': 'فشل في الإنشاء',
    'builder.pdfExported': 'تم تصدير PDF بنجاح',
    'builder.exportFailed': 'فشل في التصدير',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
  }, [direction, language]);

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};