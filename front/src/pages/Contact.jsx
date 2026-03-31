import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe,
  Instagram, Facebook, Twitter, Linkedin, Sparkles
} from 'lucide-react';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import toast from 'react-hot-toast';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent to our sanctuary!");
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="relative selection:bg-saloon-500 selection:text-white bg-white dark:bg-slate-950 font-sans min-h-screen">
      <PublicNavbar />
      
      <main>
        {/* Page Hero */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop" 
              alt="Luxury Sanctuary" 
              className="w-full h-full object-cover opacity-30 grayscale scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-slate-950" />
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="w-16 h-16 bg-saloon-500 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3">
                <MessageSquare className="text-white" size={32} />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">Get In <span className="text-saloon-500">Touch</span></h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-6">Contact the artisans of beauty.</p>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-5 space-y-12">
               <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 italic">The HQ Sanctuary</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest leading-relaxed mb-10">
                    Visit us for a consultation or simply to experience the ambiance of true luxury. Our artisans are waiting to listen.
                  </p>
                  
                  <div className="space-y-8">
                     {[
                        { icon: <MapPin />, title: "Headquarters", details: "123 Sanctuary Road, Bandra West, Mumbai, 400050" },
                        { icon: <Phone />, title: "Hotline", details: "+91 98765 43210 (24/7 Support)" },
                        { icon: <Mail />, title: "Email Channel", details: "artisans@glowelegance.com" },
                        { icon: <Clock />, title: "Open Ritual Hours", details: "Mon - Sat: 9 AM - 9 PM" },
                     ].map((item, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-6 group"
                        >
                           <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-saloon-500 group-hover:bg-saloon-500 group-hover:text-white transition-all duration-500">
                              {item.icon}
                           </div>
                           <div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.title}</h4>
                              <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.details}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>

               <div className="pt-12 border-t border-slate-100 dark:border-white/5">
                  <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8">Digital Connections</h4>
                  <div className="flex items-center gap-4">
                     {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                        <a key={i} href="#" className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-saloon-500 transition-all active:scale-90">
                           <Icon size={20} />
                        </a>
                     ))}
                  </div>
               </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                     <Sparkles size={150} strokeWidth={1} className="text-saloon-500" />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">Send an Inquiry</h3>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-12">We respond to all transmissions within 2 hours.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Full Identity</label>
                             <input required placeholder="Your Name" className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all dark:text-white" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Contact Portal</label>
                             <input required type="email" placeholder="Email Address" className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all dark:text-white" />
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Subject Matter</label>
                          <input placeholder="e.g. Bridal Packages" className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all dark:text-white" />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Detailed Message</label>
                          <textarea required rows={5} placeholder="Tell us about your requirements..." className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all dark:text-white resize-none" />
                       </div>

                       <button 
                         disabled={isSubmitting}
                         className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-saloon-600 dark:hover:bg-saloon-500 dark:hover:text-white transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                       >
                          {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              Transmit Message
                              <Send size={18} />
                            </>
                          )}
                       </button>
                    </form>
                  </div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="h-[400px] bg-slate-200 dark:bg-slate-900/50 relative">
           <iframe 
             title="Sanctuary Map"
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.946399999998!2d72.825!3d19.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c92f9e42d7bb%3A0x690e7a277717616!2sBandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1625060000000!5m2!1sen!2sin" 
             className="w-full h-full border-none grayscale contrast-125 opacity-70"
             allowFullScreen="" 
             loading="lazy" 
           />
           <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent" />
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
