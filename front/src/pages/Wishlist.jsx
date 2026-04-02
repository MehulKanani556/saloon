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
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'Ritual' : 'Rituals'} saved for later
                            </p>
                        </div>
                    </div>
                    <Link 
                        to="/shop" 
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black text-muted hover:text-primary hover:bg-primary/5 uppercase tracking-[0.2em] transition-all border border-white/5"
                    >
                        <ArrowLeft size={16} /> Continue Selection
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
                            <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight font-luxury">The Archive is Empty</h3>
                            <p className="text-muted/40 text-[11px] md:text-[13px] font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-widest px-4">
                                Curate your collection of professional grooming rituals and archives for future execution.
                            </p>
                        </div>
                        <Link 
                            to="/shop" 
                            className="bg-primary text-secondary px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 font-luxury"
                        >
                            Explore Artifacts <ArrowRight size={16} strokeWidth={3} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
                        <AnimatePresence mode="popLayout">
                            {wishlistItems.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05, type: 'spring', damping: 25 }}
                                    className="group relative bg-secondary/50 backdrop-blur-3xl rounded-3xl p-5 border border-white/5 shadow-2xl hover:border-primary/30 transition-all duration-700 overflow-hidden flex flex-col h-full"
                                >
                                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-background border border-white/10 shadow-inner">
                                        <img
                                            src={item.image?.startsWith('/uploads') ? `${IMAGE_URL}${item.image}` : item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute top-4 right-4 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                                            <button 
                                                onClick={() => {
                                                    dispatch(removeFromWishlist(item._id));
                                                    toast.success('Artifact removed from archives');
                                                }}
                                                className="p-3 bg-background/80 hover:bg-rose-500 border border-white/10 rounded-xl text-muted hover:text-white transition-all backdrop-blur-md shadow-xl"
                                                title="Remove from Archive"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-background/80 backdrop-blur-md rounded-xl text-[8px] font-black text-primary uppercase tracking-[0.3em] border border-white/5 shadow-lg">
                                            {item.category || "Professional"}
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tight truncate mb-2 font-luxury leading-tight group-hover:text-primary transition-colors">
                                                    {item.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-primary/40">
                                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" stroke="none" className="group-hover:text-primary transition-colors duration-500" />)}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-xl md:text-2xl font-black text-primary tracking-tighter block leading-none">${item.price}</span>
                                                <span className="text-[8px] font-black text-muted uppercase tracking-[0.2em] mt-1 block opacity-40">Artifact Value</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full mt-auto py-5 bg-background hover:bg-primary border border-white/5 hover:border-primary text-white/50 hover:text-secondary rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all flex items-center justify-center gap-4 group/btn active:scale-95"
                                        >
                                            <ShoppingBag size={18} className="group-hover/btn:rotate-12 transition-transform" /> Move to Bag
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
