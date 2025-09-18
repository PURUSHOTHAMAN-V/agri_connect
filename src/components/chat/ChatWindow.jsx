import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ChatWindow = ({ isOpen, onClose, otherUser, product }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock messages - replace with real API
  useEffect(() => {
    if (isOpen) {
      const mockMessages = [
        {
          id: 1,
          sender: otherUser?.id || 'other',
          text: language === 'tamil' 
            ? 'வணக்கம்! இந்த பொருளைப் பற்றி கேள்விகள் உள்ளனவா?' 
            : 'Hello! Do you have any questions about this product?',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text'
        },
        {
          id: 2,
          sender: user?.id || 'current',
          text: language === 'tamil' 
            ? 'ஆம், விலை பற்றி பேசலாமா?' 
            : 'Yes, can we discuss the price?',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text'
        },
        {
          id: 3,
          sender: otherUser?.id || 'other',
          text: language === 'tamil' 
            ? 'நிச்சயமாக! நீங்கள் எவ்வளவு அளவு வாங்க விரும்புகிறீர்கள்?' 
            : 'Of course! How much quantity do you want to buy?',
          timestamp: new Date(Date.now() - 900000),
          type: 'text'
        }
      ];
      setMessages(mockMessages);
    }
  }, [isOpen, otherUser, user, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user?.id || 'current',
        text: newMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate reply
        const reply = {
          id: Date.now() + 1,
          sender: otherUser?.id || 'other',
          text: language === 'tamil' 
            ? 'நன்றி! நான் விரைவில் பதிலளிப்பேன்.' 
            : 'Thank you! I will reply soon.',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (message) => {
    return message.sender === user?.id;
  };

  const quickReplies = [
    language === 'tamil' ? 'விலை பற்றி பேசலாமா?' : 'Can we discuss the price?',
    language === 'tamil' ? 'அளவு குறைக்கலாமா?' : 'Can you reduce the quantity?',
    language === 'tamil' ? 'விநியோக கட்டணம் எவ்வளவு?' : 'What is the delivery charge?',
    language === 'tamil' ? 'தரம் பற்றி விவரங்கள் தரலாமா?' : 'Can you provide quality details?'
  ];

  return (
    <div className={`chat-window ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <div className="d-flex justify-between align-center">
          <div>
            <h4 className="mb-1">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {otherUser?.name || 'User'}
              </span>
            </h4>
            <p className="text-secondary mb-0">
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {product?.name || 'Product'}
              </span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-outline btn-small"
            aria-label={t('close')}
          >
            ×
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${isOwnMessage(message) ? 'own' : 'other'}`}
          >
            <div className="message-content">
              <p className="message-text">
                <span className={language === 'tamil' ? 'tamil' : ''}>
                  {message.text}
                </span>
              </p>
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message other">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="quick-replies mb-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              className="btn btn-outline btn-small mr-2 mb-1"
              onClick={() => setNewMessage(reply)}
            >
              <span className={language === 'tamil' ? 'tamil' : ''}>
                {reply}
              </span>
            </button>
          ))}
        </div>
        
        <div className="d-flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input flex-1"
            placeholder={language === 'tamil' ? 'செய்தியை தட்டச்சு செய்யவும்...' : 'Type your message...'}
            rows="2"
          />
          <button 
            onClick={handleSendMessage}
            className="btn btn-primary"
            disabled={!newMessage.trim()}
          >
            <span className={language === 'tamil' ? 'tamil' : ''}>
              {t('sendMessage')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

