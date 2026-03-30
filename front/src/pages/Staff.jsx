import React, { useState, useEffect } from 'react';
import { Star, Mail, Award, MoreVertical, Plus, X, Upload, Trash2, Sparkles, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, addStaff, updateStaffMember, deleteStaffMember } from '../redux/slices/staffSlice';
import { fetchServices } from '../redux/slices/serviceSlice';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { IMAGE_URL } from '../utils/BASE_URL';

export default function Staff() {
  const dispatch = useDispatch();
  const { staff, loading } = useSelector(state => state.staff);
  const { services } = useSelector(state => state.services);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileExpert, setProfileExpert] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchServices());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      services: [],
      availability: 'Mon - Sat (10AM - 8PM)',
      ratings: 5.0,
      profileImage: '',
      imageFile: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      services: Yup.array().min(1, 'Select at least one ritual'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('availability', values.availability);
      formData.append('ratings', values.ratings);

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

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchServices());
  }, [dispatch]);

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
      services: expert.services.map(s => s._id),
      availability: expert.availability,
      ratings: expert.ratings,
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expertToDelete, setExpertToDelete] = useState(null);

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
            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-white/5 shadow-2xl hover:shadow-saloon-500/10 transition-all duration-500 overflow-hidden"
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
                <div className="absolute bottom-0 right-2 bg-saloon-500 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-tighter shadow-lg ring-4 ring-white dark:ring-slate-800">
                  {member.ratings.toFixed(1)}
                </div>
              </div>
              <div className="flex flex-col gap-2 transition-opacity duration-300">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Edit3 size={18} />
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
            </div>

            <div className="mt-10 pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Working Hours</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{member.availability}</span>
              </div>
              <button
                onClick={() => { setProfileExpert(member); setIsProfileOpen(true); }}
                className="px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-saloon-500 dark:hover:bg-saloon-500 dark:hover:text-white transition-all shadow-lg active:scale-95"
              >
                Profile
              </button>
            </div>
          </motion.div>
        ))}
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
                      {selectedExpert ? 'Edit Staff' : 'Add Staff'}
                    </h2>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4">Add or update staff information</p>
                  </div>
                  <button onClick={handleCloseDrawer} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-saloon-500 transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-2xl bg-slate-50 dark:bg-slate-800 border-4 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-saloon-500">
                        {imagePreview ? (
                          <img
                            src={imagePreview.startsWith('blob') || !imagePreview.startsWith('/uploads') ? imagePreview : `${IMAGE_URL}${imagePreview}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-slate-400">
                            <Upload size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-4">Upload Photo</span>
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

                  <form onSubmit={formik.handleSubmit} className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Staff Member Name</label>
                      <input
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all dark:text-white shadow-inner"
                        placeholder="e.g. Master Barber"
                      />
                      {formik.touched.name && formik.errors.name && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase italic">{formik.errors.name}</p>}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                      <input
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all dark:text-white shadow-inner"
                        placeholder="artisan@glowsaloon.com"
                      />
                      {formik.touched.email && formik.errors.email && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase italic">{formik.errors.email}</p>}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Work Specializations</label>
                      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {services.length > 0 ? (
                          services.map(s => (
                            <label key={s._id} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${formik.values.services.includes(s._id) ? 'bg-saloon-50 border-saloon-500 text-saloon-700' : 'bg-slate-50 dark:bg-slate-800/80 border-transparent text-slate-400'}`}>
                              <span className="text-xs font-black uppercase tracking-widest">{s.name}</span>
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
                              {formik.values.services.includes(s._id) && <Sparkles size={16} />}
                            </label>
                          ))
                        ) : (
                          <div className="p-8 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl text-center space-y-4 bg-slate-50/50 dark:bg-slate-800/30">
                            <Star size={32} className="mx-auto text-saloon-400 opacity-30" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No services found. <br />Please create services before onboarding experts.</p>
                            <button
                              type="button"
                              onClick={() => { navigate('/services'); handleCloseDrawer(); }}
                              className="text-[9px] font-black text-saloon-600 uppercase tracking-widest underline decoration-2 underline-offset-4"
                            >
                              Go to Services Protocol
                            </button>
                          </div>
                        )}
                      </div>
                      {formik.touched.services && formik.errors.services && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase italic">{formik.errors.services}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 px-2 dark:bg-slate-800 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-[0.3em] hover:bg-saloon-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                    >
                      {selectedExpert ? 'Save Changes' : 'Add Staff Member'}
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
          {isProfileOpen && profileExpert && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setIsProfileOpen(false); setProfileExpert(null); }}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl z-[210] flex flex-col border-l border-white/20"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={profileExpert.profileImage?.startsWith('/uploads') ? `${IMAGE_URL}${profileExpert.profileImage}` : profileExpert.profileImage}
                    className="w-full h-full object-cover grayscale-[40%] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <button
                    onClick={() => { setIsProfileOpen(false); setProfileExpert(null); }}
                    className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-saloon-500 transition-all"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute bottom-10 left-10">
                    <div className="px-3 py-1 bg-saloon-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg inline-block mb-3">Team Member</div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{profileExpert.name}</h2>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-10 py-8 space-y-12 custom-scrollbar text-slate-800 dark:text-white">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3 text-saloon-500 mb-2">
                        <Star size={16} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Rating</span>
                      </div>
                      <div className="text-2xl font-black text-slate-800 dark:text-white">{profileExpert.ratings.toFixed(1)} / 5.0</div>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3 text-blue-500 mb-2">
                        <Mail size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Digital Signature</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-300 break-all">{profileExpert.email}</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skills & Expertise</span>
                      <span className="h-[2px] flex-1 bg-slate-100 dark:bg-white/5 mx-6" />
                      <Award size={16} className="text-slate-400" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {profileExpert.services.map(s => (
                        <div key={s._id} className="group relative px-6 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                          <div className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter">{s.name}</div>
                          <div className="text-[9px] font-black text-saloon-500 uppercase tracking-widest mt-1">Specialized</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Working Hours</span>
                      <span className="h-[2px] flex-1 bg-slate-100 dark:bg-white/5 mx-6" />
                      <Sparkles size={16} className="text-slate-400" />
                    </div>
                    <div className="p-8 bg-slate-900 dark:bg-white rounded-2xl text-center shadow-2xl">
                      <div className="text-white dark:text-slate-900 font-black text-sm uppercase tracking-widest leading-relaxed">
                        {profileExpert.availability}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 border-t border-slate-100 dark:border-white/5 flex gap-4">
                  <button
                    onClick={() => { setIsProfileOpen(false); handleEdit(profileExpert); }}
                    className="flex-1 py-5 bg-saloon-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-saloon-600 transition-all shadow-xl shadow-saloon-500/20 active:scale-95"
                  >
                    Edit Information
                  </button>
                  <button
                    onClick={() => { setIsProfileOpen(false); setProfileExpert(null); }}
                    className="w-20 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
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

      {createPortal(
        <AnimatePresence>
          {isDeleteModalOpen && expertToDelete && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDeleteModalOpen(false)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[300]"
              />
              <div className="fixed inset-0 flex items-center justify-center z-[310] p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-10 shadow-3xl border border-white/10 text-center pointer-events-auto"
                >
                  <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-500/20 shadow-inner">
                    <Trash2 size={32} />
                  </div>

                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-4">Remove Staff?</h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 leading-relaxed px-4">
                    Are you sure you want to remove <span className="text-red-500 italic">{expertToDelete.name}</span> from the saloon?
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={confirmDelete}
                      className="w-full py-5 bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
                    >
                      Confirm Removal
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-slate-600 dark:hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

const Edit3 = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
