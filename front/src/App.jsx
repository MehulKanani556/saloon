import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Staff from './pages/Staff'
import Clients from './pages/Clients'
import Categories from './pages/Categories'
import Sales from './pages/Sales'
import Settings from './pages/Settings'
import Invoices from './pages/Invoices'
import Reports from './pages/Reports'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast'
import './index.css'

import Home from './pages/Home'
import PublicServices from './pages/PublicServices'
import About from './pages/About'
import BookAppointment from './pages/BookAppointment'
import AdminServices from './pages/AdminServices'

const AppContent = () => {
  const { adminInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isLandingPage = ['/', '/services', '/about', '/book'].includes(location.pathname);

  useEffect(() => {
    // If we're not logged in and not on an auth or landing page, redirect to login
    if (!adminInfo && !isAuthPage && !isLandingPage) {
      navigate('/login');
    }
  }, [adminInfo, isAuthPage, isLandingPage, navigate]);

  const WrappedLayout = ({ children }) => {
    if (isAuthPage || isLandingPage) return <>{children}</>;
    return <Layout>{children}</Layout>;
  };

  return (
    <WrappedLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<PublicServices />} />
        <Route path="/about" element={<About />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={adminInfo ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/appointments" element={adminInfo ? <Appointments /> : <Navigate to="/login" />} />
        <Route path="/admin/services" element={adminInfo ? <AdminServices /> : <Navigate to="/login" />} />
        <Route path="/staff" element={adminInfo ? <Staff /> : <Navigate to="/login" />} />
        <Route path="/clients" element={adminInfo ? <Clients /> : <Navigate to="/login" />} />
        <Route path="/categories" element={adminInfo ? <Categories /> : <Navigate to="/login" />} />
        <Route path="/sales" element={adminInfo ? <Sales /> : <Navigate to="/login" />} />
        <Route path="/invoices" element={adminInfo ? <Invoices /> : <Navigate to="/login" />} />
        <Route path="/reports" element={adminInfo ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/settings" element={adminInfo ? <Settings /> : <Navigate to="/login" />} />
      </Routes>
    </WrappedLayout>
  );
};



function App() {
  return (
    <Router>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 104, 187, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(181, 126, 101, 0.2)',
            borderRadius: '16px',
            color: '#334155',
            fontWeight: '700',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }
        }}
      />
      <AppContent />
    </Router>
  )
}

export default App
