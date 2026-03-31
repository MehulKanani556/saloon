import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target, Wallet, CreditCard, ChevronRight, X, AlertCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFinancialMatrix, processWithdrawal } from '../redux/slices/salesSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../components/ui/Modal';

export default function Sales() {
  const dispatch = useDispatch();
  const { matrix, loading } = useSelector(state => state.sales);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchFinancialMatrix());
  }, [dispatch]);

  const withdrawalFormik = useFormik({
    initialValues: {
      amount: '',
      bankAccount: '',
      notes: ''
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required('Amount required')
        .min(10, 'Minimum withdrawal $10')
        .max(matrix.totalRevenue || 0, 'Insufficient vault balance'),
      bankAccount: Yup.string()
        .required('Bank tether required')
        .matches(/^[0-9]+$/, 'Invalid digital sequence (Numeric only)'),
      notes: Yup.string().max(100, 'Keep it concise')
    }),
    onSubmit: async (values) => {
      const result = await dispatch(processWithdrawal({
        amount: values.amount,
        bankAccount: values.bankAccount,
        notes: values.notes
      }));
      if (!result.error) {
        setIsWithdrawModalOpen(false);
        withdrawalFormik.resetForm();
      }
    }
  });

  if (loading && !matrix.chartData.length) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-6 relative z-10 transition-all">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-primary shadow-glass shrink-0 transition-transform hover:rotate-6">
            <Wallet size={24} md:size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase leading-tight italic font-luxury">Financial Matrix</h1>
            <p className="text-muted font-bold text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.25em] mt-2 opacity-70 group-hover:opacity-100 transition-opacity whitespace-normal">Real-time audit of saloon revenue ecosystems</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3 lg:px-10 lg:py-5 bg-primary text-secondary lg:rounded-2xl rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group"
          >
            <Plus size={20} />
            Withdrawal Protocol
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Net Vault Revenue', value: `$${matrix.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.4%' },
          { label: 'Daily Momentum', value: `$${Math.round(matrix.dailyAvg).toLocaleString()}`, icon: TrendingUp, trend: '+8.4%' },
          { label: 'Growth Trajectory', value: `${matrix.growth}%`, icon: Target, trend: '+2.1%' },
        ].map((stat, i) => (
          <div key={i} className="bg-secondary p-6 md:p-8 rounded-2xl border border-white/5 shadow-2xl relative group hover:scale-[1.02] transition-transform overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-background flex items-center justify-center text-muted group-hover:bg-primary group-hover:text-secondary transition-all duration-500 shadow-inner border border-white/5">
                <stat.icon size={24} md:size={28} />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-primary px-3 py-1.5 rounded-full uppercase tracking-widest bg-primary/10 border border-primary/20">
                <TrendingUp size={14} />
                {stat.trend}
              </div>
            </div>
            <h3 className="text-muted text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-3 italic">{stat.label}</h3>
            <p className="text-2xl md:text-4xl font-black text-white tracking-tighter italic font-luxury">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-secondary p-6 md:p-10 rounded-2xl shadow-2xl border border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic font-luxury">Revenue Velocity</h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest bg-background px-4 py-2 rounded-xl w-fit border border-white/5">
              <TrendingUp size={14} className="text-primary" />
              Live Feed
            </div>
          </div>
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={matrix.chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A227" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 10, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0A0A0', fontSize: 10, fontWeight: 900 }} />
                <Tooltip
                  wrapperStyle={{ zIndex: 1000 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-secondary/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-[1000] relative">
                          <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1 italic">{payload[0].payload.name} Forecast</p>
                          <p className="text-xl font-black text-primary italic">${payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ stroke: '#C9A227', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A227" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-secondary p-6 md:p-10 rounded-2xl shadow-2xl border border-white/5 flex flex-col items-center justify-center">
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic mb-8 md:mb-12 w-full text-left font-luxury">Niche Distribution</h3>
          <div className="h-[250px] md:h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={matrix.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth < 768 ? 60 : 90}
                  outerRadius={window.innerWidth < 768 ? 90 : 130}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {matrix.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 1000 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-secondary/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl z-[500] relative">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                              <p className="text-[10px] font-black text-white uppercase tracking-widest italic leading-none">{payload[0].name}</p>
                            </div>
                            <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-1 rounded-2xl uppercase tracking-widest leading-none">
                              {payload[0].payload.count} Rituals
                            </span>
                          </div>
                          <p className="text-lg font-black text-primary italic leading-none">${payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <p className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-widest leading-none">Total</p>
              <p className="text-lg md:text-2xl font-black text-white tracking-tighter leading-none font-luxury">Niches</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 w-full mt-8 md:mt-12">
            {matrix.categoryData.map((item, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-background rounded-xl md:rounded-2xl group hover:bg-primary/5 transition-all border border-white/5">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full shadow-lg shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-[0.2em] truncate">{item.name}</p>
                  <p className="text-[10px] md:text-xs font-black text-white">${item.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Withdraw Funds"
        subtitle="Initiating extraction protocol"
        maxWidth="max-w-md"
      >
        <div className="space-y-6">
          <div className="p-6 bg-primary rounded-xl text-secondary flex items-center justify-between shadow-xl shadow-primary/10">
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-60 italic leading-none">In Vault</p>
              <p className="text-2xl font-black tracking-tighter italic leading-none font-luxury">${matrix.totalRevenue.toLocaleString()}</p>
            </div>
            <Wallet size={32} className="opacity-20" />
          </div>

          <form onSubmit={withdrawalFormik.handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-2 italic">Extraction Amount ($)</label>
              <input
                name="amount" type="number" onChange={withdrawalFormik.handleChange} value={withdrawalFormik.values.amount}
                className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-xl px-5 py-4 text-sm font-black outline-none transition-all text-white shadow-inner"
                placeholder="00.00"
              />
              {withdrawalFormik.touched.amount && withdrawalFormik.errors.amount && (
                <p className="text-[8px] font-black uppercase text-red-500 ml-2 italic">{withdrawalFormik.errors.amount}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-2 italic">Destination Bank Tether</label>
              <input
                name="bankAccount" onChange={withdrawalFormik.handleChange} value={withdrawalFormik.values.bankAccount}
                className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-xl px-5 py-4 text-xs font-bold outline-none transition-all text-white tracking-widest shadow-inner"
                placeholder="Enter account sequence..."
              />
              {withdrawalFormik.touched.bankAccount && withdrawalFormik.errors.bankAccount && (
                <p className="text-[8px] font-black uppercase text-red-500 ml-2 italic">{withdrawalFormik.errors.bankAccount}</p>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-5 bg-primary text-secondary rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/90 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              Confirm Extraction
              <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

