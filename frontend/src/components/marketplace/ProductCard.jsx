import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const ProductCard = ({ product, onOrder, onChat }) => {
  const { t, language } = useLanguage();

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-success';
      case 'B': return 'text-warning';
      case 'C': return 'text-secondary';
      default: return 'text-secondary';
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="card product-card">
      <div className="card-header">
        <h4 className="card-title">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {product.name}
          </span>
        </h4>
        <div className="text-secondary">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {product.farmer}
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="d-flex justify-between align-center mb-2">
          <span className="text-secondary">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {t('district')}: {product.district}
            </span>
          </span>
          <span className={`badge ${getGradeColor(product.grade)}`}>
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {t('grade')} {product.grade}
            </span>
          </span>
        </div>
        
        <p className="text-secondary mb-1">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {t('quantity')}: {product.quantity} {product.unit}
          </span>
        </p>
        
        <p className="text-primary mb-1 font-weight-bold">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {formatPrice(product.price)}/{product.unit}
          </span>
        </p>
        
        <p className="text-secondary mb-1">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'அறுவடை தேதி' : 'Harvest Date'}: {new Date(product.harvestDate).toLocaleDateString()}
          </span>
        </p>
        
        <div className="d-flex align-center mb-2">
          <span className="text-warning mr-1">⭐</span>
          <span>{product.rating}</span>
          <span className="text-secondary ml-2">
            <span className={language === 'tamil' ? 'tamil' : ''}>
              ({language === 'tamil' ? 'மதிப்பீடு' : 'Rating'})
            </span>
          </span>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button 
          className="btn btn-primary flex-1"
          onClick={() => onOrder(product)}
        >
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'ஆர்டர் செய்' : 'Order'}
          </span>
        </button>
        <button 
          className="btn btn-outline"
          onClick={() => onChat(product)}
        >
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'அரட்டை' : 'Chat'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

