import React, { useState, useEffect } from 'react';
import {
  Users,
  CalendarCheck2,
  DollarSign,
  TrendingUp,
  Scissors,
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
  ArrowRight,
  Loader2,
  Brain
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardInsights } from '../redux/slices/dashboardSlice';
import toast from 'react-hot-toast';
import { IMAGE_URL } from '../utils/BASE_URL';
import { format, formatDistanceToNow, isToday } from 'date-fns';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardInsights());
  }, [dispatch]);

  if (loading) return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-saloon-600 animate-spin" />
        <Brain className="w-6 h-6 text-saloon-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-12">
      {/* Cinematic Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 pt-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none italic drop-shadow-sm">Business Summary</h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1 h-3 bg-green-500 rounded-full"
                />
              ))}
            </div>
            <p className="text-slate-400 font-bold text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] italic">Glow & Elegance Live Status | Connected</p>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden lg:block h-12 w-[1px] bg-slate-100 dark:bg-white/10" />
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 md:mb-3 italic">Total Collection</p>
            <p className="text-2xl sm:text-3xl font-black text-saloon-600 tracking-tighter italic">$ {data.stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Industrial Matrix Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Total Customers', value: data.stats.totalClients, icon: Users, color: 'saloon', trend: '12.5%' },
          { label: 'Total Bookings', value: data.stats.totalAppointments, icon: CalendarCheck2, color: 'blue', trend: '4.2%' },
          { label: 'Today Collections', value: `$${data.stats.todayRevenue.toLocaleString()}`, icon: DollarSign, color: 'green', trend: '18.1%' },
          { label: 'Active Services', value: data.stats.activeServices, icon: Scissors, color: 'indigo', trend: '2.0%' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-50 dark:border-white/5 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500"
          >
            <div className="flex items-start justify-between relative z-10 mb-6 md:mb-8">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-saloon-500 group-hover:text-white transition-all duration-500 shadow-sm underline-pink`}>
                <stat.icon size={22} md:size={26} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] font-black ${stat.color === 'red' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-green-500 bg-green-500/10 border-green-500/20'} px-3 py-1.5 rounded-full uppercase tracking-widest border`}>
                <TrendingUp size={14} />
                {stat.trend}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-slate-400 dark:text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3 italic">
                {stat.label}
              </h3>
              <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-50 dark:border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-saloon-600" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 md:mb-16">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2 italic flex items-center gap-3">
                <TrendingUp className="text-saloon-500" />
                Earnings Report
              </h3>
              <p className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] italic">Sales Growth | Success Graph</p>
            </div>
          </div>
          <div className="h-[250px] sm:h-[300px] md:h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.financialVelocity}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#E2E8F0" strokeOpacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                <Tooltip
                  cursor={{ stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '20px' }}
                  itemStyle={{ color: '#f59e0b', fontWeight: 900, textTransform: 'uppercase', fontSize: '12px', fontStyle: 'italic' }}
                  labelStyle={{ color: '#fff', fontWeight: 900, marginBottom: '8px', opacity: 0.5, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-50 dark:border-white/5 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-8 md:mb-10 italic">Popular Services</h3>
            <div className="space-y-6 md:space-y-8 max-h-[642px] overflow-y-auto custom-scrollbar pr-2">
              {data.serviceHierarchy.map((service, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                    <span className="text-slate-700 dark:text-white uppercase truncate max-w-[150px]">{service.name}</span>
                    <span>{service.value}% Intensity</span>
                  </div>
                  <div className="h-3 md:h-4 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-[2px] md:p-[3px] shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${service.value}%` }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className="h-full rounded-full shadow-lg"
                      style={{ backgroundColor: service.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-50 dark:border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 md:mb-12 relative z-10">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2 italic">Previous Bookings</h3>
              <p className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] italic">Recent customer visits</p>
            </div>
          </div>
          <div className="space-y-4 md:space-y-6 relative z-10">
            {data.recentBookings.map((app, i) => (
              <div key={app._id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/50 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-saloon-500/10 flex items-center justify-center text-saloon-500">
                    <CalendarCheck2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white uppercase text-[11px] tracking-tighter italic">{app.client?.name}</h4>
                    <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{format(new Date(app.appointmentDate), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900 dark:text-white italic">${app.totalPrice}</p>
                  <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${app.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    app.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      app.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-50 dark:border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 md:mb-12 relative z-10">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2 italic">Today's Bookings</h3>
              <p className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] italic">Customers arriving today</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-saloon-500/10 flex items-center justify-center text-saloon-500 font-black text-sm border border-saloon-500/20 shadow-inner">
              {data.upcomingRituals.length}
            </div>
          </div>
          <div className="space-y-4 md:space-y-6 relative z-10">
            {data.upcomingRituals.length > 0 ? data.upcomingRituals.map((app, i) => (
              <div key={app._id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-900 shadow-xl group hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-slate-900/10 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-[11px] tracking-tighter italic">{app.client?.name}</h4>
                    <p className="text-[10px] font-black mt-1 opacity-60 italic">{format(new Date(app.appointmentDate), 'HH:mm')} PROTOCOL</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Magnitude</p>
                    <p className="text-sm font-black italic">${app.totalPrice}</p>
                  </div>
                  <ArrowRight size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )) : (
              <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem]">
                <CheckCircle2 size={32} className="mx-auto text-saloon-500/30 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No pending masterpieces today</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-50 dark:border-white/5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 md:mb-16">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2 italic">Busy Hours</h3>
            <p className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] italic">Peak footfall analysis</p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.occupancyTrends}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
              <Tooltip
                cursor={{ fill: 'rgba(245, 158, 11, 0.05)' }}
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                itemStyle={{ color: '#f59e0b', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
              />
              <Bar dataKey="intensity" radius={[4, 4, 0, 0]} barSize={24}>
                {data.occupancyTrends.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.intensity > 1 ? '#f59e0b' : '#6366f1'} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
