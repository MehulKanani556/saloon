import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, ShoppingBag, Plus, Star, Trash2, Edit3, X, User, Eye, Calendar, Clock, Award, FileText, User2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, addClient, updateClient, deleteClient } from '../redux/slices/clientSlice';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IMAGE_URL } from '../utils/BASE_URL';

export default function Clients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients, loading } = useSelector(state => state.clients);
  const { appointments } = useSelector(state => state.appointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileClient, setProfileClient] = useState(null);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (isDrawerOpen || isDeleteModalOpen || isProfileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen, isDeleteModalOpen, isProfileOpen]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      profileImage: '',
      imageFile: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Legal name required').min(2, 'Name too short'),
      email: Yup.string().email('Invalid digital signature').required('Required'),
      phone: Yup.string().required('Contact tether required')
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);

      if (values.imageFile) {
        formData.append('image', values.imageFile);
      } else {
        formData.append('profileImage', values.profileImage);
      }

      if (selectedClient) {
        dispatch(updateClient({ id: selectedClient._id, clientData: formData }));
      } else {
        dispatch(addClient(formData));
      }
      handleCloseDrawer();
    }
  });

  const handleEdit = (client) => {
    setSelectedClient(client);
    formik.setValues({
      name: client.name,
      email: client.email,
      phone: client.phone,
      profileImage: client.profileImage || '',
      imageFile: null
    });
    setImagePreview(client.profileImage ? `${IMAGE_URL}${client.profileImage}` : null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedClient(null);
    setImagePreview(null);
    formik.resetForm();
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-saloon-200 border-t-saloon-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-6 relative z-10 transition-all">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border border-saloon-100 dark:border-white/10 flex items-center justify-center text-saloon-500 shadow-glass shrink-0 transition-transform hover:rotate-6">
            <User2 size={24} md:size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none truncate md:whitespace-normal">Customer List</h1>
            <p className="text-slate-400 font-black text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.25em] mt-2 lg:mt-4 opacity-70 group-hover:opacity-100 transition-opacity">List of all customers who visit your saloon</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="bg-white dark:bg-slate-900 px-5 py-3.5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-2xl flex items-center gap-4 w-full md:w-80 group focus-within:border-saloon-500/50 transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-saloon-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full font-bold dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
            />
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-3 px-6 py-3 lg:px-10 lg:py-5 bg-gradient-to-r from-saloon-500 via-saloon-600 to-rosegold-500 text-white lg:rounded-2xl rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-saloon-500/20 hover:scale-[1.05] transition-all group"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            Add New Customer
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-50 dark:border-white/5">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Customer Name</th>
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Phone & Email</th>
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Total Visits</th>
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredClients.map((client, index) => (
                  <motion.tr
                    key={client._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group"
                  >
                    <td className="px-4 md:px-8 md:py-8 py-4">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/50 dark:border-white/10 group-hover:rotate-6 transition-transform">
                          <img
                            src={client.profileImage ? `${IMAGE_URL}${client.profileImage}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`}
                            alt={client.name}
                            className="w-full h-full rounded-[14px] object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white tracking-tighter uppercase italic whitespace-nowrap">{client.name}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-lg inline-block whitespace-nowrap">Since {new Date(client.createdAt).getFullYear()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 md:py-8 py-4">
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-3 whitespace-nowrap">
                          <Mail size={14} className="text-saloon-500" />
                          {client.email}
                        </p>
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-3 whitespace-nowrap">
                          <Phone size={14} className="text-saloon-500" />
                          {client.phone}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 md:px-8 md:py-8 py-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter whitespace-nowrap">{(client.bookingHistory?.length || 0).toString().padStart(2, '0')}</span>
                        <span className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-1 whitespace-nowrap">Engagements</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 md:py-8 py-4 text-right">
                      <div className="flex items-center justify-start gap-2 transition-opacity">
                        <button
                          onClick={() => navigate(`/invoices?id=${client.name}`)}
                          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-500 transition-all border border-transparent hover:border-indigo-500/20"
                        >
                          <FileText size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setProfileClient(client);
                            setIsProfileOpen(true);
                          }}
                          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-saloon-500 transition-all border border-transparent hover:border-saloon-500/20"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/20"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setClientToDelete(client);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseDrawer}
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
                      {selectedClient ? 'Edit Info' : 'New Customer'}
                    </h2>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4">Add or update customer details</p>
                  </div>
                  <button onClick={handleCloseDrawer} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-saloon-500 transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-10 py-8 space-y-12 custom-scrollbar">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-2xl bg-slate-50 dark:bg-slate-800 border-4 border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600 shadow-inner overflow-hidden transition-all group-hover:border-saloon-500/20">
                        {imagePreview ? (
                          <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <User size={64} strokeWidth={1} />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.currentTarget.files[0];
                            if (file) {
                              formik.setFieldValue('imageFile', file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-saloon-600 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                        <Plus size={20} />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 italic">Customer Photo</p>
                  </div>

                  <form onSubmit={formik.handleSubmit} className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Full Name</label>
                      <input
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all dark:text-white shadow-inner"
                        placeholder="John Doe"
                      />
                      {formik.touched.name && formik.errors.name && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase italic">{formik.errors.name}</p>}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Email Address</label>
                      <input
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all dark:text-white shadow-inner"
                        placeholder="john@example.com"
                      />
                      {formik.touched.email && formik.errors.email && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase italic">{formik.errors.email}</p>}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Phone Number</label>
                      <input
                        name="phone"
                        onChange={formik.handleChange}
                        value={formik.values.phone}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all dark:text-white shadow-inner"
                        placeholder="+1 234 567 890"
                      />
                      {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase italic">{formik.errors.phone}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 dark:bg-slate-800 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-[0.3em] hover:bg-saloon-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                    >
                      {selectedClient ? 'Save Changes' : 'Add Customer'}
                    </button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {isDeleteModalOpen && clientToDelete && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDeleteModalOpen(false)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[300] flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10"
                >
                  <div className="p-12 text-center space-y-8">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500 animate-pulse">
                      <Trash2 size={40} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Delete Customer?</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        You are about to eliminate the digital footprint of <span className="text-red-500">{clientToDelete.name}</span>. Historical rituals will persist, but the contact tether will be surgically removed.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 pt-6">
                      <button
                        onClick={() => {
                          dispatch(deleteClient(clientToDelete._id));
                          setIsDeleteModalOpen(false);
                        }}
                        className="w-full py-5 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
                      >
                        Abort Protocol
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {isProfileOpen && profileClient && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setIsProfileOpen(false); setProfileClient(null); }}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[300]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl z-[310] flex flex-col border-l border-white/20"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={profileClient.profileImage ? `${IMAGE_URL}${profileClient.profileImage}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileClient.name}`}
                    className="w-full h-full object-cover grayscale-[40%] hover:grayscale-0 transition-all duration-700"
                    alt={profileClient.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <button
                    onClick={() => { setIsProfileOpen(false); setProfileClient(null); }}
                    className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-saloon-500 transition-all"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute bottom-10 left-10">
                    <div className="px-3 py-1 bg-saloon-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg inline-block mb-3 italic">Premium Gentleman</div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{profileClient.name}</h2>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar text-slate-800 dark:text-white">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3 text-saloon-500 mb-2">
                        <ShoppingBag size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Ritual Count</span>
                      </div>
                      <div className="text-2xl font-black text-slate-800 dark:text-white">{(profileClient.bookingHistory?.length || 0).toString().padStart(2, '0')} Engagements</div>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3 text-blue-500 mb-2">
                        <Mail size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Digital Signature</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-300 break-all">{profileClient.email}</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Intelligence</span>
                      <span className="h-[2px] flex-1 bg-slate-100 dark:bg-white/5 mx-6" />
                      <Phone size={16} className="text-slate-400" />
                    </div>
                    <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between group hover:bg-saloon-500/5 transition-all cursor-pointer">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Verified Tether</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{profileClient.phone}</p>
                      </div>
                      <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-saloon-500 transition-colors shadow-sm">
                        <Phone size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ritual History Archive</span>
                      <span className="h-[2px] flex-1 bg-slate-100 dark:bg-white/5 mx-6" />
                      <Calendar size={16} className="text-slate-400" />
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {appointments.filter(app => app.client?._id === profileClient._id).length > 0 ? (
                        appointments
                          .filter(app => app.client?._id === profileClient._id)
                          .map((app, idx) => (
                            <div key={app._id} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 group hover:bg-saloon-500/5 transition-all">
                              <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 italic">Engagement Date</p>
                                  <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                                    {new Date(app.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${app.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                  app.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
                                    app.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                      'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                                  }`}>
                                  {app.status}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-white/5">
                                <div className="flex flex-col gap-1">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Service Protocol</p>
                                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                                    {app.services?.map(s => s.name).join(', ')}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[8px] font-mono text-slate-300 dark:text-slate-600 mb-1 tracking-widest">ID: {app._id.slice(-6).toUpperCase()}</p>
                                  <p className="text-sm font-black text-saloon-600 italic">${app.totalPrice?.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2.5rem] opacity-30">
                          <Clock size={40} className="mx-auto mb-4 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">No historical archives found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-10 border-t border-slate-100 dark:border-white/5 flex gap-4 bg-slate-50/50 dark:bg-slate-800/10">
                  <button
                    onClick={() => { setIsProfileOpen(false); handleEdit(profileClient); }}
                    className="flex-1 py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-saloon-600 transition-all shadow-xl active:scale-95"
                  >
                    Refine Identity
                  </button>
                  <button
                    onClick={() => { setIsProfileOpen(false); setProfileClient(null); }}
                    className="w-20 flex items-center justify-center bg-white dark:bg-slate-700 rounded-2xl text-slate-400 hover:text-red-500 transition-all border border-slate-100 dark:border-white/5 shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
