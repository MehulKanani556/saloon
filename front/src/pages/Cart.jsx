import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart, ArrowLeft, Receipt } from 'lucide-react';
import { removeFromCart, updateCartQty, clearCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGE_URL } from '../utils/BASE_URL';
import UserPanelLayout from '../components/public/UserPanelLayout';

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <UserPanelLayout title="Shopping bag" hideSidebar={true}>
            <div className="flex flex-col gap-8 min-h-[70vh]">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">Your <span className="text-primary italic">Selection</span></h1>
                        <p className="text-muted/40 text-[11px] font-bold uppercase tracking-widest">{cartItems.length} {cartItems.length === 1 ? 'Product' : 'Products'} curated in your bag</p>
                    </div>
                    <Link to="/shop" className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-muted hover:text-primary uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Continue Shopping
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-secondary/30 border border-white/5 rounded-3xl p-12 md:p-20 text-center space-y-6 md:space-y-8 flex flex-col items-center"
                    >
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 text-primary/30">
                            <ShoppingCart size={32} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">Your bag is empty</h3>
                            <p className="text-muted/40 text-[12px] font-medium max-w-sm mx-auto leading-relaxed">Discover our exclusive collection of professional grooming products and tools.</p>
                        </div>
                        <Link to="/shop" className="bg-primary text-secondary px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                            Explore Collection <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-secondary/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 md:p-5 flex items-center gap-6 group hover:border-primary/20 transition-all duration-500 shadow-xl overflow-hidden"
                                    >
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-background shrink-0 border border-white/5">
                                            <img
                                                src={item.image?.startsWith('/uploads') ? `${IMAGE_URL}${item.image}` : item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">{item.category}</p>
                                                    <h3 className="text-[13px] md:text-sm font-bold text-white uppercase tracking-wide truncate pr-4">{item.name}</h3>
                                                </div>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item._id))}
                                                    className="p-2 text-muted/20 hover:text-red-500 transition-colors shrink-0"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                <div className="flex items-center gap-4 bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                                                    <button
                                                        onClick={() => dispatch(updateCartQty({ id: item._id, qty: Math.max(1, item.qty - 1) }))}
                                                        className="text-muted/60 hover:text-white transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-[11px] font-bold w-6 text-center text-white">{item.qty}</span>
                                                    <button
                                                        onClick={() => dispatch(updateCartQty({ id: item._id, qty: item.qty + 1 }))}
                                                        className="text-muted/60 hover:text-white transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-muted/30 font-bold uppercase tracking-widest leading-none mb-1">Unit Total</p>
                                                    <p className="text-xl font-bold text-primary tracking-tighter">${(item.price * item.qty).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            <div className="flex items-center justify-between px-2 pt-2">
                                <button
                                    onClick={() => dispatch(clearCart())}
                                    className="text-[10px] font-bold text-muted/30 uppercase tracking-[0.2em] hover:text-red-500 transition-colors flex items-center gap-2 group"
                                >
                                    <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                                    Clear Shopping Bag
                                </button>
                                <p className="text-[10px] font-bold text-muted/20 uppercase tracking-[0.1em]">Free shipping on orders over $500</p>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-4 flex flex-col gap-6 h-fit sticky top-8">
                            <div className="bg-secondary/60 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-primary rotate-12 pointer-events-none">
                                    <Receipt size={100} />
                                </div>

                                <h3 className="text-sm font-black uppercase tracking-[0.3em] pb-4 border-b border-white/5 text-white">Summary</h3>
                                
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-muted/60">
                                        <span>Subtotal</span>
                                        <span className="text-white">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-muted/60">
                                        <span>Tax (10%)</span>
                                        <span className="text-white">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-muted/60">
                                        <span className="flex items-center gap-2">Estimated Shipping <span className="px-2 py-0.5 bg-primary/20 text-primary text-[8px] rounded">FREE</span></span>
                                        <span className="text-emerald-400">$0.00</span>
                                    </div>
                                    
                                    <div className="h-[1px] bg-white/5 my-6" />
                                    
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted/30">Total Investment</span>
                                            <p className="text-3xl font-bold text-primary tracking-tighter">${total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full py-5 bg-primary text-secondary rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
                                >
                                    Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            
                            <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <Receipt size={14} />
                                </div>
                                <p className="text-[9px] font-bold text-muted/40 uppercase tracking-widest">Secure Checkout Powered by Salon Pay</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserPanelLayout>
    );
}
