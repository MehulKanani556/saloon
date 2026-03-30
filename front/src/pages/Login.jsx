import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid business email')
    .required('Email identity is strictly required'),
  password: Yup.string()
    .min(6, 'Passkey must be at least 6 characters')
    .required('Authorization passkey is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminInfo, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (adminInfo) {
      navigate('/');
    }
  }, [adminInfo, navigate]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: (values) => {
      dispatch(loginAdmin(values));
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-gradient p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-parlour-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rosegold-100/30 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 border-white/60 shadow-premium relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-parlour-500 to-rosegold-400 p-0.5 shadow-md mb-6">
            <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center">
              <Sparkles size={32} className="text-parlour-500" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">GLOW LUXE</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-3 underline decoration-parlour-100 underline-offset-4 decoration-2">Admin Portal</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity (Email)</label>
            <div className="relative group">
              <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.email && formik.errors.email ? 'text-red-400' : 'text-slate-300 group-focus-within:text-parlour-400'}`} />
              <input 
                name="email"
                type="email" 
                {...formik.getFieldProps('email')}
                placeholder="sia@elegance.com"
                className={`w-full bg-white/50 border p-4 pl-12 rounded-2xl outline-none focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 ${formik.touched.email && formik.errors.email ? 'border-red-200' : 'border-white focus:border-parlour-200'}`} 
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-red-400 text-[9px] font-black uppercase tracking-widest pl-1 mt-1">
                <AlertCircle size={10} />
                {formik.errors.email}
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Passkey</label>
            <div className="relative group">
              <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.password && formik.errors.password ? 'text-red-400' : 'text-slate-300 group-focus-within:text-parlour-400'}`} />
              <input 
                name="password"
                type="password" 
                {...formik.getFieldProps('password')}
                placeholder="••••••••"
                className={`w-full bg-white/50 border p-4 pl-12 rounded-2xl outline-none focus:bg-white transition-all font-bold text-slate-700 ${formik.touched.password && formik.errors.password ? 'border-red-200' : 'border-white focus:border-parlour-200'}`} 
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-red-400 text-[9px] font-black uppercase tracking-widest pl-1 mt-1">
                <AlertCircle size={10} />
                {formik.errors.password}
              </motion.div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 bg-gradient-to-r from-parlour-500 to-rosegold-500 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-premium hover:shadow-parlour-200 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? 'Authenticating...' : (
              <>
                Validate Credentials
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            New to Glow Luxe? 
            <Link to="/signup" className="text-parlour-500 ml-2 hover:underline">Establish Identity</Link>
          </p>
        </div>

        <p className="mt-10 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] leading-relaxed">
          Proprietary Intelligence Suite <br/> Sia Elegance Collective
        </p>
      </motion.div>
    </div>
  );
}
