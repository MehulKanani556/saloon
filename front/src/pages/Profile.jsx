import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, Shield, Save, Fingerprint } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { loginUser } from '../redux/slices/authSlice';

export default function Profile() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string().required('Phone is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await api.put('/auth/profile', values);
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success('Identity matrix updated successfully');
        window.location.reload();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Update failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="pb-12 h-full">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary p-6 md:p-10 border border-white/5 shadow-2xl rounded-3xl"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-white/5">
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-primary p-[2px] shadow-2xl relative z-10 transition-transform duration-500 group-hover:rotate-3">
                <div className="w-full h-full rounded-[22px] bg-background flex items-center justify-center text-primary text-3xl font-black font-luxury">
                  {userInfo?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight italic font-luxury">Personal Identity</h1>
                <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-full ring-1 ring-primary/20">
                  {userInfo?.role}
                </span>
              </div>
              <p className="text-muted text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 justify-center md:justify-start">
                <Fingerprint size={12} className="text-primary" />
                Matix Identity: <span className="text-primary">{userInfo?.customId || 'CLI-7728-102'}</span>
              </p>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Personal Descriptor</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    {...formik.getFieldProps('name')}
                    placeholder="Enter Matrix Name"
                    className="w-full bg-background border-2 border-transparent focus:border-primary/30 p-4 pl-12 rounded-2xl outline-none transition-all font-black text-xs uppercase tracking-widest text-white shadow-inner"
                  />
                </div>
                {formik.touched.name && formik.errors.name && <p className="text-red-500 text-[10px] uppercase font-black tracking-widest pl-1">{formik.errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Relay Identity</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    {...formik.getFieldProps('email')}
                    placeholder="Coordinate Link"
                    className="w-full bg-background border-2 border-transparent focus:border-primary/30 p-4 pl-12 rounded-2xl outline-none transition-all font-black text-xs uppercase tracking-widest text-white shadow-inner"
                  />
                </div>
                {formik.touched.email && formik.errors.email && <p className="text-red-500 text-[10px] uppercase font-black tracking-widest pl-1">{formik.errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Contact Signal</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    {...formik.getFieldProps('phone')}
                    placeholder="+1 XXX-XXX-XXXX"
                    className="w-full bg-background border-2 border-transparent focus:border-primary/30 p-4 pl-12 rounded-2xl outline-none transition-all font-black text-xs uppercase tracking-widest text-white shadow-inner"
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-[10px] uppercase font-black tracking-widest pl-1">{formik.errors.phone}</p>}
              </div>

              {/* Security Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Clearance Protocol</label>
                <div className="relative h-[58px] flex items-center bg-background border border-dashed border-white/10 px-5 rounded-2xl">
                  <Shield size={18} className="text-primary mr-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">Level 0: Standard Operations Authorized</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-3 px-10 py-4 bg-primary text-secondary rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group disabled:opacity-50"
              >
                {loading ? 'Synchronizing...' : (
                  <>
                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                    Synchronize Matrix
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
