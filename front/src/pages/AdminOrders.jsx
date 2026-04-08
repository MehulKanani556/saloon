import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Search,
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
    Plus,
    X,
    Filter
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus, exportOrderInvoicePDF } from '../redux/slices/orderSlice';
import AdminHeader from '../components/ui/AdminHeader';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';
import Modal from '../components/ui/Modal';
import CustomSelect from '../components/CustomSelect';

export default function AdminOrders() {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector(state => state.orders);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const handleDownloadInvoice = async (order) => {
        try {
            const { _id, orderId, user, shippingAddress } = order;
            const result = await dispatch(exportOrderInvoicePDF(_id)).unwrap();

            const clientName = (shippingAddress?.fullName || user?.name || 'Client').split(' ').join('_');
            const fileName = `Invoice-Order-${clientName}-${orderId}.pdf`;

            const url = window.URL.createObjectURL(new Blob([result]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Invoice exported successfully');
        } catch (err) {
            toast.error(err || 'Failed to download invoice');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await dispatch(updateOrderStatus({ id, status })).unwrap();
            toast.success(`Order status updated to ${status}`);
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        } catch (err) {
            toast.error(err || 'Failed to update order status');
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

    const availableYears = Array.from(new Set(orders.map(o => new Date(o.createdAt).getFullYear()))).sort((a, b) => b - a);
    if (availableYears.length === 0 && !availableYears.includes(new Date().getFullYear())) {
        availableYears.push(new Date().getFullYear());
    }

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const matchesSearch = (order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress?.phone?.includes(searchTerm));
        const matchesStatus = (filterStatus === 'All' || order.status === filterStatus);
        const matchesYear = orderDate.getFullYear() === Number(selectedYear);
        const matchesMonth = selectedMonth === 'all' || selectedMonth === null 
            ? true 
            : orderDate.getMonth() === Number(selectedMonth);
        
        return matchesSearch && matchesStatus && matchesYear && matchesMonth;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentItems = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const stats = [
        { label: 'Pending Orders', value: orders.filter(o => o.status === 'Processing').length, icon: Clock, color: 'text-primary' },
        { label: 'Delivered Orders', value: orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Total Sales', value: `$${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`, icon: ShoppingBag, color: 'text-white' }
    ];

    return (
        <div className="space-y-12">
            {/* Order Details Modal */}
            <Modal
                isOpen={isModalOpen && !!selectedOrder}
                onClose={() => setIsModalOpen(false)}
                title={selectedOrder?.orderId}
                subtitle="Full Order Reconstruction & Status"
                maxWidth="max-w-4xl"
                footer={
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={() => updateStatus(selectedOrder._id, 'Shipped')}
                            disabled={selectedOrder?.status === 'Shipped' || selectedOrder?.status === 'Delivered'}
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-primary text-secondary rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 font-luxury"
                        >
                            <Truck size={18} />
                            <span>Mark as Shipped</span>
                        </button>
                        <button
                            onClick={() => handleDownloadInvoice(selectedOrder)}
                            className="flex-1 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
                        >
                            Download Invoice
                        </button>
                    </div>
                }
            >
                {selectedOrder && (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                            {/* Customer & Shipping */}
                            <div className="space-y-6 md:space-y-8">
                                <div className="p-5 md:p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                        <User size={14} className="text-primary" /> Customer Info
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-sm md:text-base font-black text-white uppercase font-luxury">{selectedOrder.user?.name}</p>
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest">{selectedOrder.user?.email}</p>
                                    </div>
                                </div>
                                <div className="p-5 md:p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                        <Truck size={14} className="text-primary" /> Shipping Address
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest leading-relaxed">
                                            {selectedOrder.shippingAddress?.fullName}<br />
                                            {selectedOrder.shippingAddress?.address}<br />
                                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}<br />
                                            {selectedOrder.shippingAddress?.country}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Status */}
                            <div className="space-y-6 md:space-y-8">
                                <div className="p-5 md:p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                                    <h3 className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                        <ShoppingBag size={14} className="text-primary" /> Order Status
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                        <div className={`px-4 md:px-5 py-2 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </div>
                                        <div className="px-4 md:px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                                            Paid
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 bg-luxury-gradient rounded-2xl text-secondary flex items-center justify-between shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">
                                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-1 opacity-60">Total Amount</p>
                                        <p className="text-3xl md:text-4xl font-black font-luxury">${selectedOrder.totalAmount?.toFixed(2)}</p>
                                    </div>
                                    <Package size={40} className="opacity-20 relative z-10" strokeWidth={1} />
                                </div>
                            </div>
                        </div>

                        {/* Order Items Table */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] px-2">Order Items</h3>
                            <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left min-w-[500px]">
                                        <thead>
                                            <tr className="bg-white/5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                                                <th className="px-6 py-4">Product Name</th>
                                                <th className="px-6 py-4">Quantity</th>
                                                <th className="px-6 py-4">Unit Price</th>
                                                <th className="px-6 py-4 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {selectedOrder.items?.map((item, idx) => (
                                                <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
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
                    </div>
                )}
            </Modal>

            <AdminHeader
                title="Order Management"
                subtitle="Track and manage customer orders"
                icon={Package}
                rightContent={
                    <div className="flex flex-col md:flex-row gap-5 w-full lg:w-auto items-center">
                        <div className="bg-secondary/40 backdrop-blur-md px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-white/5 shadow-3xl flex items-center gap-4 w-full md:w-96 group focus-within:border-primary/40 transition-all duration-500">
                            <Search size={18} className="text-primary/40 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="SEARCH ORDERS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none outline-none text-[10px] md:text-[11px] font-black text-white tracking-[0.2em] w-full placeholder:text-white/5 uppercase"
                            />
                        </div>
                        {/* <button className="w-full lg:w-auto flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury">
                            <Plus size={18} md:size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span className="whitespace-nowrap">Create Manual Order</span>
                        </button> */}
                    </div>
                }
            />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-secondary/20 backdrop-blur-sm border border-white/5 rounded-2xl p-8 flex items-center justify-between group hover:border-primary/20 transition-all shadow-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-luxury-gradient opacity-20" />
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-muted uppercase tracking-[0.4em]">{stat.label}</p>
                            <p className={`text-4xl font-black ${stat.color} font-luxury tracking-tighter`}>{stat.value}</p>
                        </div>
                        <div className={`p-5 rounded-2xl bg-background/50 border border-white/5 ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                            <stat.icon size={24} strokeWidth={1} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Table Container & Filters */}
            <div className="space-y-8">
                <div className="flex flex-wrap items-end gap-4 md:gap-6 bg-secondary/20 p-4 md:p-6 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl relative z-[60]">
                    <div className="w-full sm:w-48">
                        <CustomSelect
                            label="Select Year"
                            value={selectedYear}
                            onChange={(e) => {
                                setSelectedYear(e.target.value);
                                setCurrentPage(1);
                            }}
                            options={availableYears.map(y => ({ label: y.toString(), value: y }))}
                        />
                    </div>
                    <div className="w-full sm:w-60">
                        <CustomSelect
                            label="Filter Month"
                            value={selectedMonth === null ? 'all' : selectedMonth}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedMonth(val === 'all' ? null : Number(val));
                                setCurrentPage(1);
                            }}
                            options={[
                                { label: 'ALL MONTHS', value: 'all' },
                                { label: 'JANUARY', value: 0 },
                                { label: 'FEBRUARY', value: 1 },
                                { label: 'MARCH', value: 2 },
                                { label: 'APRIL', value: 3 },
                                { label: 'MAY', value: 4 },
                                { label: 'JUNE', value: 5 },
                                { label: 'JULY', value: 6 },
                                { label: 'AUGUST', value: 7 },
                                { label: 'SEPTEMBER', value: 8 },
                                { label: 'OCTOBER', value: 9 },
                                { label: 'NOVEMBER', value: 10 },
                                { label: 'DECEMBER', value: 11 },
                            ]}
                            icon={Filter}
                        />
                    </div>

                    <div className="flex-1 flex flex-col items-start lg:items-end justify-center min-w-full lg:min-w-[200px]">
                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3 ml-2 lg:ml-0 lg:mb-2">Status Filter</p>
                        <div className="flex bg-secondary/30 p-1 rounded-xl border border-white/5 backdrop-blur-md w-full sm:w-fit shadow-2xl overflow-x-auto no-scrollbar scrollbar-hide">
                            <div className="flex gap-1">
                                {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                                    <button
                                        key={st}
                                        onClick={() => { setFilterStatus(st); setCurrentPage(1); }}
                                        className={`px-4 lg:px-5 py-2.5 rounded-lg text-[8px] lg:text-[9px] font-black uppercase tracking-widest transition-all font-luxury whitespace-nowrap ${filterStatus === st ? 'bg-primary text-secondary shadow-lg' : 'text-muted hover:text-white'}`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-3xl border border-white/5 relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-luxury-gradient opacity-10" />
                    <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" strokeWidth={1} />
                                <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Loading orders...</p>
                            </div>
                        ) : error ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
                                <AlertCircle className="w-12 h-12 text-rose-500" />
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">{error}</p>
                                <button onClick={() => dispatch(fetchAllOrders())} className="mt-4 px-8 py-3 bg-secondary border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:text-primary transition-all">Retry Sync</button>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20 opacity-40">
                                <Package size={64} strokeWidth={0.5} className="text-muted" />
                                <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">No orders found.</p>
                            </div>
                        ) : (
                                <table className="w-full min-w-[800px] text-left border-collapse">
                                    <thead>
                                        <tr className="bg-background/80">
                                            <th className="px-4 lg:px-8 py-4 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] lg:tracking-[0.4em] text-primary whitespace-nowrap">Order ID</th>
                                            <th className="px-4 lg:px-8 py-4 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] lg:tracking-[0.4em] text-primary whitespace-nowrap">Customer</th>
                                            <th className="px-4 lg:px-8 py-4 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] lg:tracking-[0.4em] text-primary whitespace-nowrap">Date</th>
                                            <th className="px-4 lg:px-8 py-4 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em] lg:tracking-[0.4em] text-primary whitespace-nowrap">Total</th>
                                            <th className="px-4 lg:px-8 py-4 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.4em] text-primary whitespace-nowrap">Status</th>
                                            <th className="px-4 lg:px-8 py-4 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] lg:tracking-[0.4em] text-primary whitespace-nowrap text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <AnimatePresence mode="popLayout">
                                            {currentItems.map((order, index) => (
                                                <motion.tr
                                                    key={order._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ delay: index * 0.02, ease: "easeOut" }}
                                                    className="group hover:bg-white/[0.03] transition-all"
                                                >
                                                    <td className="px-4 lg:px-8 py-4 lg:py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="hidden xl:flex w-9 h-9 rounded-xl bg-background border border-white/5 items-center justify-center text-primary/40 group-hover:text-primary transition-colors shrink-0">
                                                                <Package size={16} strokeWidth={1.5} />
                                                            </div>
                                                            <p className="text-[10px] lg:text-[11px] font-black text-white uppercase tracking-[0.06em] lg:tracking-widest font-luxury truncate">{order.orderId}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 lg:px-8 py-4 lg:py-6">
                                                        <p className="text-[10px] lg:text-[11px] font-black text-white uppercase tracking-[0.06em] lg:tracking-widest mb-1 truncate">{order.user?.name || 'User'}</p>
                                                        <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] whitespace-nowrap">{order.items?.length || 0} ITEMS</p>
                                                    </td>
                                                    <td className="px-4 lg:px-8 py-4 lg:py-6">
                                                        <p className="text-[9px] lg:text-[10px] font-black text-muted uppercase tracking-[0.3em] whitespace-nowrap">
                                                            {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 lg:px-8 py-4 lg:py-6">
                                                        <p className="text-base lg:text-lg font-black text-white font-luxury tracking-tighter">${order.totalAmount?.toLocaleString()}</p>
                                                    </td>
                                                    <td className="px-4 lg:px-8 py-4 lg:py-6">
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveDropdown(activeDropdown === order._id ? null : order._id);
                                                                }}
                                                                className={`flex items-center gap-2 px-3 lg:px-5 py-1.5 lg:py-2 rounded-full border text-[7px] lg:text-[8px] font-black uppercase tracking-[0.05em] lg:tracking-widest transition-all ${getStatusColor(order.status)} shadow-lg scale-100 hover:scale-[1.02] active:scale-95 whitespace-nowrap`}
                                                            >
                                                                {order.status}
                                                                <ChevronDown size={10} className={`transition-transform duration-500 ${activeDropdown === order._id ? 'rotate-180' : ''}`} />
                                                            </button>

                                                            <AnimatePresence>
                                                                {activeDropdown === order._id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                        className="absolute top-full left-0 mt-3 w-56 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-3xl z-[150] p-2 overflow-hidden backdrop-blur-2xl"
                                                                    >
                                                                        {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                                                                            <button
                                                                                key={st}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateStatus(order._id, st);
                                                                                    setActiveDropdown(null);
                                                                                }}
                                                                                className="w-full text-left p-3.5 rounded-xl hover:bg-white/5 text-[9px] font-black uppercase tracking-widest text-muted hover:text-primary transition-all flex items-center gap-4 group/item"
                                                                            >
                                                                                <div className={`w-1.5 h-1.5 rounded-full transition-transform group-hover/item:scale-150 ${getStatusColor(st).split(' ')[0]}`} />
                                                                                {st}
                                                                            </button>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 lg:px-8 py-4 lg:py-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setIsModalOpen(true);
                                                                }}
                                                                className="p-2.5 lg:p-3 bg-background border border-white/5 rounded-xl text-muted hover:text-primary hover:border-primary/30 transition-all shadow-xl"
                                                                title="View Details"
                                                            >
                                                                <Eye size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                        )}
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            </div>
        </div>
    );
}
