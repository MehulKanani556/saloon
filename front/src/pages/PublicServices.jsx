import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, Clock, Sparkles, ChevronRight, Search, Target
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';

const BASE_URL = 'http://localhost:5000/api';
const IMAGE_URL = 'http://localhost:5000';

// --- Sub-components ---

const PageHero = () => {
  const title = "OUR SERVICES".split("");
  
  return (
    <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Salon" 
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="flex justify-center mb-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            className="h-0.5 bg-saloon-500 rounded-full"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter flex justify-center gap-[2px]">
          {title.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
        >
          <Link to="/" className="hover:text-saloon-500 transition-colors">Home</Link>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <span className="text-saloon-500">Services</span>
        </motion.div>
      </div>
    </section>
  );
};

const BookingCTA = () => {
  const { adminInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-saloon-500 to-rosegold-500 rounded-[2.5rem] py-16 px-8 text-center text-white shadow-2xl shadow-saloon-200/20"
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none whitespace-pre-line">
              READY FOR YOUR {"\n"} TRANSFORMATION?
            </h2>
            <p className="text-white/90 text-sm md:text-base font-semibold uppercase tracking-widest mb-10 max-w-md mx-auto">
              Book your appointment today and experience luxury like never before.
            </p>
            <button 
              onClick={() => navigate(adminInfo ? '/dashboard' : '/login')}
              className="bg-white text-saloon-600 px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 mx-auto group shadow-lg"
            >
              {adminInfo ? 'Go to Dashboard' : 'Book Now'}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function PublicServices() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, serRes] = await Promise.all([
          axios.get(`${BASE_URL}/categories`),
          axios.get(`${BASE_URL}/services`)
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setServices(Array.isArray(serRes.data) ? serRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredServices = services.filter(s => 
    activeCategory === "All" || s.category?._id === activeCategory || s.category === activeCategory
  );

  return (
    <div className="relative selection:bg-saloon-500 selection:text-white bg-white dark:bg-slate-950 font-sans min-h-screen">
      <PublicNavbar />      
      <main>
        <PageHero />
        {/* Filter Bar */}
        <section className="sticky top-[60px] md:top-[57px] z-[50] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 py-4">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              <button 
                onClick={() => setActiveCategory("All")}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                  activeCategory === "All" 
                    ? "bg-saloon-500 border-saloon-500 text-white shadow-lg shadow-saloon-500/20" 
                    : "bg-white dark:bg-slate-900 border-transparent text-slate-500 hover:border-saloon-500/30"
                }`}
              >
                All Services
              </button>
              {categories.map(cat => (
                <button 
                  key={cat._id}
                  onClick={() => setActiveCategory(cat._id)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                    activeCategory === cat._id
                      ? "bg-saloon-500 border-saloon-500 text-white shadow-lg shadow-saloon-500/20" 
                      : "bg-white dark:bg-slate-900 border-transparent text-slate-500 hover:border-saloon-500/30"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 lg:py-32 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="container mx-auto px-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              >
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm animate-pulse">
                      <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
                      <div className="p-8 space-y-4">
                        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                      </div>
                    </div>
                  ))
                ) : filteredServices.length > 0 ? (
                  filteredServices.map((service, i) => (
                    <motion.div
                      key={service._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-saloon-500/10 hover:-translate-y-2"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : service.image} 
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        />
                        <div className="absolute top-6 left-6">
                          <div className="px-5 py-2 bg-saloon-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-saloon-500/30">
                            {service.category?.name || "Ritual"}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      <div className="p-8 md:p-10">
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                          <Clock size={14} className="text-saloon-500" />
                          {service.duration} Minutes
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 group-hover:text-saloon-600 transition-colors">
                          {service.name}
                        </h3>

                        <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Investment</span>
                            <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${service.price}</span>
                          </div>
                          
                          <button 
                            onClick={() => navigate(adminInfo ? '/dashboard' : '/login')}
                            className="w-14 h-14 rounded-2xl bg-slate-950 dark:bg-white dark:text-slate-900 text-white flex items-center justify-center transition-all hover:bg-saloon-500 hover:text-white dark:hover:bg-saloon-500 dark:hover:text-white shadow-xl shadow-slate-200/50 dark:shadow-none"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-40 text-center">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 text-slate-300">
                      <Scissors size={48} strokeWidth={1} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">No Rituals Found</h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Adjust your filters to see more of our exquisite collection.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
        <BookingCTA />
      </main>
      <PublicFooter />
    </div>
  );
}
