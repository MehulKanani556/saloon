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
  Brain,
  Activity,
  CalendarClock
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
import { useNavigate } from 'react-router-dom';

import AdminHeader from '../components/ui/AdminHeader';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    dispatch(fetchDashboardInsights());
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const mobileBarSize = windowWidth < 426 ? 6 : (windowWidth < 768 ? 12 : 28);

  if (loading) return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
        <Loader2 className="w-20 h-20 text-primary animate-spin relative z-10" strokeWidth={1} />
        <Brain className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      {/* Cinematic Header Section */}
      <AdminHeader
        title="Dashboard"
        subtitle="Business Overview"
        icon={Activity}
        rightContent={
          <div className="flex items-center gap-4 md:gap-8 bg-secondary/40 backdrop-blur-md px-6 md:px-10 py-4 md:py-6 rounded-2xl border border-white/5 shadow-3xl group hover:border-primary/20 transition-all duration-500 w-full md:w-auto">
            <div className="text-left">
              <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.4em] leading-none mb-2 md:mb-3 ">Total Revenue</p>
              <p className="text-2xl md:text-4xl font-black text-white tracking-tighter font-luxury leading-none group-hover:scale-105 transition-transform duration-500">
                $ {data.stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        }
      />


      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Total Clients', value: data.stats.totalClients, icon: Users, trend: '12.5%' },
          { label: 'Appointments', value: data.stats.totalAppointments, icon: CalendarCheck2, trend: '4.2%' },
          { label: 'Revenue Today', value: `$${data.stats.todayRevenue.toLocaleString()}`, icon: DollarSign, trend: '18.1%' },
          { label: 'Staff on Leave', value: data.stats.pendingLeaves || 0, icon: CalendarClock, trend: 'Absence' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-secondary rounded-2xl p-6 md:p-8 border border-white/5 shadow-3xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={64} strokeWidth={1} />
            </div>

            <div className="flex items-center justify-between relative z-10 mb-8">
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all duration-500 shadow-premium border border-white/5">
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-2xl uppercase tracking-[0.2em] ">
                <TrendingUp size={12} strokeWidth={3} />
                {stat.trend}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-muted text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-2 md:mb-3 leading-none opacity-60 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </h3>
              <p className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none font-luxury overflow-hidden truncate">{stat.value}</p>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-2 bg-secondary/30 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-white/5 shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-luxury-gradient opacity-20" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 md:mb-16 relative z-10">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase mb-2 md:mb-3 flex items-center gap-4 font-luxury">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp size={20} md:size={24} />
                </div>
                Revenue Overview
              </h3>
              <p className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-60">Overview</p>
            </div>
          </div>
          <div className="h-[200px] sm:h-[300px] md:h-[400px] w-full pr-2 md:pr-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A227" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} strokeOpacity={0.03} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  interval={windowWidth < 1024 ? 0 : 'preserveStartEnd'}
                  angle={windowWidth < 1024 ? -45 : 0}
                  textAnchor={windowWidth < 1024 ? 'end' : 'middle'}
                  height={windowWidth < 1024 ? 60 : 30}
                  tick={{ fill: '#A0A0A0', fontSize: 7, fontWeight: 900, letterSpacing: '2px' }} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 7, fontWeight: 900 }} width={30} />
                <Tooltip
                  cursor={{ stroke: '#C9A227', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(201, 162, 39, 0.2)', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '12px' }}
                  itemStyle={{ color: '#C9A227', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}
                  labelStyle={{ color: '#fff', fontWeight: 900, marginBottom: '8px', opacity: 0.5, fontSize: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A227" strokeWidth={4} md:strokeWidth={6} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-secondary/30 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-white/5 shadow-3xl relative flex flex-col">
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase mb-8 md:mb-12 font-luxury flex items-center gap-4">
            <Star className="text-primary" size={20} md:size={24} />
            Popular Services
          </h3>
          <div className="space-y-5 md:space-y-6 flex-1 max-h-[250px] md:max-h-[350px] overflow-y-auto scrollbar-hide pr-1">
            {data.categoryData.map((service, i) => (
              <div key={i} className="space-y-2 group">
                <div className="flex justify-between items-end text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-muted ">
                  <span className="text-white truncate max-w-[120px] md:max-w-[160px] group-hover:text-primary transition-colors">{service.name}</span>
                  <span className="text-primary opacity-60 group-hover:opacity-100">{service.value}%</span>
                </div>
                <div className="h-3 md:h-4 w-full bg-background rounded-full overflow-hidden p-0.5 md:p-1 shadow-inner border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${service.value}%` }}
                    transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                    className="h-full rounded-full shadow-lg relative overflow-hidden"
                    style={{ backgroundColor: service.color }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
          <div onClick={() => navigate('/admin/categories')} className="mt-6 md:mt-10 pt-6 md:pt-10 border-t border-white/5 mx-auto">
            <button className="w-full flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury">
              <span className="whitespace-nowrap">VIEW DETAILED REPORTS</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        <div className="bg-secondary/30 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/5 shadow-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between gap-6 mb-8 md:mb-12 relative z-10 leading-none">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase mb-2 md:mb-3 font-luxury">Recent Appointments</h3>
              <p className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-60">Customer bookings</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary">
              <CalendarCheck2 size={20} md:size={24} />
            </div>
          </div>
          <div className="space-y-4 md:space-y-6 relative z-10">
            {data.recentAppointments.map((app, i) => (
              <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 rounded-2xl bg-background/50 border border-white/10 group/item hover:bg-white/5 transition-all gap-4">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-secondary p-1 border border-white/5 flex items-center justify-center text-primary group-hover/item:rotate-12 transition-all duration-500">
                    <img
                      src={app.client?.profileImage ? (app.client.profileImage.startsWith('http') ? app.client.profileImage : `${IMAGE_URL}${app.client.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.client?.name || 'Client'}`}
                      className="w-full h-full rounded-xl object-cover grayscale group-hover/item:grayscale-0 transition-all"
                      alt=""
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase text-sm md:text-base tracking-tighter font-luxury leading-none group-hover/item:text-primary transition-colors">{app.client?.name}</h4>
                    <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary/40" />
                      <p className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-[0.2em]">{format(new Date(app.appointmentDate), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-3">
                  <p className="text-base md:text-lg font-black text-white font-luxury leading-none">${app.totalPrice}</p>
                  <div className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-2xl border transition-colors 
                    ${app.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      app.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                        'bg-primary/10 text-primary border-primary/20'}
                  `}>
                    {app.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary/30 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/5 shadow-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between gap-6 mb-8 md:mb-12 relative z-10 leading-none">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase mb-2 md:mb-3 font-luxury">Today's Appointments</h3>
              <p className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-60">Your bookings for today</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary text-secondary flex items-center justify-center font-black text-lg md:text-xl border-4 border-white/10 shadow-2xl font-luxury ">
              {data.upcomingAppointments.length.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="space-y-4 md:space-y-6 relative z-10">
            {data.upcomingAppointments.length > 0 ? data.upcomingAppointments.map((app, i) => (
                <motion.div
                  key={app._id}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-8 rounded-2xl bg-primary text-secondary shadow-2xl relative overflow-hidden group/appointment cursor-pointer gap-6"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/appointment:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-center gap-4 md:gap-6 relative z-10 min-w-0">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-secondary/20 backdrop-blur-xl flex items-center justify-center border border-white/20 shrink-0">
                      <Clock size={20} md:size={24} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black uppercase text-base md:text-xl font-luxury tracking-tighter leading-none mb-1 md:mb-2 truncate">{app.client?.name}</h4>
                      <p className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60 ">{format(new Date(app.appointmentDate), 'HH:mm')} APPOINTMENT</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 relative z-10 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-1">Price</p>
                      <p className="text-xl md:text-2xl font-black font-luxury tracking-tighter leading-none">${app.totalPrice}</p>
                    </div>
                    <ArrowRight size={20} md:size={24} strokeWidth={2.5} className="opacity-20 group-hover/appointment:opacity-100 transition-all -translate-x-4 group-hover/appointment:translate-x-0 hidden sm:block" />
                  </div>
                </motion.div>
            )) : (
              <div className="py-16 md:py-24 text-center border-2 border-dashed border-white/5 rounded-2xl bg-background/30">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={24} md:size={32} className="text-white/10" strokeWidth={1} />
                </div>
                <p className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-[0.5em] ">No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-secondary/30 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-white/5 shadow-3xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-luxury-gradient opacity-10" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 md:mb-16 relative z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase mb-2 md:mb-3 flex items-center gap-4 font-luxury">
              <Activity className="text-primary" size={20} md:size={24} />
              Busy Hours
            </h3>
            <p className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-60">Salon activity by hour</p>
          </div>
        </div>
        <div className="h-[250px] md:h-[350px] w-full pr-2 md:pr-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.occupancyData} margin={{ bottom: windowWidth < 1024 ? 20 : 0 }}>
              <CartesianGrid strokeDasharray="8 8" vertical={false} strokeOpacity={0.03} />
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                interval={windowWidth < 768 ? 2 : 'preserveStartEnd'}
                angle={windowWidth < 1024 ? -45 : 0}
                textAnchor={windowWidth < 1024 ? 'end' : 'middle'}
                height={windowWidth < 1024 ? 50 : 30}
                tick={{ fill: '#A0A0A0', fontSize: 7, fontWeight: 900, letterSpacing: '1px' }} 
              />
              <Tooltip
                cursor={{ fill: 'rgba(201, 162, 39, 0.03)', radius: 8 }}
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', color: '#fff', padding: '8px' }}
                itemStyle={{ color: '#C9A227', fontWeight: 900, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '1px' }}
              />
              <Bar dataKey="intensity" radius={[4, 4, 4, 4]} barSize={mobileBarSize}>
                {data.occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.intensity > 0 ? '#C9A227' : 'rgba(255,255,255,0.1)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


