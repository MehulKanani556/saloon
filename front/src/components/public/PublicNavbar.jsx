import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, LogIn } from 'lucide-react';

const PublicNavbar = () => {
  const { adminInfo } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-white/20 shadow-lg py-1' 
        : 'bg-transparent py-3 md:py-5'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl md:text-2xl transition-transform group-hover:rotate-12">✂</span>
          <h1 className={`text-sm md:text-xl font-black uppercase tracking-[0.2em] transition-colors ${
            isScrolled ? 'text-slate-900 dark:text-white' : 'text-white font-bold drop-shadow-md'
          }`}>
            Glow <span className="text-saloon-500">&</span> Elegance
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {['Home', 'Services', 'About', 'Contact'].map((link) => (
            <Link 
              key={link} 
              to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-saloon-500 ${
                isScrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/80'
              }`}
            >
              {link}
            </Link>
          ))}
          <button 
            onClick={() => navigate(adminInfo ? '/dashboard' : '/login')}
            className="premium-button-primary !py-2 !px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group"
          >
            <LogIn size={14} className="group-hover:translate-x-1 transition-transform" />
            {adminInfo ? 'Dashboard' : 'Book Now'}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} className={isScrolled ? 'text-slate-900' : 'text-white'} />
          ) : (
            <Menu size={24} className={isScrolled ? 'text-slate-900' : 'text-white'} />
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
              {['Home', 'Services', 'About', 'Contact'].map((link) => (
                <Link 
                  key={link} 
                  to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest hover:text-saloon-500 transition-colors"
                >
                  {link}
                </Link>
              ))}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate(adminInfo ? '/dashboard' : '/login');
                }}
                className="premium-button-primary w-full py-4 text-xs font-black uppercase tracking-widest"
              >
                {adminInfo ? 'Go to Dashboard' : 'Book Appointment'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PublicNavbar;
