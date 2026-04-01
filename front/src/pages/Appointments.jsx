import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Filter, Search, Plus, MapPin, User, MoreVertical, X, Sparkles, StepForward, StepBack, Edit3, Trash2, AlertTriangle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay, startOfDay } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, addAppointment, updateAppointment, deleteAppointment } from '../redux/slices/appointmentSlice';
import { fetchServices } from '../redux/slices/serviceSlice';
import { fetchClients } from '../redux/slices/clientSlice';
import Modal from '../components/ui/Modal';
import { IMAGE_URL } from '../utils/BASE_URL';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';
import AdminHeader from '../components/ui/AdminHeader';


export default function Appointments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  const { appointments, loading: appointmentsLoading } = useSelector(state => state.appointments);
  const { services } = useSelector(state => state.services);
  const { clients } = useSelector(state => state.clients);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isNewClient, setIsNewClient] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchServices());
    dispatch(fetchClients());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      clientId: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      services: [],
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      status: 'Pending',
      paymentStatus: 'Pending',
    },
    validationSchema: Yup.object({
      clientEmail: Yup.string().email('Invalid email').when('clientId', {
        is: 'new',
        then: (schema) => schema.required('Identity Required'),
        otherwise: (schema) => schema.notRequired()
      }),
      clientName: Yup.string().when('clientId', {
        is: 'new',
        then: (schema) => schema.required('Name Required'),
        otherwise: (schema) => schema.notRequired()
      }),
      clientPhone: Yup.string().when('clientId', {
        is: 'new',
        then: (schema) => schema.required('Phone Required').matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
        otherwise: (schema) => schema.notRequired()
      }),
      services: Yup.array().min(1, 'Select at least one ritual').required('Required'),
      date: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (selectedAppointment) {
          await dispatch(updateAppointment({ id: selectedAppointment._id, appointment: values })).unwrap();
        } else {
          await dispatch(addAppointment(values)).unwrap();
        }
        setIsDrawerOpen(false);
        setSelectedAppointment(null);
        resetForm();
      } catch (error) {
        toast.error(error.message || 'Operation failed');
        console.error("Masterpiece Sync Failed:", error);
      }
    }
  });

  const handleEdit = (app) => {
    const appDate = new Date(app.appointmentDate);
    setIsNewClient(false);
    setSelectedAppointment(app);
    formik.setValues({
      clientId: app.client?._id || '',
      clientName: app.client?.name || '',
      clientEmail: app.client?.email || '',
      clientPhone: app.client?.phone || '',
      services: app.assignments?.map(a => (a.service?._id || a.service)) || [],
      date: format(appDate, "yyyy-MM-dd'T'HH:mm"),
      status: app.status || 'Pending',
      paymentStatus: app.paymentStatus || 'Pending',
    });
    setIsDrawerOpen(true);
  };

  const openDeleteModal = (app) => {
    setAppointmentToDelete(app);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteAppointment(appointmentToDelete._id)).unwrap();
      toast.success('Booking cancelled');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Dissolution failed');
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredAppointments = appointments.filter(app =>
    isSameDay(new Date(app.appointmentDate), selectedDate)
  );

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Confirmed': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-white/5 text-muted border-white/10';
    }
  };

  if (appointmentsLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-6 md:gap-10">
      {/* Header */}
      <AdminHeader 
        title="Appointment Bookings"
        subtitle="Architectural Management of the Temporal Record"
        icon={CalendarIcon}
        rightContent={
          <button
            onClick={() => {
              setSelectedAppointment(null);
              setIsNewClient(false);
              formik.resetForm();
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group"
          >
            <Plus size={18} md:size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            Secure Ritual Slot
          </button>
        }
      />


      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
        {/* Calendar Column - Refactored for High Density */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <div className="bg-secondary/40 backdrop-blur-xl p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/5 shadow-3xl relative overflow-hidden flex flex-col h-fit">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />

            <div className="flex flex-row gap-4 sm:items-center justify-between mb-6 md:mb-8 relative z-10">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em] leading-none mb-2 ">Temporal Matrix</span>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter  font-luxury">{format(currentDate, 'MMMM yyyy')}</h3>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-background border border-white/5 rounded-xl hover:bg-primary hover:text-secondary transition-all shadow-xl active:scale-95 group"
                >
                  <StepBack size={16} md:size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-background border border-white/5 rounded-xl hover:bg-primary hover:text-secondary transition-all shadow-xl active:scale-95 group"
                >
                  <StepForward size={16} md:size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 relative z-10">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="text-center text-[8px] font-black text-muted/40 py-2 uppercase tracking-[0.3em] ">{day}</div>
              ))}
              {days.map((day, i) => {
                const isSelected = isSameDay(day, selectedDate);
                const hasApps = appointments.some(a => isSameDay(new Date(a.appointmentDate), day));

                return (
                  <motion.div
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.005 }}
                    className={`
                    aspect-square rounded-lg md:rounded-xl flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-300
                    ${isSelected ? 'bg-primary text-secondary shadow-lg scale-105 z-20' : 'bg-background/50 hover:bg-white/5 text-muted'}
                    ${!isSameMonth(day, monthStart) ? 'opacity-5 hover:opacity-50' : ''}
                    ${isToday(day) && !isSelected ? 'border-2 border-primary/20 shadow-inner' : 'border border-white/5'}
                  `}
                  >
                    <span className={`text-base md:text-lg font-black tracking-tighter ${isSelected ? 'text-secondary' : 'text-white'}`}>{format(day, 'd')}</span>
                    {hasApps && (
                      <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full absolute bottom-0.5  sm:bottom-1.5 md:bottom-2 ${isSelected ? 'bg-secondary' : 'bg-primary shadow-lg shadow-primary/40'}`} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Column: Appointments Feed */}
        <div className="lg:col-span-5 flex flex-col min-h-0 gap-6">
          <div className="flex items-center justify-between px-4 shrink-0">
            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase leading-none font-luxury ">Selected Protocol</h3>
              <p className="text-primary font-black text-[9px] uppercase tracking-[0.3em]">{format(selectedDate, 'MMMM do, yyyy')}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-secondary border border-white/5 flex items-center justify-center text-primary font-black text-lg shadow-inner">
              {filteredAppointments.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-4">
            {filteredAppointments.length > 0 ? filteredAppointments.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-secondary rounded-xl md:rounded-2xl p-4 border border-white/5 shadow-3xl transition-all duration-500 hover:border-primary/20 overflow-hidden"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col  sm:flex-row items-center justify-between min-w-0">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-background border border-white/10 p-1 group-hover:rotate-6 transition-transform shadow-2xl relative overflow-hidden shrink-0">
                        <img
                          src={app.client?.profileImage ? (app.client.profileImage.startsWith('http') ? app.client.profileImage : `${IMAGE_URL}${app.client.profileImage}`) : `https://api.dicebear.com/9.x/adventurer/svg?seed=${app.client?.name}`}
                          alt={app.client?.name}
                          className="w-full h-full rounded-xl md:rounded-2xl object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-white tracking-tighter uppercase text-sm truncate font-luxury  leading-none mb-2">{app.client?.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-[0.1em] bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
                            <Clock size={10} strokeWidth={3} className="opacity-50" />
                            {format(new Date(app.appointmentDate), "HH:mm")}
                          </div>
                          <div className={`text-[8px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded-lg border ${getStatusStyles(app.status)}`}>
                            {app.status}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-lg md:text-xl font-black text-white group-hover:text-primary flex self-end transition-all font-luxury ">${app.totalPrice}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 py-3 border-t border-white/5">
                    {app.assignments?.map((asm, idx) => {
                      const s = asm.service;
                      if (!s) return null;
                      return (
                        <div key={s._id || idx} className="flex items-center justify-between text-muted/60 group-hover:text-white transition-colors">
                          <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[150px]">{s.name}</span>
                          <span className="text-[8px] font-black  opacity-40">${s.price}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 justify-end">
                    <button onClick={() => navigate(`/${userInfo.role.toLowerCase()}/invoices?id=${app._id}`)} className="p-2 bg-background/80 border border-white/5 text-muted hover:text-white rounded-lg transition-all shadow-xl backdrop-blur-md">
                      <FileText size={12} />
                    </button>
                    <button onClick={() => handleEdit(app)} className="p-2 bg-background/80 border border-white/5 text-muted hover:text-primary rounded-lg transition-all shadow-xl backdrop-blur-md">
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => openDeleteModal(app)} className="p-2 bg-background/80 border border-rose-500/10 text-muted hover:text-rose-500 rounded-lg transition-all shadow-xl backdrop-blur-md">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
              </motion.div>
            ))
              : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-secondary/10 rounded-2xl border border-dashed border-white/5"
                >
                  <Clock className="text-white/5 mb-6 rotate-12" size={48} strokeWidth={1} />
                  <p className="text-muted/40 font-black uppercase tracking-[0.4em] text-[10px] ">No active protocols recorded</p>
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="mt-8 text-primary font-black text-[9px] uppercase tracking-[0.5em] flex items-center justify-center gap-3 mx-auto group hover:scale-105 transition-all"
                  >
                    <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Initialize Ritual
                  </button>
                </motion.div>
              )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedAppointment(null);
          setIsNewClient(false);
          formik.resetForm();
        }}
        title={selectedAppointment ? 'Refine Ritual' : 'Initialize Protocol'}
        subtitle="Operational Schedule Management"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-6 md:space-y-10">
          <div className="space-y-4">
            <CustomSelect
              label="Select Target Identity"
              name="clientId"
              value={formik.values.clientId}
              onChange={(e) => {
                const val = e.target.value;
                formik.setFieldValue('clientId', val);
                if (val === 'new') {
                  setIsNewClient(true);
                  formik.setValues({ ...formik.values, clientId: val, clientName: '', clientEmail: '', clientPhone: '' });
                } else {
                  setIsNewClient(false);
                  const user = clients.find(c => c._id === val);
                  if (user) {
                    formik.setValues({ ...formik.values, clientId: val, clientName: user.name, clientEmail: user.email, clientPhone: user.phone || '' });
                  }
                }
              }}
              options={[
                { label: 'Select Client Identity...', value: '' },
                ...(!selectedAppointment ? [{ label: '+ Protocol New Client', value: 'new' }] : []),
                ...clients.map(c => ({ label: `${c.name}`, value: c._id }))
              ]}
              icon={User}
            />
          </div>

          <AnimatePresence>
            {isNewClient && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="space-y-6 md:space-y-8 overflow-hidden bg-white/5 p-4 md:p-8 rounded-xl md:rounded-2xl border border-white/5"
              >
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest ml-2 ">Legal Identifer</label>
                  <input
                    name="clientName" onChange={formik.handleChange} value={formik.values.clientName}
                    className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-4 md:px-6 py-3 md:py-4 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5"
                    placeholder="Enter Full Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest ml-2 ">Contact Tether</label>
                    <input
                      name="clientPhone" onChange={formik.handleChange} value={formik.values.clientPhone}
                      className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-4 md:px-6 py-3 md:py-4 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest ml-2 ">Digital Signature</label>
                    <input
                      name="clientEmail" onChange={formik.handleChange} value={formik.values.clientEmail}
                      className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-4 md:px-6 py-3 md:py-4 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5"
                      placeholder="Email Coordinate"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <CustomSelect
              label="Ritual Selections"
              name="services"
              value={formik.values.services}
              onChange={formik.handleChange}
              isMulti={true}
              options={services.map(s => ({ label: `${s.name} - $${s.price}`, value: s._id }))}
              icon={Sparkles}
            />
          </div>

          <div className="space-y-3 md:space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest ml-2 underline decoration-primary/30 decoration-2 underline-offset-4">Temporal Coordinates</label>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-3 md:gap-4">
              <input
                name="date" type="datetime-local" onChange={formik.handleChange} value={formik.values.date}
                className="w-full bg-secondary border border-white/10 focus:border-primary/50 rounded-xl md:rounded-2xl px-3 md:px-6 py-4 md:py-5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] outline-none text-white shadow-2xl transition-all appearance-none"
              />
            </div>
            <p className="text-[7px] font-black text-primary/40 uppercase tracking-[0.2em] ml-2">* High-density temporal engagement selection</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 md:gap-6">
            <CustomSelect
              label="Operational Status" name="status" value={formik.values.status}
              onChange={formik.handleChange}
              options={['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => ({ label: s, value: s }))}
            />
            <CustomSelect
              label="Financial Status" name="paymentStatus" value={formik.values.paymentStatus}
              onChange={formik.handleChange}
              options={['Pending', 'Paid'].map(s => ({ label: s, value: s }))}
            />
          </div>

          <div className="pt-4 md:pt-8">
            <button
              type="submit" disabled={formik.isSubmitting}
              className="w-full py-5 md:py-6 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 md:gap-4 active:scale-[0.98] disabled:opacity-50 group font-luxury "
            >
              {formik.isSubmitting ? 'Architecting Matrix...' : selectedAppointment ? 'COMMIT REFINEMENTS' : 'AUTHORIZE INITIATION'}
              <Sparkles size={18} md:size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="DISSOLVE PROTOCOL?"
        subtitle="Final Irreversible Liquidation"
        maxWidth="max-w-sm"
      >
        <div className="text-center p-4">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-8 shadow-2xl shadow-rose-500/20">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>
          <p className="text-muted font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-10">
            Eliminating ritual record for <br /><span className="text-rose-500 text-base font-luxury  underline decoration-rose-500/30 decoration-2 underline-offset-4">{appointmentToDelete?.client?.name}</span> <br /> from active reality.
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleDelete}
              className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl shadow-rose-500/20 active:scale-95 hover:bg-rose-600 transition-all font-luxury "
            >CONFIRM DISSOLUTION</button>
            <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-5 bg-white/5 text-muted rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-all font-luxury ">ABORT OPERATION</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

