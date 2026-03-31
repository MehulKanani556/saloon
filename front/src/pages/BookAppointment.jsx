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
import { BASE_URL, IMAGE_URL } from '../utils/BASE_URL';

// const BASE_URL = 'http://localhost:5000/api';
// const IMAGE_URL = 'http://localhost:5000';

// --- Validation Schema ---
const appointmentSchema = Yup.object().shape({
  clientName: Yup.string().required('Full name is required').min(3, 'At least 3 characters'),
  clientEmail: Yup.string(), 
  clientPhone: Yup.string()
    .matches(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/, 'Must be in 416-123-4567 format')
    .required('Phone is required'),
  date: Yup.date().min(new Date(new Date().setHours(0,0,0,0)), 'Date cannot be in the past').required('Date is required'),
  time: Yup.string().required('Time is required'),
});

// --- Components ---

const SuccessModal = ({ data, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-background/95 backdrop-blur-2xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-secondary rounded-[3rem] p-12 text-center shadow-2xl relative border border-white/5 overflow-hidden"
      >
        {/* Simple CSS Confetti Burst Placeholder Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 500, x: 0, opacity: 1 }}
              animate={{ y: -100, x: (i - 10) * 20, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{ left: '50%' }}
            />
          ))}
        </div>

        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-inner">
          <CheckCircle2 size={56} strokeWidth={1.5} />
        </div>
        
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic font-luxury">Ritual Confirmed!</h2>
        <p className="text-muted font-bold text-[10px] uppercase tracking-widest leading-relaxed mb-10">
          Your transformation at Glow & Elegance is officially in the chronicles. We've sent a detailed confirmation to your email.
        </p>

        <div className="bg-background rounded-3xl p-6 mb-10 text-left space-y-4 border border-white/5">
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
          className="w-full py-5 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-primary/90 transition-all active:scale-95"
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
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [staffAssignments, setStaffAssignments] = useState({}); // { serviceId: staffId }
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [sRes, stRes] = await Promise.all([
          axios.get(`${BASE_URL}/services`),
          axios.get(`${BASE_URL}/staff`)
        ]);
        setServices(Array.isArray(sRes.data) ? sRes.data : []);
        setAllStaff(Array.isArray(stRes.data) ? stRes.data : []);
      } catch (err) {
        toast.error("Failed to load salon assets");
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
          clientPhone: `+1 ${values.clientPhone}`, // Added space for "+1 XXX-XXX-XXXX" format
          assignments: selectedServices.map(s => ({
            service: s._id,
            staff: staffAssignments[s._id] || null // null triggers auto-assignment
          })),
          date: new Date(`${values.date}T${time24}:00`).toISOString(),
        };
        const res = await axios.post(`${BASE_URL}/appointments`, body);
        setBookingResponse(res.data);
        setShowSuccess(true);
      } catch (err) {
        toast.error(err.response?.data?.message || "Booking failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchOccupiedSlots = async () => {
      if (formik.values.date && selectedServices.length > 0) {
        setSlotsLoading(true);
        try {
          const serviceIds = selectedServices.map(s => s._id).join(',');
          const staffIds = Object.values(staffAssignments).filter(id => id).join(',');
          const res = await axios.get(`${BASE_URL}/appointments/occupied-slots`, {
            params: { 
              date: formik.values.date,
              serviceIds,
              staffIds
            }
          });
          setOccupiedSlots(res.data.occupiedSlots || []);
        } catch (err) {
          console.error("Failed to load availability matrix");
        } finally {
          setSlotsLoading(false);
        }
      }
    };
    fetchOccupiedSlots();
  }, [formik.values.date, selectedServices, staffAssignments]);

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
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 mb-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-[2rem] bg-secondary text-primary flex items-center justify-center shadow-xl border border-white/10">
              <Scissors size={28} />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic font-luxury">Book Your Ritual</h1>
          <p className="text-muted font-black text-[10px] uppercase tracking-[0.3em] mt-4">Secure your spot in our sanctuary of elegance.</p>
        </div>

        <div className="container px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-secondary rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/5 overflow-hidden">
              
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-20 relative px-4 md:px-10">
                 {/* Connection Pipe */}
                 <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5 -translate-y-1/2 z-0 mx-10 md:mx-20" />
                 
                 {/* Progress Pipe */}
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `calc(${((step - 1) / (steps.length - 1)) * 100}% - ${step === steps.length ? '0px' : '40px'})` }}
                    className="absolute top-1/2 left-10 md:left-20 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
                 />
 
                 {steps.map((s, i) => {
                   const isActive = step === i + 1;
                   const isCompleted = step > i + 1;
                   
                   return (
                     <div key={i} className="relative z-10 flex flex-col items-center group">
                        <motion.div 
                           initial={false}
                           animate={{ 
                             scale: isActive ? 1.2 : 1,
                             backgroundColor: isCompleted ? "#10b981" : isActive ? "#C9A227" : "rgba(255,255,255,0.05)",
                             borderColor: isCompleted ? "#10b981" : isActive ? "#C9A227" : "rgba(255,255,255,0.1)"
                           }}
                           className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shadow-xl ${
                             isActive ? 'rotate-12' : ''
                           }`}
                         >
                           <div className={`transition-transform duration-500 ${isActive ? '-rotate-12' : ''} ${isActive || isCompleted ? 'text-white' : 'text-slate-300'}`}>
                              {isCompleted ? <CheckCircle2 size={24} /> : s.icon}
                           </div>
                        </motion.div>
                        
                        <div className="absolute -bottom-10 whitespace-nowrap text-center">
                           <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? 'text-primary' : 'text-muted'}`}>
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
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {loading ? (
                        [...Array(6)].map((_, i) => (
                          <div key={i} className="aspect-square bg-background rounded-3xl animate-pulse" />
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
                                ? 'bg-primary/5 border-primary shadow-xl shadow-primary/10' 
                                : 'bg-background border-white/5 hover:border-primary/20 shadow-inner'
                            }`}
                          >
                            <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                              <img 
                                src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : service.image} 
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center">
                                  <div className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center shadow-lg">
                                    <Check size={20} strokeWidth={4} />
                                  </div>
                                </div>
                              )}
                            </div>
                            <h4 className="text-xs font-black text-white uppercase tracking-tight mb-2 truncate font-luxury">{service.name}</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-primary font-luxury">${service.price}</span>
                              <div className="flex items-center gap-1.5 text-[8px] font-black text-muted uppercase">
                                <Clock size={10} />
                                {service.duration} Min
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="hidden md:flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                             <Sparkles size={18} />
                         </div>
                         <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-relaxed">
                            Select multiple rituals for a <br/> complete transformation.
                         </p>
                      </div>
                      <button 
                        onClick={nextStep}
                        disabled={selectedServices.length === 0}
                        className="px-10 py-4 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all flex items-center gap-3"
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
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Full Master Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                          <input 
                            {...formik.getFieldProps('clientName')}
                            placeholder="e.g. Alexander Pierce"
                            className={`w-full bg-background border-2 rounded-2xl px-14 py-4 text-sm font-bold outline-none transition-all text-white ${
                              formik.touched.clientName && formik.errors.clientName ? 'border-red-500/30' : 'border-transparent focus:border-primary/20'
                            }`}
                          />
                        </div>
                        {formik.touched.clientName && formik.errors.clientName && (
                          <motion.p initial={{ x: -2 }} animate={{ x: 2 }} className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientName}</motion.p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Email Transmission</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                          <input 
                            {...formik.getFieldProps('clientEmail')}
                            placeholder="ritual@glow.com"
                            className="w-full bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl px-14 py-4 text-sm font-bold outline-none transition-all text-white"
                          />
                        </div>
                        {formik.touched.clientEmail && formik.errors.clientEmail && (
                          <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientEmail}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Contact Signal</label>
                        <div className="flex bg-background border-2 border-transparent focus-within:border-primary/20 rounded-2xl transition-all overflow-hidden shadow-inner">
                           <div className="flex items-center pl-6 pr-4 border-r border-white/5 bg-white/5">
                              <span className="text-sm font-black text-muted leading-none">+1</span>
                           </div>
                           <div className="relative flex-1">
                             <input 
                               name="clientPhone"
                               value={formik.values.clientPhone}
                               onChange={handlePhoneChange}
                               onBlur={formik.handleBlur}
                               placeholder="416-123-4567"
                               className="w-full bg-transparent px-6 py-4 text-sm font-bold outline-none dark:text-white"
                             />
                           </div>
                        </div>
                        {formik.touched.clientPhone && formik.errors.clientPhone && (
                          <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientPhone}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Appointed Date</label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                          <input 
                            type="date"
                            {...formik.getFieldProps('date')}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl px-14 py-4 text-sm font-bold outline-none transition-all text-white [color-scheme:dark]"
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
                              <div key={service._id} className="bg-background p-4 rounded-3xl border border-white/5 flex items-center justify-between shadow-sm">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase text-primary truncate max-w-[120px] font-luxury">{service.name}</span>
                                  <span className="text-[8px] text-muted font-black uppercase tracking-tighter">performed by</span>
                                </div>
                                <select 
                                  value={staffAssignments[service._id] || ""}
                                  onChange={(e) => setStaffAssignments({...staffAssignments, [service._id]: e.target.value})}
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

                      <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-3">Preferred Time Slot</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 relative min-h-[100px]">
                          {slotsLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-3xl">
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
                                className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all relative overflow-hidden ${
                                  isSelected 
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
                        {formik.touched.time && formik.errors.time && (
                          <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.time}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
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
                        className="px-10 py-4 bg-primary text-secondary rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 hover:bg-primary/90 transition-all flex items-center gap-3"
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
                    <div className="bg-background rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
                       <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-primary">
                          <CheckCircle2 size={150} strokeWidth={1} />
                       </div>
                       
                       <div className="relative z-10 space-y-10">
                          <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic font-luxury">The Ritual Summary</h3>
                            <div className="space-y-4">
                              {selectedServices.map(s => (
                                <div key={s._id} className="flex justify-between items-center py-3 border-b border-white/5">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">{s.name}</span>
                                  <span className="text-sm font-black text-primary font-luxury">${s.price}</span>
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
                                <span className="text-4xl font-black text-primary tracking-tighter italic font-luxury">${totalPrice}</span>
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
                        className="w-full py-6 bg-primary text-secondary rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
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
              <div className="bg-secondary rounded-[2.5rem] p-10 border border-white/5 shadow-xl">
                 <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <ShoppingBag className="text-primary" />
                    <h3 className="text-xl font-black uppercase tracking-tighter italic font-luxury text-white">Your Rituals</h3>
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
                              className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                               <AlertCircle size={14} />
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
                       <span className="text-3xl font-black text-primary tracking-tighter italic font-luxury font-luxury">${totalPrice}</span>
                    </div>
                 </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-background rounded-[2.5rem] border border-white/5 p-8 text-center shadow-inner">
                 <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-primary fill-primary" />)}
                 </div>
                 <p className="text-[9px] font-black text-white/60 uppercase tracking-widest leading-relaxed italic font-luxury">
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
            data={{ 
              ...formik.values, 
              date: new Date(formik.values.date),
              id: bookingResponse?.appointmentId
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
