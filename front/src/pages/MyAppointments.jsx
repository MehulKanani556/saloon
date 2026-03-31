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
    'Pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Confirmed': 'bg-primary/10 text-primary border-primary/20',
    'Completed': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="pb-12 h-full">
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight italic mb-2 font-luxury">My Scheduled Rituals</h1>
            <p className="text-muted text-[10px] uppercase font-black tracking-[0.3em] flex items-center gap-2">
              <Calendar size={12} className="text-primary" />
              Chronological records of aesthetic journey
            </p>
          </div>
          <button 
            onClick={fetchAppointments}
            className="p-3 bg-secondary border border-white/5 rounded-2xl shadow-premium hover:shadow-primary/5 hover:-translate-y-1 transition-all"
          >
            <RefreshCw size={20} className={`text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted animate-pulse">Archival Exploration...</p>
          </div>
        ) : appointments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-secondary p-12 text-center rounded-[2.5rem] border border-dashed border-white/10"
          >
            <div className="w-20 h-20 bg-background rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <AlertTriangle className="text-muted" size={36} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 font-luxury">No Active Reservations</h3>
            <p className="text-muted text-[11px] font-bold uppercase tracking-widest max-w-sm mx-auto mb-10 leading-relaxed">Your aesthetic archive is currently vacant across all temporal coordinates.</p>
            <button className="flex items-center gap-3 px-10 py-4 bg-primary text-secondary rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 mx-auto transition-all hover:scale-105 active:scale-95">
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
                  className="bg-secondary p-6 md:p-8 border border-white/5 shadow-2xl rounded-[2.5rem] hover:shadow-primary/5 transition-all group flex flex-col md:flex-row md:items-center gap-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Temporal Identifier */}
                  <div className="flex flex-col items-center justify-center min-w-[100px] py-4 bg-background rounded-2xl border border-white/5 group-hover:bg-primary/5 transition-all shadow-inner">
                    <span className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">{format(new Date(app.appointmentDate), 'MMM')}</span>
                    <span className="text-3xl font-black text-white leading-none font-luxury">{format(new Date(app.appointmentDate), 'dd')}</span>
                    <span className="text-[10px] font-bold text-primary mt-1 uppercase tracking-widest">{format(new Date(app.appointmentDate), 'HH:mm')}</span>
                  </div>

                  <div className="flex-1 space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      {app.assignments.map((asm, i) => (
                        <span key={i} className="px-3 py-1.5 bg-background text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5 shadow-inner">
                          {asm.service?.name}
                        </span>
                      ))}
                      <div className={`ml-auto px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current shadow-sm ${statusColors[app.status]}`}>
                        {app.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 border-t border-white/5">
                      <div className="flex items-center gap-3 group/sub">
                        <div className="p-2.5 bg-background rounded-xl text-muted group-hover/sub:text-primary transition-colors border border-white/5">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5">Master Technician</p>
                          <p className="text-[10px] font-black text-white uppercase truncate max-w-[120px] font-luxury">{app.assignments[0]?.staff?.name || 'Assigned Master'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-background rounded-xl text-muted border border-white/5">
                          <Hash size={16} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5">Reference ID</p>
                          <p className="text-[10px] font-mono text-muted uppercase">#{app._id.slice(-8)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-background rounded-xl text-muted border border-white/5">
                          <div className={`w-2 h-2 rounded-full ${app.paymentStatus === 'Paid' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(201,162,39,0.5)]'}`} />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5">Payment Ledger</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white">{app.paymentStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex xl:flex-col gap-2">
                    <button className="flex-1 md:w-12 md:h-12 bg-background border border-white/5 rounded-2xl flex items-center justify-center text-muted hover:bg-primary hover:text-secondary transition-all group shadow-inner">
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
