import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, LayoutGrid, Pencil, Trash2, MoreVertical, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../redux/slices/categorySlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const categorySchema = Yup.object().shape({
  name: Yup.string().required('Category name required').min(2, 'Too short'),
  description: Yup.string().max(500, 'Description too long'),
});

const CategoryForm = ({ onClose, initialData }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
    validationSchema: categorySchema,
    onSubmit: async (values) => {
      try {
        if (initialData?._id) {
          await dispatch(updateCategory({ id: initialData._id, categoryData: values })).unwrap();
          toast.success('Category refined successfully!');
        } else {
          await dispatch(addCategory(values)).unwrap();
          toast.success('New category curated!');
        }
        onClose();
      } catch (err) {
        toast.error(err.message || 'Curating failed');
      }
    },
  });

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative h-screen w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-white/20"
        >
          <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">
                {initialData ? 'Refine Category' : 'Curate Category'}
              </h2>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4 italic">Defining the saloon's ritual classification</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-saloon-500 transition-all hover:rotate-90">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Category Name</label>
              <input
                {...formik.getFieldProps('name')}
                placeholder="e.g. Skincare Protocol"
                className={`w-full bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl outline-none font-bold text-slate-800 dark:text-white border-2 ${formik.touched.name && formik.errors.name ? 'border-red-400' : 'border-transparent focus:border-saloon-500/30'} transition-all shadow-inner`}
              />
              {formik.touched.name && formik.errors.name && <p className="text-red-500 text-[9px] font-black uppercase ml-4">{formik.errors.name}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Institutional Context (Description)</label>
              <textarea
                {...formik.getFieldProps('description')}
                placeholder="Describe the scope of this ritual category..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl outline-none font-bold text-slate-800 dark:text-white border-2 border-transparent focus:border-saloon-500/30 transition-all shadow-inner min-h-[150px]"
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-saloon-600 dark:hover:bg-saloon-50 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
              >
                <Sparkles size={20} />
                {formik.isSubmitting ? 'Processing...' : (initialData ? 'Refine Category' : 'Publish Category')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

const DeleteConfirmationModal = ({ onConfirm, onClose, itemName }) => {
  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium p-10 border border-white/10 text-center"
        >
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
            <Trash2 size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none mb-4 italic">Strike Category?</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.15em] mb-10 leading-relaxed px-4">
            You are about to purge <span className="text-red-500 font-black italic">"{itemName}"</span> from the institutional record. This action is final.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onConfirm}
              className="flex-1 py-5 bg-red-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
            >
              Confirm Purge
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-300 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              Abort
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await dispatch(deleteCategory(deletingCategory._id)).unwrap();
      toast.success('Category purged');
      setDeletingCategory(null);
    } catch (err) {
      toast.error('Purging failed');
    }
  };

  return (
    <div className="space-y-6 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 lg:gap-6 relative z-10 transition-all">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border border-saloon-100 dark:border-white/10 flex items-center justify-center text-saloon-500 shadow-glass shrink-0 transition-transform hover:rotate-6">
            <LayoutGrid size={24} md:size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none truncate md:whitespace-normal">Ritual Categories</h1>
            <p className="text-slate-400 font-black text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-[0.15em] lg:tracking-[0.25em] mt-2 lg:mt-4 opacity-70 group-hover:opacity-100 transition-opacity">Defining the conceptual architecture of services</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setShowForm(true); }}
          className="flex items-center gap-4 px-6 py-3 lg:px-10 lg:py-5 bg-gradient-to-r from-saloon-500 via-saloon-600 to-rosegold-500 text-white lg:rounded-2xl rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-saloon-500/20 hover:scale-[1.05] transition-all group"
        >
          <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence>
          {filteredCategories.map((cat, index) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-2xl group transition-all duration-700 hover:translate-y-[-5px] overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-white/5 flex items-center justify-center text-saloon-500 shadow-inner group-hover:bg-saloon-500 group-hover:text-white transition-all duration-500">
                    <LayoutGrid size={28} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingCategory(cat); setShowForm(true); }}
                      className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-saloon-500 rounded-xl transition-all border border-transparent hover:border-saloon-200 dark:hover:border-saloon-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-200 dark:hover:border-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-4 leading-none group-hover:text-saloon-500 transition-colors">
                    {cat.name}
                  </h3>
                  
                  <div className="space-y-2 mb-8">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Conceptual Context</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-bold leading-relaxed line-clamp-3">
                      {cat.description || 'No conceptual context defined for this operational niche.'}
                    </p>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="mt-auto pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Protocol Status</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black text-slate-900 dark:text-slate-300 uppercase tracking-tighter">Active Sync</span>
                    </div>
                  </div>
                  <div className="bg-saloon-50/50 dark:bg-saloon-900/10 px-3 py-1.5 rounded-xl border border-saloon-100 dark:border-saloon-900/20 shadow-sm">
                    <span className="text-[9px] font-black text-saloon-500 uppercase tracking-widest italic">
                      Institutional
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showForm && (
          <CategoryForm
            initialData={editingCategory}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingCategory && (
          <DeleteConfirmationModal
            itemName={deletingCategory.name}
            onConfirm={handleDelete}
            onClose={() => setDeletingCategory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
