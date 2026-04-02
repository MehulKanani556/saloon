import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors, Clock, Sparkles, ChevronRight, ChevronLeft, Search, Target, LayoutGrid
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices } from '../redux/slices/serviceSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import { IMAGE_URL } from '../utils/BASE_URL';

const ITEMS_PER_PAGE = 12;

// --- Sub-components ---

const PageHero = () => {
  const title = "OUR RITUALS".split("");

  return (
    <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Salon"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" /> */}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-3 md:mb-6"
        >
          <Sparkles size={12} className="text-primary" />
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Pure Elegance</span>
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
          <Link to="/" className="hover:text-primary transition-colors">Home Base</Link>
          <span className="w-1.5 h-px bg-white/20" />
          <span className="text-primary ">The Menu</span>
        </motion.div>
      </div>
    </section>
  );
};

export default function PublicServices() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { services, loading: servicesLoading } = useSelector(state => state.services);
  const { categories, loading: categoriesLoading } = useSelector(state => state.categories);

  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchServices(true));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter Logic
  const filteredServices = services.filter(s =>
    activeCategory === "All" || s.category?._id === activeCategory || s.category === activeCategory
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative selection:bg-primary/30 selection:text-white bg-background font-sans min-h-screen no-scrollbar">
      <PublicNavbar />
      <main>
        <PageHero />

        {/* Pro-Calibration Filter Bar */}
        <section className="sticky top-[55px] md:top-[60px] z-[50] bg-background/95 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="container mx-auto px-6 py-6 md:py-10">
            <div className="flex items-center overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              <div className="flex items-center gap-3 md:gap-4">
                {/* "All" Rituals - Optimized Width */}
                <button
                  onClick={() => handleCategoryChange("All")}
                  className={`group relative flex-shrink-0 flex items-center justify-center px-4 py-3 transition-all duration-300 snap-center ${activeCategory === "All" ? "text-primary" : "text-muted hover:text-white"
                    }`}
                >
                  {/* Active Top Glow - Double-Safe Centering */}
                  {activeCategory === "All" && (
                    <motion.div
                      layoutId="proIndicator"
                      className="absolute top-0 left-0 right-0 flex justify-center z-20"
                    >
                      <div className="w-12 h-[2px] bg-primary shadow-[0_0_30px_rgba(201,162,39,1)]" />
                    </motion.div>
                  )}

                  {/* Glass Segment */}
                  <div className={`absolute inset-0 border-x border-white/[0.08] transition-all duration-300 ${activeCategory === "All"
                    ? "bg-white/[0.05]"
                    : "bg-transparent group-hover:bg-white/[0.02]"
                    }`} />

                  <span className="relative z-10 text-[9px] font-medium uppercase tracking-[0.25em] whitespace-nowrap">
                    All Rituals
                  </span>

                  {/* Bottom Highlight */}
                  <div className={`absolute bottom-0 inset-x-0 h-[1.5px] transition-all duration-700 ${activeCategory === "All" ? "bg-gradient-to-r from-transparent via-primary/70 to-transparent" : "bg-transparent"
                    }`} />
                </button>

                {/* Ritual Category Tabs - Pro Calibration */}
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat._id)}
                    className={`group relative flex-shrink-0 flex items-center justify-center px-4 py-3 transition-all duration-300 snap-center ${activeCategory === cat._id ? "text-primary" : "text-muted hover:text-white"
                      }`}
                  >
                    {/* Active Top Glow - Double-Safe Centering */}
                    {activeCategory === cat._id && (
                      <motion.div
                        layoutId="proIndicator"
                        className="absolute top-0 left-0 right-0 flex justify-center z-20"
                      >
                        <div className="w-14 h-[2.5px] bg-primary shadow-[0_0_30px_rgba(201,162,39,1)]" />
                      </motion.div>
                    )}

                    {/* Glass Segment */}
                    <div className={`absolute inset-0 border-x border-white/[0.08] transition-all duration-300 ${activeCategory === cat._id
                      ? "bg-white/[0.05]"
                      : "bg-transparent group-hover:bg-white/[0.02]"
                      }`} />

                    <span className="relative z-10 text-[9px] font-medium uppercase tracking-[0.25em] whitespace-nowrap">
                      {cat.name}
                    </span>

                    {/* Bottom Highlight */}
                    <div className={`absolute bottom-0 inset-x-0 h-[1.5px] transition-all duration-700 ${activeCategory === cat._id ? "bg-gradient-to-r from-transparent via-primary/70 to-transparent" : "bg-transparent"
                      }`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 bg-background min-h-[800px]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-[2px] bg-primary/30" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Available Experiences</p>
                </div>
                <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-wide font-luxury">
                  {activeCategory === 'All' ? 'The Collection' : categories.find(c => c._id === activeCategory)?.name}
                </h2>
              </div>
              <p className="text-muted text-[10px] font-black uppercase tracking-widest bg-secondary/50 px-5 py-2.5 rounded-xl border border-white/5">
                Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredServices.length)} of {filteredServices.length} Results
              </p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${currentPage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {(servicesLoading || categoriesLoading) ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-secondary/40 rounded-2xl overflow-hidden animate-pulse border border-white/5">
                      <div className="aspect-[4/3] bg-white/5" />
                      <div className="p-8 space-y-4">
                        <div className="h-6 w-3/4 bg-white/5 rounded-full" />
                        <div className="h-20 w-full bg-white/5 rounded-2xl" />
                      </div>
                    </div>
                  ))
                ) : paginatedServices.length > 0 ? (
                  paginatedServices.map((service, i) => (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="group relative bg-secondary rounded-2xl p-5 border border-white/[0.05] hover:border-primary/20 transition-all duration-500"
                    >
                      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-2xl">
                        <img
                          src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : (service.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1074&auto=format&fit=crop")}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4 px-4 py-2 bg-background/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-xl border border-white/10">
                          {service.category?.name || categories.find(c => c._id === (service.category?._id || service.category))?.name || "Ritual"}
                        </div>
                      </div>

                      <div className="px-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 font-luxury leading-none">
                            {service.name}
                          </h3>
                          <span className="text-xl font-black text-primary drop-shadow-[0_0_10px_rgba(201,162,39,0.3)]">
                            ${service.price}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-muted text-[9px] font-bold uppercase tracking-widest mb-8">
                          <span className="flex items-center gap-2">
                            <Clock size={12} className="text-primary" /> {service.duration} Mins
                          </span>
                          <span className="w-1 h-1 bg-white/10 rounded-full" />
                          <span className="flex items-center gap-2">
                            <Sparkles size={12} className="text-primary" /> Expert Care
                          </span>
                        </div>

                        <button
                          onClick={() => navigate('/book', { state: { serviceId: service._id } })}
                          className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary hover:text-secondary hover:border-primary transition-all duration-300 shadow-lg group-hover:shadow-primary/10"
                        >
                          Book Protocol
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-56 text-center">
                    <div className="w-40 h-40 bg-secondary/50 rounded-3xl flex items-center justify-center mb-12 text-white/[0.03] border border-white/5 shadow-inner">
                      <LayoutGrid size={80} strokeWidth={1} />
                    </div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 font-luxury">No Matches Found</h3>
                    <p className="text-[11px] font-black text-muted uppercase tracking-[0.3em] max-w-sm leading-relaxed opacity-60">The current filter criteria returned zero available rituals. Please refine your selection.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagination UI */}
            {!(servicesLoading || categoriesLoading) && totalPages > 1 && (
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

                <p className="text-[9px] font-black text-muted/40 uppercase tracking-[0.5em] ">
                  Chronicle Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </div>
        </section>
        {/* <BookingCTA /> */}
      </main>
      <PublicFooter />
    </div>
  );
}

