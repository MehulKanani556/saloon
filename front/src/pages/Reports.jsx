import React, { useEffect } from 'react';
import { Download, FileText, Calendar, Database, Zap, Share2, ShieldCheck, TrendingUp, Users, DollarSign, Scissors, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReportIntel } from '../redux/slices/reportSlice';
import { format } from 'date-fns';

export default function Reports() {
  const dispatch = useDispatch();
  const { intel, loading, error } = useSelector(state => state.reports);

  useEffect(() => {
    dispatch(fetchReportIntel());
  }, [dispatch]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-saloon-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-[60vh]">
      <p className="text-red-500 font-black uppercase tracking-widest text-sm">{error}</p>
    </div>
  );

  const statusIcon = (type) => {
    if (type === 'completed') return <CheckCircle size={14} className="text-green-500" />;
    if (type === 'cancelled') return <XCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-amber-500" />;
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-tight italic">Business Intelligence</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Operational audit and growth analytics vault</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Appointments', value: intel.stats.active, icon: Database, color: 'saloon' },
          { label: 'Completed Sessions', value: intel.stats.downloads, icon: Zap, color: 'blue' },
          { label: 'Total Clients', value: intel.stats.shared, icon: Share2, color: 'green' },
          { label: 'Revenue Vault', value: `$${intel.stats.archiveSize}`, icon: ShieldCheck, color: 'orange' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-50 dark:border-white/5 shadow-2xl relative group hover:translate-y-[-4px] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-8 text-slate-400 group-hover:bg-saloon-600 group-hover:text-white transition-all duration-500">
              <stat.icon size={26} />
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-3 italic">{stat.label}</h3>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[
          { label: 'Total Revenue', value: `$${intel.summary.totalRevenue.toLocaleString()}`, icon: DollarSign },
          { label: 'Appointments', value: intel.summary.totalAppointments, icon: Calendar },
          { label: 'Clients', value: intel.summary.totalClients, icon: Users },
          { label: 'Active Services', value: intel.summary.activeServices, icon: Scissors },
          { label: 'Staff Members', value: intel.summary.totalStaff, icon: TrendingUp },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-50 dark:border-white/5 shadow-xl text-center">
            <item.icon size={18} className="mx-auto text-saloon-500 mb-3" />
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">{item.value}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-50 dark:border-white/5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-10">Monthly Revenue</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intel.monthlyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', padding: '16px' }}
                  itemStyle={{ color: '#f59e0b', fontWeight: 900, fontSize: '11px' }}
                  labelStyle={{ color: '#fff', opacity: 0.5, fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-2xl border border-slate-50 dark:border-white/5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-10">Monthly Appointments</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intel.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', padding: '16px' }}
                  itemStyle={{ color: '#6366f1', fontWeight: 900, fontSize: '11px' }}
                  labelStyle={{ color: '#fff', opacity: 0.5, fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Bar dataKey="appointments" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-50 dark:border-white/5 overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-white/5">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Recent Activity Log</h3>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-white/5">
          {intel.recentLogs.length === 0 && (
            <div className="p-16 text-center text-slate-400 font-black uppercase tracking-widest text-[10px] italic">No activity records found</div>
          )}
          {intel.recentLogs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-8 py-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  {statusIcon(log.type)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight italic">{log.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{log.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 dark:text-white italic">${log.amount.toLocaleString()}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {log.date ? format(new Date(log.date), 'MMM dd, yyyy') : '—'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
