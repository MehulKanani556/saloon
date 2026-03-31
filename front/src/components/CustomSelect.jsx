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
        <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 mb-4 block">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-4 px-8 py-4 
          bg-secondary border border-white/5 
          rounded-2xl text-[10px] font-black uppercase tracking-widest 
          hover:border-primary/30 shadow-premium transition-all group
          ${isFilter ? 'min-w-[220px]' : ''}
        `}
      >
        <span className="flex items-center gap-3 truncate text-white">
          {Icon && <Icon size={14} className="text-primary opacity-60 group-hover:opacity-100 transition-opacity" />}
          {getLabel()}
        </span>
        <div className="flex items-center gap-3">
          {isMulti && Array.isArray(value) && value.length > 0 && (
            <span className="px-2 py-0.5 bg-primary text-secondary text-[8px] font-black rounded-md">
              {value.length}
            </span>
          )}
          <ChevronDown 
            size={14} 
            className={`text-muted group-hover:text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`
              absolute z-[100] mt-3 w-full left-0
              bg-secondary rounded-2xl shadow-3xl 
              border border-white/10 overflow-hidden
            `}
          >
            <div className="max-h-64 overflow-auto py-3 custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggle(option.value)}
                  className={`
                    w-full flex items-center justify-between px-8 py-4 
                    text-[10px] font-black uppercase tracking-widest whitespace-nowrap
                    hover:bg-white/5 transition-all text-left
                    ${isSelected(option.value) ? 'text-primary' : 'text-muted'}
                  `}
                >
                  <span>{option.label}</span>
                  {isSelected(option.value) && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="p-1 bg-primary/10 rounded-lg"
                    >
                      <Check size={14} className="text-primary" />
                    </motion.div>
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
