import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data on app load
    const savedUser = localStorage.getItem('agriConnectUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('agriConnectUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockUser = {
        id: 'user123',
        type: credentials.userType, // 'farmer' or 'buyer'
        name: credentials.fullName,
        email: credentials.email,
        phone: credentials.phoneNumber,
        location: {
          district: credentials.district,
          taluk: credentials.taluk,
          village: credentials.village
        },
        verification: {
          aadhar: true,
          patta: true,
          bankAccount: true
        },
        language: 'tamil'
      };

      setUser(mockUser);
      localStorage.setItem('agriConnectUser', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockUser = {
        id: `user${Date.now()}`,
        type: userData.userType,
        name: userData.fullName,
        email: userData.email,
        phone: userData.phoneNumber,
        location: {
          district: userData.district,
          taluk: userData.taluk,
          village: userData.village
        },
        verification: {
          aadhar: false,
          patta: false,
          bankAccount: false
        },
        language: 'tamil'
      };

      setUser(mockUser);
      localStorage.setItem('agriConnectUser', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agriConnectUser');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('agriConnectUser', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isFarmer: user?.type === 'farmer',
    isBuyer: user?.type === 'buyer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
