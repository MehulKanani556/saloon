import React, { useState, useEffect } from 'react';
import { Star, Mail, Award, MoreVertical, Plus, X, Upload, Trash2, Sparkles, LayoutGrid, Phone, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, addStaff, updateStaffMember, deleteStaffMember } from '../redux/slices/staffSlice';
import { fetchServices } from '../redux/slices/serviceSlice';
import Modal from '../components/ui/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { IMAGE_URL } from '../utils/BASE_URL';

export default function Staff() {
  const dispatch = useDispatch();
  const { staff, loading } = useSelector(state => state.staff);
  const { services } = useSelector(state => state.services);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expertToDelete, setExpertToDelete] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileExpert, setProfileExpert] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (isDrawerOpen || isProfileOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isDrawerOpen, isProfileOpen, isDeleteModalOpen]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      services: [],
      profileImage: '',
      imageFile: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      phone: Yup.string().required('Required'),
      services: Yup.array().min(1, 'Select at least one ritual'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);

      values.services.forEach(s => formData.append('services', s));

      if (values.imageFile) {
        formData.append('image', values.imageFile);
      } else {
        formData.append('profileImage', values.profileImage);
      }

      try {
        if (selectedExpert) {
          await dispatch(updateStaffMember({ id: selectedExpert._id, staffMember: formData })).unwrap();
        } else {
          await dispatch(addStaff(formData)).unwrap();
        }
        handleCloseDrawer();
      } catch (err) {
        console.error('Expert setup failed:', err);
      }
    }
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    formik.setFieldValue('imageFile', file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = (expert) => {
    setSelectedExpert(expert);
    setImagePreview(expert.profileImage?.startsWith('/uploads') ? `${IMAGE_URL}${expert.profileImage}` : expert.profileImage);
    formik.setValues({
      name: expert.name,
      email: expert.email,
      phone: expert.phone || '',
      services: expert.services.map(s => s._id),
      profileImage: expert.profileImage,
      imageFile: null
    });
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedExpert(null);
    setImagePreview(null);
    formik.resetForm();
  };

  const handleDeleteClick = (expert) => {
    setExpertToDelete(expert);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (expertToDelete) {
      dispatch(deleteStaffMember(expertToDelete._id));
      setIsDeleteModalOpen(false);
      setExpertToDelete(null);
      toast.success('Artisan record dissolved successfully');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-saloon-200 border-t-saloon-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-0">
        <div className="flex items-center gap-4 lg:gap-6 relative z-10 transition-all">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border border-saloon-100 dark:border-white/10 flex items-center justify-center text-saloon-500 shadow-glass shrink-0 transition-transform hover:rotate-6">
            <LayoutGrid size={24} md:size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none truncate md:whitespace-normal">Our Staff</h1>
            <p className="text-slate-400 font-black text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.25em] mt-2 lg:mt-4 opacity-70 group-hover:opacity-100 transition-opacity">List of people who work in your saloon</p>
          </div>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-3 px-6 py-3 lg:px-10 lg:py-5 bg-gradient-to-r from-saloon-500 via-saloon-600 to-rosegold-500 text-white lg:rounded-2xl rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-saloon-500/20 hover:scale-[1.05] transition-all group"
        >
          <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {staff.map((member, index) => (
          <motion.div
            key={member._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', damping: 20 }}
            className="group relative bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 dark:border-white/5 shadow-2xl hover:shadow-saloon-500/10 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-saloon-500/5 to-transparent rounded-bl-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 flex items-start justify-between">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-xl group-hover:rotate-3 transition-transform duration-500">
                  <img
                    src={member.profileImage?.startsWith('/uploads') ? `${IMAGE_URL}${member.profileImage}` : member.profileImage}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

              </div>
              <div className="flex flex-col gap-2 transition-opacity duration-300">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(member)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic group-hover:text-saloon-500 transition-colors">{member.name}</h3>
              <div className="flex flex-wrap gap-2 mt-4">
                {member.services.map(s => (
                  <span key={s._id} className="px-3 py-1 bg-saloon-50 dark:bg-saloon-900/20 text-saloon-600 dark:text-saloon-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-saloon-100 dark:border-saloon-500/20">
                    {s.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-white/5">
                <div className="flex flex-col gap-2 ">
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-3">
                    <Mail size={12} className="text-saloon-500" /> {member.email}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-3">
                    <Phone size={12} className="text-saloon-500" /> {member.phone || 'No Phone'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] hover:bg-saloon-500 dark:hover:bg-saloon-500 dark:hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer" onClick={() => { setProfileExpert(member); setIsProfileOpen(true); }}>
                    View Info
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedExpert ? 'Edit Staff' : 'Add New Staff'}
        subtitle="Staff Onboarding"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-slate-50 dark:bg-slate-800 border-4 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-saloon-500">
              {imagePreview ? (
                <img
                  src={imagePreview.startsWith('blob') || !imagePreview.startsWith('/uploads') ? imagePreview : `${IMAGE_URL}${imagePreview}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Upload size={28} />
                  <span className="text-[9px] font-black uppercase tracking-widest mt-3">Upload Photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-3.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Staff Member Name</label>
            <input
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-xl px-5 py-4 text-xs font-bold outline-none transition-all dark:text-white shadow-inner"
              placeholder="e.g. Master Barber"
            />
            {formik.touched.name && formik.errors.name && <p className="text-red-500 text-[9px] font-bold ml-2 uppercase italic">{formik.errors.name}</p>}
          </div>

          <div className="space-y-3.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
            <input
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-xl px-5 py-4 text-xs font-bold outline-none transition-all dark:text-white shadow-inner"
              placeholder="artisan@glowsaloon.com"
            />
            {formik.touched.email && formik.errors.email && <p className="text-red-500 text-[9px] font-bold ml-2 uppercase italic">{formik.errors.email}</p>}
          </div>

          <div className="space-y-3.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Phone Number</label>
            <input
              name="phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-xl px-5 py-4 text-xs font-bold outline-none transition-all dark:text-white shadow-inner"
              placeholder="e.g. +91 98765 43210"
            />
            {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-[9px] font-bold ml-2 uppercase italic">{formik.errors.phone}</p>}
          </div>

          <div className="space-y-3.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Work Specializations</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {services.map(s => (
                <label key={s._id} className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border-2 ${formik.values.services.includes(s._id) ? 'bg-saloon-50 border-saloon-500 text-saloon-700' : 'bg-slate-50 dark:bg-slate-800/80 border-transparent text-slate-400'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">{s.name}</span>
                  <input
                    type="checkbox"
                    name="services"
                    value={s._id}
                    checked={formik.values.services.includes(s._id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        formik.setFieldValue('services', [...formik.values.services, s._id]);
                      } else {
                        formik.setFieldValue('services', formik.values.services.filter(id => id !== s._id));
                      }
                    }}
                    className="hidden"
                  />
                  {formik.values.services.includes(s._id) && <Sparkles size={14} />}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 px-2 dark:bg-slate-800 dark:hover:bg-saloon-600 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.3em] hover:bg-saloon-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
          >
            {selectedExpert ? 'Save Changes' : 'Add Staff Member'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => { setIsProfileOpen(false); setProfileExpert(null); }}
        title={profileExpert?.name}
        subtitle="Team Member"
        headerImage={profileExpert?.profileImage?.startsWith('/uploads') ? `${IMAGE_URL}${profileExpert.profileImage}` : profileExpert?.profileImage}
        footer={(
          <>
            <button
              onClick={() => { setIsProfileOpen(false); handleEdit(profileExpert); }}
              className="flex-1 py-4 bg-saloon-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-saloon-600 transition-all shadow-xl shadow-saloon-500/20 active:scale-95"
            >
              Edit Information
            </button>
            <button
              onClick={() => { setIsProfileOpen(false); setProfileExpert(null); }}
              className="px-6 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all border border-slate-200 dark:border-white/5"
            >
              <X size={18} />
            </button>
          </>
        )}
      >
        {profileExpert && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <Phone size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Connect</span>
                </div>
                <div className="text-[10px] font-bold text-slate-800 dark:text-slate-300 truncate">{profileExpert.phone || 'No Phone'}</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <Mail size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Connect</span>
                </div>
                <div className="text-[10px] font-bold text-slate-800 dark:text-slate-300 truncate">{profileExpert.email || 'No Email'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Skills & Expertise</span>
                <span className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5 mx-4" />
                <Award size={14} className="text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {profileExpert.services.map(s => (
                  <div key={s._id} className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-xl shadow-sm hover:border-saloon-500 transition-all group">
                    <div className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tighter truncate">{s.name}</div>
                    <div className="text-[7px] font-bold text-saloon-500 uppercase tracking-widest mt-1">Certified Expert</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Staff?"
        subtitle="Institutional Protocol"
        maxWidth="max-w-sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20 shadow-inner">
            <Trash2 size={28} />
          </div>

          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-8 leading-relaxed">
            Are you sure you want to remove <span className="text-red-500 italic">{expertToDelete?.name}</span> from the saloon?
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={confirmDelete}
              className="w-full py-4 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
            >
              Confirm Removal
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-600 dark:hover:text-white transition-all border border-slate-200 dark:border-white/5"
            >
              Take No Action
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


