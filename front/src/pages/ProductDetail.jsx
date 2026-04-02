import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Heart,
    Star,
    ArrowLeft,
    Minus,
    Plus,
    ShieldCheck,
    Truck,
    RefreshCcw,
    ChevronRight,
    Loader2,
    Package
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';
import api from '../utils/api';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import { IMAGE_URL } from '../utils/BASE_URL';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { wishlistItems } = useSelector(state => state.wishlist);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [relatedProducts, setRelatedProducts] = useState([]);

    const isWishlisted = wishlistItems.some(item => item._id === id);

    useEffect(() => {
        fetchProductData();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);

            const { data: allProducts } = await api.get('/products');
            setRelatedProducts(allProducts.filter(p => p.category === data.category && p._id !== id).slice(0, 4));

            setLoading(false);
        } catch (err) {
            toast.error('Failed to load product');
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty: quantity }));
        toast.success(`${product.name} added to cart`);
    };

    const handleWishlist = () => {
        if (isWishlisted) {
            dispatch(removeFromWishlist(id));
            toast.success('Removed from wishlist');
        } else {
            dispatch(addToWishlist(product));
            toast.success('Added to wishlist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
                <Loader2 className="w-12 h-12 text-primary animate-spin" strokeWidth={1} />
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em] animate-pulse">Loading Product Details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <ShieldCheck size={40} className="text-muted/20" />
                </div>
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-luxury">Product Not Found</h2>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">The requested product does not exist.</p>
                </div>
                <button onClick={() => navigate('/shop')} className="premium-button p-6 !px-12 flex items-center gap-4 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-secondary">
            <PublicNavbar />

            <main className="pt-32 pb-40 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-4 mb-16 overflow-x-auto no-scrollbar whitespace-nowrap">
                        <button onClick={() => navigate('/')} className="text-[9px] font-black text-muted uppercase tracking-[0.3em] hover:text-white transition-colors">Home</button>
                        <ChevronRight size={10} className="text-muted/40 shrink-0" />
                        <button onClick={() => navigate('/shop')} className="text-[9px] font-black text-muted uppercase tracking-[0.3em] hover:text-white transition-colors">Shop</button>
                        <ChevronRight size={10} className="text-muted/40 shrink-0" />
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32">
                        {/* Image Gallery */}
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="aspect-[4/5] rounded-[12px] overflow-hidden bg-dark-card border border-white/5 relative group cursor-zoom-in shadow-2xl"
                            >
                                <img
                                    src={product.image?.startsWith('/uploads') ? `${IMAGE_URL}${product.image}` : product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </motion.div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{product.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-primary">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">(48 Reviews)</span>
                                    </div>
                                </div>

                                <h1 className="text-xl xl:text-3xl font-black text-white uppercase tracking-tighter leading-[0.9] font-luxury">
                                    {product?.name}
                                </h1>

                                <div className="space-y-4">
                                    <div className="flex items-end gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-40">Price</p>
                                            <p className="text-4xl font-black text-primary font-luxury">${product.price}</p>
                                        </div>
                                        <div className="pb-1">
                                            <div className="px-5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">In Stock</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black text-muted/40 uppercase tracking-[0.3em] font-sans">Tax included.</p>
                                </div>

                                <p className="text-sm font-medium text-muted/60 leading-relaxed max-w-xl">
                                    {product.description || "Premium quality product designed for professional results and exceptional experience."}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-8 pt-8 border-t border-white/5">
                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 h-16">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-muted hover:text-white transition-colors">
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center text-[11px] font-black text-white font-luxury">{quantity.toString().padStart(2, '0')}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-muted hover:text-white transition-colors">
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 min-w-[240px] h-16 bg-primary text-secondary rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-3xl shadow-primary/20"
                                    >
                                        <ShoppingBag size={20} /> Add to Cart
                                    </button>

                                    <button
                                        onClick={handleWishlist}
                                        className={`w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center transition-all active:scale-90 ${isWishlisted ? 'bg-primary text-secondary border-primary' : 'bg-white/5 text-white hover:border-primary'}`}
                                    >
                                        <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                                    </button>
                                </div>
                            </div>

                            {/* Shipping Policy */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                {[
                                    { label: 'Fast Shipping', icon: Truck, detail: '2-4 Business Days' },
                                    { label: 'Secure Payment', icon: ShieldCheck, detail: 'Fully Encrypted' },
                                    { label: 'Easy Returns', icon: RefreshCcw, detail: '14 Day Policy' }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center gap-3 text-primary">
                                            <item.icon size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{item?.label}</span>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted/40 ml-7">{item?.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-60 space-y-12">
                            <div className="flex items-end justify-between border-b border-white/5 pb-8">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Collections</p>
                                    <h2 className="text-3xl xl:text-4xl font-black text-white uppercase tracking-tighter font-luxury">Related Products</h2>
                                </div>
                                <button onClick={() => navigate('/shop')} className="text-[9px] font-black text-muted hover:text-primary uppercase tracking-widest transition-colors mb-2">View All</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedProducts.map((p, i) => (
                                    <motion.div
                                        key={p._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        onClick={() => navigate(`/product/${p._id}`)}
                                        className="group cursor-pointer space-y-6"
                                    >
                                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-dark-card border border-white/5 relative shadow-xl">
                                            <img
                                                src={p.image?.startsWith('/uploads') ? `${IMAGE_URL}${p.image}` : p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-full">
                                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">View Product</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-start gap-4 px-1">
                                            <h3 className="text-base md:text-lg font-black text-white uppercase font-luxury tracking-tight group-hover:text-primary transition-colors">{p.name}</h3>
                                            <span className="text-base md:text-lg font-black text-primary font-luxury">${p.price}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
