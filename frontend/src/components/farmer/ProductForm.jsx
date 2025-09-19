import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { cropTypes, grades, units } from '../../utils/languages.js';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    cropType: product?.cropType || '',
    variety: product?.variety || '',
    grade: product?.grade || '',
    quantity: product?.quantity || '',
    unit: product?.unit || 'quintal',
    pricePerUnit: product?.pricePerUnit || '',
    harvestDate: product?.harvestDate || '',
    deliveryWindow: product?.deliveryWindow || '7 days',
    description: product?.description || '',
    images: product?.images || []
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

    if (!formData.cropType) {
      newErrors.cropType = language === 'tamil' ? 'பயிர் வகை தேர்ந்தெடுக்கவும்' : 'Please select crop type';
    }

    if (!formData.variety.trim()) {
      newErrors.variety = language === 'tamil' ? 'வகை தேவை' : 'Variety is required';
    }

    if (!formData.grade) {
      newErrors.grade = language === 'tamil' ? 'தரம் தேர்ந்தெடுக்கவும்' : 'Please select grade';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = language === 'tamil' ? 'சரியான அளவை உள்ளிடவும்' : 'Please enter valid quantity';
    }

    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) {
      newErrors.pricePerUnit = language === 'tamil' ? 'சரியான விலையை உள்ளிடவும்' : 'Please enter valid price';
    }

    if (!formData.harvestDate) {
      newErrors.harvestDate = language === 'tamil' ? 'அறுவடை தேதி தேவை' : 'Harvest date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these to a server
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {product ? t('editProduct') : t('addProduct')}
          </span>
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('cropType')}
                </span>
              </label>
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleInputChange}
                className={`form-select ${errors.cropType ? 'border-error' : ''}`}
              >
                <option value="">
                  {language === 'tamil' ? 'பயிர் வகையைத் தேர்ந்தெடுக்கவும்' : 'Select crop type'}
                </option>
                {cropTypes.map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name[language]}
                  </option>
                ))}
              </select>
              {errors.cropType && (
                <div className="form-error">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {errors.cropType}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('variety')}
                </span>
              </label>
              <input
                type="text"
                name="variety"
                value={formData.variety}
                onChange={handleInputChange}
                className={`form-input ${errors.variety ? 'border-error' : ''}`}
                placeholder={language === 'tamil' ? 'எ.கா. பொன்னி, பாசுமதி' : 'e.g. Ponni, Basmati'}
              />
              {errors.variety && (
                <div className="form-error">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {errors.variety}
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
                  {t('grade')}
                </span>
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className={`form-select ${errors.grade ? 'border-error' : ''}`}
              >
                <option value="">
                  {language === 'tamil' ? 'தரத்தைத் தேர்ந்தெடுக்கவும்' : 'Select grade'}
                </option>
                {grades.map(grade => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name[language]}
                  </option>
                ))}
              </select>
              {errors.grade && (
                <div className="form-error">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {errors.grade}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('quantity')}
                </span>
              </label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={`form-input flex-1 ${errors.quantity ? 'border-error' : ''}`}
                  placeholder={language === 'tamil' ? 'அளவு' : 'Quantity'}
                  min="1"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="form-select"
                  style={{ width: '120px' }}
                >
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name[language]}
                    </option>
                  ))}
                </select>
              </div>
              {errors.quantity && (
                <div className="form-error">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {errors.quantity}
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
                  {t('pricePerUnit')}
                </span>
              </label>
              <div className="d-flex align-center">
                <span className="text-primary mr-2">₹</span>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleInputChange}
                  className={`form-input flex-1 ${errors.pricePerUnit ? 'border-error' : ''}`}
                  placeholder={language === 'tamil' ? 'அலகுக்கு விலை' : 'Price per unit'}
                  min="1"
                />
              </div>
              {errors.pricePerUnit && (
                <div className="form-error">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {errors.pricePerUnit}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('harvestDate')}
                </span>
              </label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleInputChange}
                className={`form-input ${errors.harvestDate ? 'border-error' : ''}`}
              />
              {errors.harvestDate && (
                <div className="form-error">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {errors.harvestDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {t('deliveryWindow')}
            </span>
          </label>
          <select
            name="deliveryWindow"
            value={formData.deliveryWindow}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="1 day">{language === 'tamil' ? '1 நாள்' : '1 day'}</option>
            <option value="3 days">{language === 'tamil' ? '3 நாட்கள்' : '3 days'}</option>
            <option value="7 days">{language === 'tamil' ? '7 நாட்கள்' : '7 days'}</option>
            <option value="15 days">{language === 'tamil' ? '15 நாட்கள்' : '15 days'}</option>
            <option value="30 days">{language === 'tamil' ? '30 நாட்கள்' : '30 days'}</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {t('description')}
            </span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder={language === 'tamil' ? 'பொருளைப் பற்றிய விவரங்கள்...' : 'Product details...'}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {t('images')}
            </span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="form-input"
          />
          {formData.images.length > 0 && (
            <div className="d-flex gap-2 mt-2">
              {formData.images.map((image, index) => (
                <div key={index} className="position-relative">
                  <img 
                    src={image} 
                    alt={`Product ${index + 1}`}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="btn btn-outline btn-small position-absolute"
                    style={{ top: '-5px', right: '-5px', width: '20px', height: '20px', fontSize: '12px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary flex-1">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {product ? t('save') : t('addProduct')}
            </span>
          </button>
          <button type="button" onClick={onCancel} className="btn btn-outline">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {t('cancel')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

