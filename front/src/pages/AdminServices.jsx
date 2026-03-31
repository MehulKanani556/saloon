import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Scissors, Pencil, Trash2, Heart, Clock, MoreVertical, Filter, X, Image as ImageIcon, Sparkles, Layers, Target, Activity } from 'lucide-react';
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
      name: Yup.string().required('Service name is required').min(3, 'At least 3 characters'),
      category: Yup.string().required('Category is required'),
      price: Yup.number().positive('Price must be positive').required('Price is required'),
      duration: Yup.number().positive('Duration must be positive').required('Duration is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));
      if (imageFile) formData.append('image', imageFile);

      if (!editingService?._id && !imageFile) return toast.error('Service image required');

      try {
        if (editingService?._id) {
          await dispatch(updateService({ id: editingService._id, serviceData: formData })).unwrap();
          toast.success('Service updated');
        } else {
          await dispatch(addService(formData)).unwrap();
          toast.success('Service added');
        }
        setShowForm(false);
        setEditingService(null);
        setImageFile(null);
        setPreview('');
      } catch (err) {
        toast.error('Operation failed');
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
      <div className="w-16 h-16 border-4 border-slate-100 border-t-saloon-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-12">
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingService(null);
          setPreview('');
          setImageFile(null);
          formik.resetForm();
        }}
        title={editingService ? 'Refine Ritual' : 'New Service'}
        subtitle="Operational Management"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Service Image</label>
            <div className="relative aspect-video rounded-xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden group cursor-pointer shadow-inner">
              {preview ? (
                <img src={preview.startsWith('blob') || !preview.startsWith('/uploads') ? preview : `${IMAGE_URL}${preview}`} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                  <ImageIcon size={32} strokeWidth={1} className="mb-2 opacity-50" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">Upload Visual</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Ritual Nomenclature</label>
            <input
              {...formik.getFieldProps('name')}
              placeholder="e.g. Classic Haircut"
              className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-saloon-500/30 rounded-xl px-5 py-4 text-xs font-bold outline-none transition-all dark:text-white"
            />
          </div>

          <div className="relative">
            <CustomSelect
              label="Classification"
              name="category"
              value={formik.values.category}
              onChange={(e) => {
                if (e.target.value === 'new_category') setIsAddingCategory(true);
                else formik.handleChange(e);
              }}
              options={[
                { label: 'Select Category...', value: '' },
                { label: '+ Quick Create Category', value: 'new_category' },
                ...categories.map(cat => ({ label: cat.name, value: cat._id })),
              ]}
              icon={Layers}
            />
          </div>

          <AnimatePresence>
            {isAddingCategory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-white/5 space-y-3 overflow-hidden"
              >
                <input
                  placeholder="New Category Name..." value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 px-4 py-3 rounded-lg outline-none font-bold text-xs"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!newCategoryName) return toast.error('Name required');
                      const created = await dispatch(addCategory({ name: newCategoryName })).unwrap();
                      formik.setFieldValue('category', created._id);
                      setNewCategoryName('');
                      setIsAddingCategory(false);
                    }}
                    className="flex-1 py-3 bg-saloon-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest"
                  >Save</button>
                  <button type="button" onClick={() => setIsAddingCategory(false)} className="px-4 text-[9px] font-black uppercase text-slate-400">Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Duration (Min)</label>
              <input type="number" {...formik.getFieldProps('duration')} className="w-full bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl outline-none font-black text-xs" />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Price ($)</label>
              <input type="number" {...formik.getFieldProps('price')} className="w-full bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl outline-none font-black text-xs" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-white/5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Status</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={formik.values.isActive} onChange={(e) => formik.setFieldValue('isActive', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saloon-600"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-saloon-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={16} />
            {formik.isSubmitting ? 'Syncing...' : (editingService ? 'Refine Protocol' : 'Deploy Service')}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Purge Ritual?"
        subtitle="Final Deletion Protocol"
        maxWidth="max-w-sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500 mb-6">
            <Trash2 size={32} />
          </div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed mb-8 px-2">
            Eliminating <span className="text-red-500">"{services.find(s => s._id === deletingId)?.name}"</span> from the operational list.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                dispatch(deleteService(deletingId));
                setDeletingId(null);
              }}
              className="w-full py-4 bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95"
            >Confirm Deletion</button>
            <button onClick={() => setDeletingId(null)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl font-black uppercase text-[10px] tracking-widest">Abort Protocol</button>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 relative z-10">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-slate-900 border border-saloon-100 dark:border-white/10 flex items-center justify-center text-saloon-500 shadow-glass">
            <Scissors size={24} md:size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none underline-pink">Our Services</h1>
            <p className="text-slate-400 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] mt-2 md:mt-4">Manage all services provided by your saloon</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="bg-white dark:bg-slate-900 px-4 md:px-6 py-3 md:py-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-glass flex items-center gap-3 md:gap-4 flex-1 lg:w-80 group focus-within:border-saloon-500/50 transition-all">
            <Search size={18} md:size={20} className="text-saloon-400" />
            <input
              type="text"
              placeholder="Search service or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] md:text-xs w-full font-black text-slate-800 dark:text-white tracking-widest placeholder:text-slate-300 uppercase"
            />
          </div>
          <button
            onClick={() => {
              setEditingService(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 dark:text-slate-900 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.05] transition-all group"
          >
            <Plus size={18} md:size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            Add New Service
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {currentItems.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-2xl group overflow-hidden transition-all duration-500 hover:shadow-saloon-500/10"
            >
              <div className="p-3 md:p-4">
                {/* Panoramic Image Container */}
                <div className="aspect-video rounded-2xl overflow-hidden relative mb-4 md:mb-6 shadow-xl">
                  <img
                    src={service.image?.startsWith('/uploads') ? `${IMAGE_URL}${service.image}` : service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-2xl text-[9px] font-black text-saloon-500 uppercase tracking-[0.2em] border border-white/40 dark:border-white/10 shadow-lg">
                      {service.category?.name || 'GENERIC'}
                    </div>
                  </div>

                  {!service.isActive && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-red-500/95 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest animate-pulse">
                        Hidden
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical Data Panel */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                      <Clock size={12} className="text-saloon-500" />
                      {service.duration} MINUTES
                    </div>
                    <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600">ID: {service._id.slice(-6)}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none mb-6">
                    {service.name}
                  </h3>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                    <div className="flex flex-col">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                      <p className="text-2xl md:text-3xl font-black text-rosegold-500 tracking-tighter italic">${service.price.toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-saloon-500 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
                        title="Edit Ritual"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeletingId(service._id)}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
                        title="Purge Protocol"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
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
        <div className="flex flex-col items-center justify-center py-40 space-y-6 opacity-30">
          <Target size={80} strokeWidth={1} />
          <p className="text-[11px] font-black uppercase tracking-[0.4em]">No services found.</p>
        </div>
      )}
    </div>
  );
}
