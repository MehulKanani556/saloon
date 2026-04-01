import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, exportInvoicePDF } from '../redux/slices/appointmentSlice';
import { FileText, Search, Download, Eye, Printer, X, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/ui/Modal';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { IMAGE_URL } from '../utils/BASE_URL';
import AdminHeader from '../components/ui/AdminHeader';


const InvoiceDetailModal = ({ appointment, onClose }) => {
  const dispatch = useDispatch();
  if (!appointment) return null;

  const handleExportPDF = async () => {
    try {
      const result = await dispatch(exportInvoicePDF(appointment._id)).unwrap();
      const clientName = appointment.client?.name?.split(' ').join('_') || 'Client';
      const appointmentId = appointment.appointmentId || appointment._id.toString().substring(18).toUpperCase();
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${clientName}-${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error('Export protocol failed');
    }
  };

  return (
    <Modal
      isOpen={!!appointment}
      onClose={onClose}
      title="Financial Archive"
      subtitle={`Ref: ${appointment.appointmentId || appointment._id.substring(18).toUpperCase()}`}
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col max-h-[70vh] -my-10">
        <div className="p-8 md:p-12 bg-secondary/80 backdrop-blur-xl rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-luxury-gradient opacity-10" />

          <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black tracking-tighter  uppercase text-primary mb-1 font-luxury leading-none">Glow Saloon</h1>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted  opacity-60">Elite Aesthetics & Grooming</p>
              </div>
              <div className="space-y-2 text-[10px] font-black text-muted uppercase tracking-widest  opacity-80 leading-relaxed">
                <p>123 Luxury Lane, Diamond District</p>
                <p>Mumbai, Maharashtra - 400001</p>
                <p>contact@glowsaloon.com</p>
              </div>
            </div>
            <div className="text-left md:text-right space-y-6">
              <h2 className="text-5xl font-black tracking-tighter  text-white/5 uppercase select-none leading-none -mb-8">Fiscal Record</h2>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ">Recipient Protocol</p>
                <p className="text-2xl font-black tracking-tight uppercase  text-white font-luxury">{appointment.client?.name}</p>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest ">{appointment.client?.email}</p>
              </div>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-background/50 border border-white/5 shadow-inner group">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-3 ">Creation Archive</p>
              <p className="font-black  text-sm text-white tracking-widest">{format(new Date(appointment.createdAt), 'MMMM dd, yyyy')}</p>
            </div>
            <div className="p-8 rounded-2xl bg-background/50 border border-white/5 shadow-inner group">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-3 ">Ritual Identity</p>
              <p className="font-black  text-sm text-white tracking-widest">#{appointment.appointmentId || appointment._id.substring(18).toUpperCase()}</p>
            </div>
            <div className="p-8 rounded-2xl bg-background/50 border border-white/5 shadow-inner flex justify-between items-center sm:block sm:space-y-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-3 ">Ritual State</p>
                <p className={`font-black  text-[11px] uppercase tracking-[0.3em] ${appointment.status === 'Cancelled' ? 'text-rose-500' : appointment.status === 'Completed' ? 'text-emerald-500' : 'text-primary'}`}>
                  {appointment.status || 'Pending'}
                </p>
              </div>
              <div className="border-l border-white/10 pl-6 sm:border-l-0 sm:pl-0">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary mb-3 ">Settlement</p>
                <p className={`font-black  text-[11px] uppercase tracking-[0.3em] ${appointment.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {appointment.paymentStatus || 'Pending'}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mb-16">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="pb-6 text-[10px] font-black uppercase tracking-[0.4em] text-primary  px-2">Masterpiece Ritual</th>
                  <th className="pb-6 text-right text-[10px] font-black uppercase tracking-[0.4em] text-primary  px-2">Timeline</th>
                  <th className="pb-6 text-right text-[10px] font-black uppercase tracking-[0.4em] text-primary  px-2">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointment.assignments?.map((asm, idx) => {
                  const service = asm.service;
                  if (!service) return null;
                  return (
                    <tr key={service._id || idx} className="group transition-all hover:bg-white/5">
                      <td className="py-8 px-2">
                        <p className="font-black text-base tracking-tighter uppercase  text-white font-luxury">{service.name}</p>
                        <p className="text-[10px] font-black text-muted uppercase mt-2 tracking-[0.2em] ">{service.category?.name || 'General Ritual'}</p>
                      </td>
                      <td className="py-8 px-2 text-right">
                        <p className="font-black text-xs  text-white tracking-widest">{format(new Date(appointment.appointmentDate), 'MMM dd, HH:mm')}</p>
                      </td>
                      <td className="py-8 px-2 text-right">
                        <p className="font-black text-lg  text-primary tracking-tighter font-luxury leading-none">${service.price?.toLocaleString()}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-12 border-t border-white/10">
            <div className="w-full sm:w-1/2 space-y-6">
              <div className="flex justify-between items-center px-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted ">Ritual Summation</span>
                <span className="font-black  text-sm text-white tracking-widest">${appointment.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-8 bg-primary rounded-2xl text-secondary shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em]  relative z-10">Eternal Value</span>
                <span className="text-3xl font-black  tracking-tighter font-luxury relative z-10 leading-none">${appointment.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-white/5 text-center space-y-6">
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/10 ">Certified Financial Asset Authentication</p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-4 px-10 py-5 bg-secondary text-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-primary hover:text-secondary transition-all active:scale-95 shadow-2xl border border-primary/20 font-luxury "
              >
                <Download size={16} />
                AUTHORIZE PDF EXPORT
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
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
    app.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.services?.some(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    app.appointmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickExport = async (invoice) => {
    try {
      const { _id, client, appointmentId } = invoice;
      const result = await dispatch(exportInvoicePDF(_id)).unwrap();
      const clientName = client?.name?.split(' ').join('_') || 'Client';
      const aptId = appointmentId || _id.substring(18).toUpperCase();
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${clientName}-${aptId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error('Extraction failed');
    }
  };

  if (loading && !appointments.length) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12">
      <AdminHeader
        title="Financial Archive"
        subtitle="Audit trail of all financial ritual settlements"
        icon={FileText}
        rightContent={
          <div className="relative group w-full lg:w-96">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Query Masterpiece Archives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl px-16 py-5 text-[11px] font-black uppercase tracking-[0.2em] outline-none focus:border-primary/50 shadow-3xl transition-all text-white placeholder:text-white/10"
            />
          </div>
        }
      />


      <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-3xl border border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-luxury-gradient opacity-10" />
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80">
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Ritual Ref</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Client Identity</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Masterpiece</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Execution</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Value</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Settlement</th>
                <th className="px-5 py-5 text-center text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredInvoices.map((invoice, idx) => (
                  <motion.tr
                    key={invoice._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02, ease: "easeOut" }}
                    className="group border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    <td className="px-10 py-8">
                      <span className="text-[10px] font-black text-muted tracking-widest uppercase  bg-background/50 px-3 py-1.5 rounded-2xl border border-white/5 shadow-inner whitespace-nowrap">
                        #{invoice.appointmentId || invoice._id.substring(18).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-background p-1 border border-white/10 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                          <img
                            src={invoice.client?.profileImage ? (invoice.client.profileImage.startsWith('http') ? invoice.client.profileImage : `${IMAGE_URL}${invoice.client.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${invoice.client?.name || 'Client'}`}
                            alt={invoice.client?.name || 'Client'}
                            className="w-full h-full rounded-2xl object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tighter font-luxury  leading-none mb-2 group-hover:text-primary transition-colors">{invoice.client?.name}</p>
                          <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] whitespace-nowrap">{invoice.client?.phone}</p>
                        </div >
                      </div >
                    </td >
                    <td className="px-10 py-8">
                      <p className="text-[11px] font-black text-muted uppercase tracking-[0.1em]  whitespace-nowrap group-hover:text-white transition-colors">{invoice.assignments?.map(a => a.service?.name).join(', ')}</p>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-black text-white  tracking-widest leading-none">{format(new Date(invoice.appointmentDate), 'MMM dd, yyyy')}</span>
                        <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all  leading-none">
                          {format(new Date(invoice.appointmentDate), 'hh:mm a')}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-xl font-black text-white tracking-tighter  font-luxury leading-none">${invoice.totalPrice.toLocaleString()}</p>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-3 ">
                        <div className={`
                          inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.3em] w-fit shadow-xl
                          ${invoice.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                            invoice.status === 'Cancelled' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                              'bg-primary/10 border-primary/20 text-primary'}
                        `}>
                          <div className={`w-1.5 h-1.5 rounded-full ${invoice.status === 'Completed' ? 'bg-emerald-500' : invoice.status === 'Cancelled' ? 'bg-rose-500' : 'bg-primary'} animate-pulse`} />
                          {invoice.status}
                        </div>
                        {invoice.status !== 'Cancelled' && (
                          <div className={`
                            inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-[0.3em] w-fit shadow-xl
                            ${invoice.paymentStatus === 'Paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}
                          `}>
                            {invoice.paymentStatus === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {invoice.paymentStatus || 'Pending'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center justify-center gap-4 transition-all translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                        {invoice.status !== 'Cancelled' && (
                          <>
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="p-4 bg-background border border-white/5 rounded-2xl text-muted hover:text-primary shadow-2xl transition-all hover:scale-110 active:scale-95"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleQuickExport(invoice)}
                              className="p-4 bg-background border border-white/5 rounded-2xl text-muted hover:text-primary shadow-2xl transition-all hover:scale-110 active:scale-95"
                            >
                              <Download size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody >
          </table >
        </div >

        {!filteredInvoices.length && (
          <div className="p-32 text-center space-y-8">
            <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-dashed border-white/10 animate-pulse">
              <AlertCircle className="text-white/10" size={48} strokeWidth={1} />
            </div>
            <p className="text-muted/40 font-black uppercase tracking-[0.5em] text-[10px] ">No Masterpiece Records Detected in Matrix</p>
          </div>
        )
        }
      </div >

      {selectedInvoice && (
        <InvoiceDetailModal
          appointment={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div >
  );
}


