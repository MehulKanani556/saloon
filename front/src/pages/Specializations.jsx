import React, { useState, useEffect } from 'react';
import { Scissors, Search, Plus, CheckCircle2, LayoutDashboard, X, ListPlus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { fetchCurrentUser } from '../redux/slices/authSlice';
import { fetchServices } from '../redux/slices/serviceSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { fetchSpecializationRequests, submitSpecializationRequest, updateSpecializationRequestStatus } from '../redux/slices/specializationSlice';
import AdminHeader from '../components/ui/AdminHeader';

export default function Specializations() {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const { services: allServices } = useSelector((state) => state.services);
    const { categories } = useSelector((state) => state.categories);
    const { requests, loading } = useSelector((state) => state.specializations);
    
    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isStaffAddModalOpen, setIsStaffAddModalOpen] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminReason, setAdminReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isAdmin = userInfo?.role === 'Admin';
    const hasPendingRequest = requests.some(r => r.status === 'Pending' && !isAdmin);

    useEffect(() => {
        dispatch(fetchServices());
        dispatch(fetchCategories());
        dispatch(fetchSpecializationRequests(isAdmin));
    }, [dispatch, isAdmin]);

    // Formik for Staff Request
    const formik = useFormik({
        initialValues: {
            services: [],
            bio: '',
            specialization: [],
            specInput: ''
        },
        validationSchema: Yup.object({
            services: Yup.array().min(0),
            bio: Yup.string().max(500, 'Notes are too long'),
            specialization: Yup.array().of(Yup.string().max(20, 'Skill tag too long')),
        }),
        onSubmit: async (values, { resetForm }) => {
            if (values.services.length === 0 && values.specialization.length === 0 && values.bio === '') {
                return toast.error('Please add at least one update');
            }
            
            setIsSubmitting(true);
            try {
                await dispatch(submitSpecializationRequest({ 
                    services: values.services,
                    bio: values.bio,
                    specialization: values.specialization
                })).unwrap();
                toast.success('Professional update request sent');
                setIsStaffAddModalOpen(false);
                resetForm();
            } catch (error) {
                toast.error(error || 'Submission failed');
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    const handleToggleService = (serviceId) => {
        const currentServices = formik.values.services;
        if (currentServices.includes(serviceId)) {
            formik.setFieldValue('services', currentServices.filter(id => id !== serviceId));
        } else {
            formik.setFieldValue('services', [...currentServices, serviceId]);
        }
    };

    const handleAddSpec = (e) => {
        if (e.key === 'Enter' && formik.values.specInput.trim()) {
            e.preventDefault();
            const tag = formik.values.specInput.trim();
            if (!/^[a-zA-Z0-9\s]+$/.test(tag)) {
                return toast.error('Alphanumeric characters only');
            }
            if (tag.length > 20) {
                return toast.error('Skill name is too long');
            }
            if (!formik.values.specialization.includes(tag)) {
                formik.setFieldValue('specialization', [...formik.values.specialization, tag]);
            }
            formik.setFieldValue('specInput', '');
        }
    };

    const removeSpec = (tag) => {
        formik.setFieldValue('specialization', formik.values.specialization.filter(s => s !== tag));
    };

    const handleAdminAction = async (requestId, status) => {
        try {
            await dispatch(updateSpecializationRequestStatus({ id: requestId, status, adminReason })).unwrap();
            toast.success(`Request ${status}`);
            setIsActionModalOpen(false);
            setAdminReason('');
            if (status === 'Approved') {
                dispatch(fetchCurrentUser());
            }
        } catch (error) {
            toast.error(error || 'Failed to process request');
        }
    };

    // Filter logic
    const filteredServices = allServices.filter(s => {
        const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || s.category?._id === selectedCategory || s.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getNewServices = (req) => {
        if (!req || !req.staff?.services) return req?.services || [];
        const currentServiceIds = req.staff.services.map(s => s._id || s);
        return req.services?.filter(s => !currentServiceIds.includes(s._id || s)) || [];
    };

    const filteredRequests = isAdmin 
    ? requests.filter(r => {
        const matchesSearch = r.staff?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.status?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    })
    : requests;

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 md:space-y-12 pb-20">
            <AdminHeader 
                title="Profile & Skills"
                subtitle="Manage your professional services and expertise"
                icon={Scissors}
                rightContent={
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full lg:w-auto">
                        {!isAdmin && (
                            <button
                                onClick={() => setIsStaffAddModalOpen(true)}
                                disabled={hasPendingRequest}
                                className={`flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl transition-all group font-luxury ${hasPendingRequest ? 'bg-secondary text-muted cursor-not-allowed border border-white/5' : 'bg-primary text-secondary shadow-primary/20 hover:scale-[1.05]'}`}
                            >
                                <Plus size={16} md:size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span className="whitespace-nowrap">{hasPendingRequest ? 'REQUEST PENDING' : 'UPDATE SKILLS'}</span>
                            </button>
                        )}
                        <div className="relative group w-full lg:min-w-[300px]">
                            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={16} md:size={20} />
                            <input
                                type="text"
                                placeholder={isAdmin ? "Search requests..." : "Search services..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-secondary/40 backdrop-blur-md border border-white/5 rounded-xl md:rounded-2xl px-12 md:px-16 py-3.5 md:py-5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] outline-none focus:border-primary/50 shadow-3xl transition-all text-white placeholder:text-white/10"
                            />
                        </div>
                    </div>
                }
            />

            {!isAdmin && (
                <div className="space-y-4 md:space-y-8">
                    <div className="flex items-center justify-between">
                         <div>
                            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter font-luxury">Current Services</h3>
                            <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1">Confirmed on your professional profile</p>
                        </div>
                    </div>
                    
                    {userInfo?.specialization?.length > 0 && (
                        <div className="flex flex-wrap gap-2 md:gap-3 pb-2 md:pb-4">
                            {userInfo.specialization.map(tag => (
                                <span key={tag} className="px-3 md:px-5 py-1.5 md:py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest ">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                        {userInfo?.services?.map((service) => (
                            <div key={service._id} className="relative p-5 md:p-8 rounded-xl md:rounded-2xl border border-white/5 bg-secondary/30 backdrop-blur-sm overflow-hidden group">
                                <div className="relative z-10 flex flex-col gap-3 md:gap-6 ">
                                    <div className="flex justify-between items-start">
                                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center bg-background border border-white/5 text-primary">
                                            <Scissors size={16} md:size={20} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 md:px-4 py-1 md:py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg md:rounded-xl text-[7px] md:text-[9px] font-black uppercase tracking-widest ">
                                            <CheckCircle2 size={10} md:size={12} /> ACTIVE
                                        </div>
                                    </div>
                                    <div className="min-w-0 pr-2">
                                        <p className="text-[7px] md:text-[9px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1 md:mb-2 ">{service.category?.name || 'Category'}</p>
                                        <h3 className="text-sm md:text-lg font-black text-white font-luxury uppercase tracking-tight truncate md:whitespace-normal">{service.name}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Request History */}
            <div className="bg-secondary/30 backdrop-blur-md rounded-2xl border border-white/5 shadow-3xl overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter font-luxury">Request History</h3>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mt-1">Logs of your profile updates</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background/80">
                                <th className="px-4 md:px-10 py-3.5 md:py-5 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Member</th>
                                <th className="px-4 md:px-10 py-3.5 md:py-5 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap md:table-cell hidden">Details</th>
                                <th className="px-4 md:px-10 py-3.5 md:py-5 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Services</th>
                                <th className="px-4 md:px-10 py-3.5 md:py-5 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Status</th>
                                <th className="px-4 md:px-10 py-3.5 md:py-5 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRequests.map(req => {
                                const newServices = getNewServices(req);
                                return (
                                    <tr key={req._id} className="hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0">
                                        <td className="px-4 md:px-10 py-4 md:py-6">
                                            {isAdmin ? (
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl overflow-hidden border border-white/5 shrink-0">
                                                        <img src={req.staff?.profileImage ? (req.staff.profileImage.startsWith('http') ? req.staff.profileImage : `http://localhost:5000/uploads/profile pic/${req.staff.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.staff?.name}`} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" />
                                                    </div>
                                                    <div className="min-w-0 pr-2">
                                                        <span className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest truncate block">{req.staff?.name}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl overflow-hidden border border-white/5 bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                        <LayoutDashboard size={14} md:size={18} />
                                                    </div>
                                                    <span className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest">Profile Update</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-10 py-4 md:py-6 md:table-cell hidden">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">+{newServices.length} NEW SERVICES</span>
                                                <p className="text-[10px] font-black text-muted uppercase tracking-widest leading-relaxed line-clamp-1 max-w-[200px]"> "{req.bio || 'General update'}" </p>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-10 py-4 md:py-6">
                                            <span className="text-[9px] md:text-[10px] font-black text-primary/60 uppercase tracking-widest whitespace-nowrap">{req.services?.length} SERVICES</span>
                                        </td>
                                        <td className="px-4 md:px-10 py-4 md:py-6">
                                            <div className={`inline-flex px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : req.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                {req.status}
                                            </div>
                                            {req.status === 'Rejected' && req.adminReason && (
                                                <p className="text-[8px] text-rose-500 font-bold tracking-widest mt-1.5 uppercase truncate max-w-[100px]">{req.adminReason}</p>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-10 py-4 md:py-6 text-center">
                                            {isAdmin && req.status === 'Pending' ? (
                                                <button onClick={() => { setSelectedRequest(req); setIsActionModalOpen(true); }} className="p-2.5 md:p-3 bg-primary text-secondary rounded-lg md:rounded-xl hover:scale-110 transition-transform shadow-premium">
                                                    <LayoutDashboard size={14} md:size={18} />
                                                </button>
                                            ) : <p className="text-[8px] md:text-[9px] font-black text-muted/20 uppercase tracking-widest">Processed</p>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Request Updates */}
            {isStaffAddModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-12">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsStaffAddModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-secondary relative z-20 w-full max-w-4xl rounded-xl md:rounded-3xl border border-white/5 shadow-3xl overflow-hidden p-6 md:p-12 flex flex-col max-h-[92vh]">
                        <div className="flex items-center justify-between mb-8 md:mb-12 shrink-0">
                            <div className="min-w-0 pr-4">
                                <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter font-luxury truncate md:whitespace-normal">Update Profile</h3>
                                <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.4em] mt-2 md:mt-3">Request to add services or expertise to your profile</p>
                            </div>
                            <button onClick={() => setIsStaffAddModalOpen(false)} className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/5 text-muted hover:text-white transition-all shrink-0"><X size={18} md:size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 pb-8">
                                <div className="lg:col-span-3 space-y-8">
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => setSelectedCategory('all')} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedCategory === 'all' ? 'bg-primary text-secondary border-primary shadow-xl shadow-primary/20' : 'bg-background text-muted border-white/5 hover:border-white/20'}`}>ALL</button>
                                        {categories.map(cat => (
                                            <button key={cat._id} onClick={() => setSelectedCategory(cat._id)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedCategory === cat._id ? 'bg-primary text-secondary border-primary shadow-xl shadow-primary/20' : 'bg-background text-muted border-white/5 hover:border-white/20'}`}>{cat.name}</button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {filteredServices.map(service => {
                                            const isSelected = formik.values.services.includes(service._id);
                                            const isAlreadyApproved = userInfo?.services?.some(s => (s._id || s) === service._id);
                                            return (
                                                <div 
                                                    key={service._id} 
                                                    onClick={() => !isAlreadyApproved && handleToggleService(service._id)}
                                                    className={`p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${isAlreadyApproved ? 'bg-emerald-500/5 border-emerald-500/10 cursor-not-allowed opacity-40' : isSelected ? 'bg-primary/10 border-primary ring-1 ring-primary shadow-xl shadow-primary/10 cursor-pointer' : 'bg-background border-white/5 hover:border-primary/20 cursor-pointer'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-secondary' : 'bg-secondary text-muted'}`}>
                                                            <Scissors size={16} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-black text-white uppercase tracking-widest">{service.name}</span>
                                                            <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.4em]">${service.price}</span>
                                                        </div>
                                                    </div>
                                                    {isAlreadyApproved && <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded text-[7px] font-black uppercase tracking-widest">Active</div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="lg:col-span-2 space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-primary bg-primary/10 px-6 py-4 rounded-2xl border border-primary/20 border-dashed ">
                                            <ListPlus size={20} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{formik.values.services.length} Services Selected</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] leading-none mb-3 font-luxury">Professional Notes</p>
                                        <textarea 
                                            {...formik.getFieldProps('bio')}
                                            placeholder="Briefly describe your update..."
                                            className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-2xl px-6 py-6 text-xs font-bold outline-none transition-all text-white shadow-inner placeholder:text-white/5 resize-none min-h-[180px]"
                                        />
                                        {formik.touched.bio && formik.errors.bio && <p className="text-rose-500 text-[8px] font-black uppercase tracking-widest">{formik.errors.bio}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] leading-none mb-3 font-luxury">Additional Expertise</p>
                                        <div className="flex flex-wrap gap-3 mb-4">
                                            {formik.values.specialization.map(tag => (
                                                <span key={tag} className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-[8px] font-black uppercase tracking-widest">
                                                    {tag} <X size={10} className="cursor-pointer hover:text-white" onClick={() => removeSpec(tag)} />
                                                </span>
                                            ))}
                                        </div>
                                        <input 
                                            type="text"
                                            {...formik.getFieldProps('specInput')}
                                            onKeyDown={handleAddSpec}
                                            placeholder="Add skill... (Press Enter)"
                                            className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-4 md:px-6 py-3.5 md:py-4 text-[10px] font-black uppercase tracking-widest outline-none transition-all text-white shadow-inner placeholder:text-white/5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 md:pt-10 border-t border-white/5 mt-auto shrink-0">
                            <button 
                                onClick={formik.handleSubmit}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury disabled:opacity-50"
                            > 
                                <span className="whitespace-nowrap">{isSubmitting ? 'SENDING...' : 'SEND REQUEST'}</span>
                                <Sparkles size={16} md:size={18} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Admin Modal */}
            {isAdmin && isActionModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-12">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsActionModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-secondary relative z-20 w-full max-w-2xl rounded-xl md:rounded-3xl border border-white/5 shadow-3xl overflow-hidden p-6 md:p-12 flex flex-col max-h-[92vh]">
                        <div className="flex items-center justify-between mb-8 md:mb-12 shrink-0">
                            <div className="min-w-0 pr-4">
                                <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter font-luxury truncate md:whitespace-normal">Review Request</h3>
                                <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.4em] mt-2 md:mt-3">Processing update for {selectedRequest.staff?.name}</p>
                            </div>
                            <button onClick={() => setIsActionModalOpen(false)} className="p-2 md:p-4 rounded-xl md:rounded-2xl bg-white/5 text-muted hover:text-white transition-all shrink-0"><X size={18} md:size={20} /></button>
                        </div>
                        <div className="flex-1 space-y-8 md:space-y-12 overflow-y-auto custom-scrollbar">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-4 ">Staff Note</p>
                                <div className="flex items-start gap-4">
                                     <div className="flex-1 space-y-2">
                                        <p className="text-sm font-black text-white italic font-luxury leading-relaxed uppercase tracking-widest">"{selectedRequest.bio || 'General update'}"</p>
                                     </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2 ">New Services</p>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black">+{getNewServices(selectedRequest).length} Services</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {getNewServices(selectedRequest).map(s => (
                                        <div key={s._id} className="flex items-center gap-4 p-5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-in slide-in-from-bottom-2 duration-500">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-500 text-secondary flex items-center justify-center">
                                                <Scissors size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-white uppercase tracking-widest">{s.name}</span>
                                                <span className="text-[8px] font-black text-emerald-500/70 uppercase tracking-widest">NEW SKILL</span>
                                            </div>
                                        </div>
                                    ))}
                                    {getNewServices(selectedRequest).length === 0 && (
                                        <div className="col-span-full py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                                            <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em]">No new services</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[9px] font-black text-muted uppercase tracking-[0.4em] pl-2">Feedback (Optional)</p>
                                <textarea value={adminReason} onChange={(e) => setAdminReason(e.target.value)} placeholder="Add feedback for the staff..." className="w-full bg-background/50 border border-white/5 rounded-xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none text-white transition-all placeholder:text-white/5 resize-none min-h-[100px]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-white/5 mt-auto shrink-0">
                            <button onClick={() => handleAdminAction(selectedRequest._id, 'Approved')} className="py-4 md:py-5 bg-emerald-500 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] shadow-xl shadow-emerald-500/20 active:scale-95 font-luxury"> Approve </button>
                            <button onClick={() => handleAdminAction(selectedRequest._id, 'Rejected')} className="py-4 md:py-5 bg-rose-500 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] shadow-xl shadow-rose-500/20 active:scale-95 font-luxury"> Reject </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
