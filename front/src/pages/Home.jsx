import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, Star, Clock, Shield, ChevronDown, ChevronRight, 
  Instagram, Facebook, Twitter, Mail, Phone, MapPin, 
  Menu, X, Sparkles, LogIn
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import StatsBanner from '../components/public/StatsBanner';

const BASE_URL = 'http://localhost:5000/api';
const IMAGE_URL = 'http://localhost:5000';

// --- Sub-components ---


const Hero = () => {
  const { adminInfo } = useSelector((state) => state.auth);
  const headlineWords = "WHERE BEAUTY MEETS ARTISTRY".split(" ");
  const navigate = useNavigate();
  
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop" 
          alt="Luxury Salon Background"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-saloon-500/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-100%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-20 text-center">
        {/* Floating Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-saloon-500"
          />
          <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em]">
            ⭐ 4.9 Rating | 500+ Happy Clients
          </span>
        </motion.div>

        {/* Cinematic Headline */}
        <div className="mb-6 flex flex-wrap justify-center gap-x-4 md:gap-x-8">
          {headlineWords.map((word, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter"
              >
                {word}
              </motion.h2>
            </div>
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-slate-300 text-xs md:text-base font-medium tracking-widest uppercase mb-12 max-w-2xl mx-auto italic"
        >
          Crafting Your Perfect Style Since Day One
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(adminInfo ? '/dashboard' : '/login')}
            className="premium-button-primary !px-8 !py-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-saloon-500/20"
          >
            {adminInfo ? 'Go to Dashboard' : 'Book Appointment'}
          </motion.button>
          <a href="#services">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] transition-all rounded-xl"
            >
              Explore Services
            </motion.button>
          </a>
        </motion.div>
      </div>


      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};


const ServicesPreview = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/services`);
        setServices(Array.isArray(res.data) ? res.data.slice(0, 6) : []); 
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter text-center"
          >
            Our Signature <span className="text-saloon-500">Services</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            className="h-1 bg-saloon-500 mt-4 rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 h-[400px] animate-pulse">
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-6" />
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-8" />
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))
          ) : (
            services.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-white/5"
              >
                <div className="relative overflow-hidden rounded-[1.5rem] aspect-[4/3] mb-6 shadow-inner">
                  <img 
                    src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : (service.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1074&auto=format&fit=crop")} 
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1074&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[9px] font-black text-saloon-600 uppercase tracking-widest shadow-lg">
                    {service.category?.name || "Ritual"}
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{service.name}</h3>
                    <span className="text-xl font-black text-saloon-600">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[9px] font-black uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-saloon-500" /> {service.duration} Mins
                    </span>
                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-saloon-500" /> Professional Care
                    </span>
                  </div>
                  <button 
                    onClick={() => navigate('/book')}
                    className="w-full py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white hover:bg-saloon-500 hover:text-white transition-all shadow-sm group-hover:shadow-saloon-200/50"
                  >
                    Book Ritual Now
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Link to="/services" className="group flex items-center gap-4 px-8 py-4 rounded-xl border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all">
            View All Services
            <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const features = [
    { icon: <Scissors size={20} className="text-white" />, title: "Expert Stylists", desc: "Masters certified with international exposure." },
    { icon: <Star size={20} className="text-white" />, title: "Premium Products", desc: "World-class organic and luxury products." },
    { icon: <Clock size={20} className="text-white" />, title: "Relaxing Ambiance", desc: "Escape the noise in a tranquil environment." },
    { icon: <Shield size={20} className="text-white" />, title: "Easy Booking", desc: "Seamless process to respect your time." },
  ];

  return (
    <section id="about" className="py-24 bg-saloon-50 dark:bg-slate-900/50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-saloon-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4"
            >
              The Glow Experience
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 leading-[0.9] md:leading-[0.95]"
            >
              Why Discerning <br /> <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-saloon-500 to-rosegold-500">Clients Choose Us</span>
            </motion.h2>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg mb-12 max-w-xl">
              We don't just provide services; we craft masterpieces. Our dedication to perfection and luxury makes us the premier choice in the city.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg shadow-saloon-500/20">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{f.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wide">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1522335789182-9640974cf2c3?q=80&w=1073&auto=format&fit=crop" alt="Salon Ambiance" className="w-full grayscale hover:grayscale-0 transition-all duration-1000" />
            </motion.div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-saloon-200/30 rounded-full blur-[80px] z-0" />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl z-20 hidden md:block">
              <p className="text-4xl md:text-5xl font-black text-saloon-500 mb-1 tracking-tighter">12+</p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Years of Artistry</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamPreview = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/staff`);
        setStaff(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching staff:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  return (
    <section className="py-24 bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-rosegold-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4"
          >
            Maestros of Style
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter"
          >
            Meet Our <span className="text-saloon-500">Artists</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-900 rounded-[2rem] animate-pulse" />
            ))
          ) : (
            staff.map((artist, i) => (
              <motion.div
                key={artist._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-slate-900 rounded-[2rem] p-8 border border-white/5 transition-all hover:bg-slate-800/80 hover:border-saloon-500/20"
              >
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-saloon-500 to-rosegold-500 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-saloon-500/10">
                    <img 
                      src={artist.profileImage ? (artist.profileImage.startsWith('http') ? artist.profileImage : `${IMAGE_URL}${artist.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.name}`} 
                      alt={artist.name}
                      className="w-full h-full rounded-full object-cover bg-slate-800 border-2 border-slate-950"
                    />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2 group-hover:text-saloon-500 transition-colors">{artist.name}</h4>
                  <div className="px-3 py-1 bg-white/5 rounded-full mb-4">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{artist.services?.[0]?.name || "Senior Stylist"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < (artist.ratings || 5) ? "text-saloon-500 fill-saloon-500" : "text-slate-700"} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};


const Testimonials = () => {
  const reviews = [
    { name: "Anita Sharma", text: "Truly a premium experience. The ambiance is out of this world and the staff is incredibly professional.", role: "Elite Member" },
    { name: "Rahul Verma", text: "Got the best styling experience of my life. They really understand modern artistry.", role: "Regular Client" },
    { name: "Priya Das", text: "The skincare treatments are pure luxury. My skin has never glowed like this before.", role: "Bridal Client" },
    { name: "Aditya Malik", text: "A salon that finally respects your time and delivers exceptional quality every single time.", role: "Business Owner" },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const itv = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(itv);
  }, [reviews.length]);

  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 bg-saloon-50 rounded-xl flex items-center justify-center mx-auto mb-12 shadow-sm"
          >
            <Sparkles size={24} className="text-saloon-500" />
          </motion.div>
          
          <div className="min-h-[160px] md:min-h-[120px] mb-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <p className="text-lg md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic mb-8 leading-snug max-w-2xl">
                  "{reviews[index].text}"
                </p>
                <div className="flex flex-col items-center">
                  <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{reviews[index].name}</h5>
                  <p className="text-[9px] text-saloon-500 font-black uppercase tracking-[0.3em] mt-2">{reviews[index].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button 
                key={i} 
                className={`h-1 rounded-full transition-all duration-700 ${i === index ? 'w-8 bg-saloon-500' : 'w-2 bg-slate-200 dark:bg-slate-800'}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const BookingCTA = () => {
  const { adminInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-saloon-500 to-rosegold-500 rounded-[2.5rem] py-16 px-8 text-center text-white shadow-2xl shadow-saloon-200/20"
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none whitespace-pre-line">
              READY FOR YOUR {"\n"} TRANSFORMATION?
            </h2>
            <p className="text-white/90 text-sm md:text-base font-semibold uppercase tracking-widest mb-10 max-w-md mx-auto">
              Book your appointment today and experience luxury like never before.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(adminInfo ? '/dashboard' : '/login')}
              className="bg-white text-saloon-600 px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 mx-auto group shadow-lg"
            >
              {adminInfo ? 'Go to Dashboard' : 'Book Now'}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Main Home Page ---

export default function Home() {
  return (
    <div className="relative selection:bg-saloon-500 selection:text-white overflow-x-hidden bg-white dark:bg-slate-950 font-sans">
      <PublicNavbar />
      
      <main>
        <Hero />
        <StatsBanner />
        <ServicesPreview />
        <WhyChooseUs />
        <TeamPreview />
        <Testimonials />
        <BookingCTA />
      </main>

      <PublicFooter />
    </div>
  );
}
