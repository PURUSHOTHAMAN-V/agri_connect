import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import Header from '../common/Header.jsx';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual API calls
  const stats = {
    totalProducts: 12,
    totalOrders: 8,
    totalEarnings: 45000,
    pendingOrders: 3
  };

  const recentProducts = [
    {
      id: 1,
      name: language === 'tamil' ? 'பொன்னி அரிசி' : 'Ponni Rice',
      quantity: 100,
      unit: 'quintal',
      price: 2500,
      status: 'active'
    },
    {
      id: 2,
      name: language === 'tamil' ? 'கரும்பு' : 'Sugarcane',
      quantity: 50,
      unit: 'quintal',
      price: 1800,
      status: 'active'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD001',
      buyer: language === 'tamil' ? 'ராஜா கடைகள்' : 'Raja Stores',
      product: language === 'tamil' ? 'பொன்னி அரிசி' : 'Ponni Rice',
      quantity: 20,
      amount: 50000,
      status: 'confirmed'
    },
    {
      id: 'ORD002',
      buyer: language === 'tamil' ? 'மதுரை மார்க்கெட்' : 'Madurai Market',
      product: language === 'tamil' ? 'கரும்பு' : 'Sugarcane',
      quantity: 10,
      amount: 18000,
      status: 'pending'
    }
  ];

  const marketTrends = [
    { crop: language === 'tamil' ? 'அரிசி' : 'Rice', price: 2500, trend: 'up' },
    { crop: language === 'tamil' ? 'கரும்பு' : 'Sugarcane', price: 1800, trend: 'stable' },
    { crop: language === 'tamil' ? 'மஞ்சள்' : 'Turmeric', price: 12000, trend: 'up' }
  ];

  const renderOverview = () => (
    <div className="grid grid-2 gap-4">
      {/* Stats Cards */}
      <div className="card">
        <div className="d-flex justify-between align-center">
          <div>
            <h4 className="text-primary mb-1">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {t('totalProducts')}
              </span>
            </h4>
            <h2 className="mb-0">{stats.totalProducts}</h2>
          </div>
          <div className="text-secondary" style={{ fontSize: '2rem' }}>📦</div>
        </div>
      </div>

      <div className="card">
        <div className="d-flex justify-between align-center">
          <div>
            <h4 className="text-primary mb-1">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {t('totalOrders')}
              </span>
            </h4>
            <h2 className="mb-0">{stats.totalOrders}</h2>
          </div>
          <div className="text-secondary" style={{ fontSize: '2rem' }}>📋</div>
        </div>
      </div>

      <div className="card">
        <div className="d-flex justify-between align-center">
          <div>
            <h4 className="text-primary mb-1">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {t('totalEarnings')}
              </span>
            </h4>
            <h2 className="mb-0">₹{stats.totalEarnings.toLocaleString()}</h2>
          </div>
          <div className="text-success" style={{ fontSize: '2rem' }}>💰</div>
        </div>
      </div>

      <div className="card">
        <div className="d-flex justify-between align-center">
          <div>
            <h4 className="text-primary mb-1">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {t('pending')}
              </span>
            </h4>
            <h2 className="mb-0">{stats.pendingOrders}</h2>
          </div>
          <div className="text-warning" style={{ fontSize: '2rem' }}>⏳</div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div>
      <div className="d-flex justify-between align-center mb-4">
        <h3>
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {t('products')}
          </span>
        </h3>
        <button className="btn btn-primary">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {t('addProduct')}
          </span>
        </button>
      </div>

      <div className="grid grid-2 gap-4">
        {recentProducts.map(product => (
          <div key={product.id} className="card">
            <div className="d-flex justify-between align-start">
              <div>
                <h4 className="mb-2">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {product.name}
                  </span>
                </h4>
                <p className="text-secondary mb-1">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'அளவு' : 'Quantity'}: {product.quantity} {product.unit}
                  </span>
                </p>
                <p className="text-primary mb-0">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    ₹{product.price}/{product.unit}
                  </span>
                </p>
              </div>
              <div className="text-success">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {t('active')}
                </span>
              </div>
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
          {language === 'tamil' ? 'சமீபத்திய ஆர்டர்கள்' : 'Recent Orders'}
        </span>
      </h3>

      <div className="card">
        {recentOrders.map(order => (
          <div key={order.id} className="d-flex justify-between align-center p-3 border-bottom">
            <div>
              <h5 className="mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {order.id}
                </span>
              </h5>
              <p className="text-secondary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {order.buyer} - {order.product}
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
              <span className={`badge ${order.status === 'confirmed' ? 'bg-success' : 'bg-warning'}`}>
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

  const renderMarketTrends = () => (
    <div>
      <h3 className="mb-4">
        <span className={language === 'tamil' ? 'tamil' : ''}>
          {t('marketTrends')}
        </span>
      </h3>

      <div className="card">
        {marketTrends.map((trend, index) => (
          <div key={index} className="d-flex justify-between align-center p-3 border-bottom">
            <div>
              <h5 className="mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {trend.crop}
                </span>
              </h5>
              <p className="text-secondary mb-0">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  ₹{trend.price.toLocaleString()}/{language === 'tamil' ? 'குவிண்டல்' : 'quintal'}
                </span>
              </p>
            </div>
            <div className={`text-${trend.trend === 'up' ? 'success' : 'secondary'}`}>
              {trend.trend === 'up' ? '📈' : '➡️'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: language === 'tamil' ? 'கண்ணோட்டம்' : 'Overview', icon: '📊' },
    { id: 'products', label: t('products'), icon: '📦' },
    { id: 'orders', label: language === 'tamil' ? 'ஆர்டர்கள்' : 'Orders', icon: '📋' },
    { id: 'trends', label: t('marketTrends'), icon: '📈' }
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
                    ? 'உங்கள் விவசாய வணிகத்தை நிர்வகிக்கவும்'
                    : 'Manage your agricultural business'
                  }
                </span>
              </p>
            </div>
            <div className="text-primary" style={{ fontSize: '3rem' }}>👨‍🌾</div>
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'trends' && renderMarketTrends()}
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
