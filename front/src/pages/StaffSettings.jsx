import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
    User, Mail, Phone, Shield, Save, Fingerprint, Edit3, 
    Camera, Loader2, Key, ShieldCheck, Lock, CheckCircle2,
    Eye, EyeOff
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AdminHeader from '../components/ui/AdminHeader';
import { updateProfile } from '../redux/slices/authSlice';
import { IMAGE_URL } from '../utils/BASE_URL';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function StaffSettings() {
    const dispatch = useDispatch();
    const { userInfo: user } = useSelector((state) => state.auth);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [preview, setPreview] = useState(null);
    const [passwordLoading, setPasswordLoading] = useState(false);  
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const fileInputRef = useRef(null);

    // Profile Formik
    const profileFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: user?.name || '',
            email: user?.email || '',
            phone: (user?.phone ? user.phone.replace('+1 ', '') : '') || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Full name is required'),
            phone: Yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, 'Must be 10 digits (XXX-XXX-XXXX)').required('Phone number is required'),
        }),
        onSubmit: async (values) => {
            setUpdating(true);
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('phone', `+1 ${values.phone}`);
            if (fileInputRef.current?.files[0]) {
                formData.append('image', fileInputRef.current.files[0]);
            }

            const result = await dispatch(updateProfile(formData));
            setUpdating(false);
            if (!result.error) {
                setIsEditing(false);
                setPreview(null);
                toast.success('Profile updated successfully');
            }
        },
    });

    const handlePhoneChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 10);
        if (val.length > 6) {
            val = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`;
        } else if (val.length > 3) {
            val = `${val.slice(0, 3)}-${val.slice(3)}`;
        }
        profileFormik.setFieldValue('phone', val);
    };


    // Password Formik
    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            currentPassword: user?.hasPassword ? Yup.string().required('Current password is required') : Yup.string(),
            newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
                .required('Please confirm your password'),
        }),
        onSubmit: async (values, { resetForm }) => {
            setPasswordLoading(true);
            try {
                await api.put('/auth/change-password', values);
                toast.success('Password updated successfully');
                resetForm();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to update password');
            } finally {
                setPasswordLoading(false);
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

    return (
        <div className="space-y-6 md:space-y-12">
            <AdminHeader 
                title="My Profile"
                subtitle="Manage your profile and account security"
                icon={ShieldCheck}
                rightContent={
                    isEditing && (
                        <button
                            onClick={profileFormik.handleSubmit}
                            className="flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury disabled:opacity-50"
                            disabled={updating}
                        >
                            {updating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} md:size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform duration-300" />}
                            <span className="whitespace-nowrap">Save Profile</span>
                        </button>
                    )
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Profile */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-secondary p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                        
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 pb-8 border-b border-white/5">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="relative group cursor-pointer shrink-0" onClick={handleImageClick}>
                                    <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl p-[1px] transition-all duration-700 ${isEditing ? 'bg-luxury-gradient shadow-[0_0_30px_rgba(201,162,39,0.2)] scale-[1.02]' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                        <div className="w-full h-full rounded-2xl bg-background overflow-hidden relative border border-white/5 shadow-inner">
                                            <img
                                                src={preview ? preview : (user?.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `${IMAGE_URL}${user.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Artisan'}`)}
                                                alt="Profile"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {isEditing && (
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                                                    <Camera className="text-white " size={24} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                </div>

                                <div className="space-y-4 text-center md:text-left">
                                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter font-luxury leading-none">
                                        Staff <span className="text-primary/50">Core</span>
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                        <div className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-inner backdrop-blur-md">
                                            {user?.role || 'STAFF'}
                                        </div>
                                        <p className="text-muted/60 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Fingerprint size={14} className="text-primary/40" /> ID: {user?.customId || 'STAFF-ID'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => { setIsEditing(!isEditing); if(!isEditing) setPreview(null); }}
                                className={`flex items-center gap-3 px-8 py-2 md:py-4 rounded-lg md:rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all border group shrink-0 ${isEditing ? 'bg-background border-white/10 text-muted/40 hover:text-white' : 'bg-luxury-gradient text-secondary border-transparent shadow-lg hover:scale-105'}`}
                            >
                                <Edit3 size={16} />
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { name: 'name', label: 'Full Name', icon: User, editable: true },
                                { name: 'email', label: 'Email Address', icon: Mail, editable: false },
                                { name: 'phone', label: 'Phone Number', icon: Phone, editable: true }
                            ].map((field) => (
                                <div key={field.name} className="space-y-3">
                                    <label className="text-[10px] font-black text-muted/40 uppercase tracking-[0.3em] pl-2 flex items-center gap-2 ">
                                        <field.icon size={12} className="text-primary/40" />
                                        {field.label}
                                    </label>
                                    
                                    {field.name === 'phone' ? (
                                        <div className={`flex bg-background border transition-all duration-500 rounded-xl overflow-hidden ${isEditing && field.editable ? 'border-primary/40 shadow-inner' : 'border-white/5 opacity-40'}`}>
                                            <div className="flex items-center px-4 bg-white/5 border-r border-white/10 shrink-0">
                                                <span className={`text-[11px] font-black tracking-widest ${isEditing ? 'text-primary' : 'text-muted/60'}`}>+1</span>
                                            </div>
                                            <input
                                                {...profileFormik.getFieldProps(field.name)}
                                                onChange={handlePhoneChange}
                                                disabled={!isEditing || !field.editable}
                                                className={`w-full bg-transparent px-6 py-5 outline-none font-black text-[11px] uppercase tracking-[0.1em] ${isEditing && field.editable ? 'text-white' : 'text-muted/60 cursor-not-allowed'}`}
                                            />
                                        </div>
                                    ) : (
                                        <input
                                            {...profileFormik.getFieldProps(field.name)}
                                            disabled={!isEditing || !field.editable}
                                            className={`w-full bg-background border px-6 py-5 rounded-xl outline-none transition-all duration-500 font-black text-[11px] uppercase tracking-[0.1em] ${isEditing && field.editable ? 'border-primary/40 shadow-inner text-white' : 'border-white/5 cursor-not-allowed opacity-40 text-muted/60'}`}
                                        />
                                    )}

                                    {profileFormik.touched[field.name] && profileFormik.errors[field.name] && (
                                        <p className="text-primary/80 text-[8px] uppercase font-black tracking-widest pl-2">! Error: {profileFormik.errors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Security */}
                <div className="space-y-10">
                    <div className="bg-secondary p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/50" />
                        <h3 className="text-lg md:text-xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tighter font-luxury">
                            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-emerald-500 shadow-inner border border-white/5">
                                <Lock size={20} />
                            </div>
                            Security
                        </h3>

                        <form onSubmit={passwordFormik.handleSubmit} className="space-y-6">
                            {[
                                { name: 'currentPassword', label: 'Current Password', icon: Shield, show: user?.hasPassword },
                                { name: 'newPassword', label: 'New Password', icon: Key, show: true },
                                { name: 'confirmPassword', label: 'Confirm Password', icon: CheckCircle2, show: true }
                            ].filter(f => f.show).map((field) => (
                                <div key={field.name} className="space-y-2.5">
                                    <label className="text-[9px] font-black text-muted/40 uppercase tracking-[0.3em] pl-2 ">{field.label}</label>
                                    <div className="relative group/field">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/20 group-focus-within/field:text-emerald-500/50 transition-colors">
                                            <field.icon size={18} />
                                        </div>
                                        <input
                                            name={field.name}
                                            type={
                                                field.name === 'currentPassword' ? (showPasswords.current ? 'text' : 'password') :
                                                field.name === 'newPassword' ? (showPasswords.new ? 'text' : 'password') :
                                                (showPasswords.confirm ? 'text' : 'password')
                                            }
                                            placeholder="••••••••"
                                            onChange={passwordFormik.handleChange}
                                            onBlur={passwordFormik.handleBlur}
                                            value={passwordFormik.values[field.name]}
                                            className="w-full bg-background border border-white/5 focus:border-emerald-500/30 px-6 py-4 pl-14 pr-14 rounded-xl outline-none font-black text-white transition-all text-xs tracking-[0.4em] shadow-inner"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const key = field.name === 'currentPassword' ? 'current' : field.name === 'newPassword' ? 'new' : 'confirm';
                                                setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] });
                                            }}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted/20 hover:text-emerald-500 transition-colors"
                                        >
                                            {(field.name === 'currentPassword' ? showPasswords.current : field.name === 'newPassword' ? showPasswords.new : showPasswords.confirm) ? 
                                                <EyeOff size={18} /> : <Eye size={18} />
                                            }
                                        </button>
                                    </div>
                                    {passwordFormik.touched[field.name] && passwordFormik.errors[field.name] && (
                                        <p className="text-emerald-500/80 text-[8px] uppercase font-black tracking-widest pl-2 animate-pulse">{passwordFormik.errors[field.name]}</p>
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full py-5 bg-background border border-emerald-500/20 text-emerald-500 rounded-xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-emerald-500/5 active:scale-[0.98] flex items-center justify-center gap-4 font-luxury"
                            >
                                {passwordLoading ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={18} />}
                                UPDATE PASSWORD
                            </button>
                        </form>
                    </div>

                    <div className="bg-primary/5 p-6 md:p-8 rounded-2xl border border-primary/10 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-4">
                            <Shield className="text-primary" size={20} />
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Password Requirements</h4>
                        </div>
                        <p className="text-[10px] text-muted/60 font-bold leading-loose uppercase tracking-[0.15em]">
                            Passwords must be at least 6 characters long. For better security, use a combination of letters, numbers, and symbols.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
