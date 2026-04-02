import React from 'react';

const AdminHeader = ({ title, subtitle, icon: Icon, rightContent }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
      <div className="flex items-center gap-4 md:gap-8 group">
        {Icon && (
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-secondary border border-white/10 flex items-center justify-center text-primary shadow-premium shrink-0 transition-all duration-500 hover:rotate-6 hover:border-primary/30">
            <Icon size={24} md:size={40} className="md:scale-125" strokeWidth={2.5} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-white tracking-tight md:tracking-wide uppercase leading-none truncate md:whitespace-normal font-luxury">
            {title}
          </h1>
          <p className="text-[7.5px] md:text-[10.5px] font-black text-muted uppercase tracking-[0.35em] mt-2 md:mt-3 opacity-60">
            {subtitle}
          </p>
        </div>
      </div>
      {rightContent && (
        <div className="flex items-center w-full lg:w-auto">
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default AdminHeader;
