import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ArrowRight, Sparkles, Diamond, Package, Clock, ShieldCheck, Search, Target, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { IMAGE_URL } from '../utils/BASE_URL';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import toast from 'react-hot-toast';

const LuxuryItem = ({ name, price, category, image, _id, delay, item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((x) => x._id === _id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(_id));
      toast.success('Asset de-cataloged');
    } else {
      dispatch(addToWishlist(item));
      toast.success('Asset cataloged');
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(item));
    toast.success(`${name} Induction Complete`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ delay, duration: 0.4 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative bg-dark-card rounded-2xl p-5 border border-white/[0.05] hover:border-primary/20 transition-all duration-500 shadow-2xl cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-6 shadow-2xl">
        <img
          src={image?.startsWith('/uploads') ? `${IMAGE_URL}${image}` : image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Wishlist Toggle */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 left-0 p-2.5 bg-background/60 backdrop-blur-md border border-white/10 rounded-xl text-white hover:text-primary transition-all z-20"
        >
          <Heart size={14} className={isWishlisted ? 'fill-primary text-primary' : ''} />
        </button>

        {/* Category Tag */}
        <div className="absolute top-2 right-0 px-4 py-2 bg-background/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-xl border border-white/10 z-20">
          {category || "Essence"}
        </div>
      </div>

      <div className="px-1">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 font-luxury leading-none">
              {name}
            </h3>
            <div className="flex items-center gap-0.5 text-primary">
              {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
            </div>
          </div>
          <span className="text-xl font-black text-primary drop-shadow-[0_0_10px_rgba(201,162,39,0.3)]">
            ${price}
          </span>
        </div>

        <div className="flex items-center gap-4 text-muted text-[9px] font-bold uppercase tracking-widest mb-8">
          <span className="flex items-center gap-2">
            <Package size={12} className="text-primary" /> Curated
          </span>
          <span className="w-1 h-1 bg-white/10 rounded-full" />
          <span className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-primary" /> Verified
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300 shadow-lg group-hover:shadow-primary/10 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} />
          Induct To Matrix
        </button>
      </div>
    </motion.div>
  );
};

export default function Shop() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = ['All Items', 'Skincare', 'Fragrance', 'Haircare', 'Accessories', 'Grooming'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All Items' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading && !products.length) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30">
      <PublicNavbar />

      <main className="pt-32 pb-20 container mx-auto px-6">
        <div className="space-y-24">

          {/* Hero Section */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
            <img
              src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1600"
              className="w-full h-full object-cover opacity-60"
              alt="Shop Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/40 to-transparent" />

            <div className="absolute inset-0 flex items-center px-8 md:px-16">
              <div className="max-w-2xl space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-luxury-gradient" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.6em] animate-pulse">New Collection</p>
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] font-luxury">
                  Aesthetic <br /><span className="text-primary/50">Curations</span>
                </h2>
                <p className="text-muted/60 text-[12px] md:text-[14px] font-medium leading-relaxed max-w-lg tracking-wide uppercase">
                  Synchronize your daily ritual with high-fidelity formulations synthesized for the modern collective.
                </p>
                <div className="flex items-center gap-6 md:gap-8 pt-4">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="text-primary" size={24} />
                    <span className="text-[9px] font-black uppercase text-muted tracking-widest">Verified</span>
                  </div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div className="flex flex-col items-center gap-2">
                    <Diamond className="text-primary" size={24} />
                    <span className="text-[9px] font-black uppercase text-muted tracking-widest">Premium</span>
                  </div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="text-primary" size={24} />
                    <span className="text-[9px] font-black uppercase text-muted tracking-widest">Pure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating UI Elements */}
            <div className="absolute top-10 right-10 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hidden lg:block">
              <p className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Live Inventory</p>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-secondary bg-dark-card overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-secondary bg-primary flex items-center justify-center text-secondary text-[10px] font-black">
                  +42
                </div>
              </div>
            </div>
          </div>

          {/* Search & Categories Bar */}
          <div className="flex flex-wrap items-center justify-between gap-8 pb-12 border-b border-white/5">
            <div className="flex gap-12 overflow-x-auto pb-4 scrollbar-hide flex-1">
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeCategory === cat ? 'text-primary' : 'text-muted/40 hover:text-white'}`}
                >
                  {cat}
                  {activeCategory === cat && <motion.div layoutId="underline" className="absolute -bottom-4 left-0 right-0 h-1 bg-primary rounded-full" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-6 w-full lg:w-auto">
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl flex items-center gap-4 focus-within:border-primary/40 transition-all flex-1 lg:flex-none">
                <Search size={16} className="text-muted/40" />
                <input
                  type="text"
                  placeholder="SEARCH PRODUCTS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-white placeholder:text-white/5"
                />
              </div>
            </div>
          </div>

          {/* Grid Setup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredProducts.map((product, index) => (
              <LuxuryItem
                key={product._id}
                {...product}
                item={product}
                delay={index * 0.1}
              />
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-40 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <Target size={30} className="text-muted/20" />
                </div>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">No products found in this category.</p>
              </div>
            )}
          </div>

          {/* Global Footer Banner */}
          {/* <div className="bg-luxury-gradient rounded-3xl p-10 md:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:scale-150 transition-transform duration-1000 rotate-12">
              <ShoppingBag size={200} />
            </div>
            <div className="relative z-10 space-y-8 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="space-y-6">
                <h3 className="text-4xl md:text-5xl font-black text-secondary uppercase tracking-tighter leading-none font-luxury">
                  Join our <br /><span className="opacity-50">Community</span>
                </h3>
                <p className="text-secondary/60 text-[12px] font-black uppercase tracking-[0.2em]">
                  Get exclusive updates on luxury releases and drops.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex bg-secondary/10 backdrop-blur-xl border border-secondary/20 p-2 rounded-2xl w-full max-w-md">
                  <input
                    type="email"
                    placeholder="YOUR EMAIL ADDRESS"
                    className="bg-transparent text-secondary px-6 py-4 flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-secondary/40"
                  />
                  <button className="bg-secondary text-primary px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div> */}

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
