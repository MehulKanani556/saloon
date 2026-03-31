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

const sidebarItems = [
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

export default function Sidebar({ isOpen, setIsOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerMode, setIsDrawerMode] = useState(window.innerWidth < 1280);
  const { adminInfo } = useSelector((state) => state.auth);

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
        className={`h-screen glass-sidebar flex flex-col p-4 z-[110] fixed xl:sticky top-0 overflow-hidden ${isDrawerMode && !isOpen ? 'pointer-events-none' : ''}`}
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
                <img src={Logo} alt="Logo" className="h-10 w-auto object-contain dark:brightness-0 dark:invert" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            layout
            onClick={() => isDrawerMode ? setIsOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm rounded-2xl transition-colors text-rosegold-400 group hover:bg-saloon-500 hover:text-white"
          >
            {isCollapsed && !isDrawerMode ? <Menu size={22} strokeWidth={2.5} /> : <X size={22} strokeWidth={2.5} />}
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
                    ? 'bg-gradient-to-r from-saloon-500 to-saloon-600 text-white border-none'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-saloon-600'
                  }
                `}>
                  <item.icon size={22} strokeWidth={isActive ? 3 : 2} className="shrink-0" />

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
              flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900 border border-white/40 dark:border-white/5 shadow-premium overflow-hidden
              ${(isCollapsed && !isDrawerMode) ? 'justify-center border-none' : ''}
            `}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-saloon-500 to-rosegold-600 p-[2px] shadow-lg shrink-0">
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-800 overflow-hidden">
                <img
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=jaygandhi`}
                  alt="Admin Profile"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
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
                  <p className="text-xs font-black text-rosegold-500 truncate uppercase tracking-tight mb-1">{adminInfo?.name || 'Jay Gandhi'}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[9px] font-black text-slate-400 truncate uppercase tracking-widest">{adminInfo?.role || 'Admin'}</p>
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
