import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Star, ArrowRight, Sparkles, Diamond, Package,
  Clock, ShieldCheck, Search, Target, Heart, ChevronLeft,
  ChevronRight, Filter, LayoutGrid
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { IMAGE_URL } from '../utils/BASE_URL';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import toast from 'react-hot-toast';

// --- Sub-components ---

const PageHero = () => {
  const title = "OUR SHOP".split("");

  return (
    <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Shop"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-3 md:mb-6"
        >
          <Sparkles size={12} className="text-primary" />
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Premium Products</span>
        </motion.div>

        <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-4 md:mb-8 flex justify-center gap-[2px] font-luxury ">
          {title.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.6, ease: "easeOut" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 md:mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted"
        >
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="w-1.5 h-px bg-white/20" />
          <span className="text-primary ">Shop Collection</span>
        </motion.div>
      </div>
    </section>
  );
};

const LuxuryItem = ({ name, price, category, image, _id, delay, item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((x) => x._id === _id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(_id));
      toast.success('Removed from favorites');
    } else {
      dispatch(addToWishlist(item));
      toast.success('Added to favorites');
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(item));
    toast.success(`${name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ delay, duration: 0.4 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative bg-secondary rounded-2xl p-5 border border-white/[0.05] hover:border-primary/20 transition-all duration-500 shadow-2xl cursor-pointer"
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
          className="absolute top-4 left-4 p-2.5 bg-background/60 backdrop-blur-md border border-white/10 rounded-xl text-white hover:text-primary transition-all z-20"
        >
          <Heart size={14} className={isWishlisted ? 'fill-primary text-primary' : ''} />
        </button>

        {/* Category Tag */}
        <div className="absolute top-4 right-4 px-4 py-2 bg-background/90 backdrop-blur-md rounded-full text-[8px] font-black text-primary uppercase tracking-widest shadow-xl border border-white/10 z-20">
          {category || "Essence"}
        </div>
      </div>

      <div className="px-1">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 font-luxury leading-none group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-primary">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < Math.round(item?.rating || 4) ? "currentColor" : "none"} className={i < Math.round(item?.rating || 4) ? "text-primary" : "text-white/20"} />)}
              </div>
              <span className="text-[8px] font-black text-muted uppercase tracking-widest">({item?.numReviews || 12})</span>
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
          className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300 shadow-lg group-hover:shadow-primary/10 flex items-center justify-center gap-2 active:scale-95"
        >
          <ShoppingBag size={14} />
          Add To Cart
        </button>
      </div>
    </motion.div>
  );
};

export default function Shop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.products);
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = ['All Items', 'Skincare', 'Fragrance', 'Haircare', 'Accessories', 'Grooming'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All Items' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 font-sans overflow-x-hidden no-scrollbar">
      <PublicNavbar />

      <main>
        <PageHero />

        {/* Pro-Calibration Filter Bar (Sticky) */}
        <section className="sticky top-[55px] md:top-[60px] z-[50] bg-background/95 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="container mx-auto px-6 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center overflow-x-auto scrollbar-hide snap-x snap-mandatory flex-1 w-full md:w-auto">
              <div className="flex items-center gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`group relative flex-shrink-0 flex items-center justify-center px-4 py-3 transition-all duration-300 snap-center ${activeCategory === cat ? "text-primary" : "text-muted hover:text-white"
                      }`}
                  >
                    {activeCategory === cat && (
                      <motion.div
                        layoutId="proIndicator"
                        className="absolute top-0 left-0 right-0 flex justify-center z-20"
                      >
                        <div className="w-12 h-[2.5px] bg-primary shadow-[0_0_30px_rgba(201,162,39,1)]" />
                      </motion.div>
                    )}

                    <div className={`absolute inset-0 border-x border-white/[0.08] transition-all duration-300 ${activeCategory === cat
                      ? "bg-white/[0.05]"
                      : "bg-transparent group-hover:bg-white/[0.02]"
                      }`} />

                    <span className="relative z-10 text-[9px] font-medium uppercase tracking-[0.25em] whitespace-nowrap">
                      {cat}
                    </span>

                    <div className={`absolute bottom-0 inset-x-0 h-[1.5px] transition-all duration-700 ${activeCategory === cat ? "bg-gradient-to-r from-transparent via-primary/70 to-transparent" : "bg-transparent"
                      }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Enhanced */}
            <div className="flex items-center gap-4 w-full md:w-80">
              <div className="relative w-full group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="SEARCH PRODUCTS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-secondary/50 border border-white/5 rounded-xl pl-12 pr-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] outline-none focus:border-primary/30 focus:bg-secondary transition-all text-white placeholder:text-muted/20"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Collection Grid */}
        <section className="py-12 md:py-24 bg-background min-h-[800px]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-[2px] bg-primary/30" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Curated Collection</p>
                </div>
                <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-wide font-luxury">
                  {activeCategory === 'All Items' ? 'Our Boutique' : activeCategory}
                </h2>
              </div>
              <p className="text-muted text-[10px] font-black uppercase tracking-widest bg-secondary/50 px-5 py-2.5 rounded-xl border border-white/5">
                Showing {paginatedProducts.length} Results
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${searchTerm}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
              >
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[4/6] bg-secondary rounded-2xl animate-pulse" />
                  ))
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, index) => (
                    <LuxuryItem
                      key={product._id}
                      {...product}
                      item={product}
                      delay={index * 0.05}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-40 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                      <LayoutGrid size={40} className="text-muted/20" />
                    </div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">The selection is empty. Refine your discovery criteria.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Implementation */}
            {totalPages > 1 && (
              <div className="mt-12 lg:mt-24 flex flex-col items-center gap-8">
                <div className="flex items-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-14 h-14 rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-muted transition-all hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed group"
                  >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-2xl border border-white/5">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === pageNum
                            ? "bg-primary text-secondary shadow-lg shadow-primary/20 scale-110"
                            : "text-muted/50 hover:text-primary hover:bg-white/5"
                            }`}
                        >
                          {pageNum < 10 ? `0${pageNum}` : pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-14 h-14 rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-muted transition-all hover:border-primary hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed group"
                  >
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
