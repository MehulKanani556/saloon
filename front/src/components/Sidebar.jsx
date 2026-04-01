import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  FileText,
  CalendarClock,
  CheckCircle2,
  ShoppingBag,
  ChevronDown,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';
import { IMAGE_URL } from '../utils/BASE_URL';

const adminItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: CalendarCheck2, label: 'Bookings', path: '/admin/appointments' },
  { icon: Scissors, label: 'Service List', path: '/admin/services' },
  { icon: LayoutGrid, label: 'Category', path: '/admin/categories' },
  { 
    icon: ShoppingBag, 
    label: 'Inventory', 
    path: '/admin/inventory',
    children: [
      { label: 'Products', path: '/admin/products' },
      { label: 'Orders', path: '/admin/orders' },
    ]
  },
  { icon: Users, label: 'Staff Members', path: '/admin/staff' },
  { icon: UserSquare2, label: 'Customers', path: '/admin/clients' },
  { icon: TrendingUp, label: 'Business Report', path: '/admin/sales' },
  { icon: FileText, label: 'Bills', path: '/admin/invoices' },
  { icon: CalendarClock, label: 'Leaves', path: '/admin/leaves' },
  { icon: CheckCircle2, label: 'Expertise Approvals', path: '/admin/expertise-approvals' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const staffItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/staff/dashboard' },
  { icon: CalendarCheck2, label: 'Appointments', path: '/staff/appointments' },
  { icon: Scissors, label: 'Expertise', path: '/staff/specialization' },
  { icon: FileText, label: 'Bills', path: '/staff/invoices' },
  { icon: CalendarClock, label: 'My Leaves', path: '/staff/leaves' },
  { icon: Settings, label: 'Settings', path: '/staff/settings' },
];

const userItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/profile' },
  { icon: CalendarCheck2, label: 'Appointments', path: '/my-appointments' },
];

function SidebarItem({ item, isCollapsed, isDrawerMode, setIsOpen }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = location.pathname.startsWith(item.path);

  return (
    <>
      <div className="relative group">
        <NavLink
          to={hasChildren ? '#' : item.path}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            } else if (isDrawerMode) {
              setIsOpen(false);
            }
          }}
        >
          <div className={`
            flex items-center ${(isCollapsed && !isDrawerMode) ? 'justify-center' : 'gap-3'} px-3.5 py-3.5 rounded-xl transition-all duration-300 relative
            ${isActive && !hasChildren
              ? 'bg-primary text-secondary shadow-lg shadow-primary/10'
              : isActive && hasChildren
                ? 'bg-white/5 text-white'
                : 'text-muted hover:bg-white/5 hover:text-white'
            }
          `}>
            <item.icon size={18} strokeWidth={2.5} className="shrink-0" />

            <AnimatePresence mode="wait">
              {(!isCollapsed || isDrawerMode) && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-black text-[11px] uppercase tracking-wider whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {hasChildren && (!isCollapsed || isDrawerMode) && (
              <ChevronDown
                size={14}
                className={`ml-auto transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            )}
          </div>
        </NavLink>
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (!isCollapsed || isDrawerMode) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-10 space-y-1 mt-1"
          >
            {item.children.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={() => isDrawerMode && setIsOpen(false)}
                className={({ isActive }) => `
                  block py-2.5 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                  ${isActive ? 'text-primary bg-primary/10' : 'text-muted/60 hover:text-white hover:bg-white/5'}
                `}
              >
                {child.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

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
    open: { x: 0, opacity: 1, width: 260 },
    closed: { x: -260, opacity: 0, width: 0 },
    desktop: { x: 0, opacity: 1, width: isCollapsed ? 80 : 260 }
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={isDrawerMode ? (isOpen ? 'open' : 'closed') : 'desktop'}
        variants={sidebarVariants}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 35,
          mass: 1
        }}
        className={`h-screen bg-secondary border-r border-white/5 flex flex-col p-3 z-[110] fixed xl:sticky top-0 overflow-hidden ${isDrawerMode && !isOpen ? 'pointer-events-none' : ''}`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 px-2 mt-4 min-h-[40px]">
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
                <img src={logo} alt="Logo" className="h-8 w-auto object-contain brightness-0 invert drop-shadow-[0_0_8px_rgba(201,162,39,0.2)]" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            layout
            onClick={() => isDrawerMode ? setIsOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-2 bg-background border border-white/5 rounded-xl shadow-premium text-primary hover:scale-105 active:scale-95 transition-all group"
          >
            {isCollapsed && !isDrawerMode ? <Menu size={18} strokeWidth={2.5} /> : <X size={18} className="text-primary" strokeWidth={2.5} />}
          </motion.button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-0.5 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => (
            <SidebarItem key={item.label} item={item} isCollapsed={isCollapsed} isDrawerMode={isDrawerMode} setIsOpen={setIsOpen} />
          ))}
        </nav>

        {/* Profile Footer */}
        <div className="mt-auto p-0.5">
          <motion.div
            layout
            className={`
              flex items-center gap-3 p-2 rounded-xl bg-background border border-white/5 shadow-premium overflow-hidden
              ${(isCollapsed && !isDrawerMode) ? 'justify-center border-none' : ''}
            `}
          >
            <div className="w-10 h-10 rounded-xl bg-luxury-gradient p-[1px] shadow-lg shrink-0">
              <div className="w-full h-full rounded-xl bg-secondary overflow-hidden flex items-center justify-center p-[1.5px]">
                <img
                  src={userInfo?.profileImage ? (userInfo.profileImage.startsWith('http') ? userInfo.profileImage : `${IMAGE_URL}${userInfo.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo?.name || 'Artisan'}`}
                  alt="Admin Profile"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 rounded-xl"
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

