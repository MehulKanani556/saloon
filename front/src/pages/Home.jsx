import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors, Star, Clock, Shield, ChevronDown, ChevronRight,
  Instagram, Facebook, Twitter, Mail, Phone, MapPin,
  Menu, X, Sparkles, LogIn, HelpCircle, Send, Plus, Minus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import StatsBanner from '../components/public/StatsBanner';
import { IMAGE_URL } from '../utils/BASE_URL';

// Redux Slices
import { fetchServices } from '../redux/slices/serviceSlice';
import { fetchStaff } from '../redux/slices/staffSlice';
import { fetchCategories } from '../redux/slices/categorySlice';

// --- Sub-components ---
const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const headlineWords = "WHERE BEAUTY MEETS ARTISTRY".split(" ");
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero_bg.png"
          alt="Luxury Salon Background"
          className="w-full h-full object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary"
          />
          <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em]">
            500+ Happy Clients
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
                className="text-5xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-wide leading-[1.1]"
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
          className="text-muted text-xs md:text-base font-medium tracking-widest uppercase mb-12 max-w-2xl mx-auto "
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
            onClick={() => navigate('/book')}
            className="premium-button-primary !px-8 !py-4 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
          >
            Book Appointment
          </motion.button>
          <Link to="/services">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] transition-all rounded-xl"
            >
              Explore Services
            </motion.button>
          </Link>
        </motion.div>
      </div>


      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-muted"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};


const ServicesPreview = () => {
  const dispatch = useDispatch();
  const { services, loading } = useSelector(state => state.services);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const previewServices = Array.isArray(services) ? services.slice(0, 8) : [];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 text-center"
          >
            Our Signature <span className="text-primary font-luxury">Services</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            className="h-1 bg-primary mt-4 rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="bg-secondary rounded-2xl p-6 h-[400px] animate-pulse">
                <div className="w-full h-48 bg-background rounded-2xl mb-6" />
                <div className="h-6 w-3/4 bg-background rounded mb-4" />
                <div className="h-4 w-1/2 bg-background rounded mb-8" />
                <div className="h-10 w-full bg-background rounded" />
              </div>
            ))
          ) : (
            previewServices.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-secondary rounded-2xl p-4 border border-white/5"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-inner">
                  <img
                    src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : (service.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1074&auto=format&fit=crop")}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1074&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-lg">
                    {service.category?.name || "Ritual"}
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{service.name}</h3>
                    <span className="text-xl font-black text-primary">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted text-[9px] font-black uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-primary" /> {service.duration} Mins
                    </span>
                    <span className="h-1 w-1 bg-white/10 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-primary" /> Professional Care
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/book', { state: { serviceId: service._id } })}
                    className="w-full py-3.5 rounded-xl bg-background text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary hover:text-secondary transition-all shadow-sm group-hover:shadow-primary/20"
                  >
                    Book Ritual Now
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Link to="/services" className="group flex items-center gap-4 px-8 py-4 rounded-xl border-2 border-primary text-primary text-xs font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-secondary transition-all">
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
    {
      icon: <Scissors size={24} />,
      title: "Maestro Stylists",
      desc: "Architects of hair, trained in global haute couture techniques.",
      prefix: "01"
    },
    {
      icon: <Star size={24} />,
      title: "Organic Formations",
      desc: "Pure botanical extracts fused with advanced molecular science.",
      prefix: "02"
    },
    {
      icon: <Clock size={24} />,
      title: "Temporal Fluidity",
      desc: "Your ritual, your schedule. Seamless zero-latency booking.",
      prefix: "03"
    },
    {
      icon: <Shield size={24} />,
      title: "Elite Sanitization",
      desc: "Surgical-grade hygiene protocols for your absolute peace.",
      prefix: "04"
    },
  ];

  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Content Left */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">The Glow Philosophy</span>
              </div>
              <h2 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8">
                Where <span className="text-transparent bg-clip-text bg-luxury-gradient">Excellence</span> <br />
                Becomes Habit
              </h2>
              <p className="text-muted text-sm md:text-base font-medium leading-relaxed tracking-wider max-w-lg mb-10">
                We transcend the traditional salon experience. Every appointment is a meticulously choreographed ritual of transformation, precision, and luxury.
              </p>

              <div className="grid grid-cols-1 gap-6">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative flex items-start gap-6 p-6 rounded-2xl bg-secondary border border-white/5 hover:border-primary/30 transition-all duration-500"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-primary shadow-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-secondary transition-all">
                      {f.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-primary tracking-widest">{f.prefix}</span>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">{f.title}</h4>
                      </div>
                      <p className="text-[11px] text-muted font-medium leading-relaxed uppercase tracking-wide">
                        {f.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Visual Right */}
          <div className="lg:col-span-7 relative h-[600px] md:h-[800px]">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img
                src="/salon_ambiance.png"
                alt="Salon High-Fidelity Ambiance"
                className="w-full h-full object-cover transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            </motion.div>

            {/* Aesthetic Overlays */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -top-12 -right-12 w-64 h-64 border-[1px] border-primary/20 rounded-full pointer-events-none"
            />

            {/* Float Metric Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute bottom-12 right-12 bg-secondary/40 backdrop-blur-3xl border border-white/10 p-10 rounded-2xl shadow-3xl max-w-[280px]"
            >
              <div className="text-center">
                <span className="text-7xl font-black text-transparent bg-clip-text bg-luxury-gradient tracking-tighter ">12+</span>
                <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] mt-4 mb-2">Years of Mastery</p>
                <div className="h-px w-12 bg-primary mx-auto" />
                <p className="text-[8px] text-muted font-bold uppercase tracking-widest mt-4">Pioneering the future of cinematic beauty since 2012.</p>
              </div>
            </motion.div>

            {/* Experience Detail Tag */}
            <div className="absolute top-12 left-12 flex flex-col gap-4">
              <div className="px-6 py-3 rounded-xl bg-background/80 border border-white/10 backdrop-blur-xl">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Ritual Protocol v3.0</p>
              </div>
              <div className="px-6 py-3 rounded-xl bg-primary border border-primary shadow-xl shadow-primary/20">
                <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Certified Excellence</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const TeamPreview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { staff, loading } = useSelector(state => state.staff);

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-luxury font-black uppercase tracking-[0.3em] text-[10px] mb-4"
          >
            Maestros of Style
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8"
          >
            Meet Our <span className="text-primary">Artists</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-secondary rounded-2xl animate-pulse" />
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
                className="group relative bg-secondary rounded-2xl p-4 border border-white/5 transition-all duration-500 hover:border-primary/20"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-inner bg-background/50">
                  <img
                    src={artist.profileImage ? (artist.profileImage.startsWith('http') ? artist.profileImage : `${IMAGE_URL}${artist.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${artist.name}`}
                    alt={artist.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-lg">
                    {artist.role || "Expert"}
                  </div>
                </div>

                <div className="px-2 pb-2">
                  <div className="mb-4">
                    <h4 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 font-luxury  leading-none">{artist.name}</h4>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2 mb-1 opacity-80 ">Senior Artisan</p>
                  </div>

                  <div className="flex items-center gap-3 text-muted text-[9px] font-black uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-primary" /> Specialist
                    </span>
                    <span className="h-1 w-1 bg-white/10 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      Mastery v3.0
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('/book')}
                    className="w-full py-3.5 rounded-xl bg-background text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary hover:text-secondary transition-all shadow-sm group-hover:shadow-primary/20"
                  >
                    Induct Ritual
                  </button>
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
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-12 shadow-sm"
          >
            <Sparkles size={24} className="text-primary" />
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
                <p className="text-lg md:text-2xl font-black text-white uppercase tracking-tight  mb-8 leading-snug max-w-2xl font-luxury">
                  "{reviews[index].text}"
                </p>
                <div className="flex flex-col items-center">
                  <h5 className="text-sm font-black text-white uppercase tracking-[0.2em]">{reviews[index].name}</h5>
                  <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] mt-2">{reviews[index].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                className={`h-1 rounded-full transition-all duration-700 ${i === index ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const RitualMenu = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);
  const { services } = useSelector(state => state.services);
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && !activeCat) {
      setActiveCat(categories[0]._id);
    }
  }, [categories, activeCat]);

  const filteredServices = services.filter(s => s.category?._id === activeCat);

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6">

        {/* Elegant Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-extrabold uppercase tracking-[0.4em] text-[10px] mb-4"
          >
            The Ultimate Collection
          </motion.p>
          <h2 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8">
            Ritual <span className="text-primary font-luxury">Menu</span>
          </h2>

          {/* Clean Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setActiveCat(cat._id)}
                className={`px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${activeCat === cat._id
                  ? "bg-primary border-primary text-secondary shadow-lg"
                  : "bg-secondary border-transparent text-muted hover:bg-white/10 hover:text-white"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Spacious Service Grid */}
        <div className="">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2"
            >
              {filteredServices.map((service, i) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate('/book', { state: { serviceId: service._id } })}
                  className="group flex items-center justify-between py-6 border-b border-white/5 hover:border-primary/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex-1 pr-6">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-base font-black text-white uppercase tracking-tight group-hover:text-primary">
                        {service.name}
                      </h4>
                      <span className="text-lg font-black text-primary">
                        ${service.price}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">
                      {service.duration} Minutes of pure luxury
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredServices.length === 0 && (
            <div className="py-24 text-center text-muted  uppercase text-[11px] font-black tracking-[0.4em] bg-secondary/50 rounded-2xl border border-white/5 shadow-inner">
              Consulting the ritual archive...
            </div>
          )}
        </div>

        {/* Footer Detail */}
        {/* <div className="mt-20 flex justify-center">
            <div className="h-0.5 w-12 bg-saloon-100" />
        </div> */}

      </div>
    </section>
  );
};

const FAQ = () => {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: "How do I secure a ritual booking?", a: "Navigate to our booking protocol portal, select your desired ritual and maestro, and confirm your temporal slot. Digital confirmation will follow immediately." },
    { q: "What is your rescheduling protocol?", a: "We require a minimum of 24-hour notice for temporal adjustments to ensure operational fluidity and maestro availability." },
    { q: "Do you offer premium membership tiers?", a: "Yes, our 'Lumina Elite' program offers priority booking, exclusive ritual access, and cinematic lounge privileges. Inquire in-house for elevation." },
    { q: "Are ritual products available for acquisition?", a: "Select professional-grade formations used during your masterpiece session are available for home integration within our retail vault." }
  ];

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Curiosity Protocol</p>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">Frequently <br /> <span className=" text-transparent bg-clip-text bg-luxury-gradient">Asked Questions</span></h2>
            <p className="text-muted text-sm md:text-base max-w-md uppercase font-bold tracking-widest leading-relaxed">
              Informing your journey through the Glow Saloon ecosystem. Clear answers for a clear mind.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-background border border-white/5 rounded-2xl shadow-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="text-[11px] font-black text-white uppercase tracking-widest ">{faq.q}</span>
                  {open === i ? <Minus size={16} className="text-primary" /> : <Plus size={16} className="text-muted" />}
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8"
                    >
                      <p className="text-[12px] text-muted font-medium leading-relaxed tracking-wide uppercase">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const BookingCTA = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-luxury-gradient rounded-2xl py-16 px-8 text-center text-secondary shadow-2xl shadow-primary/20"
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none whitespace-pre-line">
              READY FOR YOUR {"\n"} TRANSFORMATION?
            </h2>
            <p className="text-secondary/90 text-sm md:text-base font-black uppercase tracking-widest mb-10 max-w-md mx-auto">
              Book your appointment today and experience luxury like never before.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/book')}
              className="bg-secondary text-primary px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 mx-auto group shadow-lg"
            >
              Book Now
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
    <div className="relative selection:bg-primary/30 selection:text-white overflow-x-hidden bg-background font-sans">
      <PublicNavbar />

      <main>
        <Hero />
        <StatsBanner />
        <ServicesPreview />
        <WhyChooseUs />
        <RitualMenu />
        <TeamPreview />
        <Testimonials />
        <FAQ />
        <BookingCTA />
      </main>

      <PublicFooter />
    </div>
  );
}

