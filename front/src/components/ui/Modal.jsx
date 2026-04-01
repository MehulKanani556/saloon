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
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-xl cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative w-full ${maxWidth} ${maxHeight} bg-secondary shadow-3xl rounded-2xl flex flex-col border border-white/10 overflow-hidden pointer-events-auto`}
        >
          {/* Header Implementation */}
          {headerImage ? (
            <div className="relative h-40 sm:h-56 w-full overflow-hidden shrink-0">
              <img src={headerImage} className="w-full h-full object-cover brightness-75 scale-105" alt="Header" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 md:top-6 right-4 md:right-6 p-2 bg-secondary border border-white/20 rounded-xl text-primary hover:rotate-90 transition-all z-20 shadow-2xl"
              >
                <X size={16} md:size={18} />
              </button>
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 z-10 pr-6">
                {subtitle && <div className="px-2 md:px-3 py-1 bg-primary text-secondary text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] rounded-2xl inline-block mb-2 md:mb-3 shadow-2xl">{subtitle}</div>}
                <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase  leading-tight font-luxury">{title}</h2>
              </div>
            </div>
          ) : (
            <div className="px-5 md:px-10 py-5 md:py-8 border-b border-white/5 flex items-center justify-between bg-white/5 shrink-0">
              <div className="min-w-0 pr-4">
                <h2 className="text-lg md:text-2xl font-black text-white tracking-tighter uppercase leading-none  font-luxury truncate md:whitespace-normal">
                  {title}
                </h2>
                {subtitle && <p className="text-primary font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] mt-1.5 md:mt-2 ">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="p-2 md:p-2.5 bg-background border border-white/5 rounded-lg md:rounded-xl text-muted hover:text-primary transition-all hover:rotate-90 shadow-xl shrink-0">
                <X size={16} md:size={18} />
              </button>
            </div>
          )}

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-y-auto px-5 md:px-10 py-6 md:py-10 space-y-6 md:space-y-8 custom-scrollbar text-white">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 md:px-10 py-4 md:py-6 border-t border-white/5 flex gap-4 bg-white/5 shrink-0">
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

