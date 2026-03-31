import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Force dark mode globally
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary/30 selection:text-white font-sans overflow-x-hidden">
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

      <div className="flex-1 flex flex-col relative w-full min-w-0">
        {/* Background Ambient Glow */}
        <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 blur-[80px] rounded-full pointer-events-none z-0" />

        <div className="flex-1 relative z-10 flex flex-col w-full">
          {/* Header Container pinned at top */}
          <div className="sticky top-0 z-[100] w-full">
            <Navbar 
              onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.main
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 md:mt-12 px-2 sm:px-4 md:px-10 flex-1 w-full max-w-full"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

