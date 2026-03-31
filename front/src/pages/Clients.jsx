import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, ShoppingBag, Plus, Star, Trash2, Edit3, X, User, Eye, Calendar, Clock, Award, FileText, User2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, addClient, updateClient, deleteClient } from '../redux/slices/clientSlice';
import { fetchAppointments } from '../redux/slices/appointmentSlice';
import Modal from '../components/ui/Modal';
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
                            src={client.profileImage ? (client.profileImage.startsWith('/uploads') ? `${IMAGE_URL}${client.profileImage}` : client.profileImage) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`}
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

      <Modal
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedClient ? 'Edit Info' : 'New Customer'}
        subtitle="Customer Management"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-slate-50 dark:bg-slate-800 border-4 border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600 shadow-inner overflow-hidden transition-all group-hover:border-saloon-500/20">
              {imagePreview ? (
                <img src={imagePreview.startsWith('blob') || !imagePreview.startsWith('/uploads') ? imagePreview : `${IMAGE_URL}${imagePreview}`} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <User size={48} strokeWidth={1} />
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
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-4 italic">Customer Identity</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-3.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Full Name</label>
            <input
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-xl px-5 py-4 text-xs font-bold outline-none transition-all dark:text-white shadow-inner"
              placeholder="John Doe"
            />
            {formik.touched.name && formik.errors.name && <p className="text-red-500 text-[9px] font-bold ml-2 uppercase italic">{formik.errors.name}</p>}
          </div>

          <div className="space-y-3.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Email Address</label>
            <input
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-xl px-5 py-4 text-xs font-bold outline-none transition-all dark:text-white shadow-inner"
              placeholder="john@example.com"
            />
            {formik.touched.email && formik.errors.email && <p className="text-red-500 text-[9px] font-bold ml-2 uppercase italic">{formik.errors.email}</p>}
          </div>

          <div className="space-y-3.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 italic">Phone Number</label>
            <input
              name="phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-xl px-5 py-4 text-xs font-bold outline-none transition-all dark:text-white shadow-inner"
              placeholder="+1 234 567 890"
            />
            {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-[9px] font-bold ml-2 uppercase italic">{formik.errors.phone}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 dark:bg-slate-800 dark:hover:bg-saloon-600 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.3em] hover:bg-saloon-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
          >
            {selectedClient ? 'Save Changes' : 'Add Customer Member'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Customer?"
        subtitle="Administrative Action"
        maxWidth="max-w-sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500 mb-6">
            <Trash2 size={32} />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed mb-8">
            Eliminating the digital footprint of <span className="text-red-500">{clientToDelete?.name}</span>. <br />Historical rituals will persist in archive.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                dispatch(deleteClient(clientToDelete._id));
                setIsDeleteModalOpen(false);
              }}
              className="w-full py-4 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl active:scale-95"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-900 transition-all border border-slate-200 dark:border-white/5"
            >
              Abort Protocol
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => { setIsProfileOpen(false); setProfileClient(null); }}
        title={profileClient?.name}
        subtitle="Premium Client"
        headerImage={profileClient?.profileImage ? (profileClient.profileImage.startsWith('/uploads') ? `${IMAGE_URL}${profileClient.profileImage}` : profileClient.profileImage) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileClient?.name}`}
        footer={(
          <>
            <button
              onClick={() => { setIsProfileOpen(false); handleEdit(profileClient); }}
              className="flex-1 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-saloon-600 transition-all shadow-xl active:scale-95"
            >
              Refine Identity
            </button>
            <button
              onClick={() => { setIsProfileOpen(false); setProfileClient(null); }}
              className="px-6 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-slate-100 dark:border-white/5"
            >
              <X size={18} />
            </button>
          </>
        )}
      >
        {profileClient && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-saloon-500 mb-2">
                  <ShoppingBag size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Rituals</span>
                </div>
                <div className="text-lg font-black text-slate-800 dark:text-white">{(profileClient.bookingHistory?.length || 0).toString().padStart(2, '0')} Count</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Mail size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Email</span>
                </div>
                <div className="text-[10px] font-bold text-slate-800 dark:text-slate-300 truncate">{profileClient.email}</div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between group">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Tether</p>
                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{profileClient.phone}</p>
              </div>
              <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                <Phone size={18} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ritual Archive</span>
                <span className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5 mx-4" />
                <Calendar size={14} className="text-slate-400" />
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {appointments.filter(app => app.client?._id === profileClient._id).map((app) => (
                  <div key={app._id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                        {new Date(app.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <div className={`px-3 py-1 rounded-md text-[7px] font-black uppercase tracking-widest ${app.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {app.status}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                      <span className="truncate max-w-[150px]">{app.services?.map(s => s.name).join(', ')}</span>
                      <span className="text-saloon-600 font-black italic">${app.totalPrice}</span>
                    </div>
                  </div>
                ))}
                {appointments.filter(app => app.client?._id === profileClient._id).length === 0 && (
                  <div className="py-10 text-center opacity-30 italic text-[10px] uppercase font-black tracking-widest">No archives found</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
