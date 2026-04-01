import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ShoppingCart, Heart, ArrowRight, Star, ShoppingBag, ArrowLeft } from 'lucide-react';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGE_URL } from '../utils/BASE_URL';
import toast from 'react-hot-toast';
import UserPanelLayout from '../components/public/UserPanelLayout';

export default function Wishlist() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        dispatch(removeFromWishlist(item._id));
        toast.success(`Success! ${item.name} moved to your Shopping Bag`);
    };

    return (
        <UserPanelLayout title="Wishlist" hideSidebar={true}>
            <div className="flex flex-col gap-8 min-h-[70vh]">
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">Your <span className="text-primary italic">Wishlist</span></h1>
                        <p className="text-muted/40 text-[11px] font-bold uppercase tracking-widest">{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} saved for later</p>
                    </div>
                    <Link to="/shop" className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-muted hover:text-primary uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Continue Shopping
                    </Link>
                </div>

                {wishlistItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-secondary/30 border border-white/5 rounded-3xl p-12 md:p-20 text-center space-y-6 md:space-y-8 flex flex-col items-center"
                    >
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 text-primary/30">
                            <Heart size={32} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">Your wishlist is empty</h3>
                            <p className="text-muted/40 text-[12px] font-medium max-w-sm mx-auto leading-relaxed">Save your favorite professional grooming products and tools to purchase them later.</p>
                        </div>
                        <Link to="/shop" className="bg-primary text-secondary px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                            Explore Archives <ArrowRight size={14} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        <AnimatePresence mode="popLayout">
                            {wishlistItems.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-secondary/40 backdrop-blur-3xl rounded-2xl p-4 border border-white/5 shadow-xl hover:border-primary/20 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="relative aspect-square rounded-xl overflow-hidden mb-5 bg-background border border-white/5">
                                        <img
                                            src={item.image?.startsWith('/uploads') ? `${IMAGE_URL}${item.image}` : item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <button 
                                                onClick={() => dispatch(removeFromWishlist(item._id))}
                                                className="p-2 bg-black/40 border border-white/10 rounded-lg text-white/40 hover:text-red-500 transition-all backdrop-blur-md"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-bold text-primary uppercase tracking-widest border border-white/5">
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-[13px] font-bold text-white uppercase tracking-tight truncate mb-1">{item.name}</h3>
                                                <div className="flex items-center gap-1 text-primary">
                                                    {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                                                </div>
                                            </div>
                                            <span className="text-base font-bold text-primary tracking-tighter shrink-0">${item.price}</span>
                                        </div>

                                        <button 
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full py-4 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white/80 hover:text-secondary rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            <ShoppingBag size={14} className="group-hover/btn:rotate-12 transition-transform" /> Move to Bag
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
