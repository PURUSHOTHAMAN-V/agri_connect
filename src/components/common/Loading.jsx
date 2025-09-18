import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const Loading = ({ message }) => {
  const { t, language } = useLanguage();

  return (
    <div className="d-flex flex-column align-center justify-center p-5">
      <div className="spinner mb-3"></div>
      <p className="text-center">
        <span className={language === 'tamil' ? 'tamil' : ''}>
          {message || t('loading')}
        </span>
      </p>
    </div>
  );
};

export default Loading;
