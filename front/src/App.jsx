import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCurrentUser } from './redux/slices/authSlice'
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
import StaffDashboard from './pages/StaffDashboard'
import Leaves from './pages/Leaves'
import Specializations from './pages/Specializations'
import StaffSettings from './pages/StaffSettings'
import PrivateRoute from './components/PrivateRoute'
import { Toaster } from 'react-hot-toast'
import './index.css'

import Home from './pages/Home'
import PublicServices from './pages/PublicServices'
import Shop from './pages/Shop'
import About from './pages/About'
import BookAppointment from './pages/BookAppointment'
import Contact from './pages/Contact'
import AdminServices from './pages/AdminServices'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import MyAppointments from './pages/MyAppointments'
import ChangePassword from './pages/ChangePassword'
import DeleteAccount from './pages/DeleteAccount'
import ProductDetail from './pages/ProductDetail'
import MyOrders from './pages/MyOrders'

const WrappedLayout = ({ children, isAuthPage, isLandingPage }) => {
  if (isAuthPage || isLandingPage) return <>{children}</>;
  return <Layout>{children}</Layout>;
};

const AppContent = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isLandingPage = ['/', '/services', '/shop', '/about', '/book', '/contact', '/profile', '/my-appointments', '/my-orders', '/change-password', '/delete-account', '/cart', '/wishlist', '/checkout'].some(path => location.pathname === path || location.pathname.startsWith('/product/'));

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <WrappedLayout isAuthPage={isAuthPage} isLandingPage={isLandingPage}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<PublicServices />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute roles={['Admin']}><Dashboard /></PrivateRoute>} />
        <Route path="/admin/appointments" element={<PrivateRoute roles={['Admin']}><Appointments /></PrivateRoute>} />
        <Route path="/admin/services" element={<PrivateRoute roles={['Admin']}><AdminServices /></PrivateRoute>} />
        <Route path="/admin/products" element={<PrivateRoute roles={['Admin']}><AdminProducts /></PrivateRoute>} />
        <Route path="/admin/orders" element={<PrivateRoute roles={['Admin']}><AdminOrders /></PrivateRoute>} />
        <Route path="/admin/staff" element={<PrivateRoute roles={['Admin']}><Staff /></PrivateRoute>} />
        <Route path="/admin/clients" element={<PrivateRoute roles={['Admin']}><Clients /></PrivateRoute>} />
        <Route path="/admin/categories" element={<PrivateRoute roles={['Admin']}><Categories /></PrivateRoute>} />
        <Route path="/admin/sales" element={<PrivateRoute roles={['Admin']}><Sales /></PrivateRoute>} />
        <Route path="/admin/invoices" element={<PrivateRoute roles={['Admin']}><Invoices /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute roles={['Admin']}><Reports /></PrivateRoute>} />
        <Route path="/admin/leaves" element={<PrivateRoute roles={['Admin']}><Leaves /></PrivateRoute>} />
        <Route path="/admin/expertise-approvals" element={<PrivateRoute roles={['Admin']}><Specializations /></PrivateRoute>} />
        <Route path="/admin/settings" element={<PrivateRoute roles={['Admin']}><Settings /></PrivateRoute>} />
        
        {/* Staff Routes */}
        <Route path="/staff/dashboard" element={<PrivateRoute roles={['Staff']}><StaffDashboard /></PrivateRoute>} />
        <Route path="/staff/appointments" element={<PrivateRoute roles={['Staff']}><Appointments /></PrivateRoute>} />
        <Route path="/staff/specialization" element={<PrivateRoute roles={['Staff']}><Specializations /></PrivateRoute>} />
        <Route path="/staff/invoices" element={<PrivateRoute roles={['Staff']}><Invoices /></PrivateRoute>} />
        <Route path="/staff/leaves" element={<PrivateRoute roles={['Staff']}><Leaves /></PrivateRoute>} />
        <Route path="/staff/settings" element={<PrivateRoute roles={['Staff']}><StaffSettings /></PrivateRoute>} />
        

        {/* Client/General Auth Routes */}
        <Route path="/profile" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><Profile /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><Cart /></PrivateRoute>} />
        <Route path="/wishlist" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><Wishlist /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><Checkout /></PrivateRoute>} />
        <Route path="/my-appointments" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><MyAppointments /></PrivateRoute>} />
        <Route path="/my-orders" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><MyOrders /></PrivateRoute>} />
        <Route path="/change-password" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><ChangePassword /></PrivateRoute>} />
        <Route path="/delete-account" element={<PrivateRoute roles={['User', 'Admin', 'Staff']}><DeleteAccount /></PrivateRoute>} />
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
            // background: 'rgba(26, 26, 26, 0.9)',
            // backdropFilter: 'blur(16px)',
            // border: '1px solid rgba(201, 162, 39, 0.2)',
            // boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
            borderRadius: '16px',
            // color: '#FFFFFF',
            fontWeight: '900',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          },
          // success: {
          //   iconTheme: {
          //     primary: '#C9A227',
          //     secondary: '#1A1A1A',
          //   },
          // },
        }}
      />
      <AppContent />
    </Router>
  )
}

export default App

