import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Menu, ChevronDown, ShieldCheck, Clock, Circle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';

export default function Navbar({ onMenuClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="h-14 md:h-16 w-full px-4 md:px-8 flex items-center justify-between bg-background/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={onMenuClick}
          className="p-2 bg-secondary border border-white/5 rounded-xl text-muted xl:hidden hover:text-primary transition-colors"
        >
          <Menu size={16} />
        </button>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="h-7 md:h-8 w-auto object-contain brightness-0 invert opacity-60" />
            <div className="h-6 w-[1px] bg-white/10 hidden xl:block" />
            <div className="flex flex-col">
              <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] leading-none mb-1 ">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                <p className="text-[9px] font-black text-white uppercase tracking-widest  leading-none">Online</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] leading-none mb-1 ">Today's Time</p>
            <div className="flex items-center gap-2">
              <Clock size={10} className="text-primary opacity-50" />
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.1em]  leading-none">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <div className="text-right hidden sm:flex flex-col items-end mr-1">
          <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] leading-tight">
            {userInfo?.name}
          </p>
          <p className="text-[7px] text-muted font-black tracking-[0.3em] uppercase flex items-center gap-1 mt-0.5">
            <ShieldCheck size={7} className="text-primary" /> {userInfo?.role}
          </p>
        </div>

        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="group relative cursor-pointer"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-luxury-gradient p-[1px] shadow-lg shadow-primary/5 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-xl bg-secondary flex items-center justify-center text-primary font-black text-xs uppercase tracking-tighter shadow-inner">
              {userInfo?.name?.charAt(0)}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-background border border-white/10 rounded-full flex items-center justify-center text-muted group-hover:text-primary transition-colors shadow-xl">
            <ChevronDown size={8} className={`${isDropdownOpen ? 'rotate-180' : ''} transition-transform duration-300`} />
          </div>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-3 w-56 bg-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-3xl overflow-hidden p-1.5 z-[100]"
            >
              <div className="p-3 border-b border-white/5 mb-1.5 bg-white/5 rounded-lg">
                <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1.5">{userInfo?.name}</p>
                <p className="text-[8px] text-muted truncate uppercase tracking-[0.1em] ">{userInfo?.email}</p>
              </div>

              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    dispatch(logoutUser());
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-500 transition-all group"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Logout</span>
                  <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

