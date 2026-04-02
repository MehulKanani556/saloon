import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, User, Sparkles, Clock, ChevronRight, Hash, CreditCard, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import UserPanelLayout from '../components/public/UserPanelLayout';
import { fetchMyOrders } from '../redux/slices/orderSlice';

export default function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders = [], loading } = useSelector((state) => state.orders || {});

  const [selectedOrder, setSelectedOrder] = React.useState(null);

  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrder]);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const statusColors = {
    'Processing': 'text-amber-400 bg-amber-400/5 border-amber-400/10',
    'Shipped': 'text-primary bg-primary/5 border-primary/10',
    'Delivered': 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10',
    'Cancelled': 'text-red-400 bg-red-400/5 border-red-400/10',
  };

  return (
    <UserPanelLayout title="Orders">
      <div className="flex flex-col gap-6 lg:gap-8 min-h-[70vh]">

        {/* Compact Ledger Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-white/[0.05]">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-8 h-px bg-primary/30" />
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Chronicle Ledger</p>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide font-luxury">
              Order <span className="text-primary">Archive</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="group px-6 py-3 w-full md:w-fit bg-white/[0.03] border border-white/5 text-white hover:bg-primary hover:text-secondary hover:border-primary rounded-xl flex items-center justify-center md:justify-start gap-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
          >
            <Sparkles size={14} /> Back to Shop
          </button>
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-16 h-16 border-2 border-white/5 border-t-primary rounded-full animate-spin" />
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted/40">Syncing Data Matrix...</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] border border-white/5 p-12 text-center rounded-3xl flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-white/[0.02] rounded-2xl flex items-center justify-center text-white/5 mb-8">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 font-luxury">Archive Empty</h3>
            <p className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.2em] mb-8">No order records were discovered in your profile.</p>
            <button onClick={() => navigate('/shop')} className="px-8 py-4 bg-primary text-secondary rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
              Initiate Acquisition
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-3 md:gap-4 pb-20">
            <AnimatePresence mode="popLayout">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-[#1A1A1A] border border-white/[0.05] hover:border-primary/20 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/[0.03]">

                    {/* Primary Info (Left) */}
                    <div className="flex-1 p-5 md:p-8 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/[0.02] flex items-center justify-center border border-white/5 text-primary/70">
                            <Hash size={16} />
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-white font-luxury uppercase tracking-tight">#{order._id.substring(order._id.length - 8)}</p>
                            <p className="text-[9px] font-bold text-muted/40 uppercase tracking-widest flex items-center gap-1.5">
                              <Clock size={10} /> {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all self-start sm:self-auto ${statusColors[order.status] || statusColors['Processing']}`}>
                          {order.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Total Value</p>
                          <p className="text-xl font-black text-primary font-luxury drop-shadow-primary-sm">${order.totalAmount?.toFixed(2)}</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Recipient</p>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 truncate">
                            <User size={12} className="text-primary/40" /> {order.shippingAddress?.fullName?.split(' ')[0] || 'N/A'}
                          </p>
                        </div>
                        <div className="space-y-0.5 col-span-2 md:col-span-1">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Settlement</p>
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-primary/40'}`} />
                            <p className={`text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-primary/60'}`}>{order.paymentStatus || 'Awaiting'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ritual Breakdown (Right) */}
                    <div className="w-full lg:w-72 xl:w-80 p-5 md:p-8 bg-white/[0.01] flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                        <h4 className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                          <Package size={12} /> Manifested Items
                        </h4>
                        <div className="space-y-2">
                          {order.items?.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-[10px] font-black uppercase tracking-wide">
                              <span className="text-white/60 truncate max-w-[140px]">
                                {item.name || item.product?.name || 'Aesthetic Good'}
                              </span>
                              <span className="text-muted/30 tabular-nums">QTY: 0{item.qty}</span>
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <p className="text-[9px] font-black text-primary/40 italic tracking-widest">+{order.items.length - 2} Sequential Units</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full py-3.5 bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-widest text-white hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300 rounded-xl flex items-center justify-center gap-2 group/btn shadow-lg"
                      >
                        View Ledger <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Order Details Modal - Pro Interface */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
            />
            
            <motion.div
              layoutId={`order-card-${selectedOrder._id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1A1A1A] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-5 sm:p-8 md:p-10">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6 md:mb-10 pb-6 border-b border-white/[0.05]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-px bg-primary" />
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Log Retrieval</p>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight font-luxury">Order Detail</h2>
                    <p className="text-[9px] font-black text-muted/40 uppercase tracking-widest truncate max-w-[200px] sm:max-w-none">
                      ID REFERENCE: {selectedOrder._id}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-muted hover:text-white transition-all focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-8 md:space-y-10 max-h-[65vh] overflow-y-auto scrollbar-hide pr-1 md:pr-2">
                  
                  {/* Status & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 bg-white/[0.02] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/[0.03]">
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Chronicle Date</p>
                      <p className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} className="text-primary" /> {format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy @ HH:mm')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Acquisition Status</p>
                      <div className="inline-block">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${statusColors[selectedOrder.status] || statusColors['Processing']}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items Breakdown */}
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                      <Package size={14} /> Acquisition Metrics
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between group py-3 px-1 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-1 bg-primary/40 rounded-full group-hover:bg-primary transition-colors" />
                            <div className="space-y-0.5">
                              <p className="text-[11px] font-black text-white uppercase tracking-wide truncate max-w-[150px] sm:max-w-xs">
                                {item.name || item.product?.name || 'Aesthetic Goods'}
                              </p>
                              <p className="text-[9px] font-bold text-muted/30 uppercase tracking-widest">
                                UNIT QTY: 0{item.qty}
                              </p>
                            </div>
                          </div>
                          <span className="text-[12px] font-black text-primary tabular-nums">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Logistics & Payment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                        <User size={14} /> Logistics Recipient
                      </h4>
                      <div className="bg-white/[0.02] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/[0.03] space-y-3">
                        <p className="text-[11px] font-black text-white uppercase tracking-wider">{selectedOrder.shippingAddress?.fullName}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-60 leading-relaxed">
                          {selectedOrder.shippingAddress?.address}<br />
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}<br />
                          {selectedOrder.shippingAddress?.phone}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                        <CreditCard size={14} /> Settlement Summary
                      </h4>
                      <div className="bg-white/[0.02] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/[0.03] space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-muted/30 uppercase tracking-widest">Payment Status</span>
                          <span className={`px-2 py-0.5 rounded border ${selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-primary border-primary/20 bg-primary/5'}`}>
                            {selectedOrder.paymentStatus?.toUpperCase() || 'PENDING'}
                          </span>
                        </div>
                        <div className="h-px bg-white/[0.05]" />
                        <div className="flex justify-between items-baseline pt-2">
                          <span className="text-[10px] font-black text-muted/30 uppercase tracking-widest">Grand Total</span>
                          <span className="text-2xl sm:text-3xl font-black text-primary font-luxury drop-shadow-primary-sm">${selectedOrder.totalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </UserPanelLayout>
  );
}

