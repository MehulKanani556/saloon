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
    <div className="min-h-screen flex flex-col bg-slate-950 text-white selection:bg-saloon-500">
      <PublicNavbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="w-full px-4 lg:px-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 mb-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Link to="/" className="hover:text-saloon-500 flex items-center gap-2">
              <Home size={12} /> Home
            </Link>
            <ChevronRight size={10} />
            <span className="text-white italic">{title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/5 rounded-2xl p-3 sticky top-32">
                <nav className="flex flex-col gap-2">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    if (item.path === 'logout') {
                      return (
                        <button
                          key={item.label}
                          onClick={handleLogout}
                          className="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-black uppercase tracking-widest text-left"
                        >
                          <item.icon size={18} />
                          {item.label}
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-[0.1em] ${
                          isActive 
                            ? 'bg-gradient-to-r from-saloon-500 to-rosegold-500 text-white shadow-lg shadow-saloon-500/20' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon size={18} />
                          {item.label}
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />}
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
      </main>

      <PublicFooter />
    </div>
  );
}
