import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    if (!dashboardData) return null;

    const { overview } = dashboardData;
    
    return (
      <div className="grid grid-2 gap-4">
        <div className="card">
          <div className="d-flex justify-between align-center">
            <div>
              <h4 className="text-primary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'மொத்த பயனர்கள்' : 'Total Users'}
                </span>
              </h4>
              <h2 className="mb-0">{overview.total_users}</h2>
            </div>
            <div className="text-primary" style={{ fontSize: '2rem' }}>👥</div>
          </div>
        </div>

        <div className="card">
          <div className="d-flex justify-between align-center">
            <div>
              <h4 className="text-primary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'விவசாயிகள்' : 'Farmers'}
                </span>
              </h4>
              <h2 className="mb-0">{overview.total_farmers}</h2>
            </div>
            <div className="text-success" style={{ fontSize: '2rem' }}>👨‍🌾</div>
          </div>
        </div>

        <div className="card">
          <div className="d-flex justify-between align-center">
            <div>
              <h4 className="text-primary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'வாங்குபவர்கள்' : 'Buyers'}
                </span>
              </h4>
              <h2 className="mb-0">{overview.total_buyers}</h2>
            </div>
            <div className="text-info" style={{ fontSize: '2rem' }}>🛒</div>
          </div>
        </div>

        <div className="card">
          <div className="d-flex justify-between align-center">
            <div>
              <h4 className="text-primary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'மொத்த பொருட்கள்' : 'Total Products'}
                </span>
              </h4>
              <h2 className="mb-0">{overview.total_products}</h2>
            </div>
            <div className="text-warning" style={{ fontSize: '2rem' }}>📦</div>
          </div>
        </div>

        <div className="card">
          <div className="d-flex justify-between align-center">
            <div>
              <h4 className="text-primary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'மொத்த ஆர்டர்கள்' : 'Total Orders'}
                </span>
              </h4>
              <h2 className="mb-0">{overview.total_orders}</h2>
            </div>
            <div className="text-secondary" style={{ fontSize: '2rem' }}>📋</div>
          </div>
        </div>

        <div className="card">
          <div className="d-flex justify-between align-center">
            <div>
              <h4 className="text-primary mb-1">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'மொத்த வருவாய்' : 'Total Revenue'}
                </span>
              </h4>
              <h2 className="mb-0">₹{overview.total_revenue?.toLocaleString() || 0}</h2>
            </div>
            <div className="text-success" style={{ fontSize: '2rem' }}>💰</div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecentActivity = () => {
    if (!dashboardData?.recent_activity) return null;

    return (
      <div className="card">
        <h3 className="mb-4">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'சமீபத்திய செயல்பாடு' : 'Recent Activity'}
          </span>
        </h3>
        
        <div className="space-y-3">
          {dashboardData.recent_activity.map((order, index) => (
            <div key={index} className="d-flex justify-between align-center p-3 border-bottom">
              <div>
                <h5 className="mb-1">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {order.id}
                  </span>
                </h5>
                <p className="text-secondary mb-1">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {order.buyer?.name} → {order.farmer?.name}
                  </span>
                </p>
                <p className="text-secondary mb-0">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'தேதி' : 'Date'}: {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <h5 className="text-primary mb-1">₹{order.total_amount?.toLocaleString()}</h5>
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
  };

  const renderMonthlyStats = () => {
    if (!dashboardData?.monthly_stats) return null;

    return (
      <div className="card">
        <h3 className="mb-4">
          <span className={language === 'tamil' ? 'tamil' : ''}>
            {language === 'tamil' ? 'மாதாந்திர புள்ளிவிவரங்கள்' : 'Monthly Statistics'}
          </span>
        </h3>
        
        <div className="space-y-3">
          {dashboardData.monthly_stats.map((stat, index) => (
            <div key={index} className="d-flex justify-between align-center p-3 border-bottom">
              <div>
                <h5 className="mb-1">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {new Date(stat.month).toLocaleDateString('en-IN', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </h5>
                <p className="text-secondary mb-0">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'ஆர்டர்கள்' : 'Orders'}: {stat.orders}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <h5 className="text-primary mb-0">
                  ₹{stat.revenue?.toLocaleString() || 0}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabs = [
    { 
      id: 'overview', 
      label: language === 'tamil' ? 'கண்ணோட்டம்' : 'Overview', 
      icon: '📊' 
    },
    { 
      id: 'activity', 
      label: language === 'tamil' ? 'செயல்பாடு' : 'Activity', 
      icon: '📈' 
    },
    { 
      id: 'analytics', 
      label: language === 'tamil' ? 'பகுப்பாய்வு' : 'Analytics', 
      icon: '📊' 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <div className="container py-4">
          <div className="d-flex justify-center align-center" style={{ minHeight: '50vh' }}>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="container py-4">
        {/* Header */}
        <div className="card mb-4">
          <div className="d-flex justify-between align-center">
            <div>
              <h2 className="mb-2">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'நிர்வாக டாஷ்போர்டு' : 'Admin Dashboard'}
                </span>
              </h2>
              <p className="text-secondary mb-0">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil'
                    ? 'Direct AgriConnect TN நிர்வாக கட்டுப்பாடு'
                    : 'Direct AgriConnect TN Administration'
                  }
                </span>
              </p>
            </div>
            <div className="text-primary" style={{ fontSize: '3rem' }}>⚙️</div>
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
          {activeTab === 'activity' && renderRecentActivity()}
          {activeTab === 'analytics' && renderMonthlyStats()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
