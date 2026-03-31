import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Reusable Cinematic Modal Component
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  maxWidth = 'max-w-lg', 
  maxHeight = 'max-h-[85vh]',
  headerImage,
  footer
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`relative w-full ${maxWidth} ${maxHeight} bg-white dark:bg-slate-900 shadow-3xl rounded-2xl flex flex-col border border-white/10 overflow-hidden pointer-events-auto`}
        >
          {/* Header Implementation */}
          {headerImage ? (
            <div className="relative h-48 sm:h-56 w-full overflow-hidden shrink-0">
              <img src={headerImage} className="w-full h-full object-cover" alt="Header" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-saloon-500 transition-all z-20"
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-6 left-6 z-10 pr-6">
                {subtitle && <div className="px-2 py-0.5 bg-saloon-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md inline-block mb-2">{subtitle}</div>}
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase italic leading-tight">{title}</h2>
              </div>
            </div>
          ) : (
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/10 dark:bg-slate-800/20 shrink-0">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none italic">
                  {title}
                </h2>
                {subtitle && <p className="text-saloon-500 font-black text-[8px] uppercase tracking-widest mt-1.5">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-saloon-500 transition-all hover:rotate-90 shadow-sm border border-slate-100 dark:border-white/5">
                <X size={18} />
              </button>
            </div>
          )}

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar dark:text-white">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 py-5 border-t border-slate-100 dark:border-white/5 flex gap-3 bg-slate-50/10 dark:bg-slate-800/20 shrink-0">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
