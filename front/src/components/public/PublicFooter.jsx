import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';
import Logo from '../../assets/logo.png';

const PublicFooter = () => {
  return (
    <footer id="contact" className="bg-background pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-center md:text-left">
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start space-y-8">
            <Link to="/" className="flex flex-col items-center md:items-start gap-4 group">
              <img
                src={Logo}
                alt="Logo"
                className="h-14 w-auto brightness-0 invert drop-shadow-[0_0_8px_rgba(201,162,39,0.2)] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] font-luxury italic">
                  Glow <span className="text-primary">&</span> Elegance
                </h2>
                <p className="text-[8px] font-black text-primary/60 uppercase tracking-[0.4em] mt-1 ml-1">Premium Saloon Collective</p>
              </div>
            </Link>
            
            <p className="text-muted text-[10px] font-bold leading-relaxed uppercase tracking-[0.15em] max-w-[280px]">
              The ultimate destination for luxury beauty and lifestyle. Crafting your perfect aesthetic narrative since day one.
            </p>
            
            <div className="flex items-center gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-2xl bg-secondary border border-white/5 flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 hover:scale-110 transition-all duration-300 shadow-xl"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-10 border-b-2 border-primary/20 pb-2">Navigation</h4>
            <div className="flex flex-col gap-4">
              {['Home', 'Services', 'About', 'Contact'].map((item) => (
                <Link 
                  key={item} 
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                  className="text-muted hover:text-primary transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-3" />
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Focus Column */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-10 border-b-2 border-primary/20 pb-2">Our Focus</h4>
            <div className="flex flex-col gap-4">
              {['Architectural Hair', 'Advanced Skincare', 'Bridal Rituals', 'Visual Artistry'].map((item) => (
                <span key={item} className="text-muted text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-10 border-b-2 border-primary/20 pb-2">Connect</h4>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-secondary rounded-xl text-primary border border-white/5">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5">Direct Line</p>
                  <p className="text-[10px] text-white font-black tracking-widest">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-secondary rounded-xl text-primary border border-white/5">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5">Electronic Link</p>
                  <p className="text-[10px] text-white font-black tracking-widest lowercase">concierge@glowelegance.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-secondary rounded-xl text-primary border border-white/5">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5">Physical HQ</p>
                  <p className="text-[10px] text-white font-black tracking-widest uppercase leading-tight italic">
                    123, Luxury Lane, Bandra West, Mumbai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[8px] font-black text-muted/50 uppercase tracking-[0.3em] text-center italic">
            © 2026 GLOW & ELEGANCE COLLECTIVE. SYSTEM ARCHITECTURE BY ARCHITECTS OF BEAUTY.
          </p>
          <div className="flex items-center gap-3 text-[9px] font-black text-muted uppercase tracking-[0.2em]">
            <span className="opacity-50">Crafted with</span>
            <Heart size={12} className="text-red-500 fill-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
            <span className="opacity-50">by Premium Aesthetic Artisans</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
