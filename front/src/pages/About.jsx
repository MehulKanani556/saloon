import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Eye, Heart, Star, Mail, Clock, CreditCard, MapPin,
  ChevronRight, Calendar, Users, Award, Sparkles, Phone
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../redux/slices/staffSlice';
import { fetchSettings } from '../redux/slices/settingSlice';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import StatsBanner from '../components/public/StatsBanner';
import { IMAGE_URL } from '../utils/BASE_URL';

// --- Sub-components ---

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-background overflow-hidden pt-20">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 50 }}
              className="h-0.5 bg-primary rounded-full"
            />
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">Est. 2014</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.85] md:leading-[0.85]">
            OUR <br />
            <span className="relative inline-block mt-2 font-luxury ">
              STORY
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -bottom-2 left-0 h-2 bg-gradient-to-r from-primary to-transparent rounded-full"
              />
            </span>
          </h1>

          <p className="text-muted text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-10 ">
            Glow & Elegance was born from a singular passion: to redefine the boundary between beauty and artistry. For over a decade, we've curated an oasis of sophistication.
          </p>

          <div className="flex flex-col gap-4 text-muted text-sm font-semibold uppercase tracking-widest leading-loose">
            <div className="flex items-center gap-4">
              <Sparkles size={16} className="text-primary" />
              <span>Uncompromising Quality in every ritual</span>
            </div>
            <div className="flex items-center gap-4">
              <Award size={16} className="text-primary" />
              <span>International Training Standards</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[500px] lg:h-[600px] group"
        >
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all" />
          <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1169&auto=format&fit=crop"
              alt="Salon Interior"
              className="h-full w-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          {/* Decorative Pattern Overlay */}
          <div className="absolute -top-10 -right-10 w-40 h-40 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #C9A227 1px, transparent 0)', backgroundSize: '16px 16px' }} />
        </motion.div>
      </div>
    </section>
  );
};

const MissionValues = () => {
  const data = [
    {
      icon: <Target className="text-secondary" />,
      title: "Our Mission",
      desc: "To empower individuals through personalized beauty rituals that harmonize inner confidence with outer radiance.",
      color: "from-primary to-primary"
    },
    {
      icon: <Eye className="text-secondary" />,
      title: "Our Vision",
      desc: "To become the global benchmark for luxury grooming, where innovation meets the timeless traditions of elegance.",
      color: "from-accent to-accent"
    },
    {
      icon: <Heart className="text-white" />,
      title: "Our Values",
      desc: "Integrity, excellence, and inclusivity are the pillars of every masterpiece we create at Glow & Elegance.",
      color: "from-secondary to-background"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group relative p-10 bg-secondary rounded-2xl border border-white/5 hover:border-primary/30 transition-all overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed font-medium uppercase tracking-wide">
                {item.desc}
              </p>
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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4"
          >
            The Elite Collective
          </motion.p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">MEET THE <br /> <span className="text-transparent bg-clip-text bg-luxury-gradient ">ARTISTS</span></h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-[450px] bg-secondary rounded-2xl animate-pulse shadow-sm border border-white/5" />
            ))
          ) : staff.map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -12 }}
              className="group relative bg-secondary rounded-2xl p-10 border border-white/5 transition-all text-center hover:shadow-3xl hover:shadow-primary/10"
            >
              {/* Profile Image & Ring */}
              <div className="relative w-32 h-32 mx-auto mb-8 rounded-full p-1.5 bg-luxury-gradient shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <img
                  src={member.profileImage ? (member.profileImage.startsWith('http') ? member.profileImage : `${IMAGE_URL}${member.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full border-2 border-secondary"
                />
              </div>

              {/* Content Panel */}
              <div className="space-y-4">
                <h4 className="text-xl font-black text-white uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{member.name}</h4>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-none">{member.email.split('@')[0]}</p>



                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {(member.services || []).slice(0, 3).map((s, si) => (
                    <span key={si} className="px-3 py-1 bg-background rounded-full text-[8px] font-black text-muted uppercase tracking-widest border border-white/5 shadow-inner">
                      {s.name || s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="pt-8 mt-8 border-t border-white/5">
                <span className="inline-flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest">
                  {member.email.split('@')[0]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SalonInfo = () => {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector(state => state.settings);

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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <Clock className="text-primary" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Operational Hours</h3>
          </div>

          <div className="bg-secondary rounded-2xl p-10 border border-white/5 shadow-inner">
            <div className="space-y-6">
              {businessHours.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 group border-b border-white/5 last:border-none">
                  <span className="text-[11px] font-black text-muted uppercase tracking-widest group-hover:text-primary transition-colors">{h.day}</span>
                  <span className="text-xs font-black text-white uppercase tracking-tight">{h.open} - {h.close}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Address Card */}
          <div className="bg-secondary rounded-2xl p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
              <MapPin size={120} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-8 text-secondary">
                <MapPin size={24} />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-4  font-luxury">Glow Headquarters</h4>
              <p className="text-muted text-sm leading-relaxed uppercase tracking-widest mb-10 max-w-xs font-semibold">
                123, LUXURY LANE, BANDRA WEST, <br /> MUMBAI, MAHARASHTRA 400050
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <Phone size={16} className="text-primary" />
                  <span className="text-xs font-bold tracking-widest text-white"> +91 98765 43210</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={16} className="text-primary" />
                  <span className="text-xs font-bold tracking-widest text-white/80 uppercase">CONTACT@GLOWELEGANCE.COM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-10 bg-secondary rounded-2xl border border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <CreditCard className="text-primary" size={18} />
              <h5 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Settlement Methods</h5>
            </div>
            <div className="flex flex-wrap gap-4">
              {['Cards', 'Apply Pay', 'UPI', 'Gift Vouchers', 'Net Banking'].map((m) => (
                <span key={m} className="px-5 py-2 bg-background border border-white/5 rounded-xl text-[9px] font-black text-muted uppercase tracking-widest shadow-sm">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Timeline = () => {
  const milestones = [
    { year: "2014", title: "Foundation Layed", desc: "Started as a boutique studio with 2 expert artists in Mumbai.", icon: <Award /> },
    { year: "2016", title: "Luxury Expansion", desc: "Opened our flagship Bandra salon with cinematic interiors.", icon: <Star /> },
    { year: "2019", title: "Global Recognition", desc: "Voted 'Most Innovative Salon' at Luxury Lifestyle Awards.", icon: <Sparkles /> },
    { year: "2021", title: "Academy Launch", desc: "Established 'Glow Academy' to train the next generation of maestos.", icon: <Users /> },
    { year: "2024", title: "Digital Transformation", desc: "Launched our full-suite booking and membership platform.", icon: <Calendar /> },
  ];

  return (
    <section className="py-24 bg-background overflow-hidden relative">
      {/* Background line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden lg:block" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4"
          >
            The Legacy
          </motion.p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">OUR <span className=" text-primary font-luxury">CHRONICLE</span></h2>
        </div>

        <div className="space-y-12 lg:space-y-0">
          {milestones.map((m, i) => (
            <div key={i} className={`flex flex-col lg:flex-row items-center gap-8 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''} lg:mb-24`}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <div className={`flex flex-col lg:items-start ${i % 2 === 0 ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'} w-full`}>
                  <span className="text-4xl md:text-6xl font-black text-primary/10  mb-2">{m.year}</span>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors">{m.title}</h4>
                  <p className="text-muted text-sm leading-relaxed max-w-md font-medium uppercase tracking-wide">{m.desc}</p>
                </div>
              </motion.div>

              {/* Center Node */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="relative z-20 w-16 h-16 bg-secondary border border-primary flex items-center justify-center rounded-2xl shadow-xl text-primary shrink-0"
              >
                {m.icon}
              </motion.div>

              <div className="w-full lg:w-1/2" />
            </div>
          ))}
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
        <Hero />
        <MissionValues />
        <StatsBanner />
        <TeamSection />
        <SalonInfo />
        <Timeline />
      </main>

      <PublicFooter />
    </div>
  );
}

