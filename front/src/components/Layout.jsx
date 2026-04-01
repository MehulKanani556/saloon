import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // Force dark mode globally
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    // Scroll to top of the content area on path change
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen bg-background text-white selection:bg-primary/30 selection:text-white font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Mobile/Tablet/Laptop Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[45] xl:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 blur-[80px] rounded-full pointer-events-none z-0" />

        {/* Header Container pinned at top */}
        <div className="shrink-0 z-[100] w-full">
          <Navbar 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
        </div>

        {/* Scrollable Content Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar relative z-10"
        >
          <AnimatePresence mode="wait">
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="py-6 md:py-10 px-4 md:px-10 w-full max-w-full"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

