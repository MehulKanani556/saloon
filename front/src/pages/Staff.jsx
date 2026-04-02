import React, { useState, useEffect } from 'react';
import { Star, Mail, Award, MoreVertical, Plus, X, Upload, Trash2, Sparkles, LayoutGrid, Phone, Pencil, UserCheck, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, addStaff, updateStaffMember, deleteStaffMember } from '../redux/slices/staffSlice';
import { fetchServices } from '../redux/slices/serviceSlice';
import Modal from '../components/ui/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { IMAGE_URL } from '../utils/BASE_URL';
import AdminHeader from '../components/ui/AdminHeader';

export default function Staff() {
  const dispatch = useDispatch();
  const { staff, loading } = useSelector(state => state.staff);
  const { services } = useSelector(state => state.services);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffMemberToDelete, setStaffMemberToDelete] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileStaffMember, setProfileStaffMember] = useState(null);
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
    return () => { document.body.style.overflow = 'unset'; };
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
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Required'),
      phone: Yup.string().required('Phone number is required'),
      services: Yup.array().min(1, 'Select at least one service'),
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
        if (selectedStaffMember) {
          await dispatch(updateStaffMember({ id: selectedStaffMember._id, staffMember: formData })).unwrap();
        } else {
          await dispatch(addStaff(formData)).unwrap();
        }
        handleCloseDrawer();
      } catch (err) {
        console.error('Staff setup failed:', err);
      }
    }
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    formik.setFieldValue('imageFile', file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleEdit = (member) => {
    setSelectedStaffMember(member);
    setImagePreview(member.profileImage?.startsWith('/uploads') ? `${IMAGE_URL}${member.profileImage}` : member.profileImage);
    formik.setValues({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      services: member.services.map(s => s._id),
      profileImage: member.profileImage,
      imageFile: null
    });
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedStaffMember(null);
    setImagePreview(null);
    formik.resetForm();
  };

  const handleDeleteClick = (member) => {
    setStaffMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (staffMemberToDelete) {
      dispatch(deleteStaffMember(staffMemberToDelete._id));
      setIsDeleteModalOpen(false);
      setStaffMemberToDelete(null);
      toast.success('Staff member removed');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <AdminHeader
        title="Staff Management"
        subtitle="Manage your salon's professional staff"
        icon={LayoutGrid}
        rightContent={
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full lg:w-auto flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury"
          >
            <Plus size={18} md:size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="whitespace-nowrap">ADD NEW STAFF</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        <AnimatePresence mode="popLayout">
          {staff.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
              className="group relative bg-secondary rounded-[2rem] p-5 border border-white/5 shadow-3xl transition-all duration-700 hover:border-primary/30 flex flex-col h-full"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-6 shadow-inner bg-background border border-white/5">
                <img
                  src={member.profileImage ? (member.profileImage.startsWith('http') ? member.profileImage : `${IMAGE_URL}${member.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-background/90 backdrop-blur-md rounded-xl text-[8px] font-black text-primary uppercase tracking-[0.2em] shadow-lg border border-white/5">
                  {member.role || "Staff Member"}
                </div>

                {/* Admin Actions Overlay */}
                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-all duration-500">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-3.5 bg-background/95 border border-white/10 rounded-xl text-muted hover:text-primary transition-all shadow-xl backdrop-blur-md"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(member)}
                    className="p-3.5 bg-background/95 border border-rose-500/20 rounded-xl text-muted hover:text-rose-500 transition-all shadow-xl backdrop-blur-md"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex-grow flex flex-col px-1 pb-2">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight line-clamp-1 font-luxury leading-none group-hover:text-primary transition-colors">{member.name}</h3>
                  <div className="flex items-center gap-2 mt-3 opacity-40">
                    <Mail size={10} className="text-primary" />
                    <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] truncate">{member.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-8 h-12 overflow-y-auto no-scrollbar mask-gradient">
                  {member.services.map(s => (
                    <span key={s._id} className="px-2.5 py-1.5 bg-background text-primary/60 text-[7px] font-black uppercase tracking-[0.2em] rounded-lg border border-white/5 whitespace-nowrap group-hover:border-primary/20 transition-all">
                      {s.name}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => { setProfileStaffMember(member); setIsProfileOpen(true); }}
                  className="w-full mt-auto py-4 rounded-xl bg-background border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-muted hover:bg-primary hover:text-secondary hover:border-primary transition-all shadow-sm active:scale-95 group-hover:shadow-primary/10"
                >
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedStaffMember ? 'Edit Staff Member' : 'ADD STAFF MEMBER'}
        subtitle="Set up a new professional profile"
      >
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl md:rounded-2xl bg-background border-4 border-dashed border-white/5 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-primary/40 group-hover:scale-105 shadow-inner">
              <img
                src={imagePreview ? (imagePreview.startsWith('blob') || imagePreview.startsWith('http') ? imagePreview : `${IMAGE_URL}${imagePreview}`) : `https://api.dicebear.com/9.x/adventurer/svg?seed=${formik.values.name || 'Artisan'}`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Preview"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <Upload size={24} md:size={32} className="text-secondary" />
              </div>
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
            <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-secondary shadow-xl">
              <Plus size={20} md:size={24} strokeWidth={3} />
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6 md:space-y-10">
          <div className="space-y-2 md:space-y-4">
            <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2  underline decoration-primary/30 decoration-2 underline-offset-8">Full Name</label>
            <input
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full bg-secondary border border-white/10 focus:border-primary/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5 font-luxury "
              placeholder="ENTER FULL NAME"
            />
            {formik.touched.name && formik.errors.name && <p className="text-rose-500 text-[8px] font-black ml-4 uppercase  tracking-widest">{formik.errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-2 md:space-y-4">
              <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2 ">Email Address</label>
              <input
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full bg-secondary border border-white/10 focus:border-primary/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5"
                placeholder="EMAIL@DOMAIN.COM"
              />
              {formik.touched.email && formik.errors.email && <p className="text-rose-500 text-[8px] font-black ml-4 uppercase  tracking-widest">{formik.errors.email}</p>}
            </div>

            <div className="space-y-2 md:space-y-4">
              <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2 ">Phone Number</label>
              <input
                name="phone"
                onChange={formik.handleChange}
                value={formik.values.phone}
                className="w-full bg-secondary border border-white/10 focus:border-primary/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5"
                placeholder="+XX XXXXX XXXXX"
              />
              {formik.touched.phone && formik.errors.phone && <p className="text-rose-500 text-[8px] font-black ml-4 uppercase  tracking-widest">{formik.errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <label className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-[0.3em] ml-2 ">Service Specialties</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-h-[250px] md:max-h-[350px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
              {services.map(s => (
                <label key={s._id} className={`flex items-center justify-between p-4 md:p-6 rounded-xl md:rounded-2xl cursor-pointer transition-all border border-white/5 group ${formik.values.services.includes(s._id) ? 'bg-primary text-secondary shadow-xl shadow-primary/20' : 'bg-background hover:bg-white/5 text-muted'}`}>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ">{s.name}</span>
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
                  {formik.values.services.includes(s._id) ? <UserCheck size={16} md:size={18} strokeWidth={3} /> : <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white/10 group-hover:border-primary/30 transition-colors" />}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 md:py-6 px-2 bg-primary text-secondary rounded-xl md:rounded-2xl text-[10px] md:text-[11px] uppercase tracking-[0.5em] hover:bg-primary/90 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 font-luxury "
          >
            {selectedStaffMember ? 'SAVE CHANGES' : 'ADD STAFF MEMBER'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => { setIsProfileOpen(false); setProfileStaffMember(null); }}
        title={profileStaffMember?.name}
        subtitle="STAFF MEMBER"
        headerImage={profileStaffMember?.profileImage?.startsWith('/uploads') ? `${IMAGE_URL}${profileStaffMember.profileImage}` : profileStaffMember?.profileImage}
        footer={(
          <>
            <button
              onClick={() => { setIsProfileOpen(false); handleEdit(profileStaffMember); }}
              className="flex-1 py-5 bg-primary text-secondary rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary/90 transition-all shadow-xl active:scale-95 font-luxury "
            >
              EDIT PROFILE
            </button>
            <button
              onClick={() => { setIsProfileOpen(false); setProfileStaffMember(null); }}
              className="w-14 h-14 flex items-center justify-center bg-background rounded-2xl text-muted hover:text-rose-500 transition-all border border-white/5 active:scale-95 shadow-inner"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </>
        )}
      >
        {profileStaffMember && (
          <div className="space-y-8 md:space-y-12 p-1 md:p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="p-5 md:p-6 bg-secondary/50 rounded-2xl border border-white/5 shadow-inner group">
                <div className="flex items-center gap-3 text-primary mb-3 md:mb-4">
                  <Phone size={14} strokeWidth={2.5} />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Phone</span>
                </div>
                <div className="text-[11px] md:text-xs font-black text-white tracking-widest break-all group-hover:text-primary transition-colors">{profileStaffMember.phone || 'NO PHONE NUMBER'}</div>
              </div>
              <div className="p-5 md:p-6 bg-secondary/50 rounded-2xl border border-white/5 shadow-inner group">
                <div className="flex items-center gap-3 text-primary mb-3 md:mb-4">
                  <Mail size={14} strokeWidth={2.5} />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Email</span>
                </div>
                <div className="text-[11px] md:text-xs font-black text-white tracking-widest break-all group-hover:text-primary transition-colors">{profileStaffMember.email || 'NO EMAIL'}</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <Award size={16} className="text-primary" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] leading-none">Services Provided</span>
                </div>
                <span className="h-[1px] flex-1 bg-white/5 mx-6 hidden sm:block" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                {profileStaffMember.services.map(s => (
                  <div key={s._id} className="p-5 md:p-6 bg-background rounded-2xl border border-white/5 shadow-3xl hover:border-primary/20 transition-all group/skill">
                    <div className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-tighter font-luxury leading-none transition-all group-hover/skill:text-primary">{s.name}</div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-[7px] md:text-[8px] font-black text-primary uppercase tracking-[0.3em] opacity-60">Elite Professional</div>
                      <Sparkles size={12} className="text-primary opacity-0 group-hover/skill:opacity-100 transition-opacity" />
                    </div>
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
        title="DELETE RECORD?"
        subtitle="This action cannot be undone"
        maxWidth="max-w-sm"
      >
        <div className="text-center p-4">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-10 shadow-2xl shadow-rose-500/20">
            <Trash2 size={48} strokeWidth={1} />
          </div>

          <p className="text-muted text-[10px] font-black uppercase tracking-[0.3em] mb-10 leading-relaxed ">
            Confirm permanent erasure of <br /><span className="text-rose-500 text-base font-luxury  underline decoration-rose-500/30 decoration-2 underline-offset-4">{staffMemberToDelete?.name}</span> <br /> from active records?
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={confirmDelete}
              className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-rose-600 transition-all shadow-xl active:scale-95 font-luxury "
            >
              CONFIRM DELETE
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full py-5 bg-white/5 text-muted rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-all font-luxury "
            >
              CANCEL
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
