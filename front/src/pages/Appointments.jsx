import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Filter, Search, Plus, MapPin, User, MoreVertical, X, Sparkles, StepForward, StepBack, Edit3, Trash2, AlertTriangle, FileText, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay, startOfDay, parseISO } from 'date-fns';
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
  const { appointments, leaves, loading: appointmentsLoading } = useSelector(state => state.appointments);
  const { services } = useSelector(state => state.services);
  const { clients } = useSelector(state => state.clients);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isNewClient, setIsNewClient] = useState(false);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');

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
        then: (schema) => schema.required('Email Required'),
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
      services: Yup.array().min(1, 'Select at least one service').required('Required'),
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
        console.error("Appointment Sync Failed:", error);
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
      toast.error(error.message || 'Deletion failed');
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const searchedAppointments = (appointments || []).filter(app => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.client?.name?.toLowerCase().includes(searchLower) ||
      app.assignments?.some(asm => asm.service?.name?.toLowerCase().includes(searchLower)) ||
      app.appointmentId?.toLowerCase().includes(searchLower) ||
      app._id?.toLowerCase().includes(searchLower)
    );
  });

  const filteredAppointments = searchedAppointments.filter(app =>
    isSameDay(new Date(app.appointmentDate), selectedDate)
  );

  const filteredLeaves = (leaves || []).filter(lv => 
    isSameDay(new Date(lv.startDate), selectedDate) || 
    isSameDay(new Date(lv.endDate), selectedDate) ||
    (new Date(lv.startDate) <= selectedDate && new Date(lv.endDate) >= selectedDate)
  );

  const groupAppointmentsByMonth = (apps) => {
    const filteredByYear = apps.filter(app => new Date(app.appointmentDate).getFullYear() === selectedYear);
    const sortedApps = [...filteredByYear].sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    const groups = {};
    sortedApps.forEach(app => {
      const month = format(new Date(app.appointmentDate), 'MMMM yyyy');
      if (!groups[month]) groups[month] = [];
      groups[month].push(app);
    });
    return groups;
  };

  const groupedAppointments = groupAppointmentsByMonth(searchedAppointments);

  const availableYears = Array.from(new Set((appointments || []).map(app => new Date(app.appointmentDate).getFullYear()))).sort((a, b) => b - a);
  if (!availableYears.includes(new Date().getFullYear())) {
    availableYears.unshift(new Date().getFullYear());
    availableYears.sort((a, b) => b - a);
  }

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
        title="Appointments"
        subtitle="View and manage all customer appointments"
        icon={CalendarIcon}
        rightContent={
          <>
            <div className="bg-secondary/40 backdrop-blur-md px-6 md:px-8 py-4 md:py-4.5 rounded-2xl border border-white/5 shadow-3xl flex items-center gap-4 w-full md:w-96 group focus-within:border-primary/40 transition-all duration-500">
              <Search size={18} className="text-muted group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="SEARCH APPOINTMENTS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-[10px] md:text-[11px] font-black text-white tracking-[0.2em] w-full placeholder:text-white/5 uppercase"
              />
            </div>
            <div className="bg-secondary/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md hidden sm:flex items-center gap-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-primary text-secondary shadow-lg' : 'text-muted hover:text-white'}`}
                title="Calendar View"
              >
                <CalendarIcon size={18} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-secondary shadow-lg' : 'text-muted hover:text-white'}`}
                title="List View"
              >
                <List size={18} strokeWidth={2.5} />
              </button>
            </div>
            <button
              onClick={() => {
                setSelectedAppointment(null);
                setIsNewClient(false);
                formik.resetForm();
                setIsDrawerOpen(true);
              }}
              className="flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury"
            >
              <Plus size={18} md:size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="whitespace-nowrap">Book Appointment</span>
            </button>
          </>
        }
      />


      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
        {/* Calendar Column - Refactored for High Density */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {viewMode === 'calendar' ? (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-secondary/40 backdrop-blur-xl p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/5 shadow-3xl relative overflow-hidden flex flex-col h-fit"
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[120px] rounded-full" />

                <div className="flex flex-row gap-4 sm:items-center justify-between mb-6 md:mb-8 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em] leading-none mb-2 ">Calendar</span>
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
                    <div key={day} className="text-center text-[10px] font-black text-muted/40 py-2 uppercase tracking-[0.3em] ">{day}</div>
                  ))}
                  {days.map((day, i) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const hasApps = searchedAppointments.some(a => isSameDay(new Date(a.appointmentDate), day));
                    const hasLeaves = (leaves || []).some(lv => 
                      isSameDay(new Date(lv.startDate), day) || 
                      isSameDay(new Date(lv.endDate), day) ||
                      (new Date(lv.startDate) <= day && new Date(lv.endDate) >= day)
                    );

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
                        <div className="flex gap-1 absolute bottom-1.5 md:bottom-2">
                          {hasApps && (
                            <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isSelected ? 'bg-secondary' : 'bg-primary shadow-lg shadow-primary/40'}`} />
                          )}
                          {hasLeaves && (
                            <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isSelected ? 'bg-secondary/40' : 'bg-rose-500 shadow-lg shadow-rose-500/40 animate-pulse'}`} />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-8 h-full min-h-0"
              >
                {/* Year Selection Horizontal Bar */}
                <div className="flex bg-secondary/30 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md w-fit shadow-2xl mx-auto sm:mx-0">
                  <div className="flex gap-1">
                    {availableYears.map(year => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all font-luxury ${selectedYear === year ? 'bg-primary text-secondary shadow-lg' : 'text-muted hover:text-white'}`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-10 pb-20">
                  {Object.entries(groupedAppointments).map(([month, apps]) => (
                    <div key={month} className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] bg-secondary/50 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md shadow-xl">
                          {month}
                        </span>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {apps.map((app, idx) => (
                          <motion.div
                            key={app._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setSelectedDate(new Date(app.appointmentDate))}
                            className={`group bg-secondary/30 hover:bg-secondary/60 p-5 rounded-2xl border border-white/5 transition-all cursor-pointer flex items-center justify-between gap-6 relative overflow-hidden ${isSameDay(new Date(app.appointmentDate), selectedDate) ? 'border-primary/40 bg-secondary/80 shadow-2xl scale-[1.01]' : ''}`}
                          >
                            <div className="flex items-center gap-5 relative z-10">
                              <div className="flex flex-col items-center justify-center w-14 h-14 bg-background rounded-xl border border-white/5 shrink-0">
                                <span className="text-lg font-black text-white font-luxury">{format(new Date(app.appointmentDate), 'dd')}</span>
                                <span className="text-[8px] font-black text-muted uppercase tracking-wider">{format(new Date(app.appointmentDate), 'EEE')}</span>
                              </div>
                              <div className="flex flex-col">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{app.client?.name}</h4>
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-black text-muted uppercase flex items-center gap-1.5 underline decoration-white/10 underline-offset-4">
                                    <Clock size={10} className="text-primary" />
                                    {format(new Date(app.appointmentDate), 'HH:mm')}
                                  </span>
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${getStatusStyles(app.status)}`}>
                                    {app.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0 relative z-10">
                              <p className="text-xl font-black text-white font-luxury tracking-tighter">${app.totalPrice}</p>
                              <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">{app.assignments?.length} RITUALS</p>
                            </div>

                            {isSameDay(new Date(app.appointmentDate), selectedDate) && (
                              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(groupedAppointments).length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-40">
                      <CalendarIcon size={48} className="mb-6 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-[0.4em]">No bookings discovered in history</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Column: Appointments Feed */}
        <div className="lg:col-span-5 flex flex-col min-h-0 gap-6">
          <div className="flex items-center justify-between px-4 shrink-0">
            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase leading-none font-luxury ">Appointments for</h3>
              <p className="text-primary font-black text-[9px] uppercase tracking-[0.3em]">{format(selectedDate, 'MMMM do, yyyy')}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-secondary border border-white/5 flex items-center justify-center text-primary font-black text-lg shadow-inner">
              {filteredAppointments.length + filteredLeaves.length}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-4">
            {/* Approved Leaves First */}
            {filteredLeaves.map((lv, idx) => (
              <motion.div
                key={lv._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative bg-rose-500/5 rounded-xl md:rounded-2xl p-4 border border-rose-500/10 shadow-3xl overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-background border border-rose-500/20 p-1 shrink-0 relative">
                    <img
                      src={lv.staff?.profileImage ? (lv.staff.profileImage.startsWith('http') ? lv.staff.profileImage : `${IMAGE_URL}${lv.staff.profileImage}`) : `https://api.dicebear.com/9.x/adventurer/svg?seed=${lv.staff?.name}`}
                      className="w-full h-full rounded-xl object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-rose-500/20" />
                  </div>
                  <div>
                    <h4 className="font-black text-rose-500 tracking-tighter uppercase text-sm leading-none mb-2">{lv.staff?.name}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black uppercase text-rose-500/60 bg-rose-500/10 px-2 py-1 rounded-lg border border-rose-500/20">STAFF UNAVAILABLE</span>
                       <span className="text-[8px] font-black uppercase text-muted/60">{lv.type}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredAppointments.length > 0 || filteredLeaves.length > 0 ? filteredAppointments.map((app, index) => (
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
                          <span className="text-[12px] font-black uppercase tracking-widest truncate max-w-[150px]">{s.name}</span>
                          <span className="text-[12px] font-black  opacity-40">${s.price}</span>
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
                  <p className="text-muted/40 font-black uppercase tracking-[0.4em] text-[10px] ">No appointments scheduled</p>
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="mt-8 flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury mx-auto"
                  >
                    <Plus size={18} md:size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="whitespace-nowrap">Book Now</span>
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
        title={selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        subtitle="Manage appointment details"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-6 md:space-y-10">
          <div className="space-y-4">
            <CustomSelect
              label="Select Client"
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
                { label: 'Select Client...', value: '' },
                ...(!selectedAppointment ? [{ label: '+ Add New Client', value: 'new' }] : []),
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
                  <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest ml-2 ">Full Name</label>
                  <input
                    name="clientName" onChange={formik.handleChange} value={formik.values.clientName}
                    className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-4 md:px-6 py-3 md:py-4 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5"
                    placeholder="Enter Full Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest ml-2 ">Phone Number</label>
                    <input
                      name="clientPhone" onChange={formik.handleChange} value={formik.values.clientPhone}
                      className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-4 md:px-6 py-3 md:py-4 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest ml-2 ">Email Address</label>
                    <input
                      name="clientEmail" onChange={formik.handleChange} value={formik.values.clientEmail}
                      className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-4 md:px-6 py-3 md:py-4 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <CustomSelect
              label="Select Services"
              name="services"
              value={formik.values.services}
              onChange={formik.handleChange}
              isMulti={true}
              options={services.map(s => ({ label: `${s.name} - $${s.price}`, value: s._id }))}
              icon={Sparkles}
            />
          </div>

          <div className="space-y-3 md:space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest ml-2 underline decoration-primary/30 decoration-2 underline-offset-4">Date & Time</label>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-3 md:gap-4">
              <input
                name="date" type="datetime-local" onChange={formik.handleChange} value={formik.values.date}
                className="w-full bg-secondary border border-white/10 focus:border-primary/50 rounded-xl md:rounded-2xl px-3 md:px-6 py-4 md:py-5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] outline-none text-white shadow-2xl transition-all appearance-none"
              />
            </div>
            <p className="text-[7px] font-black text-primary/40 uppercase tracking-[0.2em] ml-2">* Select a preferred date and time</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 md:gap-6">
            <CustomSelect
              label="Status" name="status" value={formik.values.status}
              onChange={formik.handleChange}
              options={['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(s => ({ label: s, value: s }))}
            />
            <CustomSelect
              label="Payment Status" name="paymentStatus" value={formik.values.paymentStatus}
              onChange={formik.handleChange}
              options={['Pending', 'Paid'].map(s => ({ label: s, value: s }))}
            />
          </div>

          <div className="pt-4 md:pt-8">
            <button
              type="submit" disabled={formik.isSubmitting}
              className="w-full flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury disabled:opacity-50"
            >
              <span className="whitespace-nowrap">{formik.isSubmitting ? 'Saving...' : selectedAppointment ? 'SAVE CHANGES' : 'BOOK APPOINTMENT'}</span>
              <Sparkles size={18} md:size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="DELETE APPOINTMENT?"
        subtitle="This action cannot be undone."
        maxWidth="max-w-sm"
      >
        <div className="text-center p-4">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-8 shadow-2xl shadow-rose-500/20">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>
          <p className="text-muted font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-10">
            Are you sure you want to delete the appointment for <br /><span className="text-rose-500 text-base font-luxury  underline decoration-rose-500/30 decoration-2 underline-offset-4">{appointmentToDelete?.client?.name}</span> <br /> permanently?
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleDelete}
              className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl shadow-rose-500/20 active:scale-95 hover:bg-rose-600 transition-all font-luxury "
            >CONFIRM DELETE</button>
            <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-5 bg-white/5 text-muted rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-all font-luxury ">CANCEL</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

