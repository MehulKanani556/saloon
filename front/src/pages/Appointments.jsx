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

export default function Appointments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-6 group">
          <div className="w-16 h-16 rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-primary shadow-premium shrink-0 transition-transform hover:rotate-6">
            <CalendarIcon size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 font-luxury">Appointment Bookings</h1>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] opacity-60">Architectural Management of the Temporal Record</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedAppointment(null);
            setIsNewClient(false);
            formik.resetForm();
            setIsDrawerOpen(true);
          }}
          className="flex items-center gap-4 px-10 py-5 bg-primary text-secondary rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group"
        >
          <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
          Secure Ritual Slot
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Calendar Column */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-secondary/40 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-3xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />

            <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between mb-12 relative z-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.5em] leading-none mb-3 ">Temporal Matrix</span>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter  font-luxury">{format(currentDate, 'MMMM yyyy')}</h3>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="w-14 h-14 flex items-center justify-center bg-background border border-white/5 rounded-2xl hover:bg-primary hover:text-secondary transition-all shadow-xl active:scale-95 group"
                >
                  <StepBack size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="w-14 h-14 flex items-center justify-center bg-background border border-white/5 rounded-2xl hover:bg-primary hover:text-secondary transition-all shadow-xl active:scale-95 group"
                >
                  <StepForward size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 relative z-10">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="text-center text-[9px] font-black text-muted/40 py-4 uppercase tracking-[0.4em] ">{day}</div>
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
                    aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-500
                    ${isSelected ? 'bg-primary text-secondary shadow-2xl scale-110 z-20' : 'bg-background/50 hover:bg-white/5 text-muted'}
                    ${!isSameMonth(day, monthStart) ? 'opacity-10 hover:opacity-100' : ''}
                    ${isToday(day) && !isSelected ? 'border-2 border-primary/20 shadow-inner shadow-primary/5' : 'border border-white/5'}
                  `}
                  >
                    <span className={`text-lg font-black tracking-tighter ${isSelected ? 'text-secondary' : 'text-white'}`}>{format(day, 'd')}</span>
                    {hasApps && (
                      <div className={`w-1.5 h-1.5 rounded-full absolute bottom-3 ${isSelected ? 'bg-secondary' : 'bg-primary shadow-lg shadow-primary/40'}`} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Column: Appointments Feed */}
        <div className="xl:col-span-4 space-y-10 lg:mt-0">
          <div className="flex items-center justify-between px-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none font-luxury ">Selected Protocol</h3>
              <p className="text-primary font-black text-[9px] uppercase tracking-[0.3em]">{format(selectedDate, 'MMMM do, yyyy')}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary border border-white/5 flex items-center justify-center text-primary font-black text-lg shadow-inner">
              {filteredAppointments.length}
            </div>
          </div>

          <div className="space-y-6 max-h-[900px] overflow-y-auto pr-3 custom-scrollbar">
            {filteredAppointments.length > 0 ? filteredAppointments.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-secondary rounded-2xl p-4 border border-white/5 shadow-3xl transition-all duration-500 hover:border-primary/20 overflow-hidden"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-background border border-white/10 p-1 group-hover:rotate-6 transition-transform shadow-2xl relative overflow-hidden shrink-0">
                      <img
                        src={app.client?.profileImage ? (app.client.profileImage.startsWith('http') ? app.client.profileImage : `${IMAGE_URL}${app.client.profileImage}`) : `https://api.dicebear.com/9.x/adventurer/svg?seed=${app.client?.name}`}
                        alt={app.client?.name}
                        className="w-full h-full rounded-2xl object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-white tracking-tighter uppercase text-sm truncate font-luxury  leading-none mb-2">{app.client?.name}</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-[0.1em] bg-primary/10 px-2 py-1 rounded-2xl border border-primary/20">
                          <Clock size={10} strokeWidth={3} className="opacity-50" />
                          {format(new Date(app.appointmentDate), "HH:mm")}
                        </div>
                        <div className={`text-[8px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded-2xl border ${getStatusStyles(app.status)}`}>
                          {app.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 py-3 border-t border-white/5">
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

                  <div className="pt-3 border-t border-dashed border-white/10 group-hover:border-primary/20 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button onClick={() => navigate(`/admin/invoices?id=${app._id}`)} className="p-2.5 bg-background/80 border border-white/5 text-muted hover:text-white rounded-2xl transition-all shadow-xl backdrop-blur-md">
                        <FileText size={14} />
                      </button>
                      <button onClick={() => handleEdit(app)} className="p-2.5 bg-background/80 border border-white/5 text-muted hover:text-primary rounded-2xl transition-all shadow-xl backdrop-blur-md">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => openDeleteModal(app)} className="p-2.5 bg-background/80 border border-rose-500/10 text-muted hover:text-rose-500 rounded-2xl transition-all shadow-xl backdrop-blur-md">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span className="text-xl font-black text-white group-hover:text-primary transition-all font-luxury ">${app.totalPrice}</span>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
              </motion.div>
            ))
              : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center bg-secondary/20 rounded-2xl border border-dashed border-white/10"
                >
                  <Clock className="mx-auto text-white/5 mb-6 rotate-12" size={64} strokeWidth={1} />
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
        <form onSubmit={formik.handleSubmit} className="space-y-10">
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
                className="space-y-8 overflow-hidden bg-white/5 p-8 rounded-2xl border border-white/5"
              >
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2 ">Legal Identifer</label>
                  <input
                    name="clientName" onChange={formik.handleChange} value={formik.values.clientName}
                    className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-6 py-4 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5"
                    placeholder="Enter Full Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2 ">Contact Tether</label>
                    <input
                      name="clientPhone" onChange={formik.handleChange} value={formik.values.clientPhone}
                      className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-6 py-4 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2 ">Digital Signature</label>
                    <input
                      name="clientEmail" onChange={formik.handleChange} value={formik.values.clientEmail}
                      className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-6 py-4 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5"
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

          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2  underline decoration-primary/30 decoration-2 underline-offset-8">Temporal Coordinates</label>
            <input
              name="date" type="datetime-local" onChange={formik.handleChange} value={formik.values.date}
              className="w-full bg-secondary border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] outline-none text-white shadow-2xl transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
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

          <div className="pt-8">
            <button
              type="submit" disabled={formik.isSubmitting}
              className="w-full py-6 bg-primary text-secondary rounded-2xl font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 group font-luxury "
            >
              {formik.isSubmitting ? 'Architecting Matrix...' : selectedAppointment ? 'COMMIT REFINEMENTS' : 'AUTHORIZE INITIATION'}
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
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

