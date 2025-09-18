import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const LanguageToggle = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="btn btn-outline btn-small"
      aria-label={language === 'tamil' ? 'Switch to English' : 'தமிழுக்கு மாற்று'}
      title={language === 'tamil' ? 'Switch to English' : 'தமிழுக்கு மாற்று'}
    >
      <span className={language === 'tamil' ? 'tamil' : ''}>
        {language === 'tamil' ? 'EN' : 'தமிழ்'}
      </span>
    </button>
  );
};

export default LanguageToggle;
