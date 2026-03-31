import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, Shield, Save, Fingerprint, Edit3, Camera, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import toast from 'react-hot-toast';
import UserPanelLayout from '../components/public/UserPanelLayout';

const IMAGE_URL = 'http://localhost:5000';

export default function Profile() {
  const { userInfo: initialUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to sync profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProfile();
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

      try {
        const { data } = await api.put('/auth/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const updatedInfo = { ...user, ...data };
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        localStorage.setItem('token', data.accessToken);
        setUser(updatedInfo);
        toast.success('Identity matrix synchronized successfully');
        setIsEditing(false);
        setPreview(null);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Synchronization failed');
      } finally {
        setUpdating(false);
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

  if (loading) {
    return (
      <UserPanelLayout title="My Profile">
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Loader2 className="w-16 h-16 text-saloon-500 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse italic">Synchronizing Identity Matrix...</p>
        </div>
      </UserPanelLayout>
    )
  }

  return (
    <UserPanelLayout title="My Profile">
      <div className="flex flex-col gap-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 lg:p-10 relative overflow-hidden"
        >
          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-saloon-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rosegold-500/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Header Profile Section */}
          <div className="flex flex-col md:flex-row items-center gap-10 mb-10 pb-8 border-b border-white/5 relative z-10">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl p-1 transition-all duration-700 ${isEditing ? 'bg-gradient-to-tr from-saloon-500 to-rosegold-500 shadow-[0_0_30px_rgba(255,104,187,0.3)] scale-105' : 'bg-white/5'}`}>
                <div className="w-full h-full rounded-2xl bg-slate-950 overflow-hidden relative border border-white/10">
                  {preview || user?.profileImage ? (
                    <img 
                      src={preview || (user.profileImage?.startsWith('http') ? user.profileImage : `${IMAGE_URL}${user.profileImage}`)} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black italic text-saloon-500/50">
                      {user?.name?.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                      <Camera className="text-white" size={24} />
                    </div>
                  )}
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center bg-saloon-500 text-white shadow-2xl animate-bounce">
                  <Camera size={16} />
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic">Personal Descriptor</h2>
                <div className="px-3 py-1 bg-saloon-500/10 text-saloon-400 border border-saloon-500/20 rounded-full text-[8px] font-black uppercase tracking-widest shadow-inner">
                  {user?.role || 'CLIENT'}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-3">
                  <Fingerprint size={12} className="text-saloon-500" /> Matrix Linked ID: <span className="text-saloon-500 italic">{user?.customId || 'CLI-IDENTITY-INIT'}</span>
                </p>
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] italic max-w-sm mx-auto md:mx-0">
                  Authenticated high-fidelity participant in the collective matrix.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`hidden md:flex premium-button-primary !px-8 !py-3 items-center gap-3 transition-all !rounded-xl ${isEditing ? 'bg-slate-800 border-white/10 hover:bg-slate-700' : ''}`}
            >
              <Edit3 size={16} /> {isEditing ? 'Abort Update' : 'Update Identity'}
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {/* Name - Editable */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Full Identity Record (Name)</label>
                <div className="relative group/field">
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-saloon-500' : 'text-slate-600'}`}>
                    <User size={20} />
                  </div>
                  <input
                    {...formik.getFieldProps('name')}
                    disabled={!isEditing}
                    placeholder="Enter Full Identity"
                    className={`w-full bg-slate-950/40 border p-5 pl-14 rounded-2xl outline-none transition-all font-black text-xs uppercase tracking-widest ${isEditing ? 'border-saloon-500 ring-2 ring-saloon-500/10' : 'border-white/5 cursor-not-allowed opacity-80'}`}
                  />
                </div>
                {formik.touched.name && formik.errors.name && <p className="text-red-500/80 text-[10px] uppercase font-black tracking-widest pl-2 italic">{formik.errors.name}</p>}
              </div>

              {/* Email - Constant */}
              <div className="space-y-4 opacity-70">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 flex items-center gap-2">
                  Identity Coordinate (Email) <Shield size={10} className="text-emerald-500" />
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700">
                    <Mail size={20} />
                  </div>
                  <input
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-slate-950/40 border border-white/5 p-5 pl-14 rounded-2xl outline-none font-black text-xs uppercase tracking-widest text-slate-600 cursor-not-allowed"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 shadow-[0_0_8px_#10b981]" />
                  </div>
                </div>
              </div>

              {/* Phone - Constant */}
              <div className="space-y-4 opacity-70">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 flex items-center gap-2">
                  Signal Protocol (Phone) <Shield size={10} className="text-emerald-500" />
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700">
                    <Phone size={20} />
                  </div>
                  <input
                    value={user?.phone || ''}
                    disabled
                    className="w-full bg-slate-950/40 border border-white/5 p-5 pl-14 rounded-2xl outline-none font-black text-xs uppercase tracking-widest text-slate-600 cursor-not-allowed"
                  />
                   <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 shadow-[0_0_8px_#10b981]" />
                  </div>
                </div>
              </div>

              {/* Clearance Status */}
              {/* <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">System Clearance</label>
                <div className="h-[66px] flex items-center px-8 bg-saloon-500/5 border border-dashed border-saloon-500/20 rounded-[2rem]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] mr-5 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-saloon-400 italic">Access Clearance Level Alpha Confirmed</p>
                </div>
              </div> */}
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col sm:flex-row justify-end gap-6 pt-8"
                >
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setPreview(null); }}
                    className="px-10 py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all text-slate-400"
                  >
                    Abort Identity Record
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="premium-button-primary !px-12 !py-5 flex items-center justify-center gap-4 hover:shadow-[0_0_40px_rgba(255,104,187,0.4)]"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Syncing Matrix...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Synchronize Permanent Identity
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
