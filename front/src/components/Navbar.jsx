import React, { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, LogOut, Menu, ChevronDown, User, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';

export default function Navbar({ darkMode, setDarkMode, onMenuClick }) {
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
    <nav className="h-16 md:h-20 w-full px-4 md:px-8 flex items-center justify-between glass-card relative z-50 mx-auto max-w-full shadow-premium border-white/60 dark:bg-slate-900/60 transition-all duration-300">
      <div className="flex items-center gap-3 md:gap-8">
        <button
          onClick={onMenuClick}
          className="p-1.5 sm:p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-lg sm:rounded-2xl text-slate-500 xl:hidden hover:text-saloon-500 transition-colors"
        >
          <Menu size={18} />
        </button>

        <div className="hidden lg:flex items-center gap-6 px-1 py-1">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="h-8 w-auto object-contain dark:brightness-0 dark:invert" />
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Online</p>
              </div>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10" />
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1 italic">Today's Time</p>
            <p className="text-xs font-black text-rosegold-500 uppercase tracking-widest transition-all">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 group cursor-pointer p-1 md:p-2 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-white/20"
        >
          <div className="text-right hidden sm:flex flex-col items-end">
            <p className="text-xs md:text-sm font-black text-rosegold-500 uppercase tracking-tight truncate max-w-[120px]">
              {userInfo?.name}
            </p>
            <p className="text-[8px] md:text-[9px] text-slate-400 font-black tracking-widest uppercase flex items-center gap-1">
              <ShieldCheck size={8} /> {userInfo?.role}
            </p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-saloon-400 to-rosegold-500 p-[2px]">
            <div className="w-full h-full rounded-[10px] bg-white dark:bg-slate-900 flex items-center justify-center text-saloon-500 font-black text-xs md:text-sm uppercase tracking-tighter">
              {userInfo?.name?.charAt(0)}
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-slate-400 group-hover:text-saloon-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-4 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 ring-1 ring-black/5"
            >
              <div className="p-3 border-b border-slate-100 dark:border-white/5 mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Appearance</p>
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => setDarkMode(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${!darkMode ? 'bg-white shadow-premium text-saloon-500' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Sun size={14} /> Light
                  </button>
                  <button
                    onClick={() => setDarkMode(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${darkMode ? 'bg-slate-700 shadow-premium text-yellow-400' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    <Moon size={14} /> Dark
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {/* <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-saloon-50 dark:hover:bg-saloon-900/10 text-slate-600 dark:text-slate-300 transition-all group"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User size={18} className="group-hover:text-saloon-500" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Protocol Profile</span>
                </button> */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    dispatch(logoutUser());
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 transition-all group"
                >
                  <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Logout Now</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
