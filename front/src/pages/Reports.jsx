import React, { useEffect } from 'react';
import { Download, FileText, Calendar, Database, Zap, Share2, ShieldCheck, TrendingUp, Users, DollarSign, Scissors, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../redux/slices/reportSlice';
import { format } from 'date-fns';
import AdminHeader from '../components/ui/AdminHeader';


export default function Reports() {
  const dispatch = useDispatch();
  const { reportData, loading, error } = useSelector(state => state.reports);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
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
      <AdminHeader 
        title="Business Reports"
        subtitle="View your business performance and analytics"
        icon={TrendingUp}
      />


      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Appointments', value: reportData.stats.active, icon: Database },
          { label: 'Completed Sessions', value: reportData.stats.downloads, icon: Zap },
          { label: 'Total Clients', value: reportData.stats.shared, icon: Share2 },
          { label: 'Total Revenue', value: `$${reportData.stats.archiveSize}`, icon: ShieldCheck },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-secondary p-6 rounded-2xl border border-white/5 shadow-2xl relative group hover:border-primary/20 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-xl bg-background border border-white/5 flex items-center justify-center mb-6 text-muted group-hover:bg-primary group-hover:text-secondary transition-all duration-500 shadow-inner">
              <stat.icon size={22} />
            </div>
            <h3 className="text-muted text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-3  opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</h3>
            <p className="text-3xl font-black text-white tracking-tighter  font-luxury">{stat.value}</p>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[
          { label: 'Total Revenue', value: `$${reportData.summary.totalRevenue.toLocaleString()}`, icon: DollarSign },
          { label: 'Appointments', value: reportData.summary.totalAppointments, icon: Calendar },
          { label: 'Clients', value: reportData.summary.totalClients, icon: Users },
          { label: 'Active Services', value: reportData.summary.activeServices, icon: Scissors },
          { label: 'Staff Members', value: reportData.summary.totalStaff, icon: TrendingUp },
        ].map((item, i) => (
          <div key={i} className="bg-secondary p-6 rounded-2xl border border-white/5 shadow-xl text-center">
            <item.icon size={18} className="mx-auto text-primary mb-3" />
            <p className="text-2xl font-black text-white tracking-tighter  font-luxury">{item.value}</p>
            <p className="text-[9px] font-black text-muted uppercase tracking-widest mt-1 ">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-secondary p-10 rounded-2xl shadow-2xl border border-white/5">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase  mb-10 font-luxury">Monthly Revenue</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData.monthlyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A227" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 10, fontWeight: 900 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}
                  itemStyle={{ color: '#C9A227', fontWeight: 900, fontSize: '11px' }}
                  labelStyle={{ color: '#fff', opacity: 0.5, fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A227" strokeWidth={4} fillOpacity={1} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-secondary p-10 rounded-2xl shadow-2xl border border-white/5">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase  mb-10 font-luxury">Monthly Appointments</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 10, fontWeight: 900 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}
                  itemStyle={{ color: '#C9A227', fontWeight: 900, fontSize: '11px' }}
                  labelStyle={{ color: '#fff', opacity: 0.5, fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Bar dataKey="appointments" fill="#C9A227" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-secondary rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase  font-luxury">Recent Activity Log</h3>
        </div>
        <div className="divide-y divide-white/5">
          {reportData.recentLogs.length === 0 && (
            <div className="p-16 text-center text-muted font-black uppercase tracking-widest text-[10px] ">No activity records found</div>
          )}
          {reportData.recentLogs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-8 py-6 hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-background border border-white/10 flex items-center justify-center">
                  {statusIcon(log.type)}
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight  font-luxury">{log.title}</p>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">{log.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-white  font-luxury">${log.amount.toLocaleString()}</p>
                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1">
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

