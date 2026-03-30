import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Filter, ArrowRightCircle, Database, Zap, Share2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportIntel } from '../redux/slices/reportSlice';
import toast from 'react-hot-toast';

export default function Reports() {
  const dispatch = useDispatch();
  const { intel, loading } = useSelector(state => state.reports);

  useEffect(() => {
    dispatch(fetchReportIntel());
  }, [dispatch]);

  if (loading && !intel.recentLogs.length) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-saloon-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-tight italic">Business Intelligence</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Operational audit and growth analytics vault</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-saloon-600 transition-all shadow-xl hover:scale-105 active:scale-95">
            <Calendar size={20} />
            Generate New Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Manifests', value: intel.stats.active, icon: Database, color: 'saloon' },
          { label: 'Cloud Downloads', value: intel.stats.downloads, icon: Zap, color: 'blue' },
          { label: 'Shared Intelligence', value: intel.stats.shared, icon: Share2, color: 'green' },
          { label: 'Vault Archive', value: intel.stats.archiveSize, icon: ShieldCheck, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-white/5 shadow-2xl relative group hover:translate-y-[-4px] transition-all">
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-8 text-slate-400 group-hover:bg-${stat.color === 'saloon' ? 'saloon-600' : stat.color + '-500'} group-hover:text-white transition-all duration-500`}>
              <stat.icon size={26} />
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-3 italic">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">{stat.value}</p>
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-50 dark:border-white/5 overflow-hidden">
        <div className="p-10 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Recent System Manifests</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Latest verified operational logs</p>
          </div>
          <button className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-saloon-500 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <AnimatePresence>
            {intel.recentLogs.map((report, index) => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-[2.5rem] transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5 group"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[1.8rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-300 group-hover:text-saloon-600 group-hover:scale-110 transition-all shadow-sm">
                    <FileText size={30} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tighter uppercase italic group-hover:text-saloon-600 transition-colors">{report.title}</h4>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <span className="text-[9px] font-black px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg uppercase tracking-widest leading-none border border-slate-200/50 dark:border-white/5">{report.type}</span>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{report.date}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-200 dark:bg-white/10 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{report.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 mt-6 md:mt-0">
                  <button 
                    onClick={() => toast.success(`Acquiring: ${report.title}`)}
                    className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-slate-500 dark:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-saloon-600 hover:text-white hover:border-saloon-600 transition-all shadow-sm group-hover:shadow-lg active:scale-95"
                  >
                    <Download size={16} />
                    Extract
                  </button>
                  <button className="p-3 text-slate-200 dark:text-slate-700 hover:text-saloon-500 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                    <ArrowRightCircle size={26} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
