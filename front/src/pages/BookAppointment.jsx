import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors, Clock, CheckCircle2, ChevronRight, ChevronLeft,
  Sparkles, Calendar, User, Phone, Mail, Loader2, Star, Check, AlertCircle, ShoppingBag,
  Trash
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import { IMAGE_URL } from '../utils/BASE_URL';
import { fetchServices } from '../redux/slices/serviceSlice';
import { fetchStaff } from '../redux/slices/staffSlice';
import { addAppointment, fetchOccupiedSlots } from '../redux/slices/appointmentSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

// --- Validation Schema ---
const appointmentSchema = Yup.object().shape({
  clientName: Yup.string().required('Full name is required').min(3, 'At least 3 characters'),
  clientEmail: Yup.string(),
  clientPhone: Yup.string()
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, 'Must be in 416-123-4567 format')
    .required('Phone is required'),
  date: Yup.date().min(new Date(new Date().setHours(0, 0, 0, 0)), 'Date cannot be in the past').required('Date is required'),
  time: Yup.string().required('Time is required'),
});

// --- Components ---

const SuccessModal = ({ data, onClose }) => {
  useEffect(() => {
    // Professional Confetti Burst
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-background/95 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-secondary rounded-2xl p-5 md:p-12 text-center shadow-2xl relative border border-white/5 overflow-hidden"
      >
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-inner">
          <CheckCircle2 size={56} strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 font-luxury">Ritual Confirmed!</h2>
        <p className="text-muted font-bold text-[10px] uppercase tracking-widest leading-relaxed mb-6 md:mb-10 px-2">
          Your transformation at Glow & Elegance is officially in the chronicles. We've sent a detailed confirmation to your email.
        </p>


        <div className="bg-background rounded-2xl p-6 mb-10 text-left space-y-4 border border-white/5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-muted">Reference:</span>
            <span className="text-white">#{data.id || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-muted">Schedule:</span>
            <span className="text-white">{data.date.toLocaleDateString()} at {data.time}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-5 bg-primary text-secondary rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-primary/90 transition-all active:scale-95"
        >
          Return to Sanctuary
        </button>
      </motion.div>
    </motion.div>
  );
};

export default function BookAppointment() {
  const { userInfo } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [staffAssignments, setStaffAssignments] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { services, loading: servicesLoading } = useSelector(state => state.services);
  const { staff: allStaff, loading: staffLoading } = useSelector(state => state.staff);
  const { occupiedSlots, loading: slotsLoading } = useSelector(state => state.appointments);

  // Pre-select service from navigation state
  useEffect(() => {
    if (location.state?.serviceId && services.length > 0) {
      const service = services.find(s => s._id === location.state.serviceId);
      if (service) {
        setSelectedServices(prev => {
          if (prev.find(s => s._id === service._id)) return prev;
          return [...prev, service];
        });
      }
    }
  }, [location.state, services]);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchStaff());

    // Load persisted state
    const savedServices = localStorage.getItem('selected_services');
    const savedStaff = localStorage.getItem('staff_assignments');
    const savedStep = localStorage.getItem('booking_step');
    
    if (savedServices) {
      try {
        setSelectedServices(JSON.parse(savedServices));
      } catch (e) { console.error("Error loading services:", e); }
    }
    if (savedStaff) {
      try {
        setStaffAssignments(JSON.parse(savedStaff));
      } catch (e) { console.error("Error loading staff:", e); }
    }
    if (savedStep) {
      setStep(parseInt(savedStep));
    }
  }, [dispatch]);

  // Persist State
  useEffect(() => {
    localStorage.setItem('selected_services', JSON.stringify(selectedServices));
  }, [selectedServices]);

  useEffect(() => {
    localStorage.setItem('staff_assignments', JSON.stringify(staffAssignments));
  }, [staffAssignments]);

  useEffect(() => {
    localStorage.setItem('booking_step', step.toString());
  }, [step]);

  const formik = useFormik({
    initialValues: {
      clientName: userInfo?.name || localStorage.getItem('guest_name') || '',
      clientEmail: userInfo?.email || localStorage.getItem('guest_email') || '',
      clientPhone: (userInfo?.phone ? userInfo.phone.replace('+1 ', '') : '') || localStorage.getItem('guest_phone') || '',
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
          clientPhone: `+1 ${values.clientPhone}`,
          assignments: selectedServices.map(s => ({
            service: s._id,
            staff: staffAssignments[s._id] || null
          })),
          date: new Date(`${values.date}T${time24}:00`).toISOString(),
        };
        const res = await dispatch(addAppointment(body)).unwrap();
        
        // Store guest data for next ritual
        localStorage.setItem('guest_name', values.clientName);
        localStorage.setItem('guest_email', values.clientEmail);
        localStorage.setItem('guest_phone', values.clientPhone);

        // Clear temporary selections
        localStorage.removeItem('selected_services');
        localStorage.removeItem('staff_assignments');
        localStorage.removeItem('booking_step');
        setSelectedServices([]);
        setStaffAssignments({});
        setStep(1);

        setBookingResponse(res);
        setShowSuccess(true);
      } catch (err) {
        // Redux slices handle toast errors, but specifically for UI flow:
        console.error("Booking Error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Watch for userInfo changes to refill if needed (e.g. login while on page)
  useEffect(() => {
    if (userInfo) {
      if (!formik.values.clientName) formik.setFieldValue('clientName', userInfo.name);
      if (!formik.values.clientEmail) formik.setFieldValue('clientEmail', userInfo.email);
      if (!formik.values.clientPhone && userInfo.phone) {
        formik.setFieldValue('clientPhone', userInfo.phone.replace('+1 ', ''));
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (formik.values.date && selectedServices.length > 0) {
      const serviceIds = selectedServices.map(s => s._id).join(',');
      const staffIds = Object.values(staffAssignments).filter(id => id).join(',');
      dispatch(fetchOccupiedSlots({
        date: formik.values.date,
        serviceIds,
        staffIds
      }));
    }
  }, [formik.values.date, selectedServices, staffAssignments, dispatch]);

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 10);
    // Format: XXX-XXX-XXXX
    if (val.length > 6) {
      val = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
    } else if (val.length > 3) {
      val = `${val.slice(0, 3)}-${val.slice(3)}`;
    }
    formik.setFieldValue('clientPhone', val);
  };

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
    <div className="relative selection:bg-primary selection:text-secondary bg-background font-sans min-h-screen">
      <PublicNavbar />

      <main>
        {/* Page Hero */}
        <section className="relative h-[35vh] md:h-[45vh] flex items-center justify-center overflow-hidden bg-background">

          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop"
              alt="Luxury Sanctuary"
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
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Temporal Slot</span>
            </motion.div>

            <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-4 md:mb-8 flex justify-center gap-[2px] font-luxury ">
              {"SECURE A RITUAL".split("").map((char, i) => (
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
              <Link to="/" className="hover:text-primary transition-colors">Home Base</Link>
              <span className="w-1.5 h-px bg-white/20" />
              <span className="text-primary ">Book Appointment</span>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-background">
          <div className="container px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">


          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-secondary rounded-2xl p-4  md:p-12 shadow-2xl border border-white/5 overflow-hidden">

              {/* Step Indicator */}
            {/* Luxury Segmented Progress Indicator */}
            <div className="flex items-center justify-between mb-16 md:mb-24 relative px-4 md:px-16 max-w-4xl mx-auto">
                
                {/* Precision Connection System */}
                <div className="absolute top-[28px] md:top-[32px] left-10 md:left-24 right-10 md:right-24 h-[1px] bg-white/5 z-0" />
                
                {/* Ritual Progress Pipe */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: step === 1 ? '0%' : step === 2 ? '50%' : '100%'
                  }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="absolute top-[28px] md:top-[32px] left-10 md:left-24 h-[2px] bg-primary z-0 shadow-[0_0_20px_rgba(201,162,39,0.4)]"
                />

                {steps.map((s, i) => {
                  const isActive = !showSuccess && step === i + 1;
                  const isCompleted = showSuccess || step > i + 1;

                  return (
                    <div key={i} className="relative z-10 flex flex-col items-center">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isActive ? 1.05 : 1,
                          backgroundColor: isCompleted ? "#10b981" : isActive ? "#C9A227" : "#121212",
                          borderColor: isCompleted ? "#10b981" : isActive ? "transparent" : "rgba(245, 230, 200, 0.1)"
                        }}
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-[22px] border flex items-center justify-center transition-all duration-500 shadow-2xl relative overflow-hidden`}
                      >
                        {/* Internal Glow for Active */}
                        {isActive && (
                          <motion.div 
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-white/20 blur-xl"
                          />
                        )}
                        
                        <div className={`relative z-10 transition-colors duration-500 ${isActive || isCompleted ? 'text-secondary' : 'text-muted'}`}>
                          {isCompleted ? <Check size={28} strokeWidth={3} /> : React.cloneElement(s.icon, { size: 24, strokeWidth: 2.5 })}
                        </div>
                      </motion.div>

                      <div className="hidden sm:block absolute -bottom-10 whitespace-nowrap text-center">
                        <span className={`text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${isActive ? 'text-primary' : 'text-muted/40'}`}>
                          {s.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">

                      {(servicesLoading || staffLoading) ? (
                        [...Array(6)].map((_, i) => (
                          <div key={i} className="aspect-square bg-background rounded-2xl animate-pulse" />
                        ))
                      ) : services.map((service) => {
                        const isSelected = selectedServices.find(s => s._id === service._id);
                        return (
                          <motion.div
                            key={service._id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleService(service)}
                            className={`group cursor-pointer relative p-4 rounded-2xl border-2 transition-all duration-300 ${isSelected
                                ? 'bg-primary/5 border-primary shadow-xl shadow-primary/10'
                                : 'bg-background border-white/5 hover:border-primary/20 shadow-inner'
                              }`}
                          >
                            <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-6 shadow-inner">
                              <img
                                src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : (service.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1074&auto=format&fit=crop")}
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute top-3 right-3 px-2 py-1 bg-background/90 backdrop-blur-md rounded-full text-[8px] font-black text-primary uppercase tracking-widest shadow-lg">
                                {service.category?.name || "Ritual"}
                              </div>
                              {isSelected && (
                                <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center">
                                  <div className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center shadow-lg">
                                    <Check size={20} strokeWidth={4} />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="px-1 pb-1">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-[13px] font-black text-white uppercase tracking-tight line-clamp-1 font-luxury  leading-none">{service.name}</h4>
                                <span className="text-[15px] font-black text-primary leading-none">${service.price}</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-muted text-[8px] font-black uppercase tracking-widest">
                                <span className="flex items-center gap-1">
                                  <Clock size={10} className="text-primary" /> {service.duration} Mins
                                </span>
                                <span className="h-0.5 w-0.5 bg-white/10 rounded-full" />
                                <span className="flex items-center gap-1">
                                  <Sparkles size={10} className="text-primary" /> Elite Care
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="hidden md:flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                          <Sparkles size={18} />
                        </div>
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-relaxed">
                          Select multiple rituals for a <br /> complete transformation.
                        </p>
                      </div>
                      <button
                        onClick={nextStep}
                        disabled={selectedServices.length === 0}
                        className="w-full sm:w-auto px-10 py-4 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-1 md:space-y-3">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Full Master Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                          <input
                            {...formik.getFieldProps('clientName')}
                            placeholder="e.g. Alexander Pierce"
                            className={`w-full bg-background border-2 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none transition-all text-white ${formik.touched.clientName && formik.errors.clientName ? 'border-red-500/30' : 'border-transparent focus:border-primary/20'
                              }`}
                          />
                        </div>
                        {formik.touched.clientName && formik.errors.clientName && (
                          <motion.p initial={{ x: -2 }} animate={{ x: 2 }} className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientName}</motion.p>
                        )}
                      </div>

                      <div className="space-y-1 md:space-y-3">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Email Transmission</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                          <input
                            {...formik.getFieldProps('clientEmail')}
                            placeholder="ritual@glow.com"
                            className="w-full bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none transition-all text-white"
                          />
                        </div>
                        {formik.touched.clientEmail && formik.errors.clientEmail && (
                          <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientEmail}</p>
                        )}
                      </div>
 
                      <div className="space-y-1 md:space-y-3">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Contact Signal</label>
                        <div className="flex bg-background border-2 border-transparent focus-within:border-primary/20 rounded-2xl transition-all overflow-hidden shadow-inner">
                          <div className="flex items-center pl-4 md:pl-6 pr-4 border-r border-white/5 bg-white/5">
                            <span className="text-xs md:text-sm font-black text-muted leading-none">+1</span>
                          </div>
                          <div className="relative flex-1">
                            <input
                              name="clientPhone"
                              value={formik.values.clientPhone}
                              onChange={handlePhoneChange}
                              onBlur={formik.handleBlur}
                              placeholder="416-123-4567"
                              className="w-full bg-transparent px-4 md:px-6 py-4 text-sm font-bold outline-none dark:text-white"
                            />
                          </div>
                        </div>
                        {formik.touched.clientPhone && formik.errors.clientPhone && (
                          <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientPhone}</p>
                        )}
                      </div>
 
                      <div className="space-y-1 md:space-y-3">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Appointed Date</label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                          <input
                            type="date"
                            {...formik.getFieldProps('date')}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none transition-all text-white [color-scheme:dark]"
                          />
                        </div>
                      </div>


                      {/* Staff Selection Section */}
                      <div className="md:col-span-2 space-y-4 pt-6 border-t border-white/5">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Select Your Master (Specialize for each ritual)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedServices.map(service => {
                            const eligibleStaff = allStaff.filter(s => s.services?.some(ser => (typeof ser === 'string' ? ser === service._id : ser._id === service._id)));
                            return (
                              <div key={service._id} className="bg-background p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-sm">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase text-primary truncate max-w-[120px] font-luxury">{service.name}</span>
                                  <span className="text-[8px] text-muted font-black uppercase tracking-tighter">performed by</span>
                                </div>
                                <select
                                  value={staffAssignments[service._id] || ""}
                                  onChange={(e) => setStaffAssignments({ ...staffAssignments, [service._id]: e.target.value })}
                                  className="bg-secondary px-3 py-2 rounded-xl text-[9px] font-black uppercase outline-none cursor-pointer text-white border border-white/5 focus:ring-0"
                                >
                                  <option value="">Any Master</option>
                                  {eligibleStaff.map(stf => (
                                    <option key={stf._id} value={stf._id}>{stf.name}</option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1 md:space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Preferred Time Slot</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3 relative min-h-[100px]">
                          {slotsLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-2xl">
                              <Loader2 className="animate-spin text-primary" strokeWidth={3} />
                            </div>
                          )}

                          {timeSlots.map(time => {
                            const [timePart, ampm] = time.split(' ');
                            let [hours, minutes] = timePart.split(':');
                            hours = parseInt(hours);
                            if (ampm === 'PM' && hours < 12) hours += 12;
                            if (ampm === 'AM' && hours === 12) hours = 0;
                            let isOccupied = false;
                            const isSelected = formik.values.time === time;

                            if (formik.values.date) {
                              const timeIso = new Date(`${formik.values.date}T${hours.toString().padStart(2, '0')}:${minutes}:00`).toISOString();
                              isOccupied = occupiedSlots.includes(timeIso);

                              // Disable if date is today and time is already past
                              const now = new Date();
                              const selectedDate = new Date(formik.values.date);
                              const isToday = selectedDate.toDateString() === now.toDateString();

                              if (isToday) {
                                // Create a date object for this specific slot in local time to compare accurately
                                const slotDateTime = new Date(`${formik.values.date}T${hours.toString().padStart(2, '0')}:${minutes}:00`);
                                if (slotDateTime < now) {
                                  isOccupied = true;
                                }
                              }
                            }

                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={isOccupied || slotsLoading}
                                onClick={() => formik.setFieldValue('time', time)}
                                className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all relative overflow-hidden ${isSelected
                                    ? 'bg-primary text-secondary shadow-xl scale-105 z-1'
                                    : isOccupied
                                      ? 'bg-white/5 text-muted/20 cursor-not-allowed grayscale'
                                      : 'bg-background text-muted hover:bg-white/5 hover:text-white hover:shadow-md border border-white/5 shadow-inner'
                                  }`}
                              >
                                {time}
                                {isOccupied && (
                                  <div className="absolute inset-0 bg-red-400/5 rotate-45 translate-y-2 pointer-events-none" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* All Slots Occupied Message */}
                        {(() => {
                          if (!formik.values.date || slotsLoading) return null;
                          const allOccupied = timeSlots.every(time => {
                            const [timePart, ampm] = time.split(' ');
                            let [hours, minutes] = timePart.split(':');
                            hours = parseInt(hours);
                            if (ampm === 'PM' && hours < 12) hours += 12;
                            if (ampm === 'AM' && hours === 12) hours = 0;
                            const timeIso = new Date(`${formik.values.date}T${hours.toString().padStart(2, '0')}:${minutes}:00`).toISOString();
                            let isOccupied = occupiedSlots.includes(timeIso);
                            const now = new Date();
                            const slotDateTime = new Date(`${formik.values.date}T${hours.toString().padStart(2, '0')}:${minutes}:00`);
                            if (slotDateTime < now) isOccupied = true;
                            return isOccupied;
                          });

                          if (allOccupied) {
                            return (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl md:col-span-2"
                              >
                                <AlertCircle size={16} className="text-primary" />
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">
                                  All qualified masters are occupied during this temporal slot
                                </p>
                              </motion.div>
                            );
                          }
                          return null;
                        })()}

                        {formik.touched.time && formik.errors.time && (

                          <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.time}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
                      <button
                        onClick={prevStep}
                        className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest hover:text-primary transition-colors"
                      >
                        <ChevronLeft size={18} />
                        Back to Selection
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={!formik.isValid || !formik.values.clientName || !formik.values.time}
                        className="w-full sm:w-auto px-10 py-4 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
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
                    <div className="bg-background rounded-2xl p-5 md:p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
                      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-primary">
                        <CheckCircle2 size={150} strokeWidth={1} />
                      </div>

                      <div className="relative z-10 space-y-10">
                        <div>
                          <h3 className="text-2xl font-black uppercase tracking-tighter mb-8  font-luxury">The Ritual Summary</h3>
                          <div className="space-y-4">
                            {selectedServices.map(s => (
                              <div key={s._id} className="flex justify-between items-center py-3 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted">{s.name}</span>
                                <span className="text-sm font-black text-primary font-luxury">${s.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                          <div className="space-y-2">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1 md:mb-2">Champion</span>
                            <p className="text-xs md:text-sm font-black uppercase tracking-widest">{formik.values.clientName}</p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1 md:mb-2">Schedule</span>
                            <p className="text-xs md:text-sm font-black uppercase tracking-widest">{formik.values.date} • {formik.values.time}</p>
                          </div>
                        </div>


                        <div className="pt-10 border-t border-white/10 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Total Investment</span>
                            <span className="text-4xl font-black text-primary tracking-tighter  font-luxury">${totalPrice}</span>
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
                        className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest hover:text-primary transition-colors"
                      >
                        <ChevronLeft size={18} />
                        Adjust Rituals
                      </button>
                      <button
                        onClick={formik.handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-6 bg-primary text-secondary rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
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

          {/* Mobile Summary (Visible when rituals are selected) */}
          <div className="lg:hidden">
            <AnimatePresence>
              {selectedServices.length > 0 && step < 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="bg-secondary rounded-2xl p-6 border border-white/5 shadow-2xl mb-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Selections</p>
                      <h4 className="text-xl font-black text-primary font-luxury">${totalPrice}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Total Rituals</p>
                      <p className="text-sm font-black text-white">{selectedServices.length}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Selection Sidebar (Desktop) */}
          <div className="lg:col-span-4 hidden lg:block">

            <div className="sticky top-32 space-y-8">
              <div className="bg-secondary rounded-2xl p-10 border border-white/5 shadow-xl">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                  <ShoppingBag className="text-primary" />
                  <h3 className="text-xl font-black uppercase tracking-tighter  font-luxury text-white">Your Rituals</h3>
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
                            <span className="text-[10px] font-black uppercase tracking-widest text-white truncate max-w-[150px] font-luxury">{s.name}</span>
                            <span className="text-[8px] font-bold text-muted uppercase tracking-[0.2em]">{s.duration} Min</span>
                          </div>
                          <button
                            onClick={() => toggleService(s)}
                            className="text-red-400 opacity-100 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Sparkles size={32} className="text-white/5 mx-auto mb-4" />
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">No rituals selected yet.</p>
                    </div>
                  )}
                </AnimatePresence>

                <div className="pt-10 border-t border-white/5 space-y-6">
                  <div className="flex justify-between items-center text-muted">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Total Rituals</span>
                    <span className="text-sm font-bold">{selectedServices.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em]">Total Investment</span>
                    <span className="text-3xl font-black text-primary tracking-tighter  font-luxury">${totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-background rounded-2xl border border-white/5 p-8 text-center shadow-inner">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-primary fill-primary" />)}
                </div>
                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest leading-relaxed  font-luxury">
                  Trusted by over 5,000 clients for <br /> premium luxury transformations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>


      <PublicFooter />

      {/* Primary Success Modal Context */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            data={{
              ...formik.values,
              date: new Date(formik.values.date),
              id: bookingResponse?._id || bookingResponse?.appointmentId
            }}
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

