import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    userType: 'farmer',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = language === 'tamil' ? 'மின்னஞ்சல் தேவை' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'tamil' ? 'சரியான மின்னஞ்சலை உள்ளிடவும்' : 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = language === 'tamil' ? 'கடவுச்சொல் தேவை' : 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        setSuccess(true);
        // Redirect based on user type
        setTimeout(() => {
          if (formData.userType === 'farmer') {
            window.location.href = '/farmer';
          } else if (formData.userType === 'buyer') {
            window.location.href = '/marketplace';
          } else {
            window.location.href = '/dashboard';
          }
        }, 2000);
      } else {
        setError(result.error || (language === 'tamil' ? 'உள்நுழைவு தோல்வி' : 'Login failed'));
      }
    } catch (err) {
      setError(language === 'tamil' ? 'ஏதோ பிழை ஏற்பட்டது' : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <div className="container">
        <div className="d-flex justify-center align-center" style={{ minHeight: '100vh' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="text-center mb-4">
              <h2>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('login')}
                </span>
              </h2>
              <p>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil'
                    ? 'உங்கள் கணக்கில் உள்நுழையவும்'
                    : 'Sign in to your account'
                  }
                </span>
              </p>
            </div>

            {error && (
              <div className="bg-error text-white p-3 mb-3 rounded">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {error}
                </span>
              </div>
            )}

            {success && (
              <div className="bg-success text-white p-3 mb-3 rounded">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil'
                    ? `உள்நுழைவு வெற்றிகரமாக! ${formData.userType === 'farmer' ? 'விவசாயி' : 'வாங்குபவர்'} பக்கத்திற்கு திருப்பி விடப்படுகிறீர்கள்...`
                    : `Login successful! Redirecting to ${formData.userType === 'farmer' ? 'farmer' : 'buyer'} page...`
                  }
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* User Type Selection */}
              <div className="form-group">
                <label className="form-label">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'பயனர் வகை' : 'User Type'}
                  </span>
                </label>
                <div className="d-flex gap-2">
                  <label className="d-flex align-center">
                    <input
                      type="radio"
                      name="userType"
                      value="farmer"
                      checked={formData.userType === 'farmer'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {t('farmer')}
                    </span>
                  </label>
                  <label className="d-flex align-center">
                    <input
                      type="radio"
                      name="userType"
                      value="buyer"
                      checked={formData.userType === 'buyer'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {t('buyer')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('email')}
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'border-error' : ''}`}
                  placeholder={language === 'tamil' ? 'உங்கள் மின்னஞ்சல்' : 'Your email'}
                />
                {errors.email && (
                  <div className="form-error">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {errors.email}
                    </span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('password')}
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'border-error' : ''}`}
                  placeholder={language === 'tamil' ? 'உங்கள் கடவுச்சொல்' : 'Your password'}
                />
                {errors.password && (
                  <div className="form-error">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {errors.password}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-large w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  ) : (
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {t('login')}
                    </span>
                  )}
                </button>
              </div>

              <div className="text-center mt-3">
                <p>
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'கணக்கு இல்லையா?' : "Don't have an account?"}
                  </span>
                  <a href="/register" className="text-primary ml-2">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {t('register')}
                    </span>
                  </a>
                </p>
                <p>
                  <a href="/forgot-password" className="text-secondary">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {t('forgotPassword')}
                    </span>
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
