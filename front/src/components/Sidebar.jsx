import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck2,
  Scissors,
  LayoutGrid,
  Users,
  UserSquare2,
  TrendingUp,
  Settings,
  Menu,
  X,
  ChevronRight,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import Logo from '../assets/logo.png';

const adminItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: CalendarCheck2, label: 'Bookings', path: '/admin/appointments' },
  { icon: Scissors, label: 'Service List', path: '/admin/services' },
  { icon: LayoutGrid, label: 'Category', path: '/admin/categories' },
  { icon: Users, label: 'Staff Members', path: '/admin/staff' },
  { icon: UserSquare2, label: 'Customers', path: '/admin/clients' },
  { icon: TrendingUp, label: 'Business Report', path: '/admin/sales' },
  { icon: FileText, label: 'Bills', path: '/admin/invoices' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const staffItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/staff/dashboard' },
  { icon: CalendarCheck2, label: 'Appointments', path: '/staff/appointments' },
];

const userItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/profile' },
  { icon: CalendarCheck2, label: 'Appointments', path: '/my-appointments' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerMode, setIsDrawerMode] = useState(window.innerWidth < 1280);
  const { userInfo } = useSelector((state) => state.auth);

  const sidebarItems = 
    userInfo?.role === 'Admin' ? adminItems : 
    userInfo?.role === 'Staff' ? staffItems : 
    userItems;

  useEffect(() => {
    const handleResize = () => setIsDrawerMode(window.innerWidth < 1280);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarVariants = {
    open: { x: 0, opacity: 1, width: 280 },
    closed: { x: -280, opacity: 0, width: 0 },
    desktop: { x: 0, opacity: 1, width: isCollapsed ? 100 : 280 }
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={isDrawerMode ? (isOpen ? 'open' : 'closed') : 'desktop'}
        variants={sidebarVariants}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 1
        }}
        className={`h-screen bg-secondary border-r border-white/5 flex flex-col p-4 z-[110] fixed xl:sticky top-0 overflow-hidden ${isDrawerMode && !isOpen ? 'pointer-events-none' : ''}`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12 px-2 mt-4 min-h-[40px]">
          <AnimatePresence mode="wait">
            {(!isCollapsed || isDrawerMode) && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <img src={Logo} alt="Logo" className="h-10 w-auto object-contain brightness-0 invert shadow-primary/20 drop-shadow-[0_0_8px_rgba(201,162,39,0.2)]" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            layout
            onClick={() => isDrawerMode ? setIsOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-2.5 bg-background border border-white/5 rounded-2xl shadow-premium text-primary hover:scale-105 active:scale-95 transition-all group"
          >
            {isCollapsed && !isDrawerMode ? <Menu size={20} strokeWidth={2.5} /> : <X size={20} className="text-primary" strokeWidth={2.5} />}
          </motion.button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 px-1 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isDrawerMode && setIsOpen(false)}
            >
              {({ isActive }) => (
                <div className={`
                  flex items-center ${(isCollapsed && !isDrawerMode) ? 'justify-center' : 'gap-4'} px-4 py-4 rounded-2xl transition-all duration-300 group relative
                  ${isActive
                    ? 'bg-primary text-secondary shadow-xl shadow-primary/10'
                    : 'text-muted hover:bg-white/5 hover:text-white'
                  }
                `}>
                  <item.icon size={20} strokeWidth={2} className="shrink-0" />

                  <AnimatePresence mode="wait">
                    {(!isCollapsed || isDrawerMode) && (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {(!isCollapsed || isDrawerMode) && (
                    <ChevronRight
                      size={14}
                      strokeWidth={3}
                      className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity"
                    />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile Footer */}
        <div className="mt-auto p-1">
          <motion.div
            layout
            className={`
              flex items-center gap-3 p-3 rounded-2xl bg-background border border-white/5 shadow-premium overflow-hidden
              ${(isCollapsed && !isDrawerMode) ? 'justify-center border-none' : ''}
            `}
          >
            <div className="w-12 h-12 rounded-2xl bg-luxury-gradient p-[1px] shadow-lg shrink-0">
              <div className="w-full h-full rounded-2xl bg-secondary overflow-hidden flex items-center justify-center p-[2px]">
                <img
                  src={userInfo?.avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${userInfo?.name || 'Artisan'}`}
                  alt="Admin Profile"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 rounded-2xl"
                />
              </div>
            </div>

            <AnimatePresence>
              {(!isCollapsed || isDrawerMode) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="overflow-hidden min-w-[120px]"
                >
                  <p className="text-xs font-black text-primary truncate uppercase tracking-tight mb-1 leading-none">{userInfo?.name || 'Artisan'}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <p className="text-[9px] font-black text-muted truncate uppercase tracking-[0.2em]">{userInfo?.role || 'Staff'}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

