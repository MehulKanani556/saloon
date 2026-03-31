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
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted animate-pulse italic">Synchronizing Identity Matrix...</p>
        </div>
      </UserPanelLayout>
    )
  }

  return (
    <UserPanelLayout title="My Profile">
      <div className="flex flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card backdrop-blur-3xl border border-white/10 rounded-2xl p-8 lg:p-16 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] ring-1 ring-white/5"
        >
          {/* Decorative Ethereal Blobs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Header Profile Section */}
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12 pb-10 border-b border-white/5 relative z-10">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <div className={`w-36 h-36 md:w-44 md:h-44 rounded-2xl p-[2px] transition-all duration-1000 ${isEditing ? 'bg-luxury-gradient shadow-[0_0_60px_rgba(201,162,39,0.3)] scale-[1.05] rotate-3' : 'bg-white/10'}`}>
                <div className="w-full h-full rounded-2xl bg-background overflow-hidden relative border border-white/5">
                  {preview || user?.profileImage ? (
                    <img
                      src={preview || (user.profileImage?.startsWith('http') ? user.profileImage : `${IMAGE_URL}${user.profileImage}`)}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-black italic text-primary/10 font-luxury tracking-tighter">
                      {user?.name?.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                      <Camera className="text-primary animate-bounce" size={32} />
                    </div>
                  )}
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              {isEditing && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -bottom-3 -right-3 w-14 h-14 rounded-2xl flex items-center justify-center bg-luxury-gradient text-secondary shadow-2xl"
                >
                  <Camera size={24} />
                </motion.div>
              )}
            </div>

            <div className="text-center md:text-left flex-1 space-y-6">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-[-0.05em] italic font-luxury leading-none">Identity <span className="text-primary/50">Core</span></h2>
                <div className="px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-inner backdrop-blur-md">
                  {user?.role || 'CLIENT'}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-muted/60 text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-center md:justify-start gap-4">
                  <Fingerprint size={16} className="text-primary/30" /> Matrix Coordinate: <span className="text-primary font-luxury italic tracking-widest">{user?.customId || 'CLI-IDENTITY-INIT'}</span>
                </p>
                <p className="text-muted/30 text-[10px] font-black uppercase tracking-[0.3em] italic max-w-md mx-auto md:mx-0 leading-relaxed">
                  High-fidelity verification established within the collective aesthetic matrix.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`hidden md:flex items-center gap-4 px-12 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] transition-all duration-500 border group ${isEditing ? 'bg-background border-white/10 text-muted/40 hover:text-white' : 'bg-luxury-gradient text-secondary border-transparent shadow-xl hover:scale-105 active:scale-95'}`}
            >
              <Edit3 size={20} className={`${!isEditing && 'group-hover:rotate-12 transition-transform'}`} />
              <span className="font-luxury italic">{isEditing ? 'Abort Record' : 'Modify Matrix'}</span>
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="relative z-10 space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {/* Name - Editable */}
              <div className="space-y-6">
                <label className="text-[11px] font-black text-muted/40 uppercase tracking-[0.5em] pl-4 italic">Full Identity Ledger</label>
                <div className="relative group/field">
                  <div className={`absolute left-8 top-1/2 -translate-y-1/2 transition-all duration-700 ${isEditing ? 'text-primary scale-110' : 'text-muted/20'}`}>
                    <User size={26} />
                  </div>
                  <input
                    {...formik.getFieldProps('name')}
                    disabled={!isEditing}
                    placeholder="Enter Identity Name"
                    className={`w-full bg-background/30 border p-8 pl-20 rounded-2xl outline-none transition-all duration-1000 font-black text-[12px] uppercase tracking-[0.3em] ${isEditing ? 'border-primary shadow-[0_0_40px_rgba(201,162,39,0.05)] text-white ring-1 ring-primary/20' : 'border-white/[0.03] cursor-not-allowed opacity-30 text-muted'}`}
                  />
                  {!isEditing && <Shield className="absolute right-8 top-1/2 -translate-y-1/2 text-white/5" size={20} />}
                </div>
                {formik.touched.name && formik.errors.name && <p className="text-primary/80 text-[10px] uppercase font-black tracking-widest pl-4 italic animate-pulse">! Alignment Error: {formik.errors.name}</p>}
              </div>

              {/* Email - Constant */}
              <div className="space-y-6">
                <label className="text-[11px] font-black text-muted/20 uppercase tracking-[0.5em] pl-4 italic">Encrypted Coordinate (Email)</label>
                <div className="relative">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white/5">
                    <Mail size={26} />
                  </div>
                  <input
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-background/20 border border-white/[0.02] p-8 pl-20 rounded-2xl outline-none font-black text-[12px] uppercase tracking-[0.3em] text-muted/20 cursor-not-allowed italic"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/20 shadow-[0_0_15px_rgba(201,162,39,0.3)]" />
                    <div className="w-2 h-2 rounded-full bg-primary/10" />
                  </div>
                </div>
              </div>

              {/* Phone - Constant */}
              <div className="space-y-6">
                <label className="text-[11px] font-black text-muted/20 uppercase tracking-[0.5em] pl-4 italic">Signal Protocol (Phone)</label>
                <div className="relative">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white/5">
                    <Phone size={26} />
                  </div>
                  <input
                    value={user?.phone || ''}
                    disabled
                    className="w-full bg-background/20 border border-white/[0.02] p-8 pl-20 rounded-2xl outline-none font-black text-[12px] uppercase tracking-[0.3em] text-muted/20 cursor-not-allowed italic"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 rounded-full border border-primary/20 animate-ping" />
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col sm:flex-row justify-end gap-8 pt-16 border-t border-white/5"
                >
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setPreview(null); }}
                    className="px-14 py-6 border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white/5 transition-all text-muted/40 hover:text-white"
                  >
                    Cancel Synchronization
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-20 py-6 bg-luxury-gradient text-secondary rounded-2xl flex items-center justify-center gap-5 shadow-[0_20px_50px_rgba(201,162,39,0.2)] hover:scale-105 active:scale-95 transition-all font-black text-[11px] uppercase tracking-[0.5em] font-luxury italic"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Architecting Matrix...
                      </>
                    ) : (
                      <>
                        <Save size={24} />
                        Commit Permanent Identity
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
