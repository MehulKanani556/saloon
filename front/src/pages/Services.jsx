import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Scissors, Pencil, Trash2, Heart, Clock, MoreVertical, Filter, X, Image as ImageIcon, Sparkles, Layers, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, addService, updateService, deleteService } from '../redux/slices/serviceSlice';
import { fetchCategories, addCategory } from '../redux/slices/categorySlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { IMAGE_URL } from '../utils/BASE_URL';
import CustomSelect from '../components/CustomSelect';
import Pagination from '../components/Pagination';

const serviceSchema = Yup.object().shape({
  name: Yup.string().required('Service name is required').min(3, 'At least 3 characters'),
  category: Yup.string().required('Category is required'),
  price: Yup.number().positive('Price must be positive').required('Price is required'),
  duration: Yup.number().positive('Duration must be positive').required('Duration is required'),
});

const ServiceForm = ({ onClose, initialData }) => {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.image || '');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { categories } = useSelector(state => state.categories);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || '',
      category: initialData?.category?._id || initialData?.category || '',
      price: initialData?.price || '',
      duration: initialData?.duration || '',
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true
    },
    validationSchema: serviceSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));
      if (imageFile) formData.append('image', imageFile);

      const action = initialData?._id
        ? updateService({ id: initialData._id, serviceData: formData })
        : addService(formData);

      if (!initialData?._id && !imageFile) return toast.error('Service image required');

      try {
        await dispatch(action).unwrap();
        onClose();
      } catch (err) {
        console.error('Service update failed:', err);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[500] flex items-center justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md h-screen bg-white dark:bg-slate-900 shadow-2xl z-[510] flex flex-col border-l border-white/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">
              {initialData ? 'Edit Service' : 'Add Service'}
            </h2>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4">
              {initialData ? 'Refine service details' : 'Create a new service profile'}
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-parlour-500 transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
          <form onSubmit={formik.handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Service Name</label>
              <input
                {...formik.getFieldProps('name')}
                placeholder="e.g. Bridal Makeover"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-parlour-500/30 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all dark:text-white"
              />
              {formik.touched.name && formik.errors.name && <p className="text-[9px] text-red-500 font-bold uppercase ml-4">{formik.errors.name}</p>}
            </div>

            <div className="relative">
              <CustomSelect
                label="Category"
                name="category"
                value={formik.values.category}
                onChange={(e) => {
                  if (e.target.value === 'new_category') {
                    setIsAddingCategory(true);
                  } else {
                    formik.handleChange(e);
                  }
                }}
                options={[
                  { label: 'Choose Category...', value: '' },
                  { label: '+ Add New Category', value: 'new_category' },
                  ...categories.map(cat => ({ label: cat.name, value: cat._id })),
                ]}
                icon={Layers}
              />
            </div>

            <AnimatePresence>
              {isAddingCategory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5 space-y-4 overflow-hidden"
                >
                  <input
                    placeholder="New Category Name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl outline-none font-bold text-sm border-2 border-transparent focus:border-parlour-500/20"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!newCategoryName) return toast.error('Category name required');
                        const created = await dispatch(addCategory({ name: newCategoryName })).unwrap();
                        formik.setFieldValue('category', created._id);
                        setNewCategoryName('');
                        setIsAddingCategory(false);
                      }}
                      className="flex-1 py-3 bg-parlour-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-parlour-700 transition-all"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="px-4 bg-white dark:bg-slate-900 text-slate-400 rounded-xl hover:text-red-500 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Duration (Min)</label>
                <input
                  type="number"
                  {...formik.getFieldProps('duration')}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl outline-none font-black text-slate-900 dark:text-white border-2 border-transparent focus:border-parlour-500/30"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Price (₹)</label>
                <input
                  type="number"
                  {...formik.getFieldProps('price')}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl outline-none font-black text-slate-900 dark:text-white border-2 border-transparent focus:border-parlour-500/30"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Service Image</label>
              <div className="relative aspect-video rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden group cursor-pointer shadow-inner">
                {preview ? (
                  <img src={preview.startsWith('blob') ? preview : `${IMAGE_URL}${preview}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                    <ImageIcon size={48} strokeWidth={1} className="mb-4 opacity-50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Upload Image</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <Activity className="text-parlour-500" size={20} />
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Active Status</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formik.values.isActive} onChange={(e) => formik.setFieldValue('isActive', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-8 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-parlour-600"></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-parlour-600 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <Sparkles size={18} />
              {formik.isSubmitting ? 'Syncing...' : (initialData ? 'Update Service' : 'Add Service')}
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => (
  createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-12 shadow-2xl border border-white/10 text-center overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-red-500" />
            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-inner">
              <Trash2 size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4 leading-none">Eradicate Asset</h3>
            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] leading-relaxed mb-12 px-2">
              You are about to permanently purge <span className="text-red-500">"{itemName}"</span> from the global portfolio registry.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                className="py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
              >
                Abort Protocol
              </button>
              <button
                onClick={onConfirm}
                className="py-5 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
              >
                Confirm Purge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
);

export default function Services() {
  const dispatch = useDispatch();
  const { services, loading } = useSelector((state) => state.services);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchCategories());
  }, [dispatch]);

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
      <div className="w-16 h-16 border-4 border-slate-100 border-t-parlour-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-12">
      <AnimatePresence>
        {showForm && (
          <ServiceForm
            onClose={() => {
              setShowForm(false);
              setEditingService(null);
            }}
            initialData={editingService}
          />
        )}
      </AnimatePresence>

      <DeleteModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          dispatch(deleteService(deletingId));
          setDeletingId(null);
        }}
        itemName={services.find(s => s._id === deletingId)?.name}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 relative z-10">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-slate-900 border border-parlour-100 dark:border-white/10 flex items-center justify-center text-parlour-500 shadow-glass">
            <Scissors size={24} md:size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none underline-pink">Service Portfolio</h1>
            <p className="text-slate-400 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] mt-2 md:mt-4">Curate Luxury and Distinction</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="bg-white dark:bg-slate-900 px-4 md:px-6 py-3 md:py-4 rounded-2xl border border-slate-100 dark:border-white/5 shadow-glass flex items-center gap-3 md:gap-4 flex-1 lg:w-80 group focus-within:border-parlour-500/50 transition-all">
            <Search size={18} md:size={20} className="text-parlour-400" />
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
            Curate New
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
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-2xl group overflow-hidden transition-all duration-500 hover:shadow-parlour-500/10"
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
                    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-2xl text-[9px] font-black text-parlour-500 uppercase tracking-[0.2em] border border-white/40 dark:border-white/10 shadow-lg">
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
                      <Clock size={12} className="text-parlour-500" />
                      {service.duration} MIN PROTOCOL
                    </div>
                    <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600">ID: {service._id.slice(-6)}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none mb-6">
                    {service.name}
                  </h3>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                    <div className="flex flex-col">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ritual Value</p>
                      <p className="text-2xl md:text-3xl font-black text-rosegold-500 tracking-tighter italic">₹{service.price.toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setShowForm(true);
                        }}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-parlour-500 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
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
          <p className="text-[11px] font-black uppercase tracking-[0.4em]">No ritual assets found in registry</p>
        </div>
      )}
    </div>
  );
}
