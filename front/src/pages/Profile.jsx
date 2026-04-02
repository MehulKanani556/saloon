import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, Shield, Save, Fingerprint, Edit3, Camera, Loader2, Sparkles, UserCircle } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserPanelLayout from '../components/public/UserPanelLayout';
import { fetchCurrentUser, updateProfile } from '../redux/slices/authSlice';
import { IMAGE_URL } from '../utils/BASE_URL';

export default function Profile() {
  const dispatch = useDispatch();
  const { userInfo: user, loading: rtkLoading } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(!user);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Full Name is required'),
    }),
    onSubmit: async (values) => {
      setUpdating(true);
      const formData = new FormData();
      formData.append('name', values.name);
      if (fileInputRef.current?.files[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      const result = await dispatch(updateProfile(formData));
      setUpdating(false);
      if (!result.error) {
        setIsEditing(false);
        setPreview(null);
      }
    },
  });

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading || (!user && rtkLoading)) {
    return (
      <UserPanelLayout title="Profile">
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <UserCircle size={16} className="text-primary/40" />
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted/60 animate-pulse">Loading Profile...</p>
        </div>
      </UserPanelLayout>
    )
  }

  return (
    <UserPanelLayout title="Profile">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-2xl"
        >
          {/* Subtle Atmosphere */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-white/5 relative z-10 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 w-full">
              <div className="relative group cursor-pointer shrink-0" onClick={handleImageClick}>
                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-3xl p-[1.5px] transition-all duration-700 ${isEditing ? 'bg-primary shadow-[0_0_30px_rgba(201,162,39,0.1)] scale-105' : 'bg-white/10 group-hover:bg-white/20'}`}>
                  <div className="w-full h-full rounded-[20px] bg-background overflow-hidden relative border border-white/5">
                    <img
                      src={preview ? preview : (user?.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `${IMAGE_URL}${user.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                        <Camera className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase leading-none">My <span className="text-primary italic">Profile</span></h2>
                  <div className="px-4 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-bold uppercase tracking-widest">
                    {user?.role || 'CLIENT'}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-muted/40 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center sm:justify-start gap-3">
                    <Fingerprint size={14} className="text-primary/30" /> REF: <span className="text-primary/80 font-mono">#{user?.customId || user?._id?.slice(-8).toUpperCase()}</span>
                  </p>
                  <p className="text-muted/40 text-[12px] font-medium max-w-md leading-relaxed mx-auto sm:mx-0">
                    Your personal details and profile information.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] transition-all border group ${isEditing ? 'bg-background border-white/10 text-muted/60 hover:text-white' : 'bg-primary text-secondary border-transparent shadow-xl hover:scale-105 active:scale-95'}`}
              >
                <Edit3 size={16} className={`${!isEditing && 'group-hover:rotate-12 transition-transform'}`} />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="relative z-10 space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
              {/* Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.3em] ml-2">Full Name</label>
                <div className="relative group/field">
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-primary' : 'text-muted/20'}`}>
                    <User size={18} />
                  </div>
                  <input
                    {...formik.getFieldProps('name')}
                    disabled={!isEditing}
                    placeholder="Enter full name"
                    className={`w-full bg-white/[0.03] border px-6 py-4 pl-12 rounded-2xl outline-none transition-all font-bold text-sm ${isEditing ? 'border-primary/30 text-white' : 'border-transparent text-muted/40 cursor-not-allowed'}`}
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500/80 text-[9px] uppercase font-bold tracking-widest ml-4">{formik.errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.3em] ml-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/20">
                    <Mail size={18} />
                  </div>
                  <input
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-white/[0.01] border border-transparent px-6 py-4 pl-12 rounded-2xl font-bold text-sm text-muted/40 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.3em] ml-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/20">
                    <Phone size={18} />
                  </div>
                  <input
                    value={user?.phone || ''}
                    disabled
                    className="w-full bg-white/[0.01] border border-transparent px-6 py-4 pl-12 rounded-2xl font-bold text-sm text-muted/40 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-white/5"
                >
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setPreview(null); }}
                    className="px-10 py-4 bg-background border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all text-muted/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-12 py-4 bg-primary text-secondary rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all font-bold text-[10px] uppercase tracking-[0.2em]"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </UserPanelLayout>
  );
}
