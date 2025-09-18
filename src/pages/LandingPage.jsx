import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import LanguageToggle from '../components/common/LanguageToggle.jsx';

const LandingPage = () => {
  const { t, language } = useLanguage();
  const [selectedUserType, setSelectedUserType] = useState(null);

  const features = [
    {
      id: 'directConnect',
      title: t('directConnect'),
      description: language === 'tamil' 
        ? 'விவசாயிகளுக்கும் வாங்குபவர்களுக்கும் நேரடி இணைப்பு'
        : 'Direct connection between farmers and buyers',
      icon: '🤝'
    },
    {
      id: 'fairPricing',
      title: t('fairPricing'),
      description: language === 'tamil'
        ? 'நியாயமான விலை மற்றும் வெளிப்படையான விலை நிர்ணயம்'
        : 'Fair pricing and transparent price determination',
      icon: '💰'
    },
    {
      id: 'noMiddlemen',
      title: t('noMiddlemen'),
      description: language === 'tamil'
        ? 'இடைத்தரகர்கள் இல்லாமல் நேரடி வர்த்தகம்'
        : 'Direct trade without middlemen',
      icon: '🚫'
    }
  ];

  const districts = [
    { id: 'thanjavur', name: language === 'tamil' ? 'தஞ்சாவூர்' : 'Thanjavur' },
    { id: 'madurai', name: language === 'tamil' ? 'மதுரை' : 'Madurai' },
    { id: 'erode', name: language === 'tamil' ? 'ஈரோடு' : 'Erode' },
    { id: 'salem', name: language === 'tamil' ? 'சேலம்' : 'Salem' },
    { id: 'coimbatore', name: language === 'tamil' ? 'கோயம்புத்தூர்' : 'Coimbatore' },
    { id: 'trichy', name: language === 'tamil' ? 'திருச்சி' : 'Trichy' }
  ];

  return (
    <div className="min-h-screen bg-light">
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">
        {language === 'tamil' ? 'முக்கிய உள்ளடக்கத்திற்கு செல்' : 'Skip to main content'}
      </a>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container">
          <div className="d-flex justify-between align-center p-3">
            <h1 className="text-primary mb-0">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                Direct AgriConnect TN
              </span>
            </h1>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-primary text-white py-5">
          <div className="container">
            <div className="text-center">
              <h1 className="mb-3">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' 
                    ? 'தமிழ்நாட்டு விவசாயிகளுக்கான டிஜிட்டல் சந்தை'
                    : 'Digital Marketplace for Tamil Nadu Farmers'
                  }
                </span>
              </h1>
              <p className="mb-4" style={{ fontSize: '1.2rem' }}>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil'
                    ? 'விவசாயிகளுக்கும் வாங்குபவர்களுக்கும் இடையே நேரடி இணைப்பு'
                    : 'Direct connection between farmers and buyers'
                  }
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* User Type Selection */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="mb-3">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'நீங்கள் யார்?' : 'Who are you?'}
                </span>
              </h2>
              <p>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' 
                    ? 'உங்கள் பயனர் வகையைத் தேர்ந்தெடுக்கவும்'
                    : 'Select your user type'
                  }
                </span>
              </p>
            </div>

            <div className="grid grid-2 gap-4">
              <div 
                className={`card text-center cursor-pointer ${selectedUserType === 'farmer' ? 'border-primary' : ''}`}
                onClick={() => setSelectedUserType('farmer')}
                style={{ cursor: 'pointer', border: selectedUserType === 'farmer' ? '3px solid var(--primary-green)' : 'none' }}
              >
                <div className="mb-3" style={{ fontSize: '3rem' }}>👨‍🌾</div>
                <h3 className="text-primary">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('farmer')}
                  </span>
                </h3>
                <p>
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil'
                      ? 'உங்கள் பயிர்களை விற்கவும், நேரடி விலையைப் பெறவும்'
                      : 'Sell your crops and get direct pricing'
                    }
                  </span>
                </p>
              </div>

              <div 
                className={`card text-center cursor-pointer ${selectedUserType === 'buyer' ? 'border-primary' : ''}`}
                onClick={() => setSelectedUserType('buyer')}
                style={{ cursor: 'pointer', border: selectedUserType === 'buyer' ? '3px solid var(--primary-green)' : 'none' }}
              >
                <div className="mb-3" style={{ fontSize: '3rem' }}>🛒</div>
                <h3 className="text-primary">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('buyer')}
                  </span>
                </h3>
                <p>
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil'
                      ? 'நேரடியாக விவசாயிகளிடமிருந்து வாங்கவும்'
                      : 'Buy directly from farmers'
                    }
                  </span>
                </p>
              </div>
            </div>

            {selectedUserType && (
              <div className="text-center mt-4">
                <a 
                  href={`/register?type=${selectedUserType}`}
                  className="btn btn-primary btn-large"
                >
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'தொடரவும்' : 'Continue'}
                  </span>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'முக்கிய அம்சங்கள்' : 'Key Features'}
                </span>
              </h2>
            </div>

            <div className="grid grid-3 gap-4">
              {features.map((feature) => (
                <div key={feature.id} className="card text-center">
                  <div className="mb-3" style={{ fontSize: '2.5rem' }}>
                    {feature.icon}
                  </div>
                  <h4 className="text-primary mb-2">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {feature.title}
                    </span>
                  </h4>
                  <p>
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {feature.description}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Districts Section */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'தமிழ்நாட்டு மாவட்டங்கள்' : 'Tamil Nadu Districts'}
                </span>
              </h2>
              <p>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil'
                    ? 'நாங்கள் பின்வரும் மாவட்டங்களில் சேவை வழங்குகிறோம்'
                    : 'We serve the following districts'
                  }
                </span>
              </p>
            </div>

            <div className="grid grid-3 gap-3">
              {districts.map((district) => (
                <div key={district.id} className="card text-center">
                  <h5>
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {district.name}
                    </span>
                  </h5>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5 bg-secondary text-white">
          <div className="container">
            <div className="text-center">
              <h2 className="mb-3">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'இப்போது தொடங்குங்கள்' : 'Get Started Today'}
                </span>
              </h2>
              <p className="mb-4">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil'
                    ? 'தமிழ்நாட்டு விவசாயத்தின் எதிர்காலத்தில் பங்கேற்கவும்'
                    : 'Join the future of Tamil Nadu agriculture'
                  }
                </span>
              </p>
              <div className="d-flex justify-center gap-3">
                <a href="/marketplace" className="btn btn-primary btn-large">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'சந்தை இடத்தைப் பாருங்கள்' : 'Browse Marketplace'}
                  </span>
                </a>
                <a href="/register" className="btn btn-outline btn-large" style={{ color: 'white', borderColor: 'white' }}>
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('register')}
                  </span>
                </a>
                <a href="/login" className="btn btn-outline btn-large" style={{ color: 'white', borderColor: 'white' }}>
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('login')}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark-gray text-white py-4">
        <div className="container">
          <div className="text-center">
            <p>
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil'
                  ? '© 2024 Direct AgriConnect TN. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
                  : '© 2024 Direct AgriConnect TN. All rights reserved.'
                }
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
