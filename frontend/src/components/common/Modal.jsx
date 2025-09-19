import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-width: 400px',
    medium: 'max-width: 600px',
    large: 'max-width: 800px',
    full: 'max-width: 95vw'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: sizeClasses[size] }}
      >
        {/* Header */}
        <div className="d-flex justify-between align-center mb-4">
          <h3 className="mb-0">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {title}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="btn btn-outline btn-small"
            aria-label={t('close')}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
