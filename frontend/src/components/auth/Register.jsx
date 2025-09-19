import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { districts } from '../../utils/languages.js';

const Register = () => {
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get user type from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const userTypeFromUrl = urlParams.get('type');

  const [formData, setFormData] = useState({
    userType: userTypeFromUrl || 'farmer',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    aadharNumber: '',
    pattaNumber: '',
    district: '',
    taluk: '',
    village: '',
    address: '',
    bankAccount: '',
    ifscCode: ''
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = language === 'tamil' ? 'பெயர் தேவை' : 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'tamil' ? 'மின்னஞ்சல் தேவை' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'tamil' ? 'சரியான மின்னஞ்சலை உள்ளிடவும்' : 'Please enter a valid email';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = language === 'tamil' ? 'தொலைபேசி எண் தேவை' : 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = language === 'tamil' ? 'சரியான தொலைபேசி எண்ணை உள்ளிடவும்' : 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = language === 'tamil' ? 'கடவுச்சொல் தேவை' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = language === 'tamil' ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்' : 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'tamil' ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match';
    }

    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = language === 'tamil' ? 'ஆதார் எண் தேவை' : 'Aadhar number is required';
    } else if (!/^[0-9]{12}$/.test(formData.aadharNumber.replace(/\D/g, ''))) {
      newErrors.aadharNumber = language === 'tamil' ? 'சரியான ஆதார் எண்ணை உள்ளிடவும்' : 'Please enter a valid Aadhar number';
    }

    if (!formData.district) {
      newErrors.district = language === 'tamil' ? 'மாவட்டம் தேர்ந்தெடுக்கவும்' : 'Please select a district';
    }

    if (!formData.taluk.trim()) {
      newErrors.taluk = language === 'tamil' ? 'தாலுகா தேவை' : 'Taluk is required';
    }

    if (!formData.village.trim()) {
      newErrors.village = language === 'tamil' ? 'கிராமம் தேவை' : 'Village is required';
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
      const result = await register(formData);
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
        setError(result.error || (language === 'tamil' ? 'பதிவு தோல்வி' : 'Registration failed'));
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
          <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="text-center mb-4">
              <h2>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('register')} - {t(formData.userType)}
                </span>
              </h2>
              <p>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil'
                    ? 'உங்கள் கணக்கை உருவாக்கவும்'
                    : 'Create your account'
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
                    ? `பதிவு வெற்றிகரமாக! ${formData.userType === 'farmer' ? 'விவசாயி' : 'வாங்குபவர்'} பக்கத்திற்கு திருப்பி விடப்படுகிறீர்கள்...`
                    : `Registration successful! Redirecting to ${formData.userType === 'farmer' ? 'farmer' : 'buyer'} page...`
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

              {/* Personal Information */}
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('fullName')}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.fullName ? 'border-error' : ''}`}
                      placeholder={language === 'tamil' ? 'உங்கள் முழு பெயர்' : 'Your full name'}
                    />
                    {errors.fullName && (
                      <div className="form-error">
                        <span className={language === 'tamil' ? 'tamil' : ''}>
                          {errors.fullName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
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
                </div>
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('phoneNumber')}
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`form-input ${errors.phoneNumber ? 'border-error' : ''}`}
                      placeholder={language === 'tamil' ? 'உங்கள் தொலைபேசி எண்' : 'Your phone number'}
                    />
                    {errors.phoneNumber && (
                      <div className="form-error">
                        <span className={language === 'tamil' ? 'tamil' : ''}>
                          {errors.phoneNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="row">
                <div className="col">
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
                </div>
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('confirmPassword')}
                      </span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`form-input ${errors.confirmPassword ? 'border-error' : ''}`}
                      placeholder={language === 'tamil' ? 'கடவுச்சொல்லை உறுதிப்படுத்து' : 'Confirm password'}
                    />
                    {errors.confirmPassword && (
                      <div className="form-error">
                        <span className={language === 'tamil' ? 'tamil' : ''}>
                          {errors.confirmPassword}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Documents */}
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('aadharNumber')}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      className={`form-input ${errors.aadharNumber ? 'border-error' : ''}`}
                      placeholder={language === 'tamil' ? 'ஆதார் எண்' : 'Aadhar number'}
                      maxLength="12"
                    />
                    {errors.aadharNumber && (
                      <div className="form-error">
                        <span className={language === 'tamil' ? 'tamil' : ''}>
                          {errors.aadharNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('pattaNumber')}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="pattaNumber"
                      value={formData.pattaNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder={language === 'tamil' ? 'பட்டா எண் (விருப்பமானது)' : 'Patta number (optional)'}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('district')}
                      </span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`form-select ${errors.district ? 'border-error' : ''}`}
                    >
                      <option value="">
                        {language === 'tamil' ? 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்' : 'Select district'}
                      </option>
                      {districts.map(district => (
                        <option key={district.id} value={district.id}>
                          <span className={language === 'tamil' ? 'tamil' : ''}>
                            {district.name[language]}
                          </span>
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <div className="form-error">
                        <span className={language === 'tamil' ? 'tamil' : ''}>
                          {errors.district}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('taluk')}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="taluk"
                      value={formData.taluk}
                      onChange={handleInputChange}
                      className={`form-input ${errors.taluk ? 'border-error' : ''}`}
                      placeholder={language === 'tamil' ? 'தாலுகா' : 'Taluk'}
                    />
                    {errors.taluk && (
                      <div className="form-error">
                        <span className={language === 'tamil' ? 'tamil' : ''}>
                          {errors.taluk}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('village')}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleInputChange}
                      className={`form-input ${errors.village ? 'border-error' : ''}`}
                      placeholder={language === 'tamil' ? 'கிராமம்' : 'Village'}
                    />
                    {errors.village && (
                      <div className="form-error">
                        <span className={language === 'tamil' ? 'tamil' : ''}>
                          {errors.village}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('address')}
                  </span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder={language === 'tamil' ? 'முழு முகவரி' : 'Full address'}
                  rows="3"
                />
              </div>

              {/* Bank Details */}
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('bankAccount')}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder={language === 'tamil' ? 'வங்கி கணக்கு எண்' : 'Bank account number'}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label className="form-label">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {t('ifscCode')}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder={language === 'tamil' ? 'IFSC குறியீடு' : 'IFSC code'}
                    />
                  </div>
                </div>
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
                      {t('register')}
                    </span>
                  )}
                </button>
              </div>

              <div className="text-center mt-3">
                <p>
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'}
                  </span>
                  <a href="/login" className="text-primary ml-2">
                    <span className={language === 'tamil' ? 'tamil' : ''}>
                      {t('login')}
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

export default Register;
