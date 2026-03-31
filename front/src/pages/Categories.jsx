import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, LayoutGrid, List, Pencil, Trash2, MoreVertical, X, Sparkles, Filter, Zap, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../redux/slices/categorySlice';
import Modal from '../components/ui/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingCategory?.name || '',
      description: editingCategory?.description || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nomenclature required').min(2, 'Too short'),
      description: Yup.string().max(500, 'Description excessive'),
    }),
    onSubmit: async (values) => {
      try {
        if (editingCategory?._id) {
          await dispatch(updateCategory({ id: editingCategory._id, categoryData: values })).unwrap();
          toast.success('Taxonomy refined successfully');
        } else {
          await dispatch(addCategory(values)).unwrap();
          toast.success('New taxonomy curated');
        }
        setShowForm(false);
        setEditingCategory(null);
      } catch (err) {
        toast.error(err.message || 'Matrix failure');
      }
    },
  });

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await dispatch(deleteCategory(deletingCategory._id)).unwrap();
      toast.success('Taxonomy purged');
      setDeletingCategory(null);
    } catch (err) {
      toast.error('Purge failure');
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
        <div className="flex items-center gap-6 group">
          <div className="w-16 h-16 rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-primary shadow-premium shrink-0 transition-transform hover:rotate-6">
            <LayoutGrid size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-6xl font-black text-white uppercase tracking-wide leading-[1.1] mb-8 font-luxury">Ritual Categories</h1>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] opacity-60">Architectural Classification & Service Taxonomy</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingCategory(null); setShowForm(true); }}
          className="flex items-center justify-center gap-4 px-10 py-5 bg-primary text-secondary rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury "
        >
          <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
          INDuct NEW CATEGORY
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-secondary/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-3xl">
        <div className="relative flex-grow max-w-md w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="SEARCH NOMENCLATURE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background/50 py-4 pl-14 pr-6 rounded-2xl outline-none font-black text-[10px] text-white border border-white/5 focus:border-primary/40 transition-all shadow-inner tracking-[0.2em] placeholder:text-white/5"
          />
        </div>

        <div className="flex items-center gap-3 bg-background/50 p-2 rounded-2xl border border-white/5 shadow-inner">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all  font-luxury ${viewMode === 'grid' ? 'bg-primary text-secondary shadow-lg scale-105' : 'text-muted hover:text-white'}`}
          >
            <LayoutGrid size={14} />
            Matrix View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all  font-luxury ${viewMode === 'list' ? 'bg-primary text-secondary shadow-lg scale-105' : 'text-muted hover:text-white'}`}
          >
            <List size={14} />
            Linear View
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredCategories.map((cat, index) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
                className="group relative bg-secondary rounded-2xl p-4 border border-white/5 shadow-3xl transition-all duration-500 hover:border-primary/20 overflow-hidden flex flex-col h-full"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-inner bg-background flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-secondary border border-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-premium">
                    <LayoutGrid size={40} strokeWidth={1} />
                  </div>

                  {/* Category Status Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full border border-white/5 shadow-lg">
                    <div className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest ">{cat.isActive ? 'Active' : 'Inactive'}</span>
                  </div>

                  {/* Admin Actions Overlay */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                    <button
                      onClick={() => { setEditingCategory(cat); setShowForm(true); }}
                      className="p-3 bg-background/80 border border-white/5 rounded-xl text-muted hover:text-primary transition-all shadow-xl backdrop-blur-md"
                      title="Refine Classification"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="p-3 bg-background/80 border border-rose-500/10 rounded-xl text-muted hover:text-rose-500 transition-all shadow-xl backdrop-blur-md"
                      title="Purge Classification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="px-2 pb-2 flex-grow flex flex-col">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight  mb-3 leading-none group-hover:text-primary transition-colors font-luxury">
                    {cat.name}
                  </h3>
                  <p className="text-muted text-[10px] uppercase font-black tracking-widest leading-relaxed line-clamp-2  opacity-60 group-hover:opacity-100 transition-opacity mb-6">
                    {cat.description || 'No conceptual context defined in the archives.'}
                  </p>

                  <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
                    <span className="text-[8px] font-black text-muted/30 uppercase tracking-[0.4em] ">Protocol ID: {cat._id.slice(-6).toUpperCase()}</span>
                    <button
                      onClick={() => dispatch(updateCategory({ id: cat._id, categoryData: { isActive: !cat.isActive } }))}
                      className={`w-10 h-5 rounded-full relative transition-all duration-500 p-1 ${cat.isActive ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-background border border-white/5'}`}
                    >
                      <motion.div
                        animate={{ x: cat.isActive ? 20 : 0 }}
                        className={`w-2.5 h-2.5 rounded-full shadow-lg ${cat.isActive ? 'bg-emerald-500' : 'bg-white/20'}`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* List Header */}
            <div className="hidden lg:grid grid-cols-[1.5fr_2fr_1.5fr_150px] gap-8 px-12 py-5 items-center">
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.5em] ">Ritual Protocol</span>
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.5em] ">Institutional Context</span>
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.5em] ">Status Matrix</span>
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.5em]  text-right">Actions</span>
            </div>

            {filteredCategories.map((cat, index) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group relative bg-secondary/30 backdrop-blur-sm rounded-2xl border border-white/5 shadow-3xl hover:border-primary/40 transition-all duration-700"
              >
                <div className="relative z-10 px-5 py-5 grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1.5fr_150px] gap-6 lg:gap-8 items-center">
                  {/* Protocol Name */}
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-secondary transition-all duration-700 shadow-inner">
                      <LayoutGrid size={22} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight  group-hover:text-primary transition-colors font-luxury">{cat.name}</h3>
                      <p className="lg:hidden text-[8px] font-black text-muted uppercase tracking-[0.4em] mt-2 ">Ritual Protocol</p>
                    </div>
                  </div>

                  {/* Context */}
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-muted line-clamp-1  group-hover:text-white/60 transition-colors">
                      {cat.description || 'No conceptual context defined in metadata.'}
                    </p>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center gap-5">
                    <div className={`w-2.5 h-2.5 rounded-full ${cat.isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-white/10'}`} />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] font-luxury">{cat.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                    <button
                      onClick={() => dispatch(updateCategory({ id: cat._id, categoryData: { isActive: !cat.isActive } }))}
                      className={`ml-auto lg:ml-6 w-12 h-6 rounded-full relative transition-all duration-700 p-1 ${cat.isActive ? 'bg-emerald-500' : 'bg-background'}`}
                    >
                      <motion.div
                        animate={{ x: cat.isActive ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => { setEditingCategory(cat); setShowForm(true); }}
                      className="w-12 h-12 flex items-center justify-center text-muted hover:bg-primary/10 hover:text-primary rounded-2xl transition-all duration-500 border border-transparent hover:border-primary/20"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="w-12 h-12 flex items-center justify-center text-muted hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl transition-all duration-500 border border-transparent hover:border-rose-500/20"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/[0.03] group-hover:to-transparent rounded-2xl pointer-events-none transition-all duration-700" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingCategory(null); formik.resetForm(); }}
        title={editingCategory ? 'Refine Classification' : 'Induct Category'}
        subtitle="Operational Matrix Management"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-10 p-2">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2  underline decoration-primary/30 underline-offset-8">Category Nomenclature</label>
            <input
              {...formik.getFieldProps('name')}
              placeholder="e.g. MAGNUM SKINCARE"
              className={`w-full bg-secondary/50 border-2 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5  font-luxury ${formik.touched.name && formik.errors.name ? 'border-rose-500/50' : 'border-transparent focus:border-primary/50'}`}
            />
            {formik.touched.name && formik.errors.name && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 ml-4 text-rose-500">
                <ShieldAlert size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">{formik.errors.name}</span>
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2  underline decoration-primary/30 underline-offset-8">Institutional Context</label>
            <textarea
              {...formik.getFieldProps('description')}
              placeholder="Describe the conceptual scope of this classification protocol..."
              className="w-full bg-secondary/50 border border-white/10 focus:border-primary/50 p-6 rounded-2xl outline-none font-black text-[11px] text-white shadow-2xl transition-all min-h-[160px] tracking-[0.2em] placeholder:text-white/5 "
            />
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-6 bg-primary text-secondary rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 font-luxury "
          >
            {formik.isSubmitting ? 'SYNCING MATRIX...' : (editingCategory ? 'COMMIT CLASSIFICATION' : 'AUTHORIZE TAXONOMY')}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="PURGE TAXONOMY?"
        subtitle="Final Forensic Dissolution"
        maxWidth="max-w-sm"
      >
        <div className="text-center p-4">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-8 shadow-2xl shadow-rose-500/20">
            <Trash2 size={40} strokeWidth={1} />
          </div>
          <p className="text-muted font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-10 px-2 ">
            Eliding <br /><span className="text-rose-500 text-lg font-luxury font-black  underline decoration-rose-500/30 decoration-2 underline-offset-8">"{deletingCategory?.name}"</span> <br /> from institutional matrix.
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleDelete}
              className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl active:scale-95 transition-all font-luxury "
            >CONFIRM PURGE</button>
            <button onClick={() => setDeletingCategory(null)} className="w-full py-5 bg-secondary text-muted rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] border border-white/10 hover:text-white transition-all font-luxury ">ABORT PROTOCOL</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


