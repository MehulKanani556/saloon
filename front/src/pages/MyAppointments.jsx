import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ChevronRight, Hash, AlertTriangle, RefreshCw, Sparkles, Filter, Package } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import UserPanelLayout from '../components/public/UserPanelLayout';
import { fetchMyOrders } from '../redux/slices/orderSlice';

export default function MyAppointments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const fetchOrders = () => {
    dispatch(fetchMyOrders());
  };

  const statusColors = {
    'Processing': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Shipped': 'bg-primary/10 text-primary border-primary/20',
    'Delivered': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const handleOpenDetail = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) {
      await dispatch(deleteAppointment(id));
      setIsModalOpen(false);
      dispatch(fetchMyAppointments());
    }
  };

  return (
    <UserPanelLayout title="Reservations">
      <div className="flex flex-col gap-10 md:gap-16 min-h-[80vh]">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-10 border-b border-white/5 relative">
          <div className="space-y-4 md:space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-primary" />
              <p className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-[0.4em] md:tracking-[0.6em]">Premium Concierge</p>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
              Client <span className="text-primary italic">Reservations</span>
            </h1>
            <p className="text-muted/60 text-[12px] md:text-[13px] font-medium tracking-wide max-w-xl">
              A curated chronological record of your bespoke grooming and wellness sessions at our atelier.
            </p>
          </div>
          <Link 
            to="/book"
            className="w-full md:w-auto group px-8 py-4 bg-primary text-secondary rounded-full flex items-center justify-center gap-3 font-bold text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(201,162,39,0.2)]"
          >
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            Book New Session
          </Link>
        </div>

        {loading && appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8">
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 md:w-24 md:h-24 border border-primary/20 rounded-full" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 md:w-16 md:h-16 border-t-2 border-primary rounded-full absolute top-3 left-3 md:top-4 md:left-4" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Scissors className="text-primary/40 animate-pulse" size={20} md:size={24} />
              </div>
            </div>
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-muted/60">Retrieving Portfolio...</p>
          </div>
        ) : orders && orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/5 p-12 md:p-20 text-center rounded-3xl flex flex-col items-center gap-6 md:gap-8"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary/30">
              <Calendar className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-[-0.05em] mb-4 md:mb-6 font-luxury leading-none">Archive <span className="text-muted/20">Null</span></h3>
            <p className="text-muted/40 text-[10px] md:text-[12px] font-black tracking-[0.2em] max-w-xs md:max-w-sm mx-auto mb-10 md:mb-16 leading-relaxed">Your chronological records contain zero active acquisitions in the current branch.</p>
            <button onClick={() => navigate('/shop')} className="px-8 py-5 md:px-12 md:py-7 bg-luxury-gradient text-secondary rounded-2xl flex items-center gap-4 md:gap-5 mx-auto font-black text-[10px] md:text-[12px] uppercase tracking-[0.2em] shadow-3xl hover:scale-105 active:scale-95 transition-all font-luxury">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" /> Visit Archives
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6 md:gap-8 pb-32">
            <AnimatePresence mode="popLayout">
              {orders && orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-dark-card border border-white/10 p-6 md:p-8 rounded-3xl hover:border-primary/30 transition-all flex flex-col gap-6 shadow-xl"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <Package size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted/60 uppercase tracking-widest mb-1">Order Ref: {order.orderId}</p>
                        <p className="text-sm font-bold text-white tracking-wide">{format(new Date(order.createdAt), 'MMMM dd, yyyy - HH:mm')}</p>
                      </div>
                    </div>
                    <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-inner self-start sm:self-auto ${statusColors[order.status]}`}>
                      {order.status}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-8">
                    {/* Items */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-2">Purchased Items</h4>
                      <div className="bg-background/40 rounded-2xl border border-white/5 overflow-hidden shadow-inner flex flex-col">
                        {order.items.map((item, i) => (
                          <div key={i} className={`flex flex-col gap-3 p-5 ${i !== order.items.length - 1 ? 'border-b border-white/5' : ''}`}>
                            <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-primary/30" />
                              <span className="text-[11px] font-black text-white/90 uppercase tracking-wider">{item.name}</span>
                            </div>
                            <span className="text-[11px] font-black text-muted uppercase tracking-widest pl-6">Qty: {item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-6 bg-background/40 p-6 rounded-2xl border border-white/5 shadow-inner">
                      <div className="flex flex-col gap-2">
                        <p className="text-[9px] font-black text-muted/60 uppercase tracking-widest">Recipient</p>
                        <p className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <User size={12} className="text-primary/50" /> {order.shippingAddress?.fullName || 'N/A'}
                        </p>
                      </div>
                      
                      <div className="h-px bg-white/5" />
                      
                      <div className="flex flex-col gap-2">
                        <p className="text-[9px] font-black text-muted/60 uppercase tracking-widest">Payment Status</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${order.paymentStatus === 'Paid' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-primary shadow-[0_0_10px_rgba(201,162,39,0.8)]'}`} />
                          <p className={`text-[11px] font-black uppercase tracking-wider ${order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-primary'}`}>
                            {order.paymentStatus}
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-white/5" />
                      
                      <div className="flex flex-col gap-2">
                        <p className="text-[9px] font-black text-muted/60 uppercase tracking-widest">Total Amount</p>
                        <p className="text-2xl font-black text-primary font-luxury">${order.totalAmount?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
        }
      </div>

      {/* Reservation Detail Modal (Balanced and Responsive) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Reservation Details"
        maxWidth="max-w-xl"
      >
        {selectedApp && (
          <div className="space-y-8 md:space-y-10">
            {/* Modal Subheader */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                   <Calendar size={20} />
                </div>
                <div className="space-y-0.5">
                   <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em]">Reserved Schedule</p>
                   <p className="text-[13px] md:text-[15px] font-bold text-white tracking-tight">
                     {format(new Date(selectedApp.appointmentDate), 'EEEE, MMMM dd, yyyy')}
                   </p>
                </div>
              </div>
              <div className={`self-start sm:self-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${statusColors[selectedApp.status]}`}>
                {selectedApp.status}
              </div>
            </div>

            {/* List of Services */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Bespoke Rituals</h4>
                <div className="h-[1px] flex-1 bg-white/5 ml-6" />
              </div>
              <div className="space-y-3">
                {selectedApp.assignments.map((asm, i) => (
                  <div key={i} className="flex items-center justify-between p-4 md:p-5 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-primary/20 transition-all duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center text-muted/30 group-hover:text-primary transition-colors">
                        <Scissors size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[12px] md:text-[13px] font-bold text-white tracking-wide">{asm.service?.name}</p>
                        <p className="text-[9px] text-muted font-bold uppercase tracking-widest">
                           Artisan: <span className="text-primary/70">{asm.staff?.name || 'Assigned'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">${asm.service?.price}</p>
                      <p className="text-[8px] text-muted/40 font-bold uppercase tracking-widest">{asm.service?.duration} Min</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden">
               <div className="space-y-1 relative z-10">
                 <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                   <Clock size={12} className="text-primary" /> Session Start
                 </p>
                 <p className="text-base font-black text-white">{format(new Date(selectedApp.appointmentDate), 'hh:mm a')}</p>
               </div>
               <div className="space-y-1 relative z-10 sm:text-right">
                 <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] flex sm:flex-row-reverse items-center gap-2">
                   <CreditCard size={12} className="text-primary" /> Total Investment
                 </p>
                 <p className="text-xl font-black text-primary uppercase tracking-tight">${selectedApp.totalPrice}</p>
               </div>
               <div className="absolute top-0 right-0 p-4 opacity-5 text-primary rotate-12">
                 <Receipt size={64} />
               </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 bg-background hover:bg-white/5 border border-white/5 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all"
              >
                Return to Archive
              </button>
              {(selectedApp.status === 'Pending' || selectedApp.status === 'Confirmed') && (
                <button 
                  onClick={() => handleCancel(selectedApp._id)}
                  className="flex-1 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-red-500/5"
                >
                  <Trash2 size={14} className="group-hover:rotate-12 transition-transform" />
                  Cancel Reservation
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </UserPanelLayout>
  );
}
