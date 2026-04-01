import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
    CreditCard, 
    Truck, 
    ShieldCheck, 
    ArrowLeft, 
    MapPin, 
    User, 
    Phone, 
    Mail, 
    ArrowRight,
    ShoppingBag,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserPanelLayout from '../components/public/UserPanelLayout';
import { clearCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            zipCode: '',
            country: 'India',
            cardName: '',
            cardNumber: '',
            expiry: '',
            cvv: ''
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            address: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
            zipCode: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                setIsProcessing(true);
                
                const orderData = {
                    items: cartItems.map(item => ({
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        qty: item.qty
                    })),
                    totalAmount: total,
                    shippingAddress: {
                        fullName: values.fullName,
                        email: values.email,
                        address: values.address,
                        city: values.city,
                        zipCode: values.zipCode,
                        country: values.country
                    }
                };

                await api.post('/orders', orderData);
                
                setIsProcessing(false);
                setStep(3);
                dispatch(clearCart());
                toast.success('Acquisition Successful');
            } catch (err) {
                setIsProcessing(false);
                toast.error(err.response?.data?.message || 'Acquisition protocol failed');
            }
        }
    });

    if (cartItems.length === 0 && step !== 3) {
        return (
            <UserPanelLayout title="Checkout" hideSidebar={true}>
                <div className="flex flex-col items-center justify-center py-40 gap-8">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <ShoppingBag size={30} className="text-muted/20" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">No active acquisitions to process.</p>
                    <button onClick={() => navigate('/shop')} className="premium-button-primary !px-12 py-5 text-[10px] uppercase font-black tracking-widest ">
                        Return to Archives
                    </button>
                </div>
            </UserPanelLayout>
        );
    }

    return (
        <UserPanelLayout title="Checkout Protocol" hideSidebar={true}>
            <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                        >
                            <div className="lg:col-span-2 space-y-10">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black uppercase font-luxury tracking-wider">Shipping Details</h2>
                                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Enter your delivery information below.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-muted/60 uppercase tracking-[0.4em] ml-2">Full Name</label>
                                        <div className="relative group">
                                            <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                {...formik.getFieldProps('fullName')}
                                                className="w-full bg-dark-card border border-white/10 focus:border-primary/40 px-14 py-5 rounded-xl outline-none text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-xl"
                                                placeholder="e.g. JOHN SMITH"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-muted/60 uppercase tracking-[0.4em] ml-2">Email Address</label>
                                        <div className="relative group">
                                            <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                {...formik.getFieldProps('email')}
                                                className="w-full bg-dark-card border border-white/10 focus:border-primary/40 px-14 py-5 rounded-xl outline-none text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-xl"
                                                placeholder="EMAIL@EXAMPLE.COM"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[9px] font-black text-muted/60 uppercase tracking-[0.4em] ml-2">Delivery Address</label>
                                        <div className="relative group">
                                            <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                {...formik.getFieldProps('address')}
                                                className="w-full bg-dark-card border border-white/10 focus:border-primary/40 px-14 py-5 rounded-xl outline-none text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-xl"
                                                placeholder="STREET NAME, HOUSE NUMBER"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-muted/60 uppercase tracking-[0.4em] ml-2">City</label>
                                        <input 
                                            {...formik.getFieldProps('city')}
                                            className="w-full bg-dark-card border border-white/10 focus:border-primary/40 px-8 py-5 rounded-xl outline-none text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-xl"
                                            placeholder="LONDON"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-muted/60 uppercase tracking-[0.4em] ml-2">ZIP / Postal Code</label>
                                        <input 
                                            {...formik.getFieldProps('zipCode')}
                                            className="w-full bg-dark-card border border-white/10 focus:border-primary/40 px-8 py-5 rounded-xl outline-none text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-xl"
                                            placeholder="E1 6AN"
                                        />
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setStep(2)}
                                    className="premium-button-primary !px-12 py-6 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 group shadow-2xl"
                                >
                                    Continue to Payment <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="bg-dark-card border border-white/10 rounded-3xl p-8 h-fit space-y-8 shadow-2xl sticky top-32">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] font-luxury pb-5 border-b border-white/5">Order Summary</h3>
                                <div className="space-y-6">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="flex justify-between items-center gap-4">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-white uppercase tracking-wider truncate ">{item.name}</p>
                                                <p className="text-[8px] font-black text-primary uppercase tracking-widest">{item.qty} UNIT(S)</p>
                                            </div>
                                            <span className="text-sm font-black font-luxury shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="h-[1px] bg-white/5 my-6" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted/60">Total Amount</span>
                                        <span className="text-2xl font-black text-primary font-luxury">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <CheckCircle2 size={12} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">In Stock & Ready to Ship</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-2xl mx-auto space-y-12"
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 mb-4">
                                    <CreditCard size={28} className="text-primary animate-pulse" />
                                </div>
                                <h2 className="text-3xl font-black uppercase font-luxury tracking-wider">Payment Details</h2>
                                <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] max-w-sm">Secure payment authorization via encrypted gateway.</p>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-muted/60 uppercase tracking-[0.4em] ml-2">Name on Card</label>
                                    <input 
                                        {...formik.getFieldProps('cardName')}
                                        className="w-full bg-dark-card border border-white/10 focus:border-primary/40 px-8 py-5 rounded-xl outline-none text-[11px] font-black uppercase tracking-widest text-white transition-all"
                                        placeholder="JOHN SMITH"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-muted/60 uppercase tracking-[0.4em] ml-2">Card Number</label>
                                    <input 
                                        {...formik.getFieldProps('cardNumber')}
                                        className="w-full bg-dark-card border border-white/10 focus:border-primary/40 px-8 py-5 rounded-xl outline-none text-[11px] font-black uppercase tracking-widest text-white transition-all"
                                        placeholder="0000 0000 0000 0000"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-muted/60 uppercase tracking-[0.4em] ml-2">Expiry Date</label>
                                        <input 
                                            {...formik.getFieldProps('expiry')}
                                            className="w-full bg-dark-card border border-white/10 focus:border-primary/40 px-8 py-5 rounded-xl outline-none text-[11px] font-black uppercase tracking-widest text-white transition-all"
                                            placeholder="MM / YY"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-muted/60 uppercase tracking-[0.4em] ml-2">Security Code (CVV)</label>
                                        <input 
                                            {...formik.getFieldProps('cvv')}
                                            className="w-full bg-dark-card border border-white/10 focus:border-primary/40 px-8 py-5 rounded-xl outline-none text-[11px] font-black uppercase tracking-widest text-white transition-all"
                                            placeholder="000"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6 pt-8">
                                    <button 
                                        type="submit"
                                        disabled={isProcessing}
                                        className="premium-button-primary w-full py-6 text-[11px] font-black uppercase tracking-[0.6em] flex items-center justify-center gap-4 group relative overflow-hidden"
                                    >
                                        {isProcessing ? (
                                            <span className="flex items-center gap-4">
                                                <ShieldCheck size={18} className="animate-spin" /> PROCESSING...
                                            </span>
                                        ) : (
                                            <>PLACE ORDER <ShieldCheck size={18} /></>
                                        )}
                                        {isProcessing && <motion.div className="absolute inset-0 bg-primary/20" initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(1)} 
                                        className="text-[10px] font-black text-muted uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-3"
                                    >
                                        <ArrowLeft size={14} /> Back to Shipping
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-xl mx-auto flex flex-col items-center text-center py-20 gap-10"
                        >
                            <div className="relative">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                    className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(201,162,39,0.3)]"
                                >
                                    <CheckCircle2 size={48} className="text-secondary" />
                                </motion.div>
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"
                                />
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-4xl font-black uppercase font-luxury tracking-tighter">Order Success</h2>
                                <p className="text-[11px] font-black text-muted uppercase tracking-[0.4em] leading-loose max-w-sm">Thank you for your purchase. Your order has been received and is being processed by our team.</p>
                            </div>

                            <div className="flex flex-col gap-6 w-full max-w-sm">
                                <button 
                                    onClick={() => navigate('/shop')}
                                    className="premium-button-primary py-6 text-[10px] font-black uppercase tracking-[0.4em] "
                                >
                                    Return to Archives
                                </button>
                                <button 
                                    onClick={() => navigate('/profile')}
                                    className="text-[10px] font-black text-muted uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    View Digital Identity
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </UserPanelLayout>
    );
}
