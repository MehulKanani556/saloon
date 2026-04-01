import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Eye, Heart, Star, Mail, Clock, CreditCard, MapPin,
  ChevronRight, Calendar, Users, Award, Sparkles, Phone, Shield,
  Quote, Zap, Activity, Fingerprint
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../redux/slices/staffSlice';
import { fetchSettings } from '../redux/slices/settingSlice';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import StatsBanner from '../components/public/StatsBanner';
import { IMAGE_URL } from '../utils/BASE_URL';
import { Link } from 'react-router-dom';

// --- Sub-components ---

const PageHero = () => {
  const title = "THE CHRONICLE".split("");

  return (
    <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Salon"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6"
        >
          <Sparkles size={12} className="text-primary" />
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Our Legacy</span>
        </motion.div>

        <h1 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 flex justify-center gap-[2px] font-luxury ">
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
          <span className="text-primary ">Our Story</span>
        </motion.div>
      </div>
    </section>
  );
};

const StorySection = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-col items-start mb-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-[2px] bg-primary/30" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">The Beginning</p>
                <div className="w-12 h-[2px] bg-primary/30" />
              </div>
              <h2 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 text-center font-luxury">
                WHERE PASSION <br />
                <span className="text-primary">MEETS ARTISTRY</span>
              </h2>
            </div>
            <p className="leading-loose tracking-wide text-sm font-bold opacity-80 mb-2">
              Founded in 2014, Glow & Elegance was born from a singular passion: to redefine the boundary between beauty and artistry. For over a decade, we've curated an oasis of sophistication where every ritual is a masterpiece.
            </p>
            <p className="leading-loose tracking-wide text-sm font-bold opacity-80">
              Our artisans are not just technicians; they are visionaries trained at the highest international levels. We believe that true beauty is realized when inner confidence harmonizes with outer radiance.
            </p>

            <div className="pt-8 grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <Award className="text-primary" size={32} strokeWidth={1} />
                <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">Global Standards</h4>
                <p className="text-[10px] font-bold tracking-widest leading-relaxed opacity-50">Certified excellence in every ritual protocol performed.</p>
              </div>
              <div className="space-y-4">
                <Shield className="text-primary" size={32} strokeWidth={1} />
                <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">Safe Sanctuary</h4>
                <p className="text-[10px] font-bold tracking-widest leading-relaxed opacity-50">Uncompromising hygiene and premium care in every sanctuary.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="space-y-6 pt-16">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-white/5">
                <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1169&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Salon Detail" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square border border-white/5">
                <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1169&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Salon Detail" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden aspect-square border border-white/5">
                <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1074&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Salon Detail" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-white/5">
                <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Salon Detail" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PhilosophySection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover grayscale opacity-30"
          alt="Philosophy Background"
        />
        {/* <div className="absolute inset-0 bg-background/80 bg-gradient-to-t from-background via-transparent to-background" /> */}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <Quote className="text-primary/20 mx-auto mb-10" size={60} strokeWidth={1} />
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-normal leading-tight mb-12 font-luxury">
            "Beauty is not an accessory, it is the <span className="text-primary">ultimate expression</span> of one's architectural soul."
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-12 h-px bg-primary mb-6" />
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">The Glow Philosophy</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProtocolSection = () => {
  const steps = [
    {
      id: "01",
      title: "Archetype Consultation",
      desc: "Every ritual begins with a deep analysis of your personal aesthetic archetype and scalp/skin signature.",
      icon: <Fingerprint className="text-primary" size={24} />
    },
    {
      id: "02",
      title: "Mastery Execution",
      desc: "Our artists employ verified global protocols v3.0, using rare formulations and artisanal tools.",
      icon: <Zap className="text-primary" size={24} />
    },
    {
      id: "03",
      title: "Longevity Protocol",
      desc: "We provide bespoke aftercare scripts and temporal follow-ups to maintain the masterpiece.",
      icon: <Activity className="text-primary" size={24} />
    }
  ];

  return (
    <section className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-24 text-center">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Operational Standards</p>
          <h2 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 font-luxury">
            THE <span className="text-primary">SANCTITY</span> PROTOCOL
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative p-10 bg-background border border-white/5 rounded-3xl group hover:border-primary/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 text-7xl font-black group-hover:opacity-10 transition-opacity">
                {step.id}
              </div>
              <div className="mb-8 p-4 bg-secondary inline-block rounded-2xl">
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 font-luxury">{step.title}</h3>
              <p className="text-xs font-medium text-muted tracking-wide leading-loose opacity-60">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MissionVision = () => {
  const data = [
    {
      title: "The Mission",
      desc: "To empower individuals through personalized beauty rituals that harmonize inner confidence with outer radiance.",
      icon: <Target className="text-primary" />
    },
    {
      title: "The Vision",
      desc: "To become the global benchmark for luxury grooming, where innovation meets the timeless traditions of elegance.",
      icon: <Eye className="text-primary" />
    },
    {
      title: "The Core",
      desc: "Integrity, excellence, and inclusivity are the pillars of every masterpiece we create at Glow & Elegance.",
      icon: <Heart className="text-primary" />
    }
  ];

  return (
    <section className="py-24 bg-secondary border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {data.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="px-8 py-4 space-y-6"
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <h3 className="text-xl font-black text-white uppercase tracking-wide font-luxury">{item.title}</h3>
              </div>
              <p className="text-xs font-medium text-muted tracking-wide leading-loose max-w-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const dispatch = useDispatch();
  const { staff, loading } = useSelector(state => state.staff);

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-20 text-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-primary/30" />
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">The Elite Collective</p>
            <div className="w-12 h-[2px] bg-primary/30" />
          </div>
          <h2 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 text-center font-luxury">
            THE <span className="text-primary font-luxury">ARTISTS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-secondary rounded-2xl animate-pulse" />
            ))
          ) : staff.map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-secondary rounded-2xl p-4 border border-white/5 transition-all duration-500 hover:border-primary/20 cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/5 shadow-inner bg-background/50">
                <img
                  src={member.profileImage ? (member.profileImage.startsWith('http') ? member.profileImage : `${IMAGE_URL}${member.profileImage}`) : `https://api.dicebear.com/9.x/adventurer/svg?seed=${member.name}`}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-lg">
                  {member.role || "Elite Artisan"}
                </div>
              </div>
              <div className="px-2 pb-2">
                <div className="mb-4">
                  <h4 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 font-luxury leading-none">{member.name}</h4>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2 mb-1 opacity-80">Maestro</p>
                </div>

                <div className="flex items-center gap-3 text-muted text-[9px] font-black uppercase tracking-widest mb-6">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-primary" /> Specialist
                  </span>
                  <span className="h-1 w-1 bg-white/10 rounded-full" />
                  <span className="flex items-center gap-1.5">
                    Verified Protocol
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SalonDetails = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector(state => state.settings);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const businessHours = (settings?.businessHours?.length > 0) ? settings.businessHours : [
    { day: "Monday", open: "09:00 AM", close: "08:00 PM" },
    { day: "Tuesday", open: "09:00 AM", close: "08:00 PM" },
    { day: "Wednesday", open: "09:00 AM", close: "08:00 PM" },
    { day: "Thursday", open: "09:00 AM", close: "08:00 PM" },
    { day: "Friday", open: "10:00 AM", close: "09:00 PM" },
    { day: "Saturday", open: "10:00 AM", close: "10:00 PM" },
    { day: "Sunday", open: "10:00 AM", close: "06:00 PM" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32">
        <div className="space-y-12">
          <div className="flex flex-col items-start mb-12 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-[2px] bg-primary/30" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Access Terminal</p>
              <div className="w-12 h-[2px] bg-primary/30" />
            </div>
            <h3 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 text-left font-luxury">Operational Window</h3>
          </div>

          <div className="space-y-4">
            {businessHours.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-5 border-b border-white/5 group hover:px-4 transition-all duration-300">
                <span className="text-xs font-black text-muted uppercase tracking-[0.3em] group-hover:text-white transition-colors">{h.day}</span>
                <span className="text-xs font-black text-primary uppercase tracking-widest">{h.open} - {h.close}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-20">
          <div className="space-y-12">
            <div className="flex flex-col items-start mb-12 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-[2px] bg-primary/30" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Coordinates</p>
                <div className="w-12 h-[2px] bg-primary/30" />
              </div>
              <h3 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 text-left font-luxury">Find The <br /> Sanctuary</h3>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-secondary flex items-center justify-center rounded-2xl border border-white/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                  <MapPin size={24} strokeWidth={1} />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2">Primary Address</h5>
                  <p className="text-xs font-bold text-muted leading-relaxed uppercase tracking-widest opacity-60">123, LUXURY LANE, BANDRA WEST, <br /> MUMBAI, MAHARASHTRA 400050</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-secondary flex items-center justify-center rounded-2xl border border-white/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                  <Phone size={24} strokeWidth={1} />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2">Voice Channel</h5>
                  <p className="text-xs font-bold text-muted leading-relaxed uppercase tracking-widest opacity-60">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-secondary flex items-center justify-center rounded-2xl border border-white/5 group-hover:text-primary group-hover:border-primary/20 transition-all">
                  <Mail size={24} strokeWidth={1} />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2">Digital Protocol</h5>
                  <p className="text-xs font-bold text-muted leading-relaxed uppercase tracking-widest opacity-60">HQ@GLOWELEGANCE.COM</p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="p-12 bg-secondary/40 backdrop-blur-xl rounded-3xl border border-white/5">
            <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <CreditCard size={16} className="text-primary" /> Accepted Methods
            </h5>
            <div className="flex flex-wrap gap-4">
              {['Digital Cards', 'Apple Pay', 'UPI Protocol', 'Legacy Cash'].map((m) => (
                <span key={m} className="px-5 py-2.5 bg-background/50 border border-white/5 rounded-xl text-[9px] font-black text-muted uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all cursor-default">
                  {m}
                </span>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default function About() {
  return (
    <div className="relative selection:bg-primary/30 selection:text-white bg-background font-sans min-h-screen overflow-x-hidden">
      <PublicNavbar />

      <main>
        <PageHero />
        <StorySection />
        <PhilosophySection />
        <MissionVision />
        <StatsBanner />
        <ProtocolSection />
        <TeamSection />
        <SalonDetails />
      </main>

      <PublicFooter />
    </div>
  );
}
