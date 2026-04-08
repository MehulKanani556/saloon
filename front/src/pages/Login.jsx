import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, AlertCircle, Phone, Key, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, sendOTP } from '../redux/slices/authSlice';
import { syncCart } from '../redux/slices/cartSlice';
import { syncWishlist } from '../redux/slices/wishlistSlice';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  identity: Yup.string()
    .required('Identity (Email or Phone) is required')
    .test('is-valid-identity', 'Enter valid Email or 10-digit Phone', function (value) {
      if (!value) return false;
      if (/^\d/.test(value) || value.includes('-')) {
        return /^\d{3}-\d{3}-\d{4}$/.test(value);
      }
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }),
  method: Yup.string().oneOf(['password', 'otp']).required(),
  password: Yup.string().when('method', {
    is: 'password',
    then: (schema) => schema.min(6, 'Password must be at least 6 characters').required('Password is required'),
  }),
  otp: Yup.string().when('method', {
    is: 'otp',
    then: (schema) => schema.length(6, 'OTP must be 6 digits').required('OTP code is required'),
  }),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector((state) => state.auth);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const otpInputRef = useRef(null);

  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [otpSent]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userInfo.role === 'Staff') {
        navigate('/staff/dashboard');
      } else {
        // Regular user: Sync local storage data with server
        const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const localWishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        
        dispatch(syncCart(localCart));
        dispatch(syncWishlist(localWishlist));
        
        navigate('/');
      }
    }
  }, [userInfo, navigate, dispatch]);

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
      // Reset OTP field state to prevent premature validation errors
      formik.setFieldTouched('otp', false);
      formik.setFieldError('otp', undefined);
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
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/40 backdrop-blur-xl w-full max-w-lg p-8 md:p-10 border border-white/5 rounded-2xl shadow-premium relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-6">
            <img src={Logo} alt="Glow Saloon" className="h-16 w-auto object-contain brightness-0 invert" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase font-luxury">Glow <span className="text-primary ">Saloon</span></h1>
          <p className="text-muted text-[10px] font-bold uppercase tracking-[0.2em] mt-3 underline decoration-primary/30 underline-offset-4 decoration-2">LOGIN</p>
        </div>

        {/* Method Toggle */}
        <div className="flex bg-background p-1.5 rounded-2xl mb-8 gap-1.5 relative overflow-hidden backdrop-blur-sm border border-white/5">
          <button
            type="button"
            onClick={() => {
              formik.setFieldValue('method', 'password');
              setOtpSent(false);
            }}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${formik.values.method === 'password' ? 'text-secondary' : 'text-primary/40 hover:text-primary transition-colors'}`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => formik.setFieldValue('method', 'otp')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${formik.values.method === 'otp' ? 'text-secondary' : 'text-primary/40 hover:text-primary transition-colors'}`}
          >
            OTP Login
          </button>
          <motion.div
            animate={{ x: formik.values.method === 'password' ? '0%' : '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1.5 left-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-xl shadow-lg shadow-primary/20"
          />
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Identity Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex justify-between">
              <span>Email or Phone</span>
              <span className="text-[9px] lowercase font-medium ">Login Details</span>
            </label>
            <div className={`relative flex items-center bg-background border rounded-2xl overflow-hidden transition-all duration-300 ${formik.touched.identity && formik.errors.identity ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]' : 'border-white/5 shadow-premium'}`}>

              {/* Dynamic Prefix/Icon Area */}
              <div className="flex items-center px-4 border-r border-white/5 min-w-[70px] justify-center transition-all">
                {isNumeric ? (
                  <span className="text-primary font-black text-xs tracking-wider transition-opacity duration-300">+1</span>
                ) : (
                  <Mail size={16} className="text-primary/70 animate-in fade-in duration-300" />
                )}
                {isNumeric && <Phone size={14} className="ml-2 text-primary/40" />}
              </div>

              <input
                name="identity"
                type="text"
                value={formik.values.identity}
                onChange={handleIdentityChange}
                onBlur={formik.handleBlur}
                placeholder="Mobile Number or Email Address"
                className="w-full bg-transparent p-4 outline-none font-bold text-white placeholder:text-muted/30 tracking-tight"
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
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/10 pr-3 mr-3 h-5 pointer-events-none">
                    <ShieldCheck size={16} className="text-primary/70" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps('password')}
                    placeholder="••••••••"
                    className={`w-full bg-background border p-4 pl-16 rounded-2xl outline-none focus:bg-background transition-all font-bold text-white ${formik.touched.password && formik.errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-primary/20'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/30 hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-6 border-y border-white/5 flex flex-col items-center gap-2"
                  >
                    <p className="text-[9px] font-black text-muted/30 uppercase tracking-[0.3em]">Verification Required</p>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex justify-between">
                      <span>OTP Code</span>
                      {timer > 0 ? (
                        <span className="text-muted font-medium">Resend in {timer}s</span>
                      ) : (
                        <button type="button" onClick={handleSendOTP} className="text-primary font-black hover:underline transition-all">Resend OTP</button>
                      )}
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-white/10 pr-3 mr-3 h-5 pointer-events-none">
                        <Key size={16} className="text-primary/70" />
                      </div>
                      <input
                        name="otp"
                        type="text"
                        ref={otpInputRef}
                        maxLength={6}
                        {...formik.getFieldProps('otp')}
                        placeholder="000000"
                        className={`w-full bg-background border p-4 pl-16 rounded-2xl outline-none focus:bg-background transition-all font-extra-bold text-center text-xl tracking-[0.5em] text-white placeholder:text-muted/20 ${formik.touched.otp && formik.errors.otp ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-primary/20'}`}
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
            className={`w-full py-4 bg-primary text-secondary rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-premium hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : (
              <>
                {(formik.values.method === 'otp' && !otpSent) ? 'Send Code' : 'Log In'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-4">
          <div className="h-[1px] w-full bg-white/5" />
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
            New to Glow Saloon?
            <Link to="/signup" className="text-primary ml-2 hover:underline decoration-2">Create Account</Link>
          </p>
        </div>

        <p className="mt-10 text-center text-[9px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed">
          Secure Login System <br /> Glow Saloon
        </p>
      </motion.div>
    </div>
  );
}

