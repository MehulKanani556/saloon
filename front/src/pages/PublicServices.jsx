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

const ITEMS_PER_PAGE = 9;

// --- Sub-components ---

const PageHero = () => {
  const title = "OUR RITUALS".split("");

  return (
    <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Salon"
          className="w-full h-full object-cover opacity-15 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6"
        >
          <Sparkles size={12} className="text-primary" />
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Pure Elegance</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter flex justify-center gap-[2px] font-luxury italic">
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
          className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted"
        >
          <Link to="/" className="hover:text-primary transition-colors">Home Base</Link>
          <span className="w-1.5 h-px bg-white/20" />
          <span className="text-primary italic">The Menu</span>
        </motion.div>
      </div>
    </section>
  );
};

const BookingCTA = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-secondary rounded-[3rem] py-20 px-8 text-center text-white border border-white/5 shadow-3xl"
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #C9A227 1px, transparent 0)', backgroundSize: '32px 32px' }} />

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none whitespace-pre-line font-luxury">
              READY FOR YOUR {"\n"} <span className="text-primary italic font-luxury">TRANSFORMATION?</span>
            </h2>
            <p className="text-muted text-[11px] md:text-xs font-black uppercase tracking-[0.3em] mb-12 max-w-sm mx-auto leading-relaxed">
              Ascend to a new standard of personal care. Secure your ritual coordinates today.
            </p>
            <button
              onClick={() => {
                if (!userInfo) navigate('/login');
                else if (userInfo.role === 'Admin') navigate('/admin/dashboard');
                else if (userInfo.role === 'Staff') navigate('/staff/dashboard');
                else navigate('/book');
              }}
              className="bg-primary text-secondary px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 mx-auto group shadow-2xl hover:scale-105 transition-all active:scale-95"
            >
              <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
              {userInfo ? 'Access Command Center' : 'Secure Booking'}
            </button>
          </div>
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
    dispatch(fetchServices());
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
      <main className="pt-16 md:pt-20">
        <PageHero />

        {/* Filter Bar */}
        <section className="sticky top-[68px] md:top-[60px] z-[50] bg-background/80 backdrop-blur-xl border-b border-white/5 py-6">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => handleCategoryChange("All")}
                className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${activeCategory === "All"
                  ? "bg-primary border-primary text-secondary shadow-2xl shadow-primary/20"
                  : "bg-secondary border-white/10 text-muted hover:border-primary/40"
                  }`}
              >
                All Rituals
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border ${activeCategory === cat._id
                    ? "bg-primary border-primary text-secondary shadow-2xl shadow-primary/20"
                    : "bg-secondary border-white/10 text-muted hover:border-primary/40"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 lg:py-40 bg-background min-h-[800px]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-[2px] bg-primary/30" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Available Experiences</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-luxury">
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
              >
                {(servicesLoading || categoriesLoading) ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-secondary rounded-[2.5rem] overflow-hidden shadow-sm animate-pulse border border-white/5">
                      <div className="aspect-[4/3] bg-white/5" />
                      <div className="p-10 space-y-4">
                        <div className="h-6 w-3/4 bg-white/5 rounded-lg" />
                        <div className="h-20 w-full bg-white/5 rounded-2xl" />
                      </div>
                    </div>
                  ))
                ) : paginatedServices.length > 0 ? (
                  paginatedServices.map((service, i) => (
                    <motion.div
                      key={service._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group bg-secondary rounded-[3rem] overflow-hidden border border-white/5 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(201,162,39,0.15)] hover:-translate-y-3"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
                        />
                        <div className="absolute top-8 left-8">
                          <div className="px-5 py-2.5 bg-primary/90 backdrop-blur-md text-secondary rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                            {service.category?.name || "Ritual"}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
                      </div>

                      <div className="p-10 md:p-12">
                        <div className="flex items-center gap-3 text-[9px] font-black text-muted uppercase tracking-[0.3em] mb-6">
                          <Clock size={14} className="text-primary opacity-50" />
                          <span className="italic">{service.duration} Minutes Session</span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-10 group-hover:text-primary transition-colors duration-500 font-luxury leading-tight">
                          {service.name}
                        </h3>

                        <div className="flex items-center justify-between pt-10 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-muted/60 uppercase tracking-[0.4em] mb-1 italic">Investment</span>
                            <span className="text-3xl font-black text-white tracking-tighter">${service.price}</span>
                          </div>

                          <button
                            onClick={() => {
                              if (!userInfo) navigate('/login');
                              else if (userInfo.role === 'Admin') navigate('/admin/dashboard');
                              else if (userInfo.role === 'Staff') navigate('/staff/dashboard');
                              else navigate('/book');
                            }}
                            className="w-16 h-16 rounded-2xl bg-secondary border border-white/10 text-primary flex items-center justify-center transition-all hover:bg-primary hover:text-secondary hover:border-primary shadow-2xl group/btn"
                          >
                            <ChevronRight size={28} className="transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-56 text-center">
                    <div className="w-32 h-32 bg-secondary rounded-[3rem] flex items-center justify-center mb-10 text-white/5 border border-white/10 shadow-inner">
                      <LayoutGrid size={64} strokeWidth={1} />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 font-luxury">No Matches Found</h3>
                    <p className="text-[11px] font-black text-muted uppercase tracking-[0.3em] max-w-sm leading-relaxed opacity-60">The current filter criteria returned zero available rituals. Please refine your selection.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagination UI */}
            {!(servicesLoading || categoriesLoading) && totalPages > 1 && (
              <div className="mt-24 flex flex-col items-center gap-8">
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

                <p className="text-[9px] font-black text-muted/40 uppercase tracking-[0.5em] italic">
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
