import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe,
  Instagram, Facebook, Twitter, Linkedin, Sparkles
} from 'lucide-react';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';


export default function Contact() {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    subject: Yup.string().required('Subject is required'),
    message: Yup.string().required('Message is required'),
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', subject: '', message: '' },
    validationSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      // Simulate API call
      setTimeout(() => {
        setSubmitting(false);
        toast.success("Message sent to our salon!");
        resetForm();
      }, 1500);
    },
  });

  return (
    <div className="relative selection:bg-primary/30 selection:text-white bg-background font-sans min-h-screen">
      <PublicNavbar />

      <main>
        {/* Page Hero */}
        <section className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-background">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop"
              alt="Glow & Elegance"
              className="w-full h-full object-cover opacity-30 scale-105"
            />
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-3 md:mb-6"
            >
              <Sparkles size={12} className="text-primary" />
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Contact Us</span>
            </motion.div>

            <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-4 md:mb-8 flex justify-center gap-[2px] font-luxury ">
              {"GET IN TOUCH".split("").map((char, i) => (
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
              className="mt-4 md:mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted"
            >
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="w-1.5 h-px bg-white/20" />
              <span className="text-primary ">Contact Us</span>
            </motion.div>
          </div>
        </section>


        <section className="py-12 md:py-24  bg-background">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h3 className="text-lg md:text-3xl font-black text-white uppercase tracking-wide mb-2">Our Salon</h3>
                <p className="text-muted text-xs md:text-sm font-medium tracking-widest leading-relaxed mb-10">
                  Visit us to talk about your needs or see our services. Our friendly staff is here to help you.
                </p>

                <div className="space-y-8">
                  {[
                    { icon: <MapPin />, title: "Our Location", details: "123 Luxury Street, Bandra West, Mumbai, 400050" },
                    { icon: <Phone />, title: "Phone", details: "+91 98765 43210" },
                    { icon: <Mail />, title: "Email", details: "contact@glowelegance.com" },
                    { icon: <Clock />, title: "Opening Hours", details: "Mon - Sat: 9 AM - 9 PM" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-6 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all duration-500 border border-white/5">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{item.title}</h4>
                        <p className="text-sm text-white tracking-wide">{item.details}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-12 border-t border-white/5">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-8">Follow Us</h4>
                <div className="flex items-center gap-4">
                  {[Instagram, Facebook, Twitter].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-lg bg-secondary border border-white/5 flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 hover:scale-110 transition-all duration-300 shadow-xl">
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
                className="bg-secondary rounded-2xl p-5 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Sparkles size={150} strokeWidth={1} className="text-primary" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-wide mb-2">Send a Message</h3>
                  <p className="text-muted font-bold text-[10px] uppercase tracking-widest mb-12">We'll reply within 24 hours.</p>

                  <form onSubmit={formik.handleSubmit} className="space-y-3 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-1 md:space-y-3">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Your Name</label>
                        <input
                          {...formik.getFieldProps('name')}
                          placeholder="Your Name"
                          className={`w-full bg-background border-2 ${formik.touched.name && formik.errors.name ? 'border-red-500/50' : 'border-transparent'} focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all text-white`}
                        />
                        {formik.touched.name && formik.errors.name && <p className="text-[8px] text-red-500 font-black uppercase tracking-widest ml-2">{formik.errors.name}</p>}
                      </div>
                      <div className="space-y-1 md:space-y-3">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Email Address</label>
                        <input
                          {...formik.getFieldProps('email')}
                          type="email"
                          placeholder="Email Address"
                          className={`w-full bg-background border-2 ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : 'border-transparent'} focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all text-white`}
                        />
                        {formik.touched.email && formik.errors.email && <p className="text-[8px] text-red-500 font-black uppercase tracking-widest ml-2">{formik.errors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-1 md:space-y-3">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Subject</label>
                      <input
                        {...formik.getFieldProps('subject')}
                        placeholder="e.g. Bridal Packages"
                        className={`w-full bg-background border-2 ${formik.touched.subject && formik.errors.subject ? 'border-red-500/50' : 'border-transparent'} focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all text-white`}
                      />
                      {formik.touched.subject && formik.errors.subject && <p className="text-[8px] text-red-500 font-black uppercase tracking-widest ml-2">{formik.errors.subject}</p>}
                    </div>

                    <div className="space-y-1 md:space-y-3">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Your Message</label>
                      <textarea
                        {...formik.getFieldProps('message')}
                        rows={5}
                        placeholder="Tell us what you need..."
                        className={`w-full bg-background border-2 ${formik.touched.message && formik.errors.message ? 'border-red-500/50' : 'border-transparent'} focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all text-white resize-none`}
                      />
                      {formik.touched.message && formik.errors.message && <p className="text-[8px] text-red-500 font-black uppercase tracking-widest ml-2">{formik.errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="w-full py-6 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                    >
                      {formik.isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message
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
        <section className="h-[400px] bg-secondary relative">
          <iframe
            title="Salon Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.946399999998!2d72.825!3d19.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c92f9e42d7bb%3A0x690e7a277717616!2sBandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1625060000000!5m2!1sen!2sin"
            className="w-full h-full border-none contrast-125 opacity-60"
            allowFullScreen=""
            loading="lazy"
          />
          {/* <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent" /> */}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

