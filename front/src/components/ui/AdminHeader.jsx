import React from 'react';

const AdminHeader = ({ title, subtitle, icon: Icon, rightContent }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
      <div className="flex items-center gap-4 group">
        {Icon && (
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-primary shadow-premium shrink-0 transition-transform hover:rotate-6">
            <Icon size={24} md:size={32} strokeWidth={2.5} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-wide uppercase leading-none truncate md:whitespace-normal font-luxury">
            {title}
          </h1>
          <p className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-[0.3em] mt-1 opacity-60">
            {subtitle}
          </p>
        </div>
      </div>
      {rightContent && (
        <div className="flex items-center gap-4">
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default AdminHeader;
