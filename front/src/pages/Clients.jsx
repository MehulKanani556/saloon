import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, ShoppingBag, Plus, Star, Trash2, Edit3, X, User, Eye, Calendar, Clock, Award, FileText, User2, CameraIcon } from 'lucide-react';
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
      <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="flex items-center gap-6 group">
          <div className="w-16 h-16 rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-primary shadow-premium shrink-0 transition-transform hover:rotate-6">
            <User2 size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none truncate md:whitespace-normal font-luxury ">Customer Archives</h1>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mt-3 opacity-60 ">Cataloging Eternal Beauty Profiles</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-secondary/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 shadow-2xl flex items-center gap-4 w-full md:w-96 group focus-within:border-primary/40 transition-all">
            <Search size={20} className="text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Query by name, signal, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] w-full font-black uppercase tracking-widest text-white placeholder:text-white/10"
            />
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-4 px-10 py-5 bg-primary text-secondary rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            INDuct NEW PROTOCOL
          </button>
        </div>
      </div>

      <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-3xl border border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-luxury-gradient opacity-10" />
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80">
                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-primary  whitespace-nowrap">Identity</th>
                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-primary  whitespace-nowrap">Tethers & Signals</th>
                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-primary  whitespace-nowrap text-center">Frequency</th>
                <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-primary  whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredClients.map((client, index) => (
                  <motion.tr
                    key={client._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.02, ease: "easeOut" }}
                    className="hover:bg-white/5 transition-all group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-background p-1 border border-white/10 group-hover:rotate-6 transition-all duration-500 shadow-2xl relative overflow-hidden">
                          <img
                            src={client.profileImage ? (client.profileImage.startsWith('/uploads') ? `${IMAGE_URL}${client.profileImage}` : client.profileImage) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`}
                            alt={client.name}
                            className="w-full h-full rounded-2xl object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                          />
                        </div>
                        <div>
                          <p className="font-black text-white text-base tracking-tighter uppercase  whitespace-nowrap font-luxury group-hover:text-primary transition-colors leading-none mb-3">{client.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] whitespace-nowrap">Protocol Est. {new Date(client.createdAt).getFullYear()}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-muted group-hover:text-white transition-colors flex items-center gap-4 whitespace-nowrap tracking-widest uppercase">
                          <Mail size={14} className="text-primary/40 group-hover:text-primary" />
                          {client.email}
                        </p>
                        <p className="text-[10px] font-black text-muted group-hover:text-white transition-colors flex items-center gap-4 whitespace-nowrap tracking-widest uppercase">
                          <Phone size={14} className="text-primary/40 group-hover:text-primary" />
                          {client.phone}
                        </p>
                      </div>
                    </td>

                    <td className="px-10 py-8 text-center">
                      <div className="inline-flex flex-col items-center bg-background/50 px-6 py-4 rounded-2xl border border-white/5 group-hover:bg-primary transition-all duration-500">
                        <span className="text-xl font-black text-white tracking-tighter whitespace-nowrap group-hover:text-secondary">{(client.bookingHistory?.length || 0).toString().padStart(2, '0')}</span>
                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mt-1 whitespace-nowrap group-hover:text-secondary group-hover:opacity-40 ">Rituals</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                        <button
                          onClick={() => navigate(`/admin/invoices?id=${client.name}`)}
                          className="p-4 bg-background border border-white/5 rounded-2xl text-muted hover:text-white transition-all shadow-xl"
                        >
                          <FileText size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setProfileClient(client);
                            setIsProfileOpen(true);
                          }}
                          className="p-4 bg-background border border-white/5 rounded-2xl text-muted hover:text-primary transition-all shadow-xl"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-4 bg-background border border-white/5 rounded-2xl text-muted hover:text-primary transition-all shadow-xl"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setClientToDelete(client);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-4 bg-background border border-rose-500/10 rounded-2xl text-muted hover:text-rose-500 transition-all shadow-xl"
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
        title={selectedClient ? 'Edit Identity' : 'INDuct PROTOCOL'}
        subtitle="Customer Matrix Management"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-40 h-40 rounded-2xl bg-background border-4 border-white/5 flex items-center justify-center text-white/5 shadow-inner overflow-hidden transition-all duration-500 group-hover:border-primary/20 group-hover:scale-105">
              {imagePreview ? (
                <img src={imagePreview.startsWith('blob') || !imagePreview.startsWith('/uploads') ? imagePreview : `${IMAGE_URL}${imagePreview}`} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" alt="Preview" />
              ) : (
                <User size={64} strokeWidth={1} />
              )}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <CameraIcon size={32} className="text-secondary" />
              </div>
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
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-secondary shadow-xl group-hover:scale-110 transition-transform">
              <Plus size={24} strokeWidth={3} />
            </div>
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-8 ">Geometric Identity Signature</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2  underline decoration-primary/30 decoration-2 underline-offset-8">Legal Identity</label>
            <input
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full bg-secondary border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5 "
              placeholder="ENTER NOMENCLATURE"
            />
            {formik.touched.name && formik.errors.name && <p className="text-rose-500 text-[9px] font-black ml-4 uppercase  tracking-widest">{formik.errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2 ">Digital Beacon (Email)</label>
              <input
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full bg-secondary border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5"
                placeholder="EMAIL@MATRIX.COM"
              />
              {formik.touched.email && formik.errors.email && <p className="text-rose-500 text-[9px] font-black ml-4 uppercase  tracking-widest">{formik.errors.email}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2 ">Tether Signal (Phone)</label>
              <input
                name="phone"
                onChange={formik.handleChange}
                value={formik.values.phone}
                className="w-full bg-secondary border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5"
                placeholder="+XX XXXXX XXXXX"
              />
              {formik.touched.phone && formik.errors.phone && <p className="text-rose-500 text-[9px] font-black ml-4 uppercase  tracking-widest">{formik.errors.phone}</p>}
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-primary text-secondary rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 font-luxury "
            >
              {selectedClient ? 'COMMIT IDENTITY UPDATE' : 'AUTHORIZE PROTOCOL ENTRY'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="DISSOLVE IDENTITY?"
        subtitle="Final Administrative Liquidation"
        maxWidth="max-w-sm"
      >
        <div className="text-center p-4">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-10 shadow-2xl shadow-rose-500/20">
            <Trash2 size={48} strokeWidth={1} />
          </div>
          <p className="text-muted font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-10 ">
            Eliminating digital signature of <br /><span className="text-rose-500 text-base font-luxury  underline decoration-rose-500/30 decoration-2 underline-offset-4">{clientToDelete?.name}</span> <br /> from active records.
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                dispatch(deleteClient(clientToDelete._id));
                setIsDeleteModalOpen(false);
              }}
              className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-rose-600 transition-all shadow-xl active:scale-95 font-luxury "
            >
              CONFIRM DISSOLUTION
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full py-5 bg-white/5 text-muted rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-all font-luxury "
            >
              ABORT OPERATION
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => { setIsProfileOpen(false); setProfileClient(null); }}
        title={profileClient?.name}
        subtitle="ETERNAL MEMBER"
        headerImage={profileClient?.profileImage ? (profileClient.profileImage.startsWith('/uploads') ? `${IMAGE_URL}${profileClient.profileImage}` : profileClient.profileImage) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileClient?.name}`}
        footer={(
          <>
            <button
              onClick={() => { setIsProfileOpen(false); handleEdit(profileClient); }}
              className="flex-1 py-5 bg-primary text-secondary rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary/90 transition-all shadow-xl active:scale-95 font-luxury "
            >
              REDEFINE PROTOCOL
            </button>
            <button
              onClick={() => { setIsProfileOpen(false); setProfileClient(null); }}
              className="w-14 h-14 flex items-center justify-center bg-background rounded-2xl text-muted hover:text-rose-500 transition-all border border-white/5 active:scale-95"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </>
        )}
      >
        {profileClient && (
          <div className="space-y-12 p-2">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-secondary/50 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex items-center gap-3 text-primary mb-4 ">
                  <ShoppingBag size={14} strokeWidth={2.5} />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Rituals</span>
                </div>
                <div className="text-3xl font-black text-white  font-luxury leading-none">{(profileClient.bookingHistory?.length || 0).toString().padStart(2, '0')}</div>
              </div>
              <div className="p-6 bg-secondary/50 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex items-center gap-3 text-primary mb-4 ">
                  <Award size={14} strokeWidth={2.5} />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Status</span>
                </div>
                <div className="text-sm font-black text-white  font-luxury leading-none uppercase tracking-tighter">PREMIUM</div>
              </div>
            </div>

            <div className="p-8 bg-background/50 rounded-2xl border border-white/5 flex items-center justify-between group shadow-3xl hover:border-primary/20 transition-all duration-500">
              <div className="space-y-4">
                <p className="text-[9px] font-black text-muted uppercase tracking-[0.5em] ">Active Tether</p>
                <p className="text-2xl font-black text-white tracking-tighter  font-luxury group-hover:text-primary transition-all">{profileClient.phone}</p>
              </div>
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-muted group-hover:bg-primary group-hover:text-secondary transition-all duration-500 shadow-xl border border-white/5">
                <Phone size={24} strokeWidth={2.5} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <Calendar size={16} className="text-primary" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]  leading-none">Ritual Archive</span>
                </div>
                <span className="h-[1px] flex-1 bg-white/5 mx-6" />
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                {appointments.filter(app => app.client?._id === profileClient._id).map((app) => (
                  <div key={app._id} className="p-6 bg-secondary/30 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <p className="text-[11px] font-black text-white uppercase tracking-tighter  font-luxury leading-none">
                          {format(new Date(app.appointmentDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em]  border ${app.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                        {app.status}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-muted uppercase tracking-widest truncate max-w-[180px] ">{app.services?.map(s => s.name).join(', ')}</span>
                      <span className="text-lg font-black text-primary font-luxury  leading-none">${app.totalPrice}</span>
                    </div>
                  </div>
                ))}
                {appointments.filter(app => app.client?._id === profileClient._id).length === 0 && (
                  <div className="py-20 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <Clock className="mx-auto text-white/5 mb-6" size={48} strokeWidth={1} />
                    <p className="text-muted/40  text-[10px] uppercase font-black tracking-[0.4em]">No archives found in matrix</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


