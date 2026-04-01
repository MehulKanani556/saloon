import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  User, Calendar, ShieldCheck, Trash2, LogOut, ChevronRight, Home
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

const menuItems = [
  { icon: User, label: 'My Profile', path: '/profile' },
  { icon: Calendar, label: 'Order History', path: '/my-appointments' },
  { icon: ShieldCheck, label: 'Change Password', path: '/change-password' },
  { icon: Trash2, label: 'Delete Account', path: '/delete-account' },
  { icon: LogOut, label: 'Logout', path: 'logout' },
];

export default function UserPanelLayout({ children, title }) {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary/40 selection:text-white font-sans antialiased overflow-hidden">
      <PublicNavbar />

      <main className="flex-1 flex flex-col relative overflow-hidden pt-20 md:pt-24">
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-[180px] -z-10" />

        <div className="container flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 md:px-8 py-8 md:py-12 relative z-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-4 mb-10 text-[9px] font-black uppercase tracking-[0.5em] text-muted/60">
              <Link to="/" className="hover:text-primary flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                <Home size={12} className="text-primary/40" /> <span className="font-luxury ">Threshold</span>
              </Link>
              <div className="w-1.5 h-px bg-white/10" />
              <span className="text-white  tracking-[0.2em] font-luxury">{title}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
              {/* Sidebar Linkage */}
              <aside className="lg:w-80 shrink-0">
                <div className="bg-dark-card backdrop-blur-3xl border border-white/10 rounded-xl p-4 sticky top-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
                  <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      if (item.path === 'logout') {
                        return (
                          <button
                            key={item.label}
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-6 py-4 rounded-xl text-muted/30 hover:bg-red-500/10 hover:text-red-400 transition-all text-[10px] font-black uppercase tracking-[0.3em] text-left mt-4 border-t border-white/5 pt-6 group"
                          >
                            <item.icon size={18} className="opacity-30 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500" />
                            <span className="font-luxury ">{item.label}</span>
                          </button>
                        );
                      }
                      return (
                        <Link
                          key={item.label}
                          to={item.path}
                          className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-500 text-[10px] font-black uppercase tracking-[0.3em] relative group ${isActive
                              ? 'bg-luxury-gradient text-secondary shadow-lg scale-[1.02] ring-1 ring-white/10'
                              : 'text-muted/50 hover:bg-white/[0.03] hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon size={18} className={`${isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all'} duration-500`} />
                            <span className={`${isActive ? 'font-luxury' : ''}`}>{item.label}</span>
                          </div>
                          {isActive && (
                            <motion.div
                              layoutId="active-nav"
                              className="w-1 h-1 rounded-full bg-secondary shadow-[0_0_10px_white]"
                            />
                          )}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              </aside>

              {/* Content */}
              <div className="flex-1 min-w-0">
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

