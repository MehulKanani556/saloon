import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { signupAdmin } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    email: Yup.string()
        .email('Please enter a valid business email')
        .required('Email identity is strictly required'),
    password: Yup.string()
        .min(6, 'Passkey must be at least 6 characters')
        .required('Authorization passkey is required'),
});

export default function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { adminInfo, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        if (adminInfo) {
            navigate('/');
        }
    }, [adminInfo, navigate]);

    const formik = useFormik({
        initialValues: { name: '', email: '', password: '' },
        validationSchema,
        onSubmit: (values) => {
            dispatch(signupAdmin(values));
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-luxury-gradient p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-saloon-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rosegold-100/30 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-lg p-10 border-white/60 shadow-premium relative z-10"
            >
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-saloon-500 to-rosegold-400 p-0.5 shadow-md mb-4">
                        <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center">
                            <Sparkles size={28} className="text-saloon-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">JOIN THE ELITE</h1>
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-3 underline decoration-saloon-100 underline-offset-4 decoration-2">Create Admin Profile</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.name && formik.errors.name ? 'text-red-400' : 'text-slate-300 group-focus-within:text-saloon-400'}`} />
                            <input
                                name="name"
                                type="text"
                                {...formik.getFieldProps('name')}
                                placeholder="Glow Saloon Admin"
                                className={`w-full bg-white/50 border p-3.5 pl-11 rounded-2xl outline-none focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 ${formik.touched.name && formik.errors.name ? 'border-red-200' : 'border-white focus:border-saloon-200'}`}
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
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
                        <div className="relative group">
                            <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.email && formik.errors.email ? 'text-red-400' : 'text-slate-300 group-focus-within:text-saloon-400'}`} />
                            <input
                                name="email"
                                type="email"
                                {...formik.getFieldProps('email')}
                                placeholder="contact@glowsaloon.com"
                                className={`w-full bg-white/50 border p-3.5 pl-11 rounded-2xl outline-none focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 ${formik.touched.email && formik.errors.email ? 'border-red-200' : 'border-white focus:border-saloon-200'}`}
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
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Passkey</label>
                        <div className="relative group">
                            <Lock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.password && formik.errors.password ? 'text-red-400' : 'text-slate-300 group-focus-within:text-saloon-400'}`} />
                            <input
                                name="password"
                                type="password"
                                {...formik.getFieldProps('password')}
                                placeholder="••••••••"
                                className={`w-full bg-white/50 border p-3.5 pl-11 rounded-2xl outline-none focus:bg-white transition-all font-bold text-slate-700 ${formik.touched.password && formik.errors.password ? 'border-red-200' : 'border-white focus:border-saloon-200'}`}
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
                        className={`w-full py-4 mt-2 bg-gradient-to-r from-saloon-500 to-rosegold-500 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-premium hover:shadow-saloon-200 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? 'Creating Profile...' : (
                            <>
                                Establish Identity
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Already have an identity? 
                        <Link to="/login" className="text-saloon-500 ml-2 hover:underline">Access Portal</Link>
                    </p>
                </div>

                <p className="mt-10 text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] leading-relaxed">
                    Glow Saloon Collective <br/> Global Administrative Core
                </p>
            </motion.div>
        </div>
    );
}
