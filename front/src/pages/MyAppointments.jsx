import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ChevronRight, Hash, AlertTriangle, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import UserPanelLayout from '../components/public/UserPanelLayout';
import { fetchMyAppointments } from '../redux/slices/appointmentSlice';

export default function MyAppointments() {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);

  const fetchAppointments = () => {
    dispatch(fetchMyAppointments());
  };

  const statusColors = {
    'Pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Confirmed': 'bg-primary/10 text-primary border-primary/20',
    'Completed': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <UserPanelLayout title="Archive">
      <div className="flex flex-col gap-16">
        {/* Cinematic Header Area */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 pb-16 border-b border-white/5 relative">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-16 h-[2px] bg-luxury-gradient" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.6em] animate-pulse">Temporal Logistics</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-[-0.05em] italic font-luxury leading-none">The Ritual <span className="text-primary/50">Archive</span></h1>
            <p className="text-muted/40 text-[11px] uppercase font-black tracking-[0.5em] flex items-center gap-4 italic">
               Chronological ledger of your aesthetic evolution within the matrix
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAppointments}
            className="w-20 h-20 bg-dark-card border border-white/10 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex items-center justify-center group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-luxury-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
            <RefreshCw size={28} className={`text-primary transition-transform duration-1000 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          </motion.button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-primary/10 rounded-full animate-ping absolute inset-0" />
              <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_60px_rgba(201,162,39,0.3)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.6em] text-muted animate-pulse italic">Consulting the Matrix Oracle...</p>
          </div>
        ) : appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-card backdrop-blur-3xl p-24 text-center rounded-[4rem] border border-dashed border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] ring-1 ring-white/5 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="w-28 h-28 bg-background/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-inner border border-white/5 text-primary/20">
              <AlertTriangle size={56} strokeWidth={1} />
            </div>
            <h3 className="text-4xl font-black text-white uppercase tracking-[-0.05em] mb-6 font-luxury italic leading-none">Archive <span className="text-muted/20">Null</span></h3>
            <p className="text-muted/40 text-[12px] font-black uppercase tracking-[0.4em] max-w-sm mx-auto mb-16 leading-relaxed italic">Your chronological records contain zero active ritual coordinates in the current branch.</p>
            <button className="px-16 py-7 bg-luxury-gradient text-secondary rounded-[2.5rem] flex items-center gap-5 mx-auto font-black text-[11px] uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all font-luxury italic">
              <Sparkles size={20} /> Register New Ritual
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-12 pb-20">
            <AnimatePresence mode="popLayout">
              {appointments.map((app, index) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-dark-card backdrop-blur-3xl p-10 md:p-14 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] rounded-[3.5rem] ring-1 ring-white/5 hover:ring-primary/30 transition-all duration-1000 group flex flex-col lg:flex-row lg:items-center gap-16 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-3 h-full bg-luxury-gradient opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                  <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 blur-[150px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-2000" />

                  {/* Enhanced Temporal Identifier */}
                  <div className="flex flex-col items-center justify-center min-w-[160px] py-12 bg-background/40 rounded-[3rem] border border-white/5 group-hover:border-primary/20 transition-all duration-1000 shadow-inner relative z-10">
                    <span className="text-[12px] font-black text-muted/40 uppercase tracking-[0.6em] mb-4 italic">{format(new Date(app.appointmentDate), 'MMM')}</span>
                    <span className="text-7xl font-black text-white leading-none font-luxury tracking-tighter italic group-hover:text-primary transition-colors duration-1000">{format(new Date(app.appointmentDate), 'dd')}</span>
                    <span className="text-[12px] font-black text-primary mt-6 uppercase tracking-[0.4em] bg-primary/5 px-6 py-2 rounded-full border border-primary/20 shadow-inner font-luxury">{format(new Date(app.appointmentDate), 'HH:mm')}</span>
                  </div>

                  <div className="flex-1 space-y-12 relative z-10">
                    <div className="flex flex-wrap items-center gap-6 justify-between border-b border-white/5 pb-10">
                      <div className="flex flex-wrap gap-4">
                        {app.assignments.map((asm, i) => (
                          <div key={i} className="px-8 py-3.5 bg-background/50 border border-white/5 text-primary text-[11px] font-black uppercase tracking-[0.5em] rounded-2xl shadow-inner flex items-center gap-4 group-hover:border-primary/20 transition-all duration-700 font-luxury italic">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(201,162,39,0.8)]" />
                            {asm.service?.name}
                          </div>
                        ))}
                      </div>
                      <div className={`px-10 py-3.5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] border shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl font-luxury italic ring-1 ring-white/5 ${statusColors[app.status]}`}>
                        {app.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                      <div className="flex items-center gap-6 group/sub">
                        <div className="w-16 h-16 bg-background/60 rounded-[1.5rem] text-muted/30 group-hover/sub:text-primary group-hover/sub:border-primary/40 group-hover/sub:scale-110 transition-all duration-700 border border-white/5 flex items-center justify-center shadow-inner">
                          <User size={28} strokeWidth={1} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted/20 uppercase tracking-[0.5em] mb-2 italic">Technician</p>
                          <p className="text-[13px] font-black text-white uppercase tracking-[-0.02em] font-luxury italic group-hover/sub:text-primary transition-colors duration-700">{app.assignments[0]?.staff?.name || 'Assigned Master'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 group/sub">
                        <div className="w-16 h-16 bg-background/60 rounded-[1.5rem] text-muted/30 group-hover/sub:text-primary transition-all duration-700 border border-white/5 flex items-center justify-center shadow-inner">
                          <Hash size={28} strokeWidth={1} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted/20 uppercase tracking-[0.5em] mb-2 italic">Matrix Ref</p>
                          <p className="text-[12px] font-black text-muted/40 uppercase tracking-[0.4em] font-luxury">0x{app._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 group/sub">
                        <div className="w-16 h-16 bg-background/60 rounded-[1.5rem] border border-white/5 flex items-center justify-center shadow-inner group-hover/sub:border-primary/20 transition-all duration-700">
                          <div className={`w-4 h-4 rounded-full ${app.paymentStatus === 'Paid' ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-primary shadow-[0_0_30px_rgba(201,162,39,0.8)] animate-pulse'}`} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted/20 uppercase tracking-[0.5em] mb-2 italic">Ledger State</p>
                          <p className={`text-[13px] font-black uppercase tracking-[0.2em] italic font-luxury ${app.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-primary'}`}>{app.paymentStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0">
                    <motion.button 
                      whileHover={{ scale: 1.1, x: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-full lg:w-24 lg:h-56 bg-background/60 border border-white/10 rounded-[2.5rem] flex items-center justify-center text-muted/20 hover:text-secondary hover:bg-luxury-gradient hover:border-transparent transition-all duration-1000 group/btn shadow-inner"
                    >
                      <ChevronRight size={48} strokeWidth={1} className="transition-transform group-hover/btn:translate-x-2" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
        }
      </div>
    </UserPanelLayout>
  );
}
