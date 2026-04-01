import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { removeFromCart, updateCartQty, clearCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGE_URL } from '../utils/BASE_URL';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';

import UserPanelLayout from '../components/public/UserPanelLayout';

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <UserPanelLayout title="Shopping Cart" hideSidebar={true}>
            <div className="flex flex-col gap-10">
                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-secondary/30 border border-white/5 rounded-3xl p-16 text-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                            <ShoppingBag size={28} className="text-muted/20" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-black uppercase tracking-widest ">Your cart is empty</h3>
                            <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto text-center leading-relaxed">Induct architectural assets into your matrix.</p>
                        </div>
                        <Link to="/shop" className="premium-button-primary inline-flex items-center gap-4 !px-10 py-4 text-[10px] uppercase font-black tracking-widest ">
                            Explore Archives <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                        <div className="xl:col-span-3 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-dark-card border border-white/10 rounded-2xl p-5 flex items-center gap-6 group hover:border-primary/20 transition-all duration-500 shadow-xl"
                                    >
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-background shrink-0 border border-white/5">
                                            <img
                                                src={item.image?.startsWith('/uploads') ? `${IMAGE_URL}${item.image}` : item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-0.5">{item.category}</p>
                                                    <h3 className="text-sm font-black text-white uppercase tracking-wider font-luxury truncate">{item.name}</h3>
                                                </div>
                                                <button
                                                    onClick={() => dispatch(removeFromCart(item._id))}
                                                    className="p-2 text-muted/30 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 bg-background/50 rounded-lg px-3 py-1.5 border border-white/5">
                                                    <button
                                                        onClick={() => dispatch(updateCartQty({ id: item._id, qty: Math.max(1, item.qty - 1) }))}
                                                        className="text-muted hover:text-white transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-[10px] font-black w-4 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => dispatch(updateCartQty({ id: item._id, qty: item.qty + 1 }))}
                                                        className="text-muted hover:text-white transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <p className="text-lg font-black text-primary font-luxury">${(item.price * item.qty).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <button
                                onClick={() => dispatch(clearCart())}
                                className="text-[10px] font-black text-muted/30 uppercase tracking-[0.4em] hover:text-rose-500 transition-colors mt-6 py-2 px-2"
                            >
                                PURGE ACQUISITION MATRIX
                            </button>
                        </div>

                        <div className="bg-dark-card border border-white/10 rounded-2xl p-8 space-y-8 h-fit sticky top-0 shadow-2xl">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] font-luxury pb-5 border-b border-white/5">Order Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[13px] font-black uppercase tracking-widest ">
                                    <span className="text-muted/60">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[13px] font-black uppercase tracking-widest ">
                                    <span className="text-muted/60">Tax (10%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="h-[1px] bg-white/5 my-6" />
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] ">Final Price</span>
                                    <span className="text-3xl font-black text-primary font-luxury">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="premium-button-primary w-full py-5 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 group"
                            >
                                CHECKOUT <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </UserPanelLayout>
    );
}
