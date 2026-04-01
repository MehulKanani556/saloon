import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, Shield, Save, Fingerprint, Edit3, Camera, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserPanelLayout from '../components/public/UserPanelLayout';
import { fetchCurrentUser, updateUserProfile } from '../redux/slices/authSlice';
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
    dispatch(fetchCurrentUser());
    setLoading(false);
  }, [dispatch]);

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

      const result = await dispatch(updateUserProfile(formData));
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
      <UserPanelLayout title="My Profile">
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted animate-pulse ">Synchronizing Identity Matrix...</p>
        </div>
      </UserPanelLayout>
    )
  }

  return (
    <UserPanelLayout title="Identity">
      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card backdrop-blur-3xl border border-white/10 rounded-xl p-6 lg:p-10 relative overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/5"
        >
          {/* Decorative Ethereal Blobs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Header Profile Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 pb-8 border-b border-white/5 relative z-10 w-full">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative group cursor-pointer shrink-0" onClick={handleImageClick}>
                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-xl p-[1px] transition-all duration-700 ${isEditing ? 'bg-luxury-gradient shadow-[0_0_30px_rgba(201,162,39,0.2)] scale-[1.02]' : 'bg-white/10 group-hover:bg-white/20'}`}>
                  <div className="w-full h-full rounded-xl bg-background overflow-hidden relative border border-white/5 shadow-inner">
                    <img
                      src={preview ? preview : (user?.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `${IMAGE_URL}${user.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`)}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                        <Camera className="text-white animate-bounce" size={24} />
                      </div>
                    )}
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="space-y-4 max-w-lg">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <h2 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 font-luxury">Identity <span className="text-primary/50">Core</span></h2>
                  <div className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-inner backdrop-blur-md">
                    {user?.role || 'CLIENT'}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-muted/60 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-4">
                    <Fingerprint size={14} className="text-primary/30" /> ID: <span className="text-primary font-luxury  tracking-wider">{user?.customId || 'CLI-IDENTITY-INIT'}</span>
                  </p>
                  <p className="text-muted/40 text-[9px] font-black uppercase tracking-[0.2em]  max-w-sm leading-relaxed">
                    High-fidelity verification established within the collective aesthetic matrix.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-3 px-10 py-5 rounded-xl font-black uppercase text-[11px] tracking-[0.3em] transition-all duration-300 border group shrink-0 ${isEditing ? 'bg-background border-white/10 text-muted/40 hover:text-white' : 'bg-luxury-gradient text-secondary border-transparent shadow-[0_20px_40px_rgba(201,162,39,0.2)] hover:scale-105 active:scale-95'}`}
            >
              <Edit3 size={18} className={`${!isEditing && 'group-hover:rotate-12 transition-transform'}`} />
              <span className="font-luxury ">{isEditing ? 'Abort Record' : 'Modify Record'}</span>
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="relative z-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {/* Name - Editable */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted/40 uppercase tracking-[0.4em] pl-2 ">Identity Ledger</label>
                <div className="relative group/field">
                  <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 ${isEditing ? 'text-primary scale-110' : 'text-muted/20'}`}>
                    <User size={20} />
                  </div>
                  <input
                    {...formik.getFieldProps('name')}
                    disabled={!isEditing}
                    placeholder="Enter Identity Name"
                    className={`w-full bg-background/20 border px-6 py-5 pl-14 rounded-xl outline-none transition-all duration-500 font-black text-[11px] uppercase tracking-[0.2em] ${isEditing ? 'border-primary/40 shadow-inner text-white' : 'border-white/[0.05] cursor-not-allowed opacity-40 text-muted/60'}`}
                  />
                </div>
                {formik.touched.name && formik.errors.name && <p className="text-primary/80 text-[9px] uppercase font-black tracking-widest pl-2  animate-pulse">! Error: {formik.errors.name}</p>}
              </div>

              {/* Email - Constant */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted/30 uppercase tracking-[0.4em] pl-2 ">Encryption (Email)</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/5 opacity-40">
                    <Mail size={20} />
                  </div>
                  <input
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-background/10 border border-white/[0.02] px-6 py-5 pl-14 rounded-xl outline-none font-black text-[11px] uppercase tracking-[0.2em] text-muted/40 cursor-not-allowed  shadow-inner"
                  />
                </div>
              </div>

              {/* Phone - Constant */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted/30 uppercase tracking-[0.4em] pl-2 ">Signal Protocol (Phone)</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/5 opacity-40">
                    <Phone size={20} />
                  </div>
                  <input
                    value={user?.phone || ''}
                    disabled
                    className="w-full bg-background/10 border border-white/[0.02] px-6 py-5 pl-14 rounded-xl outline-none font-black text-[11px] uppercase tracking-[0.2em] text-muted/40 cursor-not-allowed  shadow-inner"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col sm:flex-row justify-end gap-6 pt-8 border-t border-white/5"
                >
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setPreview(null); }}
                    className="px-10 py-5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all text-muted/40 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-14 py-5 bg-luxury-gradient text-secondary rounded-xl flex items-center justify-center gap-4 shadow-lg hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-[0.4em] font-luxury "
                  >
                    {updating ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Commit Changes
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
