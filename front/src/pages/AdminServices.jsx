import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Scissors, Pencil, Trash2, Heart, Clock, MoreVertical, Filter, X, Image as ImageIcon, Sparkles, Layers, Target, Activity, Zap, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, addService, updateService, deleteService } from '../redux/slices/serviceSlice';
import { fetchCategories, addCategory } from '../redux/slices/categorySlice';
import Modal from '../components/ui/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { IMAGE_URL } from '../utils/BASE_URL';
import CustomSelect from '../components/CustomSelect';
import Pagination from '../components/Pagination';
import AdminHeader from '../components/ui/AdminHeader';

export default function AdminServices() {
  const dispatch = useDispatch();
  const { services, loading } = useSelector((state) => state.services);
  const { categories } = useSelector(state => state.categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchCategories());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingService?.name || '',
      category: editingService?.category?._id || editingService?.category || '',
      price: editingService?.price || '',
      duration: editingService?.duration || '',
      isActive: editingService?.isActive !== undefined ? editingService.isActive : true
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Ritual nomenclature required').min(3, 'At least 3 characters'),
      category: Yup.string().required('Classification required'),
      price: Yup.number().positive('Magnitude must be positive').required('Required'),
      duration: Yup.number().positive('Temporal duration must be positive').required('Required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));
      if (imageFile) formData.append('image', imageFile);

      if (!editingService?._id && !imageFile) return toast.error('Visual signature required');

      try {
        if (editingService?._id) {
          await dispatch(updateService({ id: editingService._id, serviceData: formData })).unwrap();
          toast.success('Ritual archive refined');
        } else {
          await dispatch(addService(formData)).unwrap();
          toast.success('New ritual cataloged');
        }
        setShowForm(false);
        setEditingService(null);
        setImageFile(null);
        setPreview('');
        formik.resetForm();
      } catch (err) {
        toast.error('Matrix operation failed');
      }
    },
  });

  const handleEdit = (service) => {
    setEditingService(service);
    setPreview(service.image || '');
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.category?.name || String(service.category)).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || service.category?._id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentItems = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (deletingId || showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [deletingId, showForm]);

  if (loading && !services.length) return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
        <Scissors className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40 animate-pulse" size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingService(null); setImageFile(null); setPreview(''); formik.resetForm(); }}
        title={editingService ? 'Refine Ritual' : 'Induct Ritual'}
        subtitle="Operational Matrix Management"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-10 p-2">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2 ">Visual Archive Signature</label>
            <div className="relative aspect-video rounded-2xl bg-background border-2 border-dashed border-white/10 overflow-hidden group cursor-pointer shadow-3xl hover:border-primary/40 transition-all duration-500">
              {preview ? (
                <img
                  src={preview.startsWith('blob') || !preview.startsWith('/uploads') ? preview : `${IMAGE_URL}${preview}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/5">
                  <ImageIcon size={48} strokeWidth={1} className="mb-4 opacity-50 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] ">Commit Visual Protocol</span>
                </div>
              )}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <Upload size={32} className="text-secondary" />
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2  underline decoration-primary/30 underline-offset-8">Ritual Nomenclature</label>
            <input
              {...formik.getFieldProps('name')}
              placeholder="e.g. MAGNUM OPUS CUT"
              className="w-full bg-secondary/50 border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5  font-luxury"
            />
          </div>

          <div className="relative">
            <CustomSelect
              label="Taxonomic Classification"
              name="category"
              value={formik.values.category}
              onChange={(e) => {
                if (e.target.value === 'new_category') setIsAddingCategory(true);
                else formik.handleChange(e);
              }}
              options={[
                { label: 'Select Classification...', value: '' },
                { label: '+ INDuct NEW CLASSIFICATION', value: 'new_category' },
                ...categories.map(cat => ({ label: cat.name, value: cat._id })),
              ]}
              icon={Layers}
            />
          </div>

          <AnimatePresence>
            {isAddingCategory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="p-6 bg-background rounded-2xl border border-white/10 space-y-4 overflow-hidden shadow-inner"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={14} className="text-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 ">Quick Classification Forge</span>
                </div>
                <input
                  placeholder="NEW NOMENCLATURE..." value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full bg-secondary/80 border border-white/5 px-6 py-4 rounded-xl outline-none font-black text-[10px] uppercase tracking-[0.2em] text-white placeholder:text-white/5"
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!newCategoryName) return toast.error('Taxonomy required');
                      const created = await dispatch(addCategory({ name: newCategoryName })).unwrap();
                      formik.setFieldValue('category', created._id);
                      setNewCategoryName('');
                      setIsAddingCategory(false);
                    }}
                    className="flex-1 py-4 bg-primary text-secondary rounded-xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-primary/90 transition-all font-luxury "
                  >COMMIT TAXONOMY</button>
                  <button type="button" onClick={() => setIsAddingCategory(false)} className="px-6 text-[9px] font-black uppercase tracking-widest text-muted hover:text-white transition-colors">ABORT</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2 ">Temporal Span (MIN)</label>
              <input
                type="number"
                {...formik.getFieldProps('duration')}
                className="w-full bg-secondary/50 border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] outline-none text-white shadow-2xl transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2 ">Magnitude ($)</label>
              <input
                type="number"
                {...formik.getFieldProps('price')}
                className="w-full bg-secondary/50 border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] outline-none text-white shadow-2xl transition-all font-luxury"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-secondary/30 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner">
            <div className="flex items-center gap-4">
              <Activity size={18} className="text-primary" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] ">Availability Status</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer group">
              <input type="checkbox" checked={formik.values.isActive} onChange={(e) => formik.setFieldValue('isActive', e.target.checked)} className="sr-only peer" />
              <div className="w-14 h-7 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-6 bg-primary text-secondary rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 font-luxury "
          >
            {formik.isSubmitting ? 'SYNCING MATRIX...' : (editingService ? 'COMMIT REFINEMENT' : 'AUTHORIZE CREATION')}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="PURGE PROTOCOL?"
        subtitle="Permanent Forensic Erasure"
        maxWidth="max-w-sm"
      >
        <div className="text-center p-4">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-8 shadow-2xl shadow-rose-500/20">
            <Trash2 size={40} strokeWidth={1} />
          </div>
          <p className="text-muted font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-10 px-2 ">
            Dissolving <br /><span className="text-rose-500 text-lg font-luxury font-black  underline decoration-rose-500/30 decoration-2 underline-offset-8">"{services.find(s => s._id === deletingId)?.name}"</span> <br /> from active archives.
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                dispatch(deleteService(deletingId));
                setDeletingId(null);
              }}
              className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl active:scale-95 transition-all font-luxury "
            >CONFIRM PURGE</button>
            <button onClick={() => setDeletingId(null)} className="w-full py-5 bg-secondary text-muted rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] border border-white/10 hover:text-white transition-all font-luxury ">ABORT PROTOCOL</button>
          </div>
        </div>
      </Modal>

      <AdminHeader 
        title="Ritual Archives"
        subtitle="Operational Directory & Inventory Management"
        icon={Scissors}
        rightContent={
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto items-center">
            <div className="bg-secondary/40 backdrop-blur-md px-8 py-5 rounded-2xl border border-white/5 shadow-3xl flex items-center gap-5 w-full sm:w-96 group focus-within:border-primary/40 transition-all duration-500">
              <Search size={20} className="text-primary/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="SEARCH NOMENCLATURE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-[11px] font-black text-white tracking-[0.2em] w-full placeholder:text-white/5 uppercase"
              />
            </div>
            <button
              onClick={() => {
                setEditingService(null);
                formik.resetForm();
                setPreview('');
                setImageFile(null);
                setShowForm(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-primary text-secondary rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury "
            >
              <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              INDuct NEW RITUAL
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <AnimatePresence mode="popLayout">
          {currentItems.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
              className="group relative bg-secondary rounded-2xl p-4 border border-white/5 shadow-3xl transition-all duration-500 hover:border-primary/20"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-inner bg-background">
                <img
                  src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : service.image}
                  alt={service.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-lg">
                  {service.category?.name || "Ritual"}
                </div>

                {/* Admin Actions Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-3 bg-background/80 border border-white/5 rounded-xl text-muted hover:text-primary transition-all shadow-xl backdrop-blur-md"
                    title="Refine Ritual"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingId(service._id)}
                    className="p-3 bg-background/80 border border-rose-500/10 rounded-xl text-muted hover:text-rose-500 transition-all shadow-xl backdrop-blur-md"
                    title="Purge Ritual"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {!service.isActive && (
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-rose-500/20 backdrop-blur-md text-rose-500 border border-rose-500/30 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] animate-pulse ">
                      DECATALOGUED
                    </div>
                  </div>
                )}
              </div>

              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 font-luxury  leading-none">{service.name}</h3>
                  <span className="text-xl font-black text-primary leading-none">${service.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3 text-muted text-[9px] font-black uppercase tracking-widest mb-6">
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-primary" /> {service.duration} Mins
                  </span>
                  <span className="h-1 w-1 bg-white/10 rounded-full" />
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-primary" /> Professional
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5 mt-auto">
                  <p className="text-[8px] font-black text-muted/30 uppercase tracking-[0.4em]  truncate">Protocol X-{service._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {!filteredServices.length && (
        <div className="flex flex-col items-center justify-center py-40 space-y-10 group">
          <div className="w-32 h-32 bg-secondary/50 rounded-2xl flex items-center justify-center border border-white/5 shadow-3xl text-white/10 group-hover:text-primary/20 transition-all duration-700">
            <Target size={64} strokeWidth={1} className="group-hover:rotate-45 transition-transform duration-1000" />
          </div>
          <p className="text-[11px] font-black text-muted uppercase tracking-[0.6em] ">Archives yield no data matches.</p>
        </div>
      )}
    </div>
  );
}
