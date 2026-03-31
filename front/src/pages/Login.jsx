import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, AlertCircle, Phone, Key, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, sendOTP } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  identity: Yup.string()
    .required('Identity (Email or Phone) is required'),
  method: Yup.string().oneOf(['password', 'otp']).required(),
  password: Yup.string().when('method', {
    is: 'password',
    then: (schema) => schema.min(6, 'Passkey must be at least 6 characters').required('Authorization passkey is required'),
  }),
  otp: Yup.string().when('method', {
    is: 'otp',
    then: (schema) => schema.length(6, 'OTP must be 6 digits').required('Verification code is required'),
  }),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector((state) => state.auth);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userInfo.role === 'Staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/'); // Regular user
      }
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formik = useFormik({
    initialValues: { identity: '', password: '', otp: '', method: 'password' },
    validationSchema,
    onSubmit: (values) => {
      // Ensure phone numbers match database format: +1 XXX-XXX-XXXX
      const finalIdentity = isNumeric && !values.identity.startsWith('+') 
        ? `+1 ${values.identity}` 
        : values.identity;
      dispatch(loginUser({ ...values, identity: finalIdentity }));
    },
  });

  const handleIdentityChange = (e) => {
    let value = e.target.value;
    if (/^\d/.test(value)) {
      // Numeric formatting (XXX-XXX-XXXX)
      const digits = value.replace(/\D/g, '').substring(0, 10);
      if (digits.length > 6) {
        value = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 3) {
        value = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        value = digits;
      }
    }
    formik.setFieldValue('identity', value);
  };

  useEffect(() => {
    setOtpSent(false);
  }, [formik?.values?.identity]);

  const handleSendOTP = async () => {
    if (!formik.values.identity) {
      formik.setFieldError('identity', 'Enter identity first');
      return;
    }
    const finalIdentity = isNumeric && !formik.values.identity.startsWith('+') 
      ? `+1 ${formik.values.identity}` 
      : formik.values.identity;
    const result = await dispatch(sendOTP(finalIdentity));
    if (result.meta.requestStatus === 'fulfilled') {
      setOtpSent(true);
      setTimer(60);
    }
  };

  // Default to numeric (phone) view when empty
  const isNumeric = formik.values.identity === '' || /^\d/.test(formik.values.identity);
  const isEmail = !isNumeric && (formik.values.identity.includes('@') || /[a-z]/i.test(formik.values.identity));

  const handleAction = (e) => {
    if (formik.values.method === 'otp' && !otpSent) {
      e.preventDefault();
      handleSendOTP();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-gradient p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saloon-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rosegold-100/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-8 md:p-10 border-white/60 shadow-premium relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-6">
            <img src={Logo} alt="Glow & Elegance" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">GLOW & ELEGANCE</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-3 underline decoration-saloon-100 underline-offset-4 decoration-2">UNIFIED ACCESS PORTAL</p>
        </div>

        {/* Method Toggle */}
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl mb-8 gap-1.5 relative overflow-hidden backdrop-blur-sm">
          <button
            type="button"
            onClick={() => {
              formik.setFieldValue('method', 'password');
              setOtpSent(false);
            }}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${formik.values.method === 'password' ? 'text-white' : 'text-slate-400'}`}
          >
            Passkey Login
          </button>
          <button
            type="button"
            onClick={() => formik.setFieldValue('method', 'otp')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${formik.values.method === 'otp' ? 'text-white' : 'text-slate-400'}`}
          >
            Code Login
          </button>
          <motion.div
            animate={{ x: formik.values.method === 'password' ? '0%' : '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1.5 left-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-saloon-500 to-rosegold-500 rounded-xl shadow-lg"
          />
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Identity Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
              <span>Contact Signal</span>
              <span className="text-[9px] lowercase font-medium italic">identity matrix</span>
            </label>
            <div className={`relative flex items-center bg-white/50 border rounded-2xl overflow-hidden transition-all duration-300 ${formik.touched.identity && formik.errors.identity ? 'border-red-200 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]' : 'border-saloon-100/50 shadow-premium'}`}>
              
              {/* Dynamic Prefix/Icon Area */}
              <div className="flex items-center px-4 border-r border-slate-200/60 bg-slate-50/50 min-w-[70px] justify-center transition-all">
                {isNumeric ? (
                  <span className="text-saloon-500 font-black text-xs tracking-wider transition-opacity duration-300">+1</span>
                ) : (
                  <Mail size={16} className="text-saloon-400 animate-in fade-in duration-300" />
                )}
                {isNumeric && <Phone size={14} className="ml-2 text-saloon-300" />}
              </div>

              <input
                name="identity"
                type="text"
                value={formik.values.identity}
                onChange={handleIdentityChange}
                onBlur={formik.handleBlur}
                placeholder="Mobile Number or Email Address"
                className="w-full bg-transparent p-4 outline-none font-bold text-slate-700 placeholder:text-slate-300 tracking-tight"
              />
            </div>
            {formik.touched.identity && formik.errors.identity && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase tracking-widest pl-1 mt-1">
                <AlertCircle size={10} />
                {formik.errors.identity}
              </motion.div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {formik.values.method === 'password' ? (
              <motion.div
                key="password-field"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Authorization Passkey</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-3 mr-3 h-5 pointer-events-none">
                    <ShieldCheck size={16} className="text-saloon-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    {...formik.getFieldProps('password')}
                    placeholder="••••••••"
                    className={`w-full bg-white/50 border p-4 pl-16 rounded-2xl outline-none focus:bg-white transition-all font-bold text-slate-700 ${formik.touched.password && formik.errors.password ? 'border-red-200 focus:border-red-400' : 'border-white focus:border-saloon-200'}`}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase tracking-widest pl-1 mt-1">
                    <AlertCircle size={10} />
                    {formik.errors.password}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="otp-field"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full py-4 border-2 border-dashed border-saloon-200 rounded-2xl flex items-center justify-center gap-3 text-saloon-600 font-black text-[10px] tracking-widest uppercase hover:bg-saloon-50 transition-colors"
                  >
                    <Key size={16} />
                    Generate Access Code
                  </button>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                      <span>Verification Code</span>
                      {timer > 0 ? (
                        <span className="text-slate-400 font-medium">Resend in {timer}s</span>
                      ) : (
                        <button type="button" onClick={handleSendOTP} className="text-saloon-500 font-black hover:underline transition-all">Resend Code</button>
                      )}
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-3 mr-3 h-5 pointer-events-none">
                        <Key size={16} className="text-saloon-400" />
                      </div>
                      <input
                        name="otp"
                        type="text"
                        maxLength={6}
                        {...formik.getFieldProps('otp')}
                        placeholder="000000"
                        className={`w-full bg-white/50 border p-4 pl-16 rounded-2xl outline-none focus:bg-white transition-all font-extra-bold text-center text-xl tracking-[0.5em] text-slate-700 ${formik.touched.otp && formik.errors.otp ? 'border-red-200 focus:border-red-400' : 'border-white focus:border-saloon-200'}`}
                      />
                    </div>
                    {formik.touched.otp && formik.errors.otp && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase tracking-widest pl-1 mt-1">
                        <AlertCircle size={10} />
                        {formik.errors.otp}
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            onClick={handleAction}
            disabled={loading}
            className={`w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-premium hover:shadow-saloon-200 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing Protocol...' : (
              <>
                {(formik.values.method === 'otp' && !otpSent) ? 'Generate Access Code' : 'Validate Identity'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-4">
          <div className="h-[1px] w-full bg-slate-100" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            New to Glow & Elegance?
            <Link to="/signup" className="text-saloon-500 ml-2 hover:underline decoration-2">Establish Identity</Link>
          </p>
        </div>

        <p className="mt-10 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] leading-relaxed">
          Proprietary Intelligence Suite <br /> Glow & Elegance Collective
        </p>
      </motion.div>
    </div>
  );
}
