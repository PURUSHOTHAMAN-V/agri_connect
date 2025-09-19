import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '../utils/languages';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('agriConnectLanguage');
    return savedLanguage || 'tamil';
  });

  const t = (key) => getTranslation(key, language);

  const toggleLanguage = () => {
    const newLanguage = language === 'tamil' ? 'english' : 'tamil';
    setLanguage(newLanguage);
    localStorage.setItem('agriConnectLanguage', newLanguage);
  };

  useEffect(() => {
    // Add Tamil font to document when Tamil is selected
    if (language === 'tamil') {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@300;400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
