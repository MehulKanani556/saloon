import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ChevronRight, Hash, AlertTriangle, RefreshCw, Sparkles, Filter, Package, Scissors, CreditCard, Receipt, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import UserPanelLayout from '../components/public/UserPanelLayout';
import { fetchMyAppointments, deleteAppointment } from '../redux/slices/appointmentSlice';

export default function MyAppointments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments = [], loading } = useSelector((state) => state.appointments || {});

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    if (selectedApp || showCancelConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedApp, showCancelConfirm]);

  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);

  const statusColors = {
    'pending': 'text-amber-400 bg-amber-400/5 border-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.1)]',
    'confirmed': 'text-primary bg-primary/5 border-primary/10 shadow-[0_0_15px_rgba(201,162,39,0.1)]',
    'completed': 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.1)]',
    'cancelled': 'text-red-400 bg-red-400/5 border-red-400/10 shadow-[0_0_15px_rgba(248,113,113,0.1)]',
  };

  const getStatusColor = (status) => {
    return statusColors[status.toLowerCase()] || statusColors['pending'];
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const finalizeCancellation = async () => {
    if (selectedApp) {
      await dispatch(deleteAppointment(selectedApp._id));
      setShowCancelConfirm(false);
      setSelectedApp(null);
      dispatch(fetchMyAppointments());
    }
  };

  return (
    <UserPanelLayout title="Appointments">
      <div className="flex flex-col gap-6 md:gap-8 min-h-[70vh]">

        {/* User Settings Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-b border-white/[0.05]">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-8 h-px bg-primary/30" />
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Your Settings</p>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide font-luxury">
              My <span className="text-primary">Appointments</span>
            </h1>
          </div>
          <Link
            to="/book"
            className="group px-6 py-3 bg-white/[0.03] border border-white/5 text-white hover:bg-primary hover:text-secondary hover:border-primary rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
          >
            <Sparkles size={14} /> Book Appointment
          </Link>
        </div>

        {loading && appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 border-2 border-white/5 border-t-primary rounded-full animate-spin" />
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted/40">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] border border-white/5 p-12 text-center rounded-3xl flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-white/[0.02] rounded-2xl flex items-center justify-center text-white/5 mb-8">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 font-luxury">No Appointments Found</h3>
            <p className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.2em] mb-8">You haven't booked any appointments yet.</p>
            <button onClick={() => navigate('/book')} className="px-8 py-4 bg-primary text-secondary rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
              Book Appointment
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-3 md:gap-4 pb-20">
            <AnimatePresence mode="popLayout">
              {appointments.map((app, index) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-[#1A1A1A] border border-white/[0.05] hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                  onClick={() => setSelectedApp(app)}
                >
                  {/* Ultra-Compact Appointment Layout */}
                  <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/[0.03]">

                    {/* Primary Details (Left) */}
                    <div className="flex-1 p-5 md:p-8 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/[0.02] flex items-center justify-center border border-white/5 text-primary/70">
                            <Clock size={16} />
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-white font-luxury uppercase tracking-tight">#{app._id.substring(app._id.length - 8)}</p>
                            <p className="text-[9px] font-bold text-muted/40 uppercase tracking-widest flex items-center gap-1.5">
                              <Calendar size={10} /> {format(new Date(app.appointmentDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all self-start sm:self-auto ${getStatusColor(app.status)}`}>
                          {app.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Price</p>
                          <p className="text-xl font-black text-primary font-luxury drop-shadow-primary-sm">${app.totalPrice?.toFixed(2)}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Appointment Time</p>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 pt-1">
                            <Clock size={12} className="text-primary/40" /> {format(new Date(app.appointmentDate), 'hh:mm a')}
                          </p>
                        </div>
                        <div className="space-y-0.5 col-span-2 md:col-span-1">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Service Type</p>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 pt-1 border-t border-white/[0.03] md:border-0">
                            <Scissors size={12} className="text-primary/40" /> Hair & Beauty Service
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ritual Preview (Right) */}
                    <div className="w-full lg:w-72 xl:w-80 p-5 md:p-8 bg-white/[0.01] flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                        <h4 className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                          <Scissors size={12} /> Selected Services
                        </h4>
                        <div className="space-y-2 text-[10px] font-black uppercase tracking-wide">
                          {app.assignments?.slice(0, 2).map((asm, i) => (
                            <div key={i} className="flex items-center justify-between text-white/60">
                              <span className="truncate max-w-[140px]">{asm.service?.name}</span>
                              <span className="text-primary/30 tabular-nums">${asm.service?.price}</span>
                            </div>
                          ))}
                          {app.assignments?.length > 2 && (
                            <p className="text-[9px] font-black text-primary/40 italic tracking-widest">+{app.assignments.length - 2} More Services</p>
                          )}
                        </div>
                      </div>

                      <button className="w-full py-3.5 bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-widest text-white hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300 rounded-xl flex items-center justify-center gap-2 group/btn shadow-lg">
                        View Details <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Reservation Detail Modal - Pro Interface */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
            />
            
            <motion.div
              layoutId={`app-card-${selectedApp._id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1A1A1A] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl mt-10 md:mt-0"
            >
              <div className="p-5 sm:p-8 md:p-10">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6 md:mb-8 pb-6 border-b border-white/[0.05]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-px bg-primary" />
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Appointment Details</p>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight font-luxury">Appointment Details</h2>
                    <p className="text-[9px] font-black text-muted/40 uppercase tracking-widest truncate max-w-[200px] sm:max-w-none">
                      REF ID: {selectedApp._id}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-muted hover:text-white transition-all focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-8 max-h-[65vh] overflow-y-auto scrollbar-hide pr-1 md:pr-2">
                  
                  {/* Status & Schedule */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-white/[0.02] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/[0.03]">
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Appointment Date</p>
                      <p className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} className="text-primary" /> {format(new Date(selectedApp.appointmentDate), 'EEEE, MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Status</p>
                      <div className="inline-block">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${getStatusColor(selectedApp.status)}`}>
                          {selectedApp.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ritual Sequence */}
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                      <Scissors size={14} /> Service Breakdown
                    </h4>
                    <div className="space-y-3">
                      {selectedApp.assignments?.map((asm, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl group hover:border-primary/20 transition-all gap-3">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-muted/10 group-hover:text-primary/40 transition-colors">
                              <Package size={20} />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[12px] font-black text-white uppercase tracking-tight">{asm.service?.name}</p>
                              <p className="text-[9px] font-bold text-muted/30 uppercase tracking-widest">
                                Artisan: <span className="text-primary/60">{asm.staff?.name || 'Assigned Specialist'}</span>
                              </p>
                            </div>
                          </div>
                          <div className="sm:text-right border-t sm:border-0 border-white/[0.03] pt-3 sm:pt-0">
                            <p className="text-base font-black text-white font-luxury tabular-nums">${asm.service?.price}</p>
                            <p className="text-[8px] font-bold text-muted/20 uppercase tracking-widest tabular-nums">{asm.service?.duration} Mins Service</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investment & Actions */}
                  <div className="bg-white/[0.02] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/[0.03] space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                           <Clock size={12} className="text-primary/40" /> Local Time
                        </p>
                        <p className="text-xl font-black text-white uppercase tracking-tighter">
                          {format(new Date(selectedApp.appointmentDate), 'hh:mm a')}
                        </p>
                      </div>
                      <div className="sm:text-right space-y-1">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Total Price</p>
                        <p className="text-3xl font-black text-primary font-luxury drop-shadow-primary-sm">${selectedApp.totalPrice?.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => setSelectedApp(null)}
                        className="flex-1 py-4 bg-white/[0.03] border border-white/[0.08] hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none"
                      >
                        Close Details
                      </button>
                      {selectedApp.status === 'Pending' && (
                        <button 
                          onClick={handleCancelClick}
                          className="flex-1 py-4 bg-red-400/5 hover:bg-red-400 text-red-400 hover:text-secondary border border-red-400/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group focus:outline-none"
                        >
                          <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* High-Fidelity Cancellation Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelConfirm(false)}
              className="absolute inset-0 bg-background/98 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#1A1A1A] rounded-2xl overflow-hidden"
            >
              <div className="p-6 md:p-8 text-center">
                <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse text-red-500 border border-red-500/10">
                  <AlertTriangle size={24} />
                </div>
                
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 font-luxury">Cancel Appointment?</h3>
                <p className="text-[10px] font-bold text-muted/50 uppercase tracking-[0.1em] leading-relaxed mb-6">
                  Warning: This action permanently cancels your appointment. <span className="text-red-400">The time slot may not be available if you re-book.</span> 
                </p>

                <div className="space-y-3">
                  <button 
                    onClick={finalizeCancellation}
                    className="w-full py-3.5 bg-red-400 text-secondary hover:bg-white hover:text-red-500 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all shadow-lg active:scale-[0.98]"
                  >
                    Yes, Cancel Appointment
                  </button>
                  <button 
                    onClick={() => setShowCancelConfirm(false)}
                    className="w-full py-3.5 bg-white/[0.02] border border-white/[0.05] text-white/30 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all"
                  >
                    Keep Appointment
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </UserPanelLayout>
  );
}
