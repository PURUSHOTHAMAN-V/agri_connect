import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import LanguageToggle from './LanguageToggle.jsx';
import NotificationSystem from './NotificationSystem.jsx';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container">
        <div className="d-flex justify-between align-center p-3">
          {/* Logo */}
          <div className="d-flex align-center">
            <h1 className="text-primary mb-0" style={{ fontSize: '1.5rem' }}>
              <span className={language === 'tamil' ? 'tamil' : ''}>
                Direct AgriConnect TN
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="d-none d-flex align-center">
            <LanguageToggle />
            
            {isAuthenticated && (
              <div className="ml-3">
                <NotificationSystem />
              </div>
            )}
            
            {isAuthenticated ? (
              <div className="d-flex align-center ml-3">
                <a href="/marketplace" className="btn btn-outline btn-small mr-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'சந்தை இடம்' : 'Marketplace'}
                  </span>
                </a>
                <span className="text-secondary mr-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('welcome')}, {user?.name}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-small"
                >
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('logout')}
                  </span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-center ml-3">
                <a href="/marketplace" className="btn btn-outline btn-small mr-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'சந்தை இடம்' : 'Marketplace'}
                  </span>
                </a>
                <a href="/login" className="btn btn-outline btn-small mr-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('login')}
                  </span>
                </a>
                <a href="/register" className="btn btn-primary btn-small">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('register')}
                  </span>
                </a>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="btn btn-outline d-block d-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <span>☰</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-white border-top p-3">
            <LanguageToggle />
            
            {isAuthenticated ? (
              <div className="mt-3">
                <div className="text-secondary mb-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('welcome')}, {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline w-100"
                >
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('logout')}
                  </span>
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <a href="/login" className="btn btn-outline w-100 mb-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('login')}
                  </span>
                </a>
                <a href="/register" className="btn btn-primary w-100">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('register')}
                  </span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
