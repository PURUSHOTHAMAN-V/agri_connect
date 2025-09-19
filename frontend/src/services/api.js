import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agriConnectToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('agriConnectToken');
      localStorage.removeItem('agriConnectUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Refresh token
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  
  // Get user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Logout
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  // Get user profile
  getProfile: () => api.get('/users/profile'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/users/profile', userData),
  
  // Upload profile image
  uploadProfileImage: (imageUrl) => api.post('/users/profile-image', { image_url: imageUrl }),
  
  // Update location
  updateLocation: (location) => api.put('/users/location', location),
  
  // Get nearby users
  getNearbyUsers: (params) => api.get('/users/nearby', { params }),
  
  // Get user statistics
  getUserStats: () => api.get('/users/stats'),
  
  // Deactivate account
  deactivateAccount: () => api.delete('/users/account'),
};

// Products API
export const productsAPI = {
  // Get all products with filters
  getProducts: (params) => api.get('/products', { params }),
  
  // Get single product
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Create new product
  createProduct: (productData) => api.post('/products', productData),
  
  // Update product
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Get farmer's products
  getFarmerProducts: (farmerId, params) => api.get(`/products/farmer/${farmerId}`, { params }),
};

// Orders API
export const ordersAPI = {
  // Create new order
  createOrder: (orderData) => api.post('/orders', orderData),
  
  // Get user's orders
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  
  // Get single order
  getOrder: (id) => api.get(`/orders/${id}`),
  
  // Update order status
  updateOrderStatus: (id, statusData) => api.patch(`/orders/${id}/status`, statusData),
  
  // Update payment status
  updatePaymentStatus: (id, paymentData) => api.patch(`/orders/${id}/payment`, paymentData),
};

// Chat API
export const chatAPI = {
  // Send message
  sendMessage: (messageData) => api.post('/chat/send', messageData),
  
  // Get conversation
  getConversation: (otherUserId, params) => api.get(`/chat/conversation/${otherUserId}`, { params }),
  
  // Get user's conversations
  getConversations: (params) => api.get('/chat/conversations', { params }),
  
  // Mark messages as read
  markAsRead: (senderId) => api.patch('/chat/mark-read', { sender_id: senderId }),
  
  // Get unread count
  getUnreadCount: () => api.get('/chat/unread-count'),
};

// ML/AI API
export const mlAPI = {
  // Get price predictions
  getPricePredictions: (cropId, params) => api.get(`/ml/predictions/${cropId}`, { params }),
  
  // Get price history
  getPriceHistory: (cropId, params) => api.get(`/ml/price-history/${cropId}`, { params }),
  
  // Get crop recommendations
  getCropRecommendations: (params) => api.get('/ml/recommendations', { params }),
  
  // Get market analytics
  getMarketAnalytics: (params) => api.get('/ml/analytics', { params }),
  
  // Generate price prediction
  generatePricePrediction: (predictionData) => api.post('/ml/predict-price', predictionData),
};

// Admin API
export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Get all users
  getUsers: (params) => api.get('/admin/users', { params }),
  
  // Get user details
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  
  // Update user verification
  updateUserVerification: (id, verificationData) => api.patch(`/admin/users/${id}/verify`, verificationData),
  
  // Update user status
  updateUserStatus: (id, statusData) => api.patch(`/admin/users/${id}/status`, statusData),
  
  // Get all products
  getProducts: (params) => api.get('/admin/products', { params }),
  
  // Get all orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  
  // Get system analytics
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        details: error.response.data?.details || null,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        details: null,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        details: null,
      };
    }
  },
  
  // Format API response
  formatResponse: (response) => {
    return {
      success: true,
      data: response.data?.data || response.data,
      message: response.data?.message || 'Success',
    };
  },
  
  // Set auth token
  setAuthToken: (token) => {
    localStorage.setItem('agriConnectToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  // Remove auth token
  removeAuthToken: () => {
    localStorage.removeItem('agriConnectToken');
    localStorage.removeItem('agriConnectUser');
    delete api.defaults.headers.common['Authorization'];
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('agriConnectToken');
  },
  
  // Get stored user data
  getStoredUser: () => {
    const userData = localStorage.getItem('agriConnectUser');
    return userData ? JSON.parse(userData) : null;
  },
  
  // Store user data
  storeUser: (userData) => {
    localStorage.setItem('agriConnectUser', JSON.stringify(userData));
  },
};

export default api;
