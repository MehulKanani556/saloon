import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Lock, Shield, Save, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../utils/api';
import toast from 'react-hot-toast';
import UserPanelLayout from '../components/public/UserPanelLayout';

export default function ChangePassword() {
  const { userInfo } = useSelector((state) => state.auth);
  const [user, setUser] = useState(userInfo);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Security sync failed', error);
      } finally {
        setSyncing(false);
      }
    };
    fetchLatestProfile();
  }, []);

  const hasPassword = !!user?.password;

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().when([], {
        is: () => hasPassword,
        then: () => Yup.string().required('Current matrix key required'),
        otherwise: () => Yup.string().notRequired(),
      }),
      newPassword: Yup.string()
        .min(6, 'Minimum 6 characters for security entropy')
        .required('New matrix key required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Matrix keys do not match')
        .required('Verification required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await api.put('/auth/change-password', values);
        toast.success('Security credentials synchronized');
        formik.resetForm();
        // Update local user state
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Access denied');
      } finally {
        setLoading(false);
      }
    },
  });

  if (syncing) {
    return (
      <UserPanelLayout title="Change Password">
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Loader2 className="w-16 h-16 text-saloon-500 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse italic">Synchronizing Security Matrix...</p>
        </div>
      </UserPanelLayout>
    )
  }

  return (
    <UserPanelLayout title="Change Password">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 lg:p-10 relative overflow-hidden"
        >
          {/* Dynamic Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rosegold-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-6 mb-12 pb-10 border-b border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-saloon-500/10 flex items-center justify-center text-saloon-500 border border-saloon-500/20 shadow-inner">
              <KeyRound size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Security Matrix</h2>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">Synchronize access credentials</p>
            </div>
          </div>

          {!hasPassword && (
            <div className="mb-10 p-5 bg-saloon-500/10 border border-saloon-500/20 rounded-2xl flex items-start gap-4 ring-1 ring-saloon-500/10">
              <AlertCircle className="text-saloon-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-[10px] font-black text-saloon-500 uppercase tracking-widest mb-1 leading-none">Initialization Required</p>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase italic">Initialize your matrix for password-based access.</p>
              </div>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Current Password - Only show if they have one */}
            {hasPassword && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Current Secret Key</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-saloon-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    {...formik.getFieldProps('currentPassword')}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-white/5 p-5 pl-14 rounded-2xl outline-none focus:border-saloon-500/50 transition-all font-black text-xs tracking-widest"
                  />
                </div>
                {formik.touched.currentPassword && formik.errors.currentPassword && <p className="text-red-500/80 text-[10px] uppercase font-black tracking-widest pl-1 italic">{formik.errors.currentPassword}</p>}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">New Security Entropy</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-saloon-500 transition-colors">
                  <Shield size={18} />
                </div>
                <input
                  type="password"
                  {...formik.getFieldProps('newPassword')}
                  placeholder="New Matrix Key"
                  className="w-full bg-slate-950/50 border border-white/5 p-5 pl-14 rounded-2xl outline-none focus:border-saloon-500/50 transition-all font-black text-xs tracking-widest"
                />
              </div>
              {formik.touched.newPassword && formik.errors.newPassword && <p className="text-red-500/80 text-[10px] uppercase font-black tracking-widest pl-1 italic">{formik.errors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Verify Synchronization</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-saloon-500 transition-colors">
                  <KeyRound size={18} />
                </div>
                <input
                  type="password"
                  {...formik.getFieldProps('confirmPassword')}
                  placeholder="Repeat Secret Key"
                  className="w-full bg-slate-950/50 border border-white/5 p-5 pl-14 rounded-2xl outline-none focus:border-saloon-500/50 transition-all font-black text-xs tracking-widest"
                />
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-red-500/80 text-[10px] uppercase font-black tracking-widest pl-1 italic">{formik.errors.confirmPassword}</p>}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full premium-button-primary !py-5 flex items-center justify-center gap-3"
              >
                {loading ? 'Processing Cryptography...' : (
                  <>
                    <Save size={18} />
                    Apply Protocol
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </UserPanelLayout>
  );
}
