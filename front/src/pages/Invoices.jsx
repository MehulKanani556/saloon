import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, exportInvoicePDF } from '../redux/slices/appointmentSlice';
import { FileText, Search, Download, Eye, Printer, X, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { IMAGE_URL } from '../utils/BASE_URL';

const InvoiceDetailModal = ({ appointment, onClose }) => {
  const dispatch = useDispatch();
  if (!appointment) return null;

  const handleExportPDF = async () => {
    try {
      // toast.loading('Exporting financial masterpiece...', { id: 'pdf-export' });
      const result = await dispatch(exportInvoicePDF(appointment._id)).unwrap();

      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${appointment._id.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      // toast.success('Financial archive retrieved', { id: 'pdf-export' });
    } catch (err) {
      toast.error('Export protocol failed', { id: 'pdf-export' });
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20"
        >
          {/* Modal Header */}
          <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-parlour-500/10 flex items-center justify-center text-parlour-600 shadow-inner">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none italic">Invoice Archive</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Ref: INV-{appointment._id.substring(0, 8).toUpperCase()}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleExportPDF}
                className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-parlour-500 transition-all shadow-sm group"
              >
                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Invoice Body (Scrollable) */}
          <div className="p-12 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 printable-area text-slate-900 dark:text-white">
            <div className="grid grid-cols-2 gap-20 mb-20">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter italic uppercase text-parlour-600 mb-2">Glow & Elegance</h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Luxury Salon & Spa Narrative</p>
                </div>
                <div className="space-y-1 text-sm font-bold text-slate-500 italic">
                  <p>123 Luxury Lane, Diamond District</p>
                  <p>Mumbai, Maharashtra - 400001</p>
                  <p>contact@glowelegance.com</p>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              <div className="text-right space-y-8">
                <h2 className="text-6xl font-black tracking-tighter italic text-slate-100 dark:text-white/5 uppercase select-none">Invoice</h2>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Financial Summary For</p>
                  <p className="text-xl font-black tracking-tight uppercase italic">{appointment.client?.name}</p>
                  <p className="text-xs font-bold text-slate-500">{appointment.client?.email}</p>
                  <p className="text-xs font-bold text-slate-500">{appointment.client?.phone}</p>
                </div>
              </div>
            </div>

            <div className="mb-20 grid grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 shadow-inner">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 italic">Creation Date</p>
                <p className="font-black italic text-sm">{format(new Date(appointment.createdAt), 'MMMM dd, yyyy')}</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 shadow-inner">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 italic">Ritual Identity</p>
                <p className="font-black italic text-sm">#INV-{appointment._id.substring(18).toUpperCase()}</p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 shadow-inner space-y-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 italic">Protocol Status</p>
                  <p className={`font-black italic text-sm uppercase tracking-widest ${appointment.status === 'Cancelled' ? 'text-red-500' : appointment.status === 'Completed' ? 'text-green-500' : 'text-slate-500'}`}>
                    {appointment.status || 'Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 italic">Settlement</p>
                  <p className={`font-black italic text-sm uppercase tracking-widest ${appointment.paymentStatus === 'Paid' ? 'text-indigo-500' : 'text-amber-500'}`}>
                    {appointment.paymentStatus || 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            <table className="w-full mb-20">
              <thead>
                <tr className="border-b-2 border-slate-100 dark:border-white/5">
                  <th className="text-left pb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic px-4">Masterpiece / Service</th>
                  <th className="text-right pb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic px-4">Execution Date</th>
                  <th className="text-right pb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic px-4 w-32">Vault Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="group">
                  <td className="py-8 px-4">
                    <p className="font-black text-lg tracking-tight uppercase italic">{appointment.service?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 italic">{appointment.service?.category?.name || 'General Ritual'}</p>
                  </td>
                  <td className="py-8 px-4 text-right align-top">
                    <p className="font-black text-sm italic">{format(new Date(appointment.appointmentDate), 'MMM dd, HH:mm')}</p>
                  </td>
                  <td className="py-8 px-4 text-right align-top">
                    <p className="font-black text-lg italic text-parlour-600">₹{appointment.totalPrice.toLocaleString()}</p>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end pt-10 border-t-2 border-slate-100 dark:border-white/5">
              <div className="w-1/3 space-y-6">
                <div className="flex justify-between items-center px-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Sub-Total Value</span>
                  <span className="font-black italic">₹{appointment.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center px-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Protocol Tax (0%)</span>
                  <span className="font-black italic">₹0</span>
                </div>
                <div className="flex justify-between items-center p-6 bg-parlour-600 rounded-2xl text-white shadow-xl shadow-parlour-600/20">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Total Extraction</span>
                  <span className="text-2xl font-black italic tracking-tighter">₹{appointment.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-20 border-t border-slate-100 dark:border-white/5 text-center space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Validated Financial Intelligence</p>
              <div className="flex items-center justify-center gap-4 text-slate-300">
                <div className="h-[1px] w-20 bg-slate-100 dark:bg-white/5" />
                <Sparkles size={16} />
                <div className="h-[1px] w-20 bg-slate-100 dark:bg-white/5" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default function Invoices() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id');

  const { appointments, loading } = useSelector(state => state.appointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (initialId && appointments.length > 0) {
      const inv = appointments.find(a => a._id === initialId);
      if (inv) setSelectedInvoice(inv);
    }
  }, [initialId, appointments]);

  const filteredInvoices = appointments.filter(app =>
    app.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickExport = async (id) => {
    try {
      // toast.loading('Extracting financial asset...', { id: 'quick-export' });
      const result = await dispatch(exportInvoicePDF(id)).unwrap();

      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${id.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      // toast.success('Extraction complete', { id: 'quick-export' });
    } catch (err) {
      toast.error('Extraction failed', { id: 'quick-export' });
    }
  };

  if (loading && !appointments.length) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-parlour-600 rounded-full animate-spin" />
    </div>
  ); 

  return (
    <div className="space-y-6 md:space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-4 md:gap-6 relative z-10 transition-all">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border border-parlour-100 dark:border-white/10 flex items-center justify-center text-parlour-500 shadow-glass shrink-0 transition-transform hover:rotate-6">
            <FileText size={24} md:size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none italic truncate md:whitespace-normal">
              Financial Archive
            </h1>
            <p className="text-slate-400 font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.25em] mt-2 md:mt-4 opacity-70">
              Audit trail of all financial ritual settlements
            </p>
          </div>
        </div>

        <div className="relative group w-full lg:w-96">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-parlour-500 transition-colors">
            <Search size={18} md:size={20} />
          </div>
          <input
            type="text"
            placeholder="Search Intelligence Archive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl px-14 md:px-16 py-4 md:py-5 text-sm font-bold outline-none focus:border-parlour-500/50 shadow-2xl transition-all dark:text-white"
          />
        </div>
      </div>

      {/* Invoices Grid/Table */}
      <div className="glass-card overflow-hidden border-white/40 dark:bg-slate-900/40 shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Ritual Ref</th>
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Client Portfolio</th>
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Masterpiece</th>
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Execution Date</th>
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Financial Value</th>
                <th className="px-4 md:px-8 md:py-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic whitespace-nowrap">Status & Settlement</th>
                <th className="px-4 md:px-8 md:py-8 py-4 text-center text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 italic whitespace-nowrap">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredInvoices.map((invoice, idx) => (
                  <motion.tr
                    key={invoice._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    <td className="px-4 md:px-8 md:py-8 py-4">
                      <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase whitespace-nowrap">
                        #INV-{invoice._id.substring(18).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 md:py-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/50 dark:border-white/10 shadow-sm transition-transform group-hover:-rotate-3">
                          <img
                            src={invoice.client?.profileImage ? `${IMAGE_URL}${invoice.client?.profileImage}` : `https://api.dicebear.com/9.x/adventurer/svg?seed=${invoice.client?.name}`}
                            alt={invoice.client?.name}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter italic whitespace-nowrap">{invoice.client?.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic whitespace-nowrap">{invoice.client?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 md:py-8 py-4">
                      <p className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.1em] italic whitespace-nowrap">{invoice.services.map(s => s.name).join(', ')}</p>
                    </td>
                    <td className="px-4 md:px-8 md:py-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-200 italic whitespace-nowrap">{format(new Date(invoice.appointmentDate), 'MMM dd, yyyy')}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity italic whitespace-nowrap">
                          {format(new Date(invoice.appointmentDate), 'hh:mm a')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 md:py-8 py-4">
                      <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter italic">₹{invoice.totalPrice.toLocaleString()}</p>
                    </td>
                    <td className="px-4 md:px-8 md:py-8 py-4">
                      <div className="flex flex-col gap-2 italic">
                        <div className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest w-fit
                          ${invoice.status === 'Completed' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                            invoice.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                              'bg-slate-500/10 border-slate-500/20 text-slate-500'}
                        `}>
                          {invoice.status}
                        </div>
                        {invoice.status !== 'Cancelled' && (
                          <div className={`
                            inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest w-fit
                            ${invoice.paymentStatus === 'Paid' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}
                          `}>
                            {invoice.paymentStatus === 'Paid' ? <CheckCircle size={10} /> : <Clock size={10} />}
                            {invoice.paymentStatus || 'Pending'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-8 md:py-8 py-4">
                      <div className="flex items-center justify-center gap-4">
                        {invoice.status !== 'Cancelled' && (
                          <>
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-parlour-500 shadow-sm transition-all hover:scale-110 active:scale-90"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleQuickExport(invoice._id)}
                              className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-indigo-500 shadow-sm transition-all hover:scale-110 active:scale-90"
                            >
                              <Download size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!filteredInvoices.length && (
          <div className="p-20 text-center space-y-4 opacity-40">
            <AlertCircle className="mx-auto text-slate-200" size={48} />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] italic">No intelligence records match your parameters</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          appointment={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
