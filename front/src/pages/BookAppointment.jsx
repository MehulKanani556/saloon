import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, Clock, CheckCircle2, ChevronRight, ChevronLeft, 
  Sparkles, Calendar, User, Phone, Mail, Loader2, Star, Check, AlertCircle, ShoppingBag
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';

const BASE_URL = 'http://localhost:5000/api';
const IMAGE_URL = 'http://localhost:5000';

// --- Validation Schema ---
const appointmentSchema = Yup.object().shape({
  clientName: Yup.string().required('Full name is required').min(3, 'At least 3 characters'),
  clientEmail: Yup.string().email('Invalid email').required('Email is required'),
  clientPhone: Yup.string().matches(/^[0-9]{10}$/, 'Must be 10 digits').required('Phone is required'),
  date: Yup.date().min(new Date(), 'Date cannot be in the past').required('Date is required'),
  time: Yup.string().required('Time is required'),
});

// --- Components ---

const SuccessModal = ({ data, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Simple CSS Confetti Burst Placeholder Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 500, x: 0, opacity: 1 }}
              animate={{ y: -100, x: (i - 10) * 20, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="absolute w-2 h-2 bg-saloon-500 rounded-full"
              style={{ left: '50%' }}
            />
          ))}
        </div>

        <div className="w-24 h-24 bg-green-100 dark:bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={56} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">Ritual Confirmed!</h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed mb-10">
          Your transformation at Glow & Elegance is officially in the chronicles. We've sent a detailed confirmation to your email.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6 mb-10 text-left space-y-4">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400">Reference:</span>
            <span className="text-slate-900 dark:text-white">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400">Schedule:</span>
            <span className="text-slate-900 dark:text-white">{data.date.toLocaleDateString()} at {data.time}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-saloon-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-saloon-700 transition-all active:scale-95"
        >
          Return to Sanctuary
        </button>
      </motion.div>
    </motion.div>
  );
};

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/services`);
        setServices(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const formik = useFormik({
    initialValues: {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      date: '',
      time: '',
    },
    validationSchema: appointmentSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const [timePart, ampm] = values.time.split(' ');
        let [hours, minutes] = timePart.split(':');
        hours = parseInt(hours);
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        const time24 = `${hours.toString().padStart(2, '0')}:${minutes}`;
        
        const body = {
          clientName: values.clientName,
          clientEmail: values.clientEmail,
          clientPhone: values.clientPhone,
          services: selectedServices.map(s => s._id),
          date: new Date(`${values.date}T${time24}:00`).toISOString(),
        };
        await axios.post(`${BASE_URL}/appointments`, body);
        setShowSuccess(true);
      } catch (err) {
        toast.error(err.response?.data?.message || "Booking failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const toggleService = (service) => {
    if (selectedServices.find(s => s._id === service._id)) {
      setSelectedServices(selectedServices.filter(s => s._id !== service._id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const nextStep = () => {
    if (step === 1 && selectedServices.length === 0) return;
    setStep(prev => prev + 1);
  };
  const prevStep = () => setStep(prev => prev - 1);

  const timeSlots = [];
  for (let hour = 9; hour <= 19; hour++) {
    timeSlots.push(`${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`);
    if (hour < 19) timeSlots.push(`${hour % 12 || 12}:30 ${hour < 12 ? 'AM' : 'PM'}`);
  }

  const steps = [
    { title: "Choose Rituals", icon: <Scissors size={18} /> },
    { title: "Your Mandate", icon: <User size={18} /> },
    { title: "Final Seal", icon: <CheckCircle2 size={18} /> },
  ];

  return (
    <div className="relative selection:bg-saloon-500 selection:text-white bg-slate-50 dark:bg-slate-950 font-sans min-h-screen">
      <PublicNavbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 mb-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-xl">
              <Scissors size={28} />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Book Your Ritual</h1>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-4">Secure your spot in our sanctuary of elegance.</p>
        </div>

        <div className="container px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
              
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-16 relative">
                 <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-white/5 -translate-y-1/2 -z-0" />
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    className="absolute top-1/2 left-0 h-0.5 bg-saloon-500 -translate-y-1/2 z-0" 
                 />

                 {steps.map((s, i) => (
                   <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                     <motion.div 
                        initial={false}
                        animate={{ 
                          backgroundColor: step > i + 1 ? "#10b981" : step === i + 1 ? "#f59e0b" : "#f1f5f9",
                          color: step >= i + 1 ? "#ffffff" : "#94a3b8"
                        }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-black shadow-lg"
                      >
                        {step > i + 1 ? <Check size={20} strokeWidth={3} /> : i + 1}
                     </motion.div>
                     <span className={`text-[9px] font-black uppercase tracking-widest hidden md:block ${step === i + 1 ? 'text-saloon-600' : 'text-slate-400'}`}>
                        {s.title}
                     </span>
                   </div>
                 ))}
              </div>

              {/* Steps Animation */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-10"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {loading ? (
                        [...Array(6)].map((_, i) => (
                          <div key={i} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl animate-pulse" />
                        ))
                      ) : services.map((service) => {
                        const isSelected = selectedServices.find(s => s._id === service._id);
                        return (
                          <motion.div
                            key={service._id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleService(service)}
                            className={`group cursor-pointer relative p-6 rounded-3xl border-2 transition-all duration-300 ${
                              isSelected 
                                ? 'bg-saloon-500/5 border-saloon-500 shadow-xl shadow-saloon-500/10' 
                                : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-white/10'
                            }`}
                          >
                            <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                              <img 
                                src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : service.image} 
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-saloon-500/40 backdrop-blur-[2px] flex items-center justify-center">
                                  <div className="w-10 h-10 bg-white text-saloon-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Check size={20} strokeWidth={4} />
                                  </div>
                                </div>
                              )}
                            </div>
                            <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 truncate">{service.name}</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-saloon-600">${service.price}</span>
                              <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase">
                                <Clock size={10} />
                                {service.duration} Min
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div className="hidden md:flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-saloon-500">
                             <Sparkles size={18} />
                         </div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                            Select multiple rituals for a <br/> complete transformation.
                         </p>
                      </div>
                      <button 
                        onClick={nextStep}
                        disabled={selectedServices.length === 0}
                        className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-saloon-600 dark:hover:bg-saloon-500 dark:hover:text-white transition-all flex items-center gap-3"
                      >
                        Next Chapter
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Full Master Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-saloon-400" />
                          <input 
                            {...formik.getFieldProps('clientName')}
                            placeholder="e.g. Alexander Pierce"
                            className={`w-full bg-slate-50 dark:bg-slate-800/80 border-2 rounded-2xl px-14 py-4 text-sm font-bold outline-none transition-all dark:text-white ${
                              formik.touched.clientName && formik.errors.clientName ? 'border-red-500/30' : 'border-transparent focus:border-saloon-500/20'
                            }`}
                          />
                        </div>
                        {formik.touched.clientName && formik.errors.clientName && (
                          <motion.p initial={{ x: -2 }} animate={{ x: 2 }} className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientName}</motion.p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Email Transmission</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-saloon-400" />
                          <input 
                            {...formik.getFieldProps('clientEmail')}
                            placeholder="ritual@glow.com"
                            className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/20 rounded-2xl px-14 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                          />
                        </div>
                        {formik.touched.clientEmail && formik.errors.clientEmail && (
                          <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientEmail}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Contact Signal</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-saloon-400" />
                          <input 
                            {...formik.getFieldProps('clientPhone')}
                            placeholder="10-digit number"
                            className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/20 rounded-2xl px-14 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                          />
                        </div>
                        {formik.touched.clientPhone && formik.errors.clientPhone && (
                          <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientPhone}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Appointed Date</label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-saloon-400" />
                          <input 
                            type="date"
                            {...formik.getFieldProps('date')}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/20 rounded-2xl px-14 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Preferred Time Slot</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => formik.setFieldValue('time', time)}
                              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                formik.values.time === time 
                                  ? 'bg-saloon-500 text-white shadow-lg' 
                                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        {formik.touched.time && formik.errors.time && (
                          <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.time}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <button 
                        onClick={prevStep}
                        className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-saloon-500 transition-colors"
                      >
                        <ChevronLeft size={18} />
                        Back to Selection
                      </button>
                      <button 
                        onClick={nextStep}
                        disabled={!formik.isValid || !formik.values.clientName || !formik.values.time}
                        className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 hover:bg-saloon-600 dark:hover:bg-saloon-500 transition-all flex items-center gap-3"
                      >
                        Confirm Details
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-10"
                  >
                    <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                          <CheckCircle2 size={150} strokeWidth={1} />
                       </div>
                       
                       <div className="relative z-10 space-y-10">
                          <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">The Ritual Summary</h3>
                            <div className="space-y-4">
                              {selectedServices.map(s => (
                                <div key={s._id} className="flex justify-between items-center py-3 border-b border-white/5">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{s.name}</span>
                                  <span className="text-sm font-black text-saloon-500">${s.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-12">
                             <div>
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2">Champion</span>
                                <p className="text-xs font-black uppercase tracking-widest">{formik.values.clientName}</p>
                             </div>
                             <div>
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2">Schedule</span>
                                <p className="text-xs font-black uppercase tracking-widest">{formik.values.date} • {formik.values.time}</p>
                             </div>
                          </div>

                          <div className="pt-10 border-t border-white/10 flex items-center justify-between">
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Total Investment</span>
                                <span className="text-4xl font-black text-saloon-500 tracking-tighter">${totalPrice}</span>
                             </div>
                             <div className="flex items-center gap-3 text-white/60">
                                <Clock size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">~{totalDuration} Min</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row items-center gap-6">
                      <button 
                        onClick={prevStep}
                        className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-saloon-500 transition-colors"
                      >
                        <ChevronLeft size={18} />
                        Adjust Rituals
                      </button>
                      <button 
                        onClick={formik.handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-6 bg-gradient-to-r from-saloon-500 to-rosegold-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-saloon-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                      >
                        {isSubmitting ? (
                          <Loader2 size={24} className="animate-spin" />
                        ) : (
                          <>
                            Establish Protocol
                            <ChevronRight size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sticky Selection Sidebar (Desktop) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5 shadow-xl">
                 <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50 dark:border-white/5">
                    <ShoppingBag className="text-saloon-500" />
                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Your Rituals</h3>
                 </div>

                 <AnimatePresence>
                    {selectedServices.length > 0 ? (
                      <div className="space-y-6 mb-10">
                        {selectedServices.map(s => (
                          <motion.div 
                            key={s._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex justify-between items-start group"
                          >
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-white truncate max-w-[150px]">{s.name}</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{s.duration} Min</span>
                            </div>
                            <button 
                              onClick={() => toggleService(s)}
                              className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                               <AlertCircle size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                         <Sparkles size={32} className="text-slate-100 dark:text-white/5 mx-auto mb-4" />
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No rituals selected yet.</p>
                      </div>
                    )}
                 </AnimatePresence>

                 <div className="pt-10 border-t border-slate-100 dark:border-white/5 space-y-6">
                    <div className="flex justify-between items-center text-slate-400">
                       <span className="text-[9px] font-black uppercase tracking-[0.3em]">Total Rituals</span>
                       <span className="text-sm font-bold">{selectedServices.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Investment</span>
                       <span className="text-3xl font-black text-saloon-600 tracking-tighter">${totalPrice}</span>
                    </div>
                 </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-center">
                 <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-saloon-500 fill-saloon-500" />)}
                 </div>
                 <p className="text-[9px] font-black text-white/60 uppercase tracking-widest leading-relaxed">
                    Trusted by over 5,000 clients for <br/> premium luxury transformations.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal 
            data={{ ...formik.values, date: new Date(formik.values.date) }} 
            onClose={() => {
              setShowSuccess(false);
              navigate('/');
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
