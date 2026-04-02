import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Package, 
    Search, 
    Filter, 
    Download, 
    Eye, 
    Clock, 
    CheckCircle2, 
    XCircle,
    ShoppingBag,
    MoreVertical,
    Loader2,
    AlertCircle,
    ChevronDown,
    Truck,
    User,
    Plus
} from 'lucide-react';
import AdminHeader from '../components/ui/AdminHeader';
import api from '../utils/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders');
            setOrders(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Matrix synchronization failed');
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Protocol ${newStatus} Initiated`);
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
            fetchOrders();
        } catch (err) {
            toast.error('Protocol transformation failed');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'Shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            default: return 'text-muted bg-white/5 border-white/10';
        }
    };

    const filteredOrders = orders.filter(order => 
        (order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === 'All' || order.status === filterStatus)
    );

    const stats = [
        { label: 'Active Acquisitions', value: orders.filter(o => o.status === 'Processing').length, icon: Clock, color: 'text-primary' },
        { label: 'Completed Fulfillment', value: orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Asset Magnitude ($)', value: `$${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`, icon: ShoppingBag, color: 'text-white' }
    ];

    return (
        <div className="space-y-10">
            {/* Order Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0A0A0A] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/10 shadow-3xl relative z-10 overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Acquisition Manifest</p>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-luxury">{selectedOrder.orderId}</h2>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-muted hover:text-white transition-all transform hover:rotate-90"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Customer & Shipping */}
                                    <div className="space-y-8">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                                <User size={14} className="text-primary" /> Customer Identity
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-white uppercase font-luxury">{selectedOrder.user?.name}</p>
                                                <p className="text-[10px] font-black text-muted uppercase tracking-widest">{selectedOrder.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                                <Truck size={14} className="text-primary" /> Logistics Target
                                            </h3>
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-black text-white uppercase tracking-widest leading-relaxed">
                                                    {selectedOrder.shippingAddress?.fullName}<br />
                                                    {selectedOrder.shippingAddress?.address}<br />
                                                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}<br />
                                                    {selectedOrder.shippingAddress?.country}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Status */}
                                    <div className="space-y-8">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                                <ShoppingBag size={14} className="text-primary" /> Fulfillment Status
                                            </h3>
                                            <div className="flex items-center gap-4">
                                                <div className={`px-5 py-2 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>
                                                    {selectedOrder.status}
                                                </div>
                                                <div className="px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                                                    Paid
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 bg-luxury-gradient rounded-2xl text-secondary flex items-center justify-between shadow-2xl">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-1 opacity-60">Revenue Magnitude</p>
                                                <p className="text-4xl font-black font-luxury">${selectedOrder.totalAmount?.toFixed(2)}</p>
                                            </div>
                                            <Package size={40} className="opacity-20" />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Table */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] px-2">Archived Assets</h3>
                                    <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-muted/40">
                                                    <th className="px-6 py-4">Asset Name</th>
                                                    <th className="px-6 py-4">Quantity</th>
                                                    <th className="px-6 py-4">Unit Value</th>
                                                    <th className="px-6 py-4 text-right">Magnitude</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {selectedOrder.items?.map((item, idx) => (
                                                    <tr key={idx} className="group">
                                                        <td className="px-6 py-5 text-[10px] font-black text-white uppercase tracking-widest">{item.name}</td>
                                                        <td className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest">{item.qty} UNITS</td>
                                                        <td className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-widest">${item.price?.toFixed(2)}</td>
                                                        <td className="px-6 py-5 text-right text-[10px] font-black text-primary font-luxury">${(item.price * item.qty).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-white/5 bg-white/5 flex gap-4">
                                <button 
                                    onClick={() => updateStatus(selectedOrder._id, 'Shipped')}
                                    disabled={selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered'}
                                    className="flex-1 flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Truck size={18} className="group-hover:translate-x-1 transition-transform" />
                                    <span className="whitespace-nowrap">Initiate Deployment</span>
                                </button>
                                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                                    Download Manifest
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AdminHeader 
                title="Order Ledger"
                subtitle="Acquisition Manifest & Asset Fulfillment"
                icon={Package}
                rightContent={
                    <button className="w-full md:w-auto flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury">
                        <Plus size={18} md:size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span className="whitespace-nowrap">Create Manual Order</span>
                    </button>
                }
            />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-dark-card border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-primary/20 transition-all shadow-xl"
                    >
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-muted/40 uppercase tracking-[0.3em]">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color} font-luxury`}>{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={20} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-dark-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10">
                {/* Search & Filter Bar */}
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-6">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="SEARCH BY ORDER ID OR CUSTOMER..."
                            className="w-full bg-background/50 border border-white/5 focus:border-primary/40 px-12 py-4 rounded-xl outline-none text-[10px] font-black uppercase tracking-widest text-white transition-all font-sans"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/5">
                            {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setFilterStatus(st)}
                                    className={`px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === st ? 'bg-primary text-secondary' : 'text-muted hover:text-white'}`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto custom-scrollbar min-h-[400px] relative">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/20 backdrop-blur-sm z-20">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" strokeWidth={1} />
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Synchronizing Ledger...</p>
                        </div>
                    ) : error ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/20 backdrop-blur-sm z-20">
                            <AlertCircle className="w-10 h-10 text-rose-500" />
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">{error}</p>
                            <button onClick={fetchOrders} className="mt-4 px-8 py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Retry Sync</button>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/20 backdrop-blur-sm z-20">
                            <Package className="w-10 h-10 text-muted/20" />
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">No acquisition records found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted/40 border-b border-white/5">Order ID</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted/40 border-b border-white/5">Customer</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted/40 border-b border-white/5">Date</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted/40 border-b border-white/5">Magnitude ($)</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted/40 border-b border-white/5">Status</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted/40 border-b border-white/5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-primary transition-colors">{order.orderId}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{order.user?.name || 'Unknown Protocol'}</p>
                                            <p className="text-[8px] font-black text-muted/40 uppercase tracking-widest">{order.items?.length || 0} Assets</p>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-black text-muted/60 uppercase tracking-widest">
                                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-white font-luxury">${order.totalAmount?.toFixed(2)}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="relative h-full">
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveDropdown(activeDropdown === order._id ? null : order._id);
                                                    }}
                                                    className={`flex items-center gap-3 px-4 py-2 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(order.status)} shadow-inner cursor-pointer hover:border-white/20 transition-all`}
                                                >
                                                    {order.status}
                                                    <ChevronDown size={10} className={`transition-transform duration-300 ${activeDropdown === order._id ? 'rotate-180' : ''}`} />
                                                </div>
                                                
                                                {/* Dropdown Menu */}
                                                <AnimatePresence>
                                                    {activeDropdown === order._id && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-3xl z-[100] p-2 overflow-hidden"
                                                        >
                                                            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                                                                <button
                                                                    key={st}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateStatus(order._id, st);
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                    className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors flex items-center gap-3"
                                                                >
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(st).split(' ')[0]}`} />
                                                                    {st}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-all"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-all">
                                                    <MoreVertical size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer Pagination Placeholder */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[9px] font-black text-muted/40 uppercase tracking-widest ">Viewing {filteredOrders.length} of {orders.length} acquisitions</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 border border-white/5 rounded-lg text-[9px] font-black text-muted hover:text-white transition-all">Previous</button>
                        <button className="px-4 py-2 bg-white/5 rounded-lg text-[9px] font-black text-white">1</button>
                        <button className="px-4 py-2 border border-white/5 rounded-lg text-[9px] font-black text-muted hover:text-white transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
