import React, { useState, useEffect } from 'react';
import { Plus, Search, LayoutGrid, Pencil, Trash2, X, Sparkles, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../redux/slices/categorySlice';
import Modal from '../components/ui/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import AdminHeader from '../components/ui/AdminHeader';


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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingCategory?.name || '',
      description: editingCategory?.description || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name required').min(2, 'Too short'),
      description: Yup.string().max(500, 'Description too long'),
    }),
    onSubmit: async (values) => {
      try {
        if (editingCategory?._id) {
          await dispatch(updateCategory({ id: editingCategory._id, categoryData: values })).unwrap();
          toast.success('Category updated successfully');
        } else {
          await dispatch(addCategory(values)).unwrap();
          toast.success('New category added');
        }
        setShowForm(false);
        formik.resetForm();
        setEditingCategory(null);
      } catch (err) {
        toast.error(err.message || 'System error');
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
      toast.success('Category deleted');
      setDeletingCategory(null);
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="space-y-12">
      <AdminHeader
        title="Service Categories"
        subtitle="Classification & Service Management"
        icon={LayoutGrid}
        rightContent={
          <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-auto">
            <div className="bg-secondary/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5 shadow-2xl flex items-center gap-4 w-full lg:w-96 group focus-within:border-primary/40 transition-all">
              <Search size={18} className="text-muted group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="SEARCH CATEGORIES..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-[10px] md:text-[11px] w-full font-black uppercase tracking-widest text-white placeholder:text-white/10"
              />
            </div>
            <button
              onClick={() => { setEditingCategory(null); setShowForm(true); }}
              className="w-full lg:w-auto flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury"
            >
              <Plus size={18} md:size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="whitespace-nowrap">ADD NEW CATEGORY</span>
            </button>
          </div>
        }
      />

      <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-3xl border border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-luxury-gradient opacity-10" />
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80">
                <th className="px-3 lg:px-5 py-3 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Category Name</th>
                <th className="px-3 lg:px-5 py-3 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Description</th>
                <th className="px-3 lg:px-5 py-3 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap text-center">Status</th>
                <th className="px-3 lg:px-5 py-3 lg:py-5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredCategories.map((cat, index) => (
                  <motion.tr
                    key={cat._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.02, ease: "easeOut" }}
                    className="hover:bg-white/5 transition-all group"
                  >
                    <td className="px-3 lg:px-5 py-3 lg:py-5">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div>
                          <p className="font-black text-white text-sm lg:text-base tracking-wide uppercase whitespace-nowrap font-luxury group-hover:text-primary transition-colors leading-none mb-1.5 lg:mb-3">{cat.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-primary" />
                            <p className="text-[8px] lg:text-[9px] font-black text-muted uppercase tracking-[0.2em] whitespace-nowrap">ID: {cat._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-5 py-3 lg:py-5">
                      <p className="text-[11px] font-bold text-muted line-clamp-1 group-hover:text-white/60 transition-colors max-w-xs xl:max-w-md uppercase tracking-wider">
                        {cat.description || 'No description provided.'}
                      </p>
                    </td>
                    <td className="px-3 lg:px-5 py-3 lg:py-5">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className={`text-[8px] font-black uppercase tracking-[0.2em] ${cat.isActive ? 'text-emerald-500' : 'text-white/20'}`}>
                            {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </div>
                          <button
                            onClick={() => dispatch(updateCategory({ id: cat._id, categoryData: { isActive: !cat.isActive } }))}
                            className={`w-10 h-5 rounded-full relative transition-all duration-500 p-1 ${cat.isActive ? 'bg-emerald-500/20 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-background border border-white/5'}`}
                          >
                            <motion.div
                              animate={{ x: cat.isActive ? 20 : 0 }}
                              className={`w-2.5 h-2.5 rounded-full shadow-lg transition-colors ${cat.isActive ? 'bg-emerald-500' : 'bg-white/20'}`}
                            />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-5 py-3 lg:py-5 text-right">
                      <div className="flex items-center justify-end gap-2 lg:gap-3">
                        <button
                          onClick={() => { setEditingCategory(cat); setShowForm(true); }}
                          className="p-3 lg:p-4 bg-background border border-white/5 rounded-xl lg:rounded-2xl text-muted hover:text-primary transition-all shadow-xl"
                        >
                          <Pencil size={16} lg:size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="p-3 lg:p-4 bg-background border border-rose-500/10 rounded-xl lg:rounded-2xl text-muted hover:text-rose-500 transition-all shadow-xl"
                        >
                          <Trash2 size={16} lg:size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingCategory(null); formik.resetForm(); }}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        subtitle="Category Management"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-10 p-2">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2  underline decoration-primary/30 underline-offset-8">Category Name</label>
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
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2  underline decoration-primary/30 underline-offset-8">Category Description</label>
            <textarea
              {...formik.getFieldProps('description')}
              placeholder="Enter category description..."
              className="w-full bg-secondary/50 border border-white/10 focus:border-primary/50 p-6 rounded-2xl outline-none font-black text-[11px] text-white shadow-2xl transition-all min-h-[160px] tracking-[0.2em] placeholder:text-white/5 "
            />
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-6 bg-primary text-secondary rounded-2xl font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 font-luxury "
          >
            {formik.isSubmitting ? 'SAVING...' : (editingCategory ? 'SAVE CHANGES' : 'ADD CATEGORY')}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="DELETE CATEGORY?"
        subtitle="Permanent Removal"
        maxWidth="max-w-sm"
      >
        <div className="text-center p-4">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-8 shadow-2xl shadow-rose-500/20">
            <Trash2 size={40} strokeWidth={1} />
          </div>
          <p className="text-muted font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-10 px-2 ">
            Are you sure you want to delete <br /><span className="text-rose-500 text-lg font-luxury font-black  underline decoration-rose-500/30 decoration-2 underline-offset-8">"{deletingCategory?.name}"</span>?
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleDelete}
              className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl active:scale-95 transition-all font-luxury "
            >CONFIRM DELETE</button>
            <button onClick={() => setDeletingCategory(null)} className="w-full py-5 bg-secondary text-muted rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] border border-white/10 hover:text-white transition-all font-luxury ">CANCEL</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


