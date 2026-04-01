import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ShoppingCart, Heart, ArrowRight, Star } from 'lucide-react';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGE_URL } from '../utils/BASE_URL';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import toast from 'react-hot-toast';

import UserPanelLayout from '../components/public/UserPanelLayout';

export default function Wishlist() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        dispatch(removeFromWishlist(item._id));
        toast.success(`Success! ${item.name} relocated to Cart Matrix`);
    };

    return (
        <UserPanelLayout title="Wishlist Vault" hideSidebar={true}>
            <div className="flex flex-col gap-10">
                {wishlistItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-secondary/30 border border-white/5 rounded-3xl p-16 text-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                            <Heart size={28} className="text-muted/20" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-black uppercase tracking-widest ">Your vault is empty</h3>
                            <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto text-center leading-relaxed">Seal your grooming aspirations in the architectural vault.</p>
                        </div>
                        <Link to="/shop" className="premium-button-primary inline-flex items-center gap-4 !px-10 py-4 text-[10px] uppercase font-black tracking-widest ">
                            Explore Archives <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence mode="popLayout">
                            {wishlistItems.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-dark-card rounded-2xl p-4 border border-white/10 shadow-xl hover:border-primary/20 transition-all duration-500"
                                >
                                    <div className="relative aspect-square rounded-xl overflow-hidden mb-6 bg-background border border-white/5 shadow-inner">
                                        <img
                                            src={item.image?.startsWith('/uploads') ? `${IMAGE_URL}${item.image}` : item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <button 
                                                onClick={() => dispatch(removeFromWishlist(item._id))}
                                                className="p-2.5 bg-background/80 border border-white/5 rounded-lg text-muted/40 hover:text-rose-500 transition-all shadow-xl backdrop-blur-md"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-background/90 backdrop-blur-md rounded-md text-[8px] font-black text-primary uppercase tracking-widest shadow-lg border border-white/5">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="px-1 space-y-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="min-w-0">
                                                <h3 className="text-xs font-black text-white uppercase tracking-tight line-clamp-1 font-luxury leading-none mb-1.5">{item.name}</h3>
                                                <div className="flex items-center gap-1 text-primary">
                                                    {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                                                </div>
                                            </div>
                                            <span className="text-lg font-black text-primary font-luxury shrink-0">${item.price}</span>
                                        </div>

                                        <button 
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full py-3.5 bg-primary text-secondary rounded-xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            <ShoppingCart size={14} /> INDUCT TO CART
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </UserPanelLayout>
    );
}
