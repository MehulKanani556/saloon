import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';
import Logo from '../../assets/logo.png';

const PublicFooter = () => {
  return (
    <footer id="contact" className="bg-background py-6 md:py-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-12 mb-10 xl:mb-20 text-center md:text-left">
          {/* Brand Column */}
          <div className="flex col-span-4 md:col-span-1 flex-col items-center md:items-start space-y-4 order-1">
            <Link to="/" className="flex flex-col items-center md:items-start gap-4 group">
              <img
                src={Logo}
                alt="Logo"
                className="h-14 w-auto brightness-0 invert drop-shadow-[0_0_8px_rgba(201,162,39,0.2)] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] font-luxury ">
                  Glow <span className="text-primary">&</span> Elegance
                </h2>
                <p className="text-[8px] font-black text-primary/60 uppercase tracking-[0.4em] mt-1 ml-1">Expert Hair & Beauty Care</p>
              </div>
            </Link>

            <p className="text-muted text-[10px] font-bold leading-relaxed tracking-[0.15em] max-w-[280px]">
              The ultimate destination for professional beauty and lifestyle care. Crafting your perfect look since day one.
            </p>

            <div className="flex items-center gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-secondary border border-white/5 flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 hover:scale-110 transition-all duration-300 shadow-xl"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="flex col-span-2 md:col-span-1 flex-col items-center md:items-start order-3 lg:order-2">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-5 lg:mb-10 border-b-2 border-primary/20 pb-2">Navigation</h4>
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
          <div className="flex col-span-2 md:col-span-1 flex-col items-center md:items-start order-4 lg:order-3">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-5 lg:mb-10 border-b-2 border-primary/20 pb-2">Our Focus</h4>
            <div className="flex flex-col gap-4">
              {['Expert Haircuts', 'Skin Treatments', 'Bridal Services', 'Beauty Care'].map((item) => (
                <span key={item} className="text-muted text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div className="flex col-span-4 md:col-span-1 flex-col items-center md:items-start order-2 lg:order-4">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-5 lg:mb-10 border-b-2 border-primary/20 pb-2">Connect</h4>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-secondary rounded-xl text-primary border border-white/5">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5 text-start">Phone Number</p>
                  <p className="text-[10px] text-white font-medium tracking-widest">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-secondary rounded-xl text-primary border border-white/5">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5 text-start">Email Address</p>
                  <p className="text-[10px] text-white font-medium tracking-widest lowercase">concierge@glowelegance.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-2.5 bg-secondary rounded-xl text-primary border border-white/5">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-0.5 text-start">Our Location</p>
                  <p className="text-[10px] text-white font-medium tracking-widest leading-tight text-start ">
                    123, Luxury Lane, Bandra West, Mumbai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 lg:pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-8">
          <p className="text-[9px] font-black text-muted/50 tracking-[0.3em] text-center ">
            &copy; 2026 GLOW & ELEGANCE SALOON. ALL RIGHTS RESERVED.
          </p>
          <div className="hidden md:flex items-center gap-3 text-[9px] font-black text-muted tracking-[0.2em]">
            <span className="opacity-50">Crafted with</span>
            <Heart size={12} className="text-red-500 fill-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
            <span className="opacity-50">with expert beauty specialists</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

