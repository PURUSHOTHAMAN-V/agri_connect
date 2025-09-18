import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import Modal from '../common/Modal.jsx';

const ProductDetails = ({ product, isOpen, onClose, onOrder, onChat }) => {
  const { t, language } = useLanguage();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  const calculateTotal = () => {
    return selectedQuantity * product.price;
  };

  const handleOrder = () => {
    onOrder({
      ...product,
      orderQuantity: selectedQuantity,
      totalAmount: calculateTotal()
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product?.name} size="large">
      {product && (
        <div>
          {/* Product Header */}
          <div className="d-flex justify-between align-start mb-4">
            <div>
              <h3 className="mb-2">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {product.name}
                </span>
              </h3>
              <p className="text-secondary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'விவசாயி' : 'Farmer'}: {product.farmer}
                </span>
              </p>
              <p className="text-secondary mb-0">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('district')}: {product.district}
                </span>
              </p>
            </div>
            <div className="text-right">
              <div className="d-flex align-center mb-2">
                <span className="text-warning mr-1">⭐</span>
                <span>{product.rating}</span>
              </div>
              <span className={`badge ${product.grade === 'A' ? 'bg-success' : product.grade === 'B' ? 'bg-warning' : 'bg-secondary'}`}>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('grade')} {product.grade}
                </span>
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-2 gap-4 mb-4">
            <div className="card">
              <h5 className="mb-2">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'பொருள் விவரங்கள்' : 'Product Details'}
                </span>
              </h5>
              <div className="mb-2">
                <span className="text-secondary">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('quantity')}:
                  </span>
                </span>
                <span className="ml-2">
                  {product.quantity} {product.unit}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-secondary">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'அறுவடை தேதி' : 'Harvest Date'}:
                  </span>
                </span>
                <span className="ml-2">
                  {new Date(product.harvestDate).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-secondary">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'விநியோக சாளரம்' : 'Delivery Window'}:
                  </span>
                </span>
                <span className="ml-2">
                  {product.deliveryWindow || '7 days'}
                </span>
              </div>
            </div>

            <div className="card">
              <h5 className="mb-2">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'விலை விவரங்கள்' : 'Pricing'}
                </span>
              </h5>
              <div className="mb-2">
                <span className="text-primary font-weight-bold">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {formatPrice(product.price)}/{product.unit}
                  </span>
                </span>
              </div>
              <div className="mb-2">
                <span className="text-secondary">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'குறைந்த ஆதரவு விலை' : 'MSP'}:
                  </span>
                </span>
                <span className="ml-2">
                  {formatPrice(product.msp || product.price * 0.9)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Section */}
          <div className="card mb-4">
            <h5 className="mb-3">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'ஆர்டர் செய்யவும்' : 'Place Order'}
              </span>
            </h5>
            
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'அளவு தேர்ந்தெடுக்கவும்' : 'Select Quantity'}
                </span>
              </label>
              <div className="d-flex align-center gap-2">
                <button
                  className="btn btn-outline btn-small"
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  disabled={selectedQuantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-input"
                  style={{ width: '100px', textAlign: 'center' }}
                  min="1"
                  max={product.quantity}
                />
                <button
                  className="btn btn-outline btn-small"
                  onClick={() => setSelectedQuantity(Math.min(product.quantity, selectedQuantity + 1))}
                  disabled={selectedQuantity >= product.quantity}
                >
                  +
                </button>
                <span className="text-secondary ml-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {product.unit}
                  </span>
                </span>
              </div>
            </div>

            <div className="d-flex justify-between align-center mb-3">
              <span className="text-secondary">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'மொத்த விலை' : 'Total Price'}:
                </span>
              </span>
              <span className="text-primary font-weight-bold">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {formatPrice(calculateTotal())}
                </span>
              </span>
            </div>

            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary flex-1"
                onClick={handleOrder}
              >
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'ஆர்டர் செய்' : 'Place Order'}
                </span>
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => onChat(product)}
              >
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'விவசாயியுடன் பேசுங்கள்' : 'Chat with Farmer'}
                </span>
              </button>
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="card">
              <h5 className="mb-2">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'விளக்கம்' : 'Description'}
                </span>
              </h5>
              <p>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {product.description}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ProductDetails;

