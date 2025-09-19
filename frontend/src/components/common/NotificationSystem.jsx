import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const NotificationSystem = () => {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Mock notifications - replace with real API
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'order',
        title: language === 'tamil' ? 'புதிய ஆர்டர்' : 'New Order',
        message: language === 'tamil' ? 'ராஜா கடைகளிடமிருந்து புதிய ஆர்டர் பெறப்பட்டது' : 'New order received from Raja Stores',
        timestamp: new Date(Date.now() - 300000),
        read: false
      },
      {
        id: 2,
        type: 'price',
        title: language === 'tamil' ? 'விலை மாற்றம்' : 'Price Update',
        message: language === 'tamil' ? 'அரிசி விலை 5% உயர்ந்துள்ளது' : 'Rice price has increased by 5%',
        timestamp: new Date(Date.now() - 600000),
        read: false
      },
      {
        id: 3,
        type: 'chat',
        title: language === 'tamil' ? 'புதிய செய்தி' : 'New Message',
        message: language === 'tamil' ? 'குமார் விவசாயியிடமிருந்து புதிய செய்தி' : 'New message from Kumar Farmer',
        timestamp: new Date(Date.now() - 900000),
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, [language]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'price': return '💰';
      case 'chat': return '💬';
      case 'system': return '🔔';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order': return 'text-success';
      case 'price': return 'text-warning';
      case 'chat': return 'text-primary';
      case 'system': return 'text-secondary';
      default: return 'text-secondary';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return language === 'tamil' ? 'இப்போது' : 'Just now';
    if (minutes < 60) return language === 'tamil' ? `${minutes} நிமிடங்களுக்கு முன்` : `${minutes} minutes ago`;
    if (hours < 24) return language === 'tamil' ? `${hours} மணி நேரங்களுக்கு முன்` : `${hours} hours ago`;
    return language === 'tamil' ? `${days} நாட்களுக்கு முன்` : `${days} days ago`;
  };

  return (
    <div className="notification-system">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline position-relative"
        aria-label={language === 'tamil' ? 'அறிவிப்புகள்' : 'Notifications'}
      >
        <span className="mr-2">🔔</span>
        <span className={language === 'tamil' ? 'tamil' : ''}>
          {language === 'tamil' ? 'அறிவிப்புகள்' : 'Notifications'}
        </span>
        {unreadCount > 0 && (
          <span className="badge bg-error position-absolute" style={{ top: '-5px', right: '-5px' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h4 className="mb-2">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {language === 'tamil' ? 'அறிவிப்புகள்' : 'Notifications'}
              </span>
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-outline btn-small"
              >
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'அனைத்தையும் படித்ததாக குறிக்கவும்' : 'Mark all as read'}
                </span>
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-secondary">
                  <span className={language === 'tamil' ? 'tamil' : ''}>
                    {language === 'tamil' ? 'அறிவிப்புகள் எதுவும் இல்லை' : 'No notifications'}
                  </span>
                </p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    <span style={{ fontSize: '1.5rem' }}>
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                  <div className="notification-content">
                    <h6 className={`mb-1 ${getNotificationColor(notification.type)}`}>
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {notification.title}
                      </span>
                    </h6>
                    <p className="mb-1">
                      <span className={language === 'tamil' ? 'tamil' : ''}>
                        {notification.message}
                      </span>
                    </p>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="notification-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-outline btn-small w-100"
              >
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {language === 'tamil' ? 'மூடு' : 'Close'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;

