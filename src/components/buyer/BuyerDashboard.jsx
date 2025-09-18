import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import Header from '../common/Header.jsx';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Mock data - replace with actual API calls
  const availableProducts = [
    {
      id: 1,
      name: language === 'tamil' ? 'பொன்னி அரிசி' : 'Ponni Rice',
      farmer: language === 'tamil' ? 'குமார் விவசாயி' : 'Kumar Farmer',
      district: 'Thanjavur',
      quantity: 100,
      unit: 'quintal',
      price: 2500,
      grade: 'A',
      harvestDate: '2025-01-15',
      rating: 4.5
    },
    {
      id: 2,
      name: language === 'tamil' ? 'கரும்பு' : 'Sugarcane',
      farmer: language === 'tamil' ? 'ராஜா விவசாயி' : 'Raja Farmer',
      district: 'Madurai',
      quantity: 50,
      unit: 'quintal',
      price: 1800,
      grade: 'B',
      harvestDate: '2025-01-20',
      rating: 4.2
    },
    {
      id: 3,
      name: language === 'tamil' ? 'மஞ்சள்' : 'Turmeric',
      farmer: language === 'tamil' ? 'செல்வி விவசாயி' : 'Selvi Farmer',
      district: 'Erode',
      quantity: 25,
      unit: 'quintal',
      price: 12000,
      grade: 'A',
      harvestDate: '2025-01-10',
      rating: 4.8
    }
  ];

  const orderHistory = [
    {
      id: 'ORD001',
      product: language === 'tamil' ? 'பொன்னி அரிசி' : 'Ponni Rice',
      farmer: language === 'tamil' ? 'குமார் விவசாயி' : 'Kumar Farmer',
      quantity: 20,
      amount: 50000,
      status: 'delivered',
      orderDate: '2024-12-15'
    },
    {
      id: 'ORD002',
      product: language === 'tamil' ? 'கரும்பு' : 'Sugarcane',
      farmer: language === 'tamil' ? 'ராஜா விவசாயி' : 'Raja Farmer',
      quantity: 10,
      amount: 18000,
      status: 'shipped',
      orderDate: '2024-12-20'
    }
  ];

  const favoriteFarmers = [
    {
      id: 1,
      name: language === 'tamil' ? 'குமார் விவசாயி' : 'Kumar Farmer',
      district: 'Thanjavur',
      rating: 4.5,
      products: 5
    },
    {
      id: 2,
      name: language === 'tamil' ? 'ராஜா விவசாயி' : 'Raja Farmer',
      district: 'Madurai',
      rating: 4.2,
      products: 3
    }
  ];

  const districts = [
    { id: 'thanjavur', name: language === 'tamil' ? 'தஞ்சாவூர்' : 'Thanjavur' },
    { id: 'madurai', name: language === 'tamil' ? 'மதுரை' : 'Madurai' },
    { id: 'erode', name: language === 'tamil' ? 'ஈரோடு' : 'Erode' },
    { id: 'salem', name: language === 'tamil' ? 'சேலம்' : 'Salem' }
  ];

  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !selectedDistrict || product.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  const renderCatalog = () => (
    <div>
      {/* Search and Filter */}
      <div className="card mb-4">
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('search')}
                </span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                placeholder={language === 'tamil' ? 'பொருள் அல்லது விவசாயி பெயர்' : 'Product or farmer name'}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label className="form-label">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('district')}
                </span>
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="form-select"
              >
                <option value="">
                  {language === 'tamil' ? 'அனைத்து மாவட்டங்களும்' : 'All districts'}
                </option>
                {districts.map(district => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="card">
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
              <p className="text-secondary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('district')}: {product.district}
                </span>
              </p>
              <p className="text-secondary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('quantity')}: {product.quantity} {product.unit}
                </span>
              </p>
              <p className="text-primary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  ₹{product.price.toLocaleString()}/{product.unit}
                </span>
              </p>
              <p className="text-secondary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('grade')}: {product.grade}
                </span>
              </p>
              <div className="d-flex align-center">
                <span className="text-warning mr-1">⭐</span>
                <span>{product.rating}</span>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary flex-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'ஆர்டர் செய்' : 'Order'}
                </span>
              </button>
              <button className="btn btn-outline">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'அரட்டை' : 'Chat'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <h3 className="mb-4">
        <span className={language === 'tamil' ? 'tamil' : ''}>
          {language === 'tamil' ? 'ஆர்டர் வரலாறு' : 'Order History'}
        </span>
      </h3>

      <div className="card">
        {orderHistory.map(order => (
          <div key={order.id} className="d-flex justify-between align-center p-3 border-bottom">
            <div>
              <h5 className="mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {order.id}
                </span>
              </h5>
              <p className="text-secondary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {order.product} - {order.farmer}
                </span>
              </p>
              <p className="mb-0">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'அளவு' : 'Quantity'}: {order.quantity} {language === 'tamil' ? 'குவிண்டல்' : 'quintal'}
                </span>
              </p>
            </div>
            <div className="text-right">
              <h5 className="text-primary mb-1">₹{order.amount.toLocaleString()}</h5>
              <span className={`badge ${order.status === 'delivered' ? 'bg-success' : 'bg-warning'}`}>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t(order.status)}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div>
      <h3 className="mb-4">
        <span className={language === 'tamil' ? 'tamil' : ''}>
          {language === 'tamil' ? 'பிடித்த விவசாயிகள்' : 'Favorite Farmers'}
        </span>
      </h3>

      <div className="grid grid-2 gap-4">
        {favoriteFarmers.map(farmer => (
          <div key={farmer.id} className="card">
            <div className="d-flex justify-between align-start">
              <div>
                <h4 className="mb-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {farmer.name}
                  </span>
                </h4>
                <p className="text-secondary mb-1">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('district')}: {farmer.district}
                  </span>
                </p>
                <p className="text-secondary mb-1">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {t('products')}: {farmer.products}
                  </span>
                </p>
                <div className="d-flex align-center">
                  <span className="text-warning mr-1">⭐</span>
                  <span>{farmer.rating}</span>
                </div>
              </div>
              <button className="btn btn-outline btn-small">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'பார்க்க' : 'View'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPriceComparison = () => (
    <div>
      <h3 className="mb-4">
        <span className={language === 'tamil' ? 'tamil' : ''}>
          {language === 'tamil' ? 'விலை ஒப்பீடு' : 'Price Comparison'}
        </span>
      </h3>

      <div className="card">
        <div className="d-flex justify-between align-center p-3 border-bottom">
          <div>
            <h5 className="mb-1">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'அரிசி விலைகள்' : 'Rice Prices'}
              </span>
            </h5>
            <p className="text-secondary mb-0">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                சராசரி: ₹2,500/குவிண்டல்
              </span>
            </p>
          </div>
          <div className="text-success">📈 +5%</div>
        </div>

        <div className="d-flex justify-between align-center p-3 border-bottom">
          <div>
            <h5 className="mb-1">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'கரும்பு விலைகள்' : 'Sugarcane Prices'}
              </span>
            </h5>
            <p className="text-secondary mb-0">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                சராசரி: ₹1,800/குவிண்டல்
              </span>
            </p>
          </div>
          <div className="text-secondary">➡️ 0%</div>
        </div>

        <div className="d-flex justify-between align-center p-3">
          <div>
            <h5 className="mb-1">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'மஞ்சள் விலைகள்' : 'Turmeric Prices'}
              </span>
            </h5>
            <p className="text-secondary mb-0">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                சராசரி: ₹12,000/குவிண்டல்
              </span>
            </p>
          </div>
          <div className="text-success">📈 +8%</div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'catalog', label: language === 'tamil' ? 'பொருட்கள்' : 'Catalog', icon: '🛒' },
    { id: 'orders', label: language === 'tamil' ? 'ஆர்டர்கள்' : 'Orders', icon: '📋' },
    { id: 'favorites', label: language === 'tamil' ? 'பிடித்தவை' : 'Favorites', icon: '❤️' },
    { id: 'comparison', label: language === 'tamil' ? 'ஒப்பீடு' : 'Comparison', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-light">
      <Header />
      
      <main className="container py-4">
        {/* Welcome Section */}
        <div className="card mb-4">
          <div className="d-flex justify-between align-center">
            <div>
              <h2 className="mb-2">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('welcome')}, {user?.name}!
                </span>
              </h2>
              <p className="text-secondary mb-0">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil'
                    ? 'நேரடியாக விவசாயிகளிடமிருந்து வாங்கவும்'
                    : 'Buy directly from farmers'
                  }
                </span>
              </p>
            </div>
            <div className="text-primary" style={{ fontSize: '3rem' }}>🛒</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card mb-4">
          <div className="d-flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'catalog' && renderCatalog()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'comparison' && renderPriceComparison()}
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
