import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  name, 
  icon: Icon,
  className = "",
  placeholder = "Select Option",
  isFilter = false,
  isMulti = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const getLabel = () => {
    if (isMulti) {
      if (!Array.isArray(value) || value.length === 0) return placeholder;
      if (value.length === 1) {
        return options.find(opt => opt.value === value[0])?.label || placeholder;
      }
      return `${value.length} Rituals Selected`;
    }
    const selected = options.find(opt => opt.value === value);
    return selected ? selected.label : placeholder;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optValue) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optValue)
        ? currentValues.filter(v => v !== optValue)
        : [...currentValues, optValue];
      onChange({ target: { name, value: newValues } });
    } else {
      onChange({ target: { name, value: optValue } });
      setIsOpen(false);
    }
  };

  const isSelected = (optValue) => {
    if (isMulti) {
      return Array.isArray(value) && value.includes(optValue);
    }
    return value === optValue;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 mb-4 block italic">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-4 px-8 py-4 
          bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-white/5 
          rounded-2xl text-[10px] font-black uppercase tracking-widest 
          hover:border-saloon-500 shadow-sm transition-all group
          ${isFilter ? 'min-w-[200px]' : ''}
        `}
      >
        <span className="flex items-center gap-2 truncate text-slate-900 dark:text-white">
          {Icon && <Icon size={14} className="text-saloon-600" />}
          {getLabel()}
        </span>
        <div className="flex items-center gap-3">
          {isMulti && Array.isArray(value) && value.length > 0 && (
            <span className="px-2 py-0.5 bg-saloon-600 text-white text-[8px] rounded-md animate-pulse">
              {value.length}
            </span>
          )}
          <ChevronDown 
            size={14} 
            className={`text-slate-400 group-hover:text-saloon-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`
              absolute z-[100] mt-3 w-full left-0
              bg-white dark:bg-slate-900 rounded-2xl shadow-2xl 
              border border-slate-100 dark:border-white/5 overflow-hidden
            `}
          >
            <div className="max-h-60 overflow-auto py-2 custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggle(option.value)}
                  className={`
                    w-full flex items-center justify-between px-6 py-4 
                    text-[10px] font-black uppercase tracking-widest whitespace-nowrap
                    hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left
                    ${isSelected(option.value) ? 'text-saloon-600' : 'text-slate-400'}
                  `}
                >
                  <span>{option.label}</span>
                  {isSelected(option.value) && (
                    <div className="box-content p-1 bg-saloon-600/10 rounded-lg">
                      <Check size={14} className="text-saloon-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
