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
      toast.error('Failed to export invoice');
    }
  };

  return (
    <Modal
      isOpen={!!appointment}
      onClose={onClose}
      title="Invoice Details"
      subtitle={`Ref: ${appointment.appointmentId || appointment._id.substring(18).toUpperCase()}`}
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col -my-6 md:-my-10">
        <div className="p-2 md:p-8 bg-secondary/80 backdrop-blur-xl rounded-xl md:rounded-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-luxury-gradient opacity-10" />

          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8 mb-6 md:mb-10">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase text-primary mb-1 font-luxury leading-none">Lux Studio</h1>
                  <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-muted opacity-60">Professional Grooming Services</p>
                </div>
                <div className="space-y-1 text-[8px] md:text-[9px] font-black text-muted uppercase tracking-widest opacity-80 leading-relaxed max-w-[200px] md:max-w-none">
                  <p>123 Luxury Lane, Diamond District</p>
                  <p>Mumbai, Maharashtra - 400001</p>
                  <p>contact@luxstudio.com</p>
                </div>
              </div>
              <div className="text-left md:text-right space-y-3 md:space-y-4 relative">
                <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white/5 uppercase select-none leading-none absolute -top-2 md:relative md:top-0 md:-mb-4 right-0 md:right-auto">Invoice</h2>
                <div className="space-y-1">
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-primary ">Bill To</p>
                  <p className="text-lg md:text-xl font-black tracking-tight uppercase text-white font-luxury">{appointment.client?.name}</p>
                  <p className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-widest ">{appointment.client?.email}</p>
                </div>
              </div>
            </div>

            <div className="mb-4 md:mb-6 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-background/50 shadow-inner group">
                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary mb-1 md:mb-2 ">Invoice Date</p>
                <p className="font-black text-[9px] md:text-xs text-white tracking-widest uppercase">{format(new Date(appointment.createdAt), 'MMM dd, yyyy')}</p>
              </div>
              <div className="p-3 md:p-4 rounded-lg md:rounded-xl bg-background/50 shadow-inner group">
                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary mb-1 md:mb-2 ">Invoice ID</p>
                <p className="font-black text-[9px] md:text-xs text-white tracking-widest">#{appointment.appointmentId || appointment._id.substring(18).toUpperCase()}</p>
              </div>
              <div className="col-span-2 md:col-span-1 p-3 md:p-4 rounded-lg md:rounded-xl bg-background/50 shadow-inner flex justify-between items-center md:block md:space-y-2">
                <div>
                  <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary mb-1 md:mb-2 ">Appointment Status</p>
                  <p className={`font-black text-[8px] md:text-[10px] uppercase tracking-[0.1em] ${appointment.status === 'Cancelled' ? 'text-rose-500' : appointment.status === 'Completed' ? 'text-emerald-500' : 'text-primary'}`}>
                    {appointment.status || 'Pending'}
                  </p>
                </div>
                <div className="border-l border-white/10 pl-3 md:border-l-0 md:pl-0">
                  <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary mb-1 md:mb-2 ">Payment Status</p>
                  <p className={`font-black text-[8px] md:text-[10px] uppercase tracking-[0.1em] ${appointment.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {appointment.paymentStatus || 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    <th className="pb-1.5 md:pb-3 text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary px-1">Service</th>
                    <th className="pb-1.5 md:pb-3 text-right text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary px-1">Date</th>
                    <th className="pb-1.5 md:pb-3 text-right text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary px-1">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {appointment.assignments?.map((asm, idx) => {
                    const service = asm.service;
                    if (!service) return null;
                    return (
                      <tr key={service._id || idx} className="group transition-all hover:bg-white/5">
                        <td className="py-2 md:py-3.5 px-1">
                          <p className="font-black text-[10px] md:text-sm tracking-tighter uppercase text-white font-luxury leading-tight">{service.name}</p>
                          <p className="text-[6px] md:text-[8px] font-black text-muted uppercase mt-0.5 tracking-widest">{service.category?.name || 'General'}</p>
                        </td>
                        <td className="py-2 md:py-3.5 px-1 text-right">
                          <p className="font-black text-[8px] md:text-[10px] text-white tracking-widest">{format(new Date(appointment.appointmentDate), 'MMM dd, HH:mm')}</p>
                        </td>
                        <td className="py-2 md:py-3.5 px-1 text-right">
                          <p className="font-black text-xs md:text-base text-primary tracking-tighter font-luxury leading-none">${service.price?.toLocaleString()}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4 md:pt-6 border-t border-white/10">
              <div className="w-full md:w-1/2 space-y-2 md:space-y-3">
                <div className="flex justify-between items-center px-4">
                  <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-muted ">Subtotal</span>
                  <span className="font-black text-[10px] md:text-xs text-white tracking-widest">${appointment.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 md:p-4 bg-primary rounded-lg md:rounded-xl text-secondary shadow-2xl shadow-primary/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] relative z-10">Total Amount</span>
                  <span className="text-base md:text-xl font-black tracking-tighter font-luxury relative z-10 leading-none">${appointment.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 mt-4 md:mt-8 pt-4 md:pt-6 border-t border-white/5 text-center space-y-3">
              <p className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/5 ">This is an electronically generated invoice</p>
              <div className="flex items-center justify-center">
                <button
                  onClick={handleExportPDF}
                  className="w-full md:w-auto flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury"
                >
                  <Download size={18} md:size={20} strokeWidth={3} className="group-hover:translate-y-1 transition-transform" />
                  <span className="whitespace-nowrap">DOWNLOAD PDF</span>
                </button>
              </div>
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
    app.client?.phone?.includes(searchTerm) ||
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
      toast.error('Failed to download invoice');
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
        title="Invoices"
        subtitle="View and manage all customer invoices"
        icon={FileText}
        rightContent={
          <div className="relative group w-full lg:w-96">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl px-16 py-3 md:py-5 text-[11px] font-black uppercase tracking-[0.2em] outline-none focus:border-primary/50 shadow-3xl transition-all text-white placeholder:text-white/10"
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
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Invoice ID</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Client</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Service</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Date & Time</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Price</th>
                <th className="px-5 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Status</th>
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
                    <td className="px-4 md:px-10 py-4 md:py-8">
                      <span className="text-[8px] md:text-[10px] font-black text-muted tracking-widest uppercase bg-background/50 px-2 md:px-3 py-1 md:py-1.5 rounded-xl md:rounded-2xl border border-white/5 shadow-inner whitespace-nowrap">
                        #{invoice.appointmentId || invoice._id.substring(18).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 md:px-5 py-4 md:py-5">
                      <div className="flex items-center gap-3 md:gap-5">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-background p-1 border border-white/10 group-hover:rotate-6 transition-all duration-500 shadow-2xl shrink-0">
                          <img
                            src={invoice.client?.profileImage ? (invoice.client.profileImage.startsWith('http') ? invoice.client.profileImage : `${IMAGE_URL}${invoice.client.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${invoice.client?.name || 'Client'}`}
                            alt={invoice.client?.name || 'Client'}
                            className="w-full h-full rounded-xl md:rounded-2xl object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                          />
                        </div>
                        <div className="min-w-0 pr-4">
                          <p className="text-xs md:text-sm font-black text-white uppercase tracking-tighter font-luxury leading-none mb-1 md:mb-2 group-hover:text-primary transition-colors truncate md:whitespace-normal">{invoice.client?.name}</p>
                          <p className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap">{invoice.client?.phone}</p>
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
                    <td className="px-4 md:px-10 py-4 md:py-8">
                      <p className="text-lg md:text-xl font-black text-white tracking-tighter font-luxury leading-none">${invoice.totalPrice.toLocaleString()}</p>
                    </td>
                    <td className="px-4 md:px-10 py-4 md:py-8">
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
                    <td className="px-4 md:px-5 py-4 md:py-5">
                      <div className="flex items-center justify-center gap-2 md:gap-4 transition-all lg:translate-x-4 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100">
                        {invoice.status !== 'Cancelled' && (
                          <>
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="p-3 md:p-4 bg-background border border-white/5 rounded-xl md:rounded-2xl text-muted hover:text-primary shadow-2xl transition-all hover:scale-110 active:scale-95"
                            >
                              <Eye size={16} md:size={18} />
                            </button>
                            <button
                              onClick={() => handleQuickExport(invoice)}
                              className="p-3 md:p-4 bg-background border border-white/5 rounded-xl md:rounded-2xl text-muted hover:text-primary shadow-2xl transition-all hover:scale-110 active:scale-95"
                            >
                              <Download size={16} md:size={18} />
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
            <p className="text-muted/40 font-black uppercase tracking-[0.5em] text-[10px] ">No invoices found</p>
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


