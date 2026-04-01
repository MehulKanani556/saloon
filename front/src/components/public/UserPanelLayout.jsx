import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  User, Calendar, ShieldCheck, Trash2, LogOut, ChevronRight, Home, ShoppingBag, Heart, UserCircle
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

const menuItems = [
  { icon: UserCircle, label: 'My Profile', path: '/profile' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  { icon: ShoppingBag, label: 'My Cart', path: '/cart' },
  { icon: Calendar, label: 'Reservations', path: '/my-appointments' },
  { icon: ShieldCheck, label: 'Change Password', path: '/change-password' },
  { icon: Trash2, label: 'Delete Account', path: '/delete-account' },
];

export default function UserPanelLayout({ children, title, hideSidebar = false }) {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary/40 selection:text-white font-sans antialiased overflow-hidden">
      <PublicNavbar />

      <main className="flex-1 flex flex-col relative overflow-hidden pt-16 md:pt-20">
        {/* Atmosphere */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        
        <div className="container flex-1 mx-auto max-w-7xl">
          <div className="px-4 md:px-6 py-6 md:py-10 relative z-10 flex flex-col h-full">
            
            {/* Breadcrumbs (Condensed) */}
            <div className="flex items-center gap-3 mb-6 text-[9px] font-bold uppercase tracking-[0.2em] text-muted/40">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Home size={10} strokeWidth={2.5} /> Atelier
              </Link>
              <span className="opacity-20">/</span>
              <span className="text-white tracking-widest">{title}</span>
            </div>

            <div className={`flex flex-col lg:flex-row gap-6 md:gap-10 items-start ${hideSidebar ? 'justify-center' : ''}`}>
              {!hideSidebar && (
                <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
                  <div className="bg-secondary/40 backdrop-blur-2xl border border-white/5 rounded-2xl p-3 shadow-xl">
                    <nav className="flex flex-col gap-1">
                      {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.15em] group ${isActive
                                ? 'bg-primary text-secondary shadow-lg scale-[1.02]'
                                : 'text-muted/60 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
                              }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300'}`} />
                              <span>{item.label}</span>
                            </div>
                            {isActive && (
                              <motion.div
                                layoutId="active-dot"
                                className="w-1 h-1 rounded-full bg-secondary"
                              />
                            )}
                          </Link>
                        )
                      })}
                      
                      <div className="h-px bg-white/5 my-2 mx-4" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3.5 px-5 py-3.5 rounded-xl text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-[0.15em] text-left group"
                      >
                        <LogOut size={16} className="opacity-40 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
                        <span>Logout</span>
                      </button>
                    </nav>
                  </div>
                </aside>
              )}

              {/* Main Content Area */}
              <div className="flex-1 w-full min-w-0">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
