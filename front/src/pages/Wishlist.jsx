import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ShoppingCart, Heart, ArrowRight, Star, ShoppingBag, ArrowLeft, Clock, Sparkles } from 'lucide-react';
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
        toast.success(`Success! ${item.name} moved to your Shopping Cart`);
    };

    return (
        <UserPanelLayout title="Wishlist" hideSidebar={true}>
            <div className="flex flex-col gap-10 md:gap-14 min-h-[75vh]">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none font-luxury">
                            Your <span className="text-primary italic">Wishlist</span>
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-px bg-primary/30" />
                            <p className="text-muted/60 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'Service' : 'Services'} saved for later
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/shop"
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black text-muted hover:text-primary hover:bg-primary/5 uppercase tracking-[0.2em] transition-all border border-white/5"
                    >
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                </div>

                {wishlistItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-12 md:p-32 text-center space-y-8 md:space-y-12 flex flex-col items-center shadow-3xl"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-all duration-700" />
                            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-background border border-white/10 rounded-full flex items-center justify-center text-primary/40 shadow-premium">
                                <Heart size={40} md:size={56} strokeWidth={1} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight font-luxury">Your Wishlist is Empty</h3>
                            <p className="text-muted/40 text-[11px] md:text-[13px] font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-widest px-4">
                                Save your favorite groomed services and products here for future selection.
                            </p>
                        </div>
                        <Link
                            to="/shop"
                            className="bg-primary text-secondary px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 font-luxury"
                        >
                            Explore Services <ArrowRight size={16} strokeWidth={3} />
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
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group relative bg-secondary rounded-2xl p-5 border border-white/[0.05] hover:border-primary/20 transition-all duration-500 flex flex-col h-full"
                                >
                                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-2xl">
                                        <img
                                            src={item.image?.startsWith('/uploads') ? `${IMAGE_URL}${item.image}` : (item.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1074&auto=format&fit=crop")}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        
                                        {/* Remove Button */}
                                        <div className="absolute top-2 left-0 z-10">
                                            <button
                                                onClick={() => {
                                                    dispatch(removeFromWishlist(item._id));
                                                    toast.success('Removed from wishlist');
                                                }}
                                                className="p-3 bg-background/80 hover:bg-rose-500/20 hover:text-rose-500 border border-white/10 rounded-xl text-muted transition-all backdrop-blur-md shadow-xl"
                                                title="Remove from Wishlist"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        {/* Category Tag */}
                                        <div className="absolute top-2 right-0 px-4 py-2 bg-background/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-xl border border-white/10">
                                            {item.category?.name || item.category || "Service"}
                                        </div>
                                    </div>

                                    <div className="px-1 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 font-luxury leading-none group-hover:text-primary transition-colors">
                                                {item.name}
                                            </h3>
                                            <span className="text-xl font-black text-primary drop-shadow-[0_0_10px_rgba(201,162,39,0.3)]">
                                                ${item.price}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-muted text-[9px] font-bold uppercase tracking-widest mb-8">
                                            <span className="flex items-center gap-2">
                                                <Clock size={12} className="text-primary" /> {item.duration || "45"} Mins
                                            </span>
                                            <span className="w-1 h-1 bg-white/10 rounded-full" />
                                            <span className="flex items-center gap-2">
                                                <Sparkles size={12} className="text-primary" /> Expert Care
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full mt-auto py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300 shadow-lg group-hover:shadow-primary/10 flex items-center justify-center gap-4 group/btn"
                                        >
                                            <ShoppingBag size={16} className="group-hover/btn:rotate-12 transition-transform" /> Move to Cart
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
