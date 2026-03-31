import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, LogIn } from 'lucide-react';

const PublicNavbar = () => {
  const { adminInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // On pages other than home, we want the solid navbar appearance by default
  const isHome = location.pathname === '/';
  const forceSolid = !isHome;
  const showSolid = isScrolled || forceSolid;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      showSolid 
        ? 'bg-white/90 dark:bg-slate-930 backdrop-blur-md border-b border-slate-100 dark:border-white/5 shadow-2xl py-1' 
        : 'bg-transparent py-3 md:py-5'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl md:text-2xl transition-transform group-hover:rotate-12">✂</span>
          <h1 className={`text-sm md:text-xl font-black uppercase tracking-[0.2em] transition-colors ${
            showSolid ? 'text-slate-900 dark:text-white' : 'text-white font-bold drop-shadow-md'
          }`}>
            Glow <span className="text-saloon-500">&</span> Elegance
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {['Home', 'Services', 'About', 'Contact', 'Book'].map((link) => (
            <Link 
              key={link} 
              to={link === 'Home' ? '/' : link === 'Book' ? '/book' : `/${link.toLowerCase()}`}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-saloon-500 ${
                showSolid ? 'text-slate-600 dark:text-slate-300' : 'text-white/80'
              }`}
            >
              {link === 'Book' ? 'Book Appointment' : link}
            </Link>
          ))}
          <button 
            onClick={() => navigate(adminInfo ? '/admin/dashboard' : '/login')}
            className={`premium-button-primary !py-2 !px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group ${showSolid ? '' : 'bg-white text-slate-900 border-none'}`}
          >
            <LogIn size={14} className="group-hover:translate-x-1 transition-transform" />
            {adminInfo ? 'Dashboard' : 'Staff Access'}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} className={showSolid ? 'text-slate-900 dark:text-white' : 'text-white'} />
          ) : (
            <Menu size={24} className={showSolid ? 'text-slate-900 dark:text-white' : 'text-white'} />
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
            className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {['Home', 'Services', 'About', 'Contact', 'Book Appointment'].map((link) => (
                <Link 
                  key={link} 
                  to={link === 'Home' ? '/' : link === 'Book Appointment' ? '/book' : `/${link.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest hover:text-saloon-500 transition-colors"
                >
                  {link}
                </Link>
              ))}
              <hr className="border-slate-100 dark:border-white/5 my-2" />
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate(adminInfo ? '/dashboard' : '/login');
                }}
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left flex items-center gap-2"
              >
                <LogIn size={14} />
                {adminInfo ? 'Go to Dashboard' : 'Staff Portal'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PublicNavbar;
