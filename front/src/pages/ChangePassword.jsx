import { useDispatch, useSelector } from 'react-redux';
import { Lock, Shield, Save, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
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
      <UserPanelLayout title="Change Password">
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted animate-pulse italic">Synchronizing Security Matrix...</p>
        </div>
      </UserPanelLayout>
    )
  }

  return (
    <UserPanelLayout title="Change Password">
      <div className="w-full">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-dark-card backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-16 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] ring-1 ring-white/5"
         >
           {/* Dynamic Ethereal Background */}
           <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
           <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
           
           <div className="flex items-center gap-8 mb-16 pb-12 border-b border-white/5 relative z-10">
             <div className="w-20 h-20 rounded-[2rem] bg-luxury-gradient flex items-center justify-center text-secondary shadow-[0_15px_40px_rgba(201,162,39,0.3)] border border-white/20">
               <KeyRound size={32} strokeWidth={2.5} />
             </div>
             <div>
               <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[-0.05em] italic leading-none mb-3 font-luxury">Security <span className="text-primary/50">Matrix</span></h2>
               <p className="text-muted/60 text-[10px] font-black uppercase tracking-[0.5em] italic">Synchronize Access Credentials</p>
             </div>
           </div>
 
           {!hasPassword && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
               className="mb-12 p-8 bg-primary/5 border border-primary/20 rounded-3xl flex items-start gap-6 backdrop-blur-md relative z-10"
             >
               <AlertCircle className="text-primary shrink-0 mt-1" size={24} />
               <div>
                 <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-2 leading-none font-luxury italic">Initialization Required</p>
                 <p className="text-[12px] text-muted/80 font-bold leading-relaxed uppercase italic tracking-widest">Construct your security matrix for password-based authentication.</p>
               </div>
             </motion.div>
           )}
 
           <form onSubmit={formik.handleSubmit} className="space-y-12 relative z-10">
             {/* Current Password - Only show if they have one */}
             {hasPassword && (
               <div className="space-y-6">
                 <label className="text-[11px] font-black text-muted/40 uppercase tracking-[0.5em] pl-4 italic">Current Secret Protocol</label>
                 <div className="relative group/field">
                   <div className="absolute left-8 top-1/2 -translate-y-1/2 text-muted/20 group-focus-within/field:text-primary group-focus-within/field:scale-110 transition-all duration-700">
                     <Lock size={26} />
                   </div>
                   <input
                     type="password"
                     {...formik.getFieldProps('currentPassword')}
                     placeholder="••••••••••••"
                     className="w-full bg-background/30 border border-white/[0.03] p-8 pl-20 rounded-[2.5rem] outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-1000 font-black text-base tracking-[0.6em] text-white"
                   />
                 </div>
                 {formik.touched.currentPassword && formik.errors.currentPassword && <p className="text-primary/80 text-[10px] uppercase font-black tracking-widest pl-4 italic animate-pulse">{formik.errors.currentPassword}</p>}
               </div>
             )}
 
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
               {/* New Password */}
               <div className="space-y-6">
                 <label className="text-[11px] font-black text-muted/40 uppercase tracking-[0.5em] pl-4 italic">New Security Entropy</label>
                 <div className="relative group/field">
                   <div className="absolute left-8 top-1/2 -translate-y-1/2 text-muted/20 group-focus-within/field:text-primary transition-all duration-700">
                     <Shield size={26} />
                   </div>
                   <input
                     type="password"
                     {...formik.getFieldProps('newPassword')}
                     placeholder="ENTROPY-X"
                     className="w-full bg-background/30 border border-white/[0.03] p-8 pl-20 rounded-[2.5rem] outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-1000 font-black text-base tracking-[0.6em] text-white"
                   />
                 </div>
                 {formik.touched.newPassword && formik.errors.newPassword && <p className="text-primary/80 text-[10px] uppercase font-black tracking-widest pl-4 italic animate-pulse">{formik.errors.newPassword}</p>}
               </div>
 
               {/* Confirm Password */}
               <div className="space-y-6">
                 <label className="text-[11px] font-black text-muted/40 uppercase tracking-[0.5em] pl-4 italic">Verify Synchronization</label>
                 <div className="relative group/field">
                   <div className="absolute left-8 top-1/2 -translate-y-1/2 text-muted/20 group-focus-within/field:text-primary transition-all duration-700">
                     <KeyRound size={26} />
                   </div>
                   <input
                     type="password"
                     {...formik.getFieldProps('confirmPassword')}
                     placeholder="REPEAT-SEC"
                     className="w-full bg-background/30 border border-white/[0.03] p-8 pl-20 rounded-[2.5rem] outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-1000 font-black text-base tracking-[0.6em] text-white"
                   />
                 </div>
                 {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-primary/80 text-[10px] uppercase font-black tracking-widest pl-4 italic animate-pulse">{formik.errors.confirmPassword}</p>}
               </div>
             </div>
 
             <div className="pt-12 border-t border-white/5">
               <button
                 type="submit"
                 disabled={loading}
                 className="w-full py-8 bg-luxury-gradient text-secondary rounded-[2.5rem] flex items-center justify-center gap-6 shadow-[0_25px_60px_rgba(201,162,39,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all font-black text-[12px] uppercase tracking-[0.6em] font-luxury italic group"
               >
                 {loading ? (
                   <>
                     <Loader2 className="animate-spin" size={24} />
                     Processing Cryptography...
                   </>
                 ) : (
                   <>
                     <Save size={24} className="group-hover:rotate-12 transition-transform" />
                     Commit Protocol Update
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
