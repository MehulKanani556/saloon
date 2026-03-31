import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const PublicFooter = () => {
  return (
    <footer id="contact" className="bg-slate-950 pt-20 pb-10 border-t border-saloon-500/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <span className="text-2xl transition-transform group-hover:rotate-12">✂</span>
              <h1 className="text-lg font-black text-white uppercase tracking-[0.2em]">
                Glow <span className="text-saloon-500">&</span> Elegance
              </h1>
            </Link>
            <p className="text-slate-500 text-[10px] font-bold leading-relaxed uppercase tracking-[0.15em] mb-8 max-w-[240px]">
              The ultimate destination for luxury beauty and lifestyle. Crafting Your Perfect Style Since Day One.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl border border-white/5 flex items-center justify-center text-slate-400 hover:bg-saloon-500 hover:text-white hover:border-saloon-500 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8">Navigation</h4>
            <div className="flex flex-col gap-3">
              {['Home', 'Services', 'About', 'Contact'].map((item) => (
                <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-slate-500 hover:text-saloon-500 transition-colors text-[10px] font-black uppercase tracking-widest">{item}</Link>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8">Our Focus</h4>
            <div className="flex flex-col gap-3">
              {['Hair Styling', 'Skincare', 'Bridal', 'Artistry'].map((item) => (
                <span key={item} className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item}</span>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8">Get In Touch</h4>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <Phone size={14} className="text-saloon-500 mt-0.5" />
                <p className="text-[10px] text-slate-300 font-black tracking-widest">+91 98765 43210</p>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={14} className="text-saloon-500 mt-0.5" />
                <p className="text-[10px] text-slate-300 font-black tracking-widest">contact@glowelegance.com</p>
              </div>
              <div className="flex items-start gap-4 text-left">
                <MapPin size={14} className="text-saloon-500 mt-0.5 shrink-0" />
                <p className="text-[10px] text-slate-300 font-black tracking-widest leading-relaxed">123, LUXURY LANE,{"\n"}BANDRA WEST, MUMBAI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] text-center">
            © 2026 GLOW & ELEGANCE PREMIUM SALOON. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            MADE WITH <span className="text-red-600 animate-pulse">❤️</span> BY BEAUTY ARTISTS
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
