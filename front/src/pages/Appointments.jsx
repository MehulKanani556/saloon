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
      services: app.services?.map(s => s._id) || [],
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

  if (appointmentsLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-saloon-100 border-t-saloon-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="">
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 lg:gap-6 relative z-10 transition-all">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border border-saloon-100 dark:border-white/10 flex items-center justify-center text-saloon-500 shadow-glass shrink-0 transition-transform hover:rotate-6">
              <CalendarIcon size={24} md:size={32} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none truncate md:whitespace-normal">Appointment Bookings</h1>
              <p className="text-slate-400 font-black text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-[0.15em] lg:tracking-[0.25em] mt-2 lg:mt-4 opacity-70 group-hover:opacity-100 transition-opacity">Manage your saloon bookings here</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedAppointment(null);
              setIsNewClient(false);
              formik.resetForm();
              setIsDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 lg:px-10 lg:py-5 bg-gradient-to-r from-saloon-500 via-saloon-600 to-rosegold-500 text-white lg:rounded-2xl rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-saloon-500/20 hover:scale-[1.05] transition-all group"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            Add New Booking
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Calendar Column */}
          <div className="xl:col-span-8 space-y-8">
            <div className="glass-card p-4 dark:bg-slate-900/40 border-white/60 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-saloon-500/5 blur-[80px] rounded-full" />

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center justify-between mb-4 sm:mb-10 mt-4 px-3 md:px-6 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black text-saloon-500 uppercase tracking-widest leading-none mb-1 md:mb-2">Calendar View</span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">{format(currentDate, 'MMMM yyyy')}</h3>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <button 
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))} 
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl md:rounded-2xl hover:bg-saloon-500 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <StepBack size={18} md:size={20} />
                  </button>
                  <button 
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))} 
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl md:rounded-2xl hover:bg-saloon-500 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    <StepForward size={18} md:size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 relative z-10 p-4">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-slate-400 py-4 uppercase tracking-[0.25em]">{day}</div>
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
                      transition={{ delay: i * 0.01 }}
                      className={`
                      aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-300
                      ${isSelected ? 'bg-saloon-500 text-white shadow-2xl scale-105 z-20' : 'hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300'}
                      ${!isSameMonth(day, monthStart) ? 'opacity-20 hover:opacity-100' : ''}
                      ${isToday(day) && !isSelected ? 'border-2 border-saloon-200' : ''}
                    `}
                    >
                      <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{format(day, 'd')}</span>
                      {hasApps && (
                        <div className={`w-1.5 h-1.5 rounded-full absolute bottom-4 ${isSelected ? 'bg-white' : 'bg-saloon-500 animate-pulse'}`} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Column: Appointments Feed */}
          <div className="xl:col-span-4 space-y-6 lg:mt-0">
            <div className="flex items-center justify-between px-2 mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">Today's Bookings</h3>
                <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest mt-3">Bookings for {format(selectedDate, 'MMM do')}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-saloon-500/10 flex items-center justify-center text-saloon-500 font-black text-sm border border-saloon-500/20">
                {filteredAppointments.length}
              </div>
            </div>

            <div className="space-y-5 max-h-[900px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredAppointments.length > 0 ? filteredAppointments.map((app, index) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 sm:p-5 border-white/60 dark:bg-slate-900/40 hover-lift shadow-xl group border-l-4 border-l-saloon-500 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-saloon-50 dark:bg-slate-800 overflow-hidden border border-white dark:border-white/5 p-0.5 shadow-sm shrink-0">
                        <img
                          src={app.client.profileImage ? `${IMAGE_URL}${app.client.profileImage}` : `https://api.dicebear.com/9.x/adventurer/svg?seed=${app.client?.name}`}
                          alt={app.client?.name}
                          className="w-full h-full rounded-[14px] object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-slate-800 dark:text-white tracking-tighter uppercase text-xs sm:text-sm truncate">{app.client?.name}</h4>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-black text-saloon-500 uppercase tracking-widest bg-saloon-50 dark:bg-saloon-900/20 px-1.5 sm:px-2 py-1 rounded-lg w-fit shrink-0">
                            <Clock size={10} sm:size={12} strokeWidth={3} />
                            {format(new Date(app.appointmentDate), 'hh:mm a')}
                          </div>
                          <div className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-1 rounded-lg border shrink-0 ${app.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            app.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              app.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}>
                            {app.status}
                          </div>
                          <div className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-1 rounded-lg border shrink-0 ${app.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            'bg-slate-500/10 text-slate-500 border-slate-500/20'
                            }`}>
                            {app.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start justify-end sm:justify-start">
                      <button onClick={() => navigate(`/invoices?id=${app._id}`)} className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 rounded-xl transition-all shadow-sm">
                        <FileText size={14} />
                      </button>
                      <button onClick={() => handleEdit(app)} className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-saloon-500 rounded-xl transition-all shadow-sm">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => openDeleteModal(app)} className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2 sm:space-y-3 group-hover:bg-slate-900 dark:group-hover:bg-saloon-500 transition-all duration-300">
                    {app.services?.map((s, idx) => (
                      <div key={s._id} className="flex items-center justify-between group-hover:text-white gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-saloon-500 group-hover:bg-white shrink-0" />
                          <span className="text-[10px] sm:text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest group-hover:text-white truncate">{s.name}</span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-black opacity-60 shrink-0">${s.price}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between group-hover:border-white/20">
                      <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/60">Final Total</span>
                      <span className="text-xs sm:text-sm font-black text-saloon-500 group-hover:text-white">${app.totalPrice}</span>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-16 text-center glass-card border-dashed border-slate-200 dark:border-white/10"
                >
                  <Clock className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No bookings for this date</p>
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="mt-6 text-saloon-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
                  >
                    <Plus size={14} /> Add Booking
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {isDrawerOpen && (
            <div key="drawer-container">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[210] flex flex-col border-l border-white/20"
              >
                <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">
                      {selectedAppointment ? 'Edit Booking' : 'New Booking'}
                    </h2>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4">
                      {selectedAppointment ? 'Update booking details' : 'Enter customer details for booking'}
                    </p>
                  </div>
                  <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-saloon-500 transition-all">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                  <form onSubmit={formik.handleSubmit} className="space-y-10">
                    <div className="space-y-4">
                      <CustomSelect
                        label="Client Name"
                        name="clientId"
                        value={formik.values.clientId}
                        onChange={(e) => {
                          const val = e.target.value;
                          formik.setFieldValue('clientId', val);
                          if (val === 'new') {
                            setIsNewClient(true);
                            formik.setFieldValue('clientName', '');
                            formik.setFieldValue('clientEmail', '');
                            formik.setFieldValue('clientPhone', '');
                          } else {
                            setIsNewClient(false);
                            if (val === '') {
                              formik.setFieldValue('clientName', '');
                              formik.setFieldValue('clientEmail', '');
                              formik.setFieldValue('clientPhone', '');
                            } else {
                              const user = clients.find(c => c._id === val);
                              if (user) {
                                formik.setFieldValue('clientName', user.name);
                                formik.setFieldValue('clientEmail', user.email);
                                formik.setFieldValue('clientPhone', user.phone || '');
                              }
                            }
                          }
                        }}
                        options={[
                          { label: 'Choose Profile...', value: '' },
                          ...(!selectedAppointment ? [{ label: '+ Add New Customer', value: 'new' }] : []),
                          ...clients.map(c => ({ label: `${c.name}`, value: c._id }))
                        ]}
                      />
                    </div>

                    <AnimatePresence>
                      {isNewClient && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-10 overflow-hidden"
                        >
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Customer Name</label>
                            <input
                              name="clientName"
                              onChange={formik.handleChange}
                              value={formik.values.clientName}
                              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all dark:text-white shadow-inner"
                              placeholder="e.g. Liam Smith"
                            />
                            {formik.errors.clientName && <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientName}</p>}
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                            <input
                              name="clientEmail"
                              onChange={formik.handleChange}
                              value={formik.values.clientEmail}
                              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all dark:text-white shadow-inner"
                              placeholder="liam@example.com"
                            />
                            {formik.errors.clientEmail && <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientEmail}</p>}
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                            <input
                              name="clientPhone"
                              onChange={formik.handleChange}
                              value={formik.values.clientPhone}
                              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all dark:text-white shadow-inner"
                              placeholder="e.g. +91 9876543210"
                            />
                            {formik.errors.clientPhone && <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.clientPhone}</p>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="">
                      <CustomSelect
                        label="Select Services"
                        name="services"
                        value={formik.values.services}
                        onChange={formik.handleChange}
                        isMulti={true}
                        options={[
                          ...services.map(s => ({ label: `${s.name} - $${s.price}`, value: s._id }))
                        ]}
                      />
                      {formik.errors.services && <p className="text-[9px] text-red-500 font-bold uppercase ml-4 mt-1">{formik.errors.services}</p>}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Date & Time</label>
                      <input
                        name="date"
                        type="datetime-local"
                        onChange={formik.handleChange}
                        value={formik.values.date}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 rounded-2xl px-6 py-5 text-xs font-black uppercase tracking-widest outline-none dark:text-white border-none"
                      />
                      {formik.errors.date && <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.date}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <CustomSelect
                        label="Booking Status"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        options={['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => ({ label: s, value: s }))}
                      />
                      <CustomSelect
                        label="Payment Status"
                        name="paymentStatus"
                        value={formik.values.paymentStatus}
                        onChange={formik.handleChange}
                        options={['Pending', 'Paid'].map(s => ({ label: s, value: s }))}
                      />
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl hover:bg-saloon-600 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                      >
                        {formik.isSubmitting ? 'Saving...' : selectedAppointment ? 'Update Booking' : 'Confirm Booking'}
                        <Sparkles size={20} />
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {isDeleteModalOpen && (
            <div key="delete-modal-backdrop" className="fixed inset-0 z-[300] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
              />
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-12 shadow-2xl overflow-hidden border border-white/20"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full" />
                <div className="relative z-10 text-center space-y-8">
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto border border-red-100 dark:border-red-500/20 text-red-500">
                    <AlertTriangle size={40} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">Delete Booking?</h3>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4">This booking will be deleted forever.</p>
                  </div>
                  <div className="flex gap-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</p>
                      <p className="text-sm font-black text-slate-700 dark:text-white uppercase truncate max-w-[200px]">{appointmentToDelete?.client?.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-300 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 dark:hover:bg-white dark:hover:text-slate-900 transition-all active:scale-95"
                    >
                      Keep
                    </button>
                    <button
                      onClick={handleDelete}
                      className="py-5 bg-red-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      Confirm Deletion
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
