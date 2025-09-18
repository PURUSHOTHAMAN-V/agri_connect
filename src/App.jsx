import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Header from './components/common/Header.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Register from './components/auth/Register.jsx';
import Loading from './components/common/Loading.jsx';
import Marketplace from './pages/Marketplace.jsx';
import './styles/App.css';

// Lazy load components for better performance
const Login = React.lazy(() => import('./components/auth/Login.jsx'));
const FarmerDashboard = React.lazy(() => import('./components/farmer/FarmerDashboard.jsx'));
const BuyerDashboard = React.lazy(() => import('./components/buyer/BuyerDashboard.jsx'));

// Protected Route Component
const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  // For now, allow access without authentication (you can add auth later)
  return children;
  
  // Uncomment this when you add authentication
  /*
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (userType && user?.type !== userType) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
  */
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  
  if (user?.type === 'farmer') {
    return <FarmerDashboard />;
  } else if (user?.type === 'buyer') {
    return <BuyerDashboard />;
  }
  
  return <Navigate to="/" replace />;
};

// App Component
const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/login" 
                element={
                  <React.Suspense fallback={<Loading />}>
                    <Login />
                  </React.Suspense>
                } 
              />
              <Route 
                path="/marketplace" 
                element={<Marketplace />} 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/farmer/*" 
                element={
                  <ProtectedRoute userType="farmer">
                    <React.Suspense fallback={<Loading />}>
                      <FarmerDashboard />
                    </React.Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/buyer/*" 
                element={
                  <ProtectedRoute userType="buyer">
                    <React.Suspense fallback={<Loading />}>
                      <BuyerDashboard />
                    </React.Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
