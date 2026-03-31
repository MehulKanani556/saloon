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
import PrivateRoute from './components/PrivateRoute'
import { Toaster } from 'react-hot-toast'
import './index.css'

import Home from './pages/Home'
import PublicServices from './pages/PublicServices'
import About from './pages/About'
import BookAppointment from './pages/BookAppointment'
import Contact from './pages/Contact'
import AdminServices from './pages/AdminServices'
import Profile from './pages/Profile'
import MyAppointments from './pages/MyAppointments'

const AppContent = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isLandingPage = ['/', '/services', '/about', '/book', '/contact'].includes(location.pathname);

  useEffect(() => {
    // If we're not logged in and not on an auth or landing page, redirect to login
    if (!userInfo && !isAuthPage && !isLandingPage) {
      navigate('/login');
    }
  }, [userInfo, isAuthPage, isLandingPage, navigate]);

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
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute roles={['Admin']}><Dashboard /></PrivateRoute>} />
        <Route path="/admin/appointments" element={<PrivateRoute roles={['Admin']}><Appointments /></PrivateRoute>} />
        <Route path="/admin/services" element={<PrivateRoute roles={['Admin']}><AdminServices /></PrivateRoute>} />
        <Route path="/admin/staff" element={<PrivateRoute roles={['Admin']}><Staff /></PrivateRoute>} />
        <Route path="/admin/clients" element={<PrivateRoute roles={['Admin']}><Clients /></PrivateRoute>} />
        <Route path="/admin/categories" element={<PrivateRoute roles={['Admin']}><Categories /></PrivateRoute>} />
        <Route path="/admin/sales" element={<PrivateRoute roles={['Admin']}><Sales /></PrivateRoute>} />
        <Route path="/admin/invoices" element={<PrivateRoute roles={['Admin']}><Invoices /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute roles={['Admin']}><Reports /></PrivateRoute>} />
        <Route path="/admin/settings" element={<PrivateRoute roles={['Admin']}><Settings /></PrivateRoute>} />

        {/* Staff Routes */}
        <Route path="/staff/dashboard" element={<PrivateRoute roles={['Staff']}><div className="p-10"><h1 className="text-3xl font-black text-slate-800">STAFF DASHBOARD</h1><p className="text-slate-400 mt-4">Welcome back to your workspace.</p></div></PrivateRoute>} />
        <Route path="/staff/appointments" element={<PrivateRoute roles={['Staff']}><Appointments /></PrivateRoute>} />
        
        {/* Client/General Auth Routes */}
        <Route path="/profile" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><Profile /></PrivateRoute>} />
        <Route path="/my-appointments" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><MyAppointments /></PrivateRoute>} />
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
