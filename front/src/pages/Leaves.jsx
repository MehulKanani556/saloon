import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CalendarClock, Plus, CheckCircle2, XCircle, Clock, Search, 
    AlertCircle, FileText, User, Calendar, Trash2, Send, 
    Edit3, LayoutGrid, Timer, X 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { format, differenceInHours } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { BASE_URL } from '../utils/BASE_URL';
import Modal from '../components/ui/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AdminHeader from '../components/ui/AdminHeader';

export default function Leaves() {
    const { userInfo } = useSelector((state) => state.auth);
    const isAdmin = userInfo?.role === 'Admin';
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const endpoint = isAdmin ? '/leaves' : '/leaves/my';
            const { data } = await api.get(endpoint);
            setLeaves(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [isAdmin]);

    const formik = useFormik({
        initialValues: {
            type: 'Casual Leave',
            reason: '',
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd'),
            startTime: '09:00',
            endTime: '17:00',
            totalHours: 8
        },
        validationSchema: Yup.object({
            reason: Yup.string().required('Reason required'),
            startDate: Yup.date().required('Start date required'),
            endDate: Yup.date().min(Yup.ref('startDate'), "End date can't be before start date").required('End date required'),
            startTime: Yup.string().required('Start time required'),
            endTime: Yup.string().required('End time required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await api.post('/leaves', values);
                toast.success('Leave protocol initiated');
                setIsModalOpen(false);
                resetForm();
                fetchLeaves();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Submission failed');
            }
        }
    });

    // Auto-calculate total hours & Sync Dates
    useEffect(() => {
        if (formik.values.startDate && formik.values.endDate) {
            if (new Date(formik.values.endDate) < new Date(formik.values.startDate)) {
                formik.setFieldValue('endDate', formik.values.startDate);
            }
        }

        if (formik.values.startTime && formik.values.endTime && formik.values.startDate && formik.values.endDate) {
            const startDay = new Date(formik.values.startDate);
            const endDay = new Date(formik.values.endDate);
            const days = Math.max(1, Math.ceil((endDay - startDay) / (1000 * 60 * 60 * 24)) + 1);

            const start = new Date(`2000-01-01T${formik.values.startTime}`);
            const end = new Date(`2000-01-01T${formik.values.endTime}`);
            let hoursPerDay = (end - start) / (1000 * 60 * 60);
            if (hoursPerDay < 0) hoursPerDay += 24; 

            formik.setFieldValue('totalHours', (hoursPerDay * days).toFixed(1));
        }
    }, [formik.values.startTime, formik.values.endTime, formik.values.startDate, formik.values.endDate]);

    const handleUpdateStatus = async (status) => {
        try {
            await api.put(`/leaves/${selectedLeave._id}`, { status });
            toast.success(`Leave Status: ${status}`);
            setIsActionModalOpen(false);
            fetchLeaves();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Status update failed');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    const filteredLeaves = leaves.filter(l => 
        l.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.staff?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            {/* Standardized Header */}
            <AdminHeader 
                title="Leave Management"
                subtitle="Absence Request Authorization"
                icon={CalendarClock}
                rightContent={
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 w-full md:w-auto">
                        {!isAdmin && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury"
                            >
                                <Plus size={16} md:size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span className="whitespace-nowrap">Add Leave Request</span>
                            </button>
                        )}
                        <div className="relative group min-w-0 md:min-w-[300px] w-full">
                            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-muted" size={16} md:size={20} />
                            <input
                                type="text"
                                placeholder="Filter records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-secondary/40 backdrop-blur-md border border-white/5 rounded-xl md:rounded-2xl px-12 md:px-16 py-4 md:py-5 text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] outline-none text-white transition-all focus:border-primary/50 placeholder:text-white/20"
                            />
                        </div>
                    </div>
                }
            />

            {/* Content Table */}
            <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-3xl border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/80">
                                {isAdmin && <th className="px-4 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Artisan</th>}
                                <th className="px-4 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Type</th>
                                <th className="px-4 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Timeline</th>
                                <th className="px-4 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Hours</th>
                                <th className="px-4 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Status</th>
                                <th className="px-4 md:px-10 py-4 md:py-6 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-primary whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                             {filteredLeaves.map((leave, idx) => (
                                <tr key={leave._id} className="group hover:bg-white/5 transition-all outline-none border-b border-white/5 last:border-0 ">
                                    {isAdmin && (
                                        <td className="px-4 md:px-10 py-4 md:py-8 text-white font-black uppercase tracking-[0.1em] md:tracking-widest text-[9px] md:text-[10px]">
                                            {leave.staff?.name}
                                        </td>
                                    )}
                                    <td className="px-4 md:px-10 py-4 md:py-8">
                                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-primary bg-primary/5 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl whitespace-nowrap">{leave.type}</span>
                                    </td>
                                    <td className="px-4 md:px-10 py-4 md:py-8">
                                        <p className="text-[9px] md:text-[11px] font-black text-white tracking-[0.1em] md:tracking-widest whitespace-nowrap ">
                                            {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd')}
                                        </p>
                                    </td>
                                    <td className="px-4 md:px-10 py-4 md:py-8 text-[9px] md:text-[11px] font-black text-muted tracking-[0.1em] md:tracking-widest uppercase whitespace-nowrap">
                                        {leave.totalHours}H
                                    </td>
                                    <td className="px-4 md:px-10 py-4 md:py-8">
                                        <div className={`inline-flex items-center gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border text-[7px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap ${getStatusStyles(leave.status)}`}>
                                            {leave.status}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-10 py-4 md:py-8">
                                        <div className="flex justify-center">
                                            {isAdmin && leave.status === 'Pending' ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedLeave(leave);
                                                        setIsActionModalOpen(true);
                                                    }}
                                                    className="p-3 md:p-4 bg-background border border-white/5 rounded-xl md:rounded-2xl text-primary hover:text-white transition-all shadow-2xl active:scale-90"
                                                >
                                                    <CheckCircle2 size={16} md:size={18} />
                                                </button>
                                            ) : (
                                                <AlertCircle size={16} md:size={18} className="text-white/5" />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD LEAVE MODAL (Using Centralized Modal Component for Porting and Centering) */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Leave"
                subtitle="Absence Protocols Initiation"
                maxWidth="max-w-[550px]"
            >
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Reason Textarea */}
                    <div className="relative group">
                        <div className="absolute left-6 top-6 text-muted/40 group-focus-within:text-primary transition-colors">
                            <Edit3 size={18} />
                        </div>
                        <textarea
                            name="reason"
                            placeholder="Reason"
                            onChange={formik.handleChange}
                            value={formik.values.reason}
                            className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl px-16 py-6 text-sm font-medium outline-none text-white transition-all min-h-[120px] placeholder:text-white/10"
                        />
                        {formik.touched.reason && formik.errors.reason && <p className="text-rose-500 text-[10px] uppercase font-bold tracking-widest mt-2">{formik.errors.reason}</p>}
                    </div>

                    {/* Leave Type Radios */}
                    <div className="bg-background border border-white/5 rounded-xl px-4 md:px-6 py-4 md:py-5 flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4 md:gap-3">
                        {['Sick Leave', 'Casual Leave', 'Emergency Leave'].map((type) => (
                            <label key={type} className="flex items-center gap-4 md:gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center shrink-0">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type}
                                        checked={formik.values.type === type}
                                        onChange={formik.handleChange}
                                        className="appearance-none w-5 h-5 rounded-full border-2 border-white/10 checked:border-primary transition-all cursor-pointer"
                                    />
                                    {formik.values.type === type && <div className="absolute w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)]" />}
                                </div>
                                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${formik.values.type === type ? 'text-white' : 'text-muted/40 group-hover:text-white/60'}`}>{type}</span>
                            </label>
                        ))}
                    </div>

                    {/* Dates - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <div 
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-primary transition-colors cursor-pointer z-10"
                                onClick={() => startDateRef.current?.showPicker()}
                            >
                                <Calendar size={18} />
                            </div>
                            <input
                                ref={startDateRef}
                                name="startDate" type="date"
                                min={format(new Date(), 'yyyy-MM-dd')}
                                onChange={formik.handleChange} value={formik.values.startDate}
                                className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl pl-14 pr-4 py-4 text-[11px] font-black outline-none text-white transition-all uppercase tracking-wider appearance-none"
                            />
                        </div>
                        <div className="relative group">
                            <div 
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-primary transition-colors cursor-pointer z-10"
                                onClick={() => endDateRef.current?.showPicker()}
                            >
                                <Calendar size={18} />
                            </div>
                            <input
                                ref={endDateRef}
                                name="endDate" type="date"
                                min={formik.values.startDate}
                                onChange={formik.handleChange} value={formik.values.endDate}
                                className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl pl-14 pr-4 py-4 text-[11px] font-black outline-none text-white transition-all uppercase tracking-wider appearance-none"
                            />
                        </div>
                    </div>

                    {/* Times - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <div 
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-primary transition-colors cursor-pointer z-10"
                                onClick={() => startTimeRef.current?.showPicker()}
                            >
                                <Clock size={18} />
                            </div>
                            <input
                                ref={startTimeRef}
                                name="startTime" type="time"
                                onChange={formik.handleChange} value={formik.values.startTime}
                                className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl pl-14 pr-4 py-4 text-[11px] font-black outline-none text-white transition-all tracking-wider appearance-none"
                            />
                        </div>
                        <div className="relative group">
                            <div 
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-primary transition-colors cursor-pointer z-10"
                                onClick={() => endTimeRef.current?.showPicker()}
                            >
                                <Timer size={18} />
                            </div>
                            <input
                                ref={endTimeRef}
                                name="endTime" type="time"
                                onChange={formik.handleChange} value={formik.values.endTime}
                                className="w-full bg-background border border-white/5 focus:border-primary/30 rounded-xl pl-14 pr-4 py-4 text-[11px] font-black outline-none text-white transition-all tracking-wider appearance-none"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury"
                        >
                            Authorize Absence
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-8 md:px-10 py-4 md:py-5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] border border-white/5 transition-all font-luxury"
                        >
                            Discard
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Admin Action Modal */}
            <Modal
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                title="Status Authority"
                subtitle={`Verification for ${selectedLeave?.staff?.name}'s Absence`}
                maxWidth="max-w-xl"
            >
                <div className="text-center space-y-10">
                    {/* Leave Core Context */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-left group">
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-4 ">Temporal Matrix</p>
                            <p className="text-xl font-black text-white tracking-widest font-luxury uppercase leading-none mb-4">
                                {selectedLeave && format(new Date(selectedLeave.startDate), 'MMM dd')} - {selectedLeave && format(new Date(selectedLeave.endDate), 'MMM dd')}
                            </p>
                            <div className="flex items-center gap-4 text-muted/60">
                                <Clock size={16} className="text-primary/40" />
                                <span className="text-[10px] font-black tracking-[0.2em] uppercase ">
                                    {selectedLeave?.startTime} - {selectedLeave?.endTime}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-left group">
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-4 ">Quantum Impact</p>
                            <p className="text-4xl font-black text-white tracking-tighter font-luxury uppercase leading-none mb-3">
                                {(selectedLeave?.totalHours / 8).toFixed(1)} <span className="text-sm opacity-40">Days</span>
                            </p>
                            <p className="text-[9px] font-black tracking-[0.2em] text-muted/40 uppercase ">Accumulated: {selectedLeave?.totalHours} Hours</p>
                        </div>
                    </div>

                    <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-4 ">Assertion Provided</p>
                        <p className="text-sm font-black text-white tracking-widest uppercase leading-relaxed font-luxury italic">
                            "{selectedLeave?.reason}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <button
                            onClick={() => handleUpdateStatus('Approved')}
                            className="py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl shadow-emerald-500/20 active:scale-95 hover:bg-emerald-600 transition-all font-luxury "
                        >
                            APPROVE
                        </button>
                        <button
                            onClick={() => handleUpdateStatus('Rejected')}
                            className="py-5 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl shadow-rose-500/20 active:scale-95 hover:bg-rose-600 transition-all font-luxury "
                        >
                            REJECT
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
