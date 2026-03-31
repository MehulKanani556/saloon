import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ChevronRight, Hash, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data);
    } catch (error) {
      toast.error('Temporal ritual retrieval failed');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    'Pending': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    'Confirmed': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'Completed': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    'Cancelled': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="pb-12 h-full">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-2">My Scheduled Rituals</h1>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.3em] flex items-center gap-2">
              <Calendar size={12} className="text-saloon-500" />
              Chronological records of aesthetic journey
            </p>
          </div>
          <button 
            onClick={fetchAppointments}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-premium hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <RefreshCw size={20} className={`text-saloon-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-saloon-500 border-t-transparent rounded-full animate-spin shadow-lg" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Archival Exploration...</p>
          </div>
        ) : appointments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10"
          >
            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <AlertTriangle className="text-slate-300" size={36} />
            </div>
            <h3 className="text-xl font-black text-slate-700 dark:text-white uppercase tracking-tight mb-3">No Active Reservations</h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest max-w-sm mx-auto mb-10 leading-relaxed">Your aesthetic archive is currently vacant across all temporal coordinates.</p>
            <button className="premium-button-primary !py-4 !px-10 uppercase text-[10px] tracking-[0.2em] font-black group">
              Register New Ritual
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {appointments.map((app, index) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 md:p-8 border-white/60 dark:border-white/5 shadow-premium hover:shadow-2xl transition-all group flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-saloon-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Temporal Identifier */}
                  <div className="flex flex-col items-center justify-center min-w-[100px] py-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 group-hover:bg-saloon-50/50 dark:group-hover:bg-saloon-950/20 transition-all shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{format(new Date(app.appointmentDate), 'MMM')}</span>
                    <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">{format(new Date(app.appointmentDate), 'dd')}</span>
                    <span className="text-[10px] font-bold text-saloon-500 mt-1 uppercase tracking-widest">{format(new Date(app.appointmentDate), 'HH:mm')}</span>
                  </div>

                  <div className="flex-1 space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      {app.assignments.map((asm, i) => (
                        <span key={i} className="px-3 py-1.5 bg-saloon-50/50 dark:bg-saloon-900/10 text-saloon-600 dark:text-saloon-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-saloon-200/30 dark:border-saloon-500/10">
                          {asm.service?.name}
                        </span>
                      ))}
                      <div className={`ml-auto px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current shadow-sm ${statusColors[app.status]}`}>
                        {app.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3 group/sub">
                        <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 group-hover/sub:text-saloon-600 transition-colors">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Master Technician</p>
                          <p className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase truncate max-w-[120px]">{app.assignments[0]?.staff?.name || 'Assigned Master'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400">
                          <Hash size={16} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Reference ID</p>
                          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">#{app._id.slice(-8)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400">
                          <div className={`w-2 h-2 rounded-full ${app.paymentStatus === 'Paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Payment Ledger</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{app.paymentStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex xl:flex-col gap-2">
                    <button className="flex-1 md:w-12 md:h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-saloon-500 hover:text-white transition-all group shadow-sm">
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
}
      </div>
    </div>
  );
}
