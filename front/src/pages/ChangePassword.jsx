import { useDispatch, useSelector } from 'react-redux';
import { Lock, Shield, Save, KeyRound, AlertCircle, Loader2, ShieldCheck, Fingerprint } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UserPanelLayout from '../components/public/UserPanelLayout';
import { fetchCurrentUser, changePassword } from '../redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ChangePassword() {
  const dispatch = useDispatch();
  const { userInfo: user, loading: rtkLoading } = useSelector((state) => state.auth);
  const [syncing, setSyncing] = useState(!user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncSecurity = async () => {
      await dispatch(fetchCurrentUser());
      setSyncing(false);
    };
    syncSecurity();
  }, [dispatch]);

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
        then: () => Yup.string().required('Current password is required'),
        otherwise: () => Yup.string().notRequired(),
      }),
      newPassword: Yup.string()
        .min(6, 'Minimum 6 characters required')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
        .required('Please confirm your new password'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const result = await dispatch(changePassword(values));
      setLoading(false);
      if (!result.error) {
        formik.resetForm();
        dispatch(fetchCurrentUser());
      }
    },
  });

  if (syncing || (!user && rtkLoading)) {
    return (
      <UserPanelLayout title="Security">
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck size={16} className="text-primary/40" />
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted/60 animate-pulse">Authenticating Vault...</p>
        </div>
      </UserPanelLayout>
    )
  }

  return (
    <UserPanelLayout title="Security">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl"
        >
          {/* Subtle Atmosphere */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-white/5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 shrink-0">
              <Fingerprint size={32} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase leading-none">Access <span className="text-primary italic">Security</span></h2>
              <p className="text-muted/40 text-[11px] font-medium tracking-widest uppercase">Secure your digital profile and atelier credentials</p>
            </div>
          </div>

          {!hasPassword && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4 relative z-10"
            >
              <AlertCircle className="text-primary shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Password Required</p>
                <p className="text-[12px] text-muted/80 font-medium">Please establish a secure password to protect your session history and preferences.</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-8 relative z-10">
            {/* Current Password */}
            {hasPassword && (
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.3em] ml-2">Current Password</label>
                <div className="relative group/field">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/30 group-focus-within/field:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    {...formik.getFieldProps('currentPassword')}
                    placeholder="Enter current password"
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/30 transition-all font-medium text-sm text-white"
                  />
                </div>
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                  <p className="text-red-500/80 text-[9px] uppercase font-bold tracking-widest ml-4">{formik.errors.currentPassword}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* New Password */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.3em] ml-2">New Password</label>
                <div className="relative group/field">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/30 group-focus-within/field:text-primary transition-colors">
                    <Shield size={18} />
                  </div>
                  <input
                    type="password"
                    {...formik.getFieldProps('newPassword')}
                    placeholder="New secure password"
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/30 transition-all font-medium text-sm text-white"
                  />
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-red-500/80 text-[9px] uppercase font-bold tracking-widest ml-4">{formik.errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.3em] ml-2">Confirm Password</label>
                <div className="relative group/field">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/30 group-focus-within/field:text-primary transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    type="password"
                    {...formik.getFieldProps('confirmPassword')}
                    placeholder="Repeat new password"
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/30 transition-all font-medium text-sm text-white"
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-red-500/80 text-[9px] uppercase font-bold tracking-widest ml-4">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-secondary rounded-2xl flex items-center justify-center gap-4 shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all font-bold text-[11px] uppercase tracking-[0.3em] group"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Securing Data...
                  </>
                ) : (
                  <>
                    <Save size={20} className="group-hover:rotate-12 transition-transform" />
                    Update Access Security
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
