import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-16 pb-5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-secondary border border-white/5 text-muted hover:text-primary hover:border-primary/30 disabled:opacity-20 disabled:hover:border-white/5 transition-all shadow-premium group"
      >
        <ChevronLeft size={20} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <div className="flex items-center gap-2 px-4 py-2 bg-secondary/40 rounded-2xl border border-white/5 shadow-inner">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <div className="w-10 flex items-center justify-center text-muted/30">
                <MoreHorizontal size={16} />
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(page)}
                className={`
                  w-10 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center
                  ${currentPage === page 
                    ? 'bg-primary text-secondary shadow-xl shadow-primary/20 scale-110' 
                    : 'text-muted hover:text-white hover:bg-white/5'}
                `}
              >
                {page < 10 ? `0${page}` : page}
              </motion.button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-secondary border border-white/5 text-muted hover:text-primary hover:border-primary/30 disabled:opacity-20 disabled:hover:border-white/5 transition-all shadow-premium group"
      >
        <ChevronRight size={20} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

export default Pagination;
