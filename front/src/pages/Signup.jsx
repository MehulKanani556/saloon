import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email identity is strictly required'),
    password: Yup.string()
        .min(6, 'Passkey must be at least 6 characters')
        .required('Authorization passkey is required'),
});

export default function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const formik = useFormik({
        initialValues: { name: '', email: '', password: '' },
        validationSchema,
        onSubmit: (values) => {
            dispatch(signupUser(values));
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary/40 backdrop-blur-xl w-full max-w-lg p-10 border border-white/5 rounded-2xl shadow-premium relative z-10"
            >
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="mb-6">
                        <img src={Logo} alt="Glow Saloon" className="h-16 w-auto object-contain brightness-0 invert" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight leading-none uppercase font-luxury">Create <span className="text-primary ">Account</span></h1>
                    <p className="text-muted text-[9px] font-bold uppercase tracking-[0.2em] mt-3 underline decoration-primary/30 underline-offset-4 decoration-2 text-center">Sign Up for Glow Saloon</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.name && formik.errors.name ? 'text-red-400' : 'text-primary/40 group-focus-within:text-primary'}`} />
                            <input
                                name="name"
                                type="text"
                                {...formik.getFieldProps('name')}
                                placeholder="Glow Customer Name"
                                className={`w-full bg-background border p-3.5 pl-11 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-muted/30 ${formik.touched.name && formik.errors.name ? 'border-red-500/50' : 'border-white/5 focus:border-primary/30'}`}
                            />
                        </div>
                        {formik.touched.name && formik.errors.name && (
                            <div className="flex items-center gap-1.5 text-red-400 text-[8px] font-black uppercase tracking-widest pl-1 mt-1">
                                <AlertCircle size={10} />
                                {formik.errors.name}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.email && formik.errors.email ? 'text-red-400' : 'text-primary/40 group-focus-within:text-primary'}`} />
                            <input
                                name="email"
                                type="email"
                                {...formik.getFieldProps('email')}
                                placeholder="contact@glowsaloon.com"
                                className={`w-full bg-background border p-3.5 pl-11 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-muted/30 ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : 'border-white/5 focus:border-primary/20'}`}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <div className="flex items-center gap-1.5 text-red-400 text-[8px] font-black uppercase tracking-widest pl-1 mt-1">
                                <AlertCircle size={10} />
                                {formik.errors.email}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.password && formik.errors.password ? 'text-red-400' : 'text-primary/40 group-focus-within:text-primary'}`} />
                            <input
                                name="password"
                                type="password"
                                {...formik.getFieldProps('password')}
                                placeholder="••••••••"
                                className={`w-full bg-background border p-3.5 pl-11 rounded-2xl outline-none transition-all font-bold text-white ${formik.touched.password && formik.errors.password ? 'border-red-500/50' : 'border-white/5 focus:border-primary/20'}`}
                            />
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <div className="flex items-center gap-1.5 text-red-400 text-[8px] font-black uppercase tracking-widest pl-1 mt-1">
                                <AlertCircle size={10} />
                                {formik.errors.password}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 mt-2 bg-primary text-secondary rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-premium hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? 'Creating Account...' : (
                            <>
                                Create Account
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center flex flex-col gap-4">
                    <div className="h-[1px] w-full bg-white/5" />
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                        Already have an account?
                        <Link to="/login" className="text-primary ml-2 hover:underline decoration-2">Log In</Link>
                    </p>
                </div>

                <p className="mt-10 text-center text-[8px] font-black text-muted uppercase tracking-[0.3em] leading-relaxed">
                    Glow Saloon <br /> Customer Registration
                </p>
            </motion.div>
        </div>
    );
}

