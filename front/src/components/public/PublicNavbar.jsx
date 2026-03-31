import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, LogIn, User, Calendar, Shield, LogOut, ChevronDown } from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';
import Logo from '../../assets/logo.png';

const PublicNavbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // On pages other than home, we want the solid navbar appearance by default
  const isHome = location.pathname === '/';
  const forceSolid = !isHome;
  const showSolid = isScrolled || forceSolid;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event) => {
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleAuthRedirect = () => {
    if (!userInfo) navigate('/login');
    else if (userInfo.role === 'Admin') navigate('/admin/dashboard');
    else if (userInfo.role === 'Staff') navigate('/staff/dashboard');
    else navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${showSolid
      ? 'bg-secondary/90 backdrop-blur-md shadow-2xl py-2'
      : 'bg-transparent py-2'
      }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={Logo}
            alt="Glow & Elegance"
            className={`h-8 md:h-12 w-auto object-contain transition-all duration-500 brightness-0 invert drop-shadow-[0_0_8px_rgba(201,162,39,0.2)]`}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {['Home', 'Services', 'About', 'Contact', 'Book'].map((link) => (
            <Link
              key={link}
              to={link === 'Home' ? '/' : link === 'Book' ? '/book' : `/${link.toLowerCase()}`}
              className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-all hover:text-primary ${showSolid ? 'text-white' : 'text-white/80'
                }`}
            >
              {link === 'Book' ? 'Book Appointment' : link}
            </Link>
          ))}

          {userInfo ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 p-1 pr-3 rounded-full border transition-all ${showSolid
                  ? 'border-white/10 bg-white/5 hover:bg-white/10'
                  : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                  }`}
              >
                <div className="w-8 h-8 rounded-full bg-luxury-gradient flex items-center justify-center text-secondary font-black text-xs shadow-lg">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">Menu</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-secondary rounded-2xl shadow-premium border border-white/10 overflow-hidden"
                  >
                    <div className="p-4 bg-white/5 border-b border-white/5">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Authenticated Identity</p>
                      <p className="text-sm font-black text-white truncate">{userInfo.name}</p>
                      <p className="text-[10px] text-muted truncate">{userInfo.email}</p>
                    </div>

                    <div className="p-2">
                      {(userInfo.role === 'Admin' || userInfo.role === 'Staff') && (
                        <button
                          onClick={() => { setIsProfileOpen(false); navigate(userInfo.role === 'Admin' ? '/admin/dashboard' : '/staff/dashboard'); }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white transition-colors group"
                        >
                          <Shield size={16} className="group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-left">Admin Terminal</span>
                        </button>
                      )}

                      <button
                        onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white transition-colors group"
                      >
                        <User size={16} className="group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-left">Profile Section</span>
                      </button>

                      <button
                        onClick={() => { setIsProfileOpen(false); navigate('/my-appointments'); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white transition-colors group"
                      >
                        <Calendar size={16} className="group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-left">My Appointments</span>
                      </button>

                      <hr className="my-1 border-white/5" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors group"
                      >
                        <LogOut size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-left">Logout Protocol</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="premium-button-primary !py-2 !px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group shadow-xl shadow-primary/10"
            >
              <LogIn size={14} className="group-hover:translate-x-1 transition-transform" />
              Access Portal
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-secondary border-b border-white/5 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {['Home', 'Services', 'About', 'Contact', 'Book Appointment'].map((link) => (
                <Link
                  key={link}
                  to={link === 'Home' ? '/' : link === 'Book Appointment' ? '/book' : `/${link.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-black text-white uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {link}
                </Link>
              ))}
              <hr className="border-slate-100 dark:border-white/5 my-2" />
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleAuthRedirect();
                }}
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-muted text-left flex items-center gap-2"
              >
                <LogIn size={14} className="text-primary" />
                {userInfo ? (userInfo.role === 'Admin' ? 'Go to Admin Terminal' : 'Proceed to Portal') : 'Access Portal'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PublicNavbar;
