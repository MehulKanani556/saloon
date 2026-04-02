import React, { useState, useEffect } from 'react';
import { Plus, Search, ShoppingBag, Pencil, Trash2, Package, Star, Filter, X, Image as ImageIcon, Sparkles, Layers, Target, Activity, Zap, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../redux/slices/productSlice';
import Modal from '../components/ui/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { IMAGE_URL } from '../utils/BASE_URL';
import CustomSelect from '../components/CustomSelect';
import Pagination from '../components/Pagination';
import AdminHeader from '../components/ui/AdminHeader';

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editingProduct?.name || '',
      category: editingProduct?.category || '',
      price: editingProduct?.price || '',
      stock: editingProduct?.stock || '',
      description: editingProduct?.description || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required').min(3, 'At least 3 characters'),
      category: Yup.string().required('Category is required'),
      price: Yup.number().positive('Price must be positive').required('Required'),
      stock: Yup.number().min(0, 'Stock cannot be negative').required('Required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(key => formData.append(key, values[key]));
      if (imageFile) formData.append('image', imageFile);

      if (!editingProduct?._id && !imageFile) return toast.error('Product image is required');

      try {
        if (editingProduct?._id) {
          await dispatch(updateProduct({ id: editingProduct._id, productData: formData })).unwrap();
          toast.success('Product updated successfully');
        } else {
          await dispatch(createProduct(formData)).unwrap();
          toast.success('Product added successfully');
        }
        setShowForm(false);
        setEditingProduct(null);
        setImageFile(null);
        setPreview('');
        formik.resetForm();
      } catch (err) {
        toast.error('Operation failed');
      }
    },
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setPreview(product.image || '');
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  if (loading && !products.length) return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-white/5 border-t-primary rounded-full animate-spin" />
        <ShoppingBag className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40 animate-pulse" size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingProduct(null); setImageFile(null); setPreview(''); formik.resetForm(); }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        subtitle="Inventory Management"
      >
        <form onSubmit={formik.handleSubmit} className="space-y-10 p-2">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2 ">Product Image</label>
            <div className="relative aspect-video rounded-2xl bg-background border-2 border-dashed border-white/10 overflow-hidden group cursor-pointer shadow-3xl hover:border-primary/40 transition-all duration-500">
              {preview ? (
                <img
                  src={preview.startsWith('blob') || !preview.startsWith('/uploads') ? preview : `${IMAGE_URL}${preview}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/5">
                  <ImageIcon size={48} strokeWidth={1} className="mb-4 opacity-50 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] ">Upload Product Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <Upload size={32} className="text-secondary" />
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2 ">Product Name</label>
            <input
              {...formik.getFieldProps('name')}
              placeholder="e.g. LUXURY FACE CREAM"
              className="w-full bg-secondary/50 border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5 font-luxury"
            />
            {formik.touched.name && formik.errors.name && <p className="text-rose-500 text-[10px] uppercase font-black tracking-widest pl-2 pt-1">{formik.errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <CustomSelect
              label="Category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              options={[
                { label: 'Select Category...', value: '' },
                { label: 'Skincare', value: 'Skincare' },
                { label: 'Fragrance', value: 'Fragrance' },
                { label: 'Haircare', value: 'Haircare' },
                { label: 'Accessories', value: 'Accessories' },
                { label: 'Grooming', value: 'Grooming' },
              ]}
              icon={Layers}
            />
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2 ">Stock Quantity</label>
              <input
                type="number"
                {...formik.getFieldProps('stock')}
                className="w-full bg-secondary/50 border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] outline-none text-white shadow-2xl transition-all font-luxury"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2 ">Price ($)</label>
            <input
              type="number"
              {...formik.getFieldProps('price')}
              className="w-full bg-secondary/50 border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] outline-none text-white shadow-2xl transition-all font-luxury"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.4em] ml-2 ">Description</label>
            <textarea
              {...formik.getFieldProps('description')}
              rows={4}
              placeholder="PRODUCT DESCRIPTION..."
              className="w-full bg-secondary/50 border border-white/10 focus:border-primary/50 rounded-2xl px-6 py-5 text-[11px] font-black uppercase tracking-[0.3em] outline-none text-white shadow-2xl transition-all placeholder:text-white/5 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury disabled:opacity-50"
          >
            {formik.isSubmitting ? (
              <span className="flex items-center gap-3"><Loader2 className="animate-spin" size={16} /> SAVING...</span>
            ) : (
                <span className="whitespace-nowrap">{editingProduct ? 'SAVE CHANGES' : 'ADD PRODUCT'}</span>
            )}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="DELETE PRODUCT?"
        subtitle="This action cannot be undone."
        maxWidth="max-w-sm"
      >
        <div className="text-center p-4">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-8 shadow-2xl shadow-rose-500/20">
            <Trash2 size={40} strokeWidth={1} />
          </div>
          <p className="text-muted font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-10 px-2 ">
            Are you sure you want to delete <br /><span className="text-rose-500 text-lg font-luxury font-black underline decoration-rose-500/30 decoration-2 underline-offset-8">"{products.find(p => p._id === deletingId)?.name}"</span> <br /> from your inventory?
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                dispatch(deleteProduct(deletingId));
                setDeletingId(null);
              }}
              className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl active:scale-95 transition-all font-luxury"
            >CONFIRM DELETE</button>
            <button onClick={() => setDeletingId(null)} className="w-full py-5 bg-secondary text-muted rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] border border-white/10 hover:text-white transition-all font-luxury">CANCEL</button>
          </div>
        </div>
      </Modal>

      <AdminHeader
        title="Product Inventory"
        subtitle="Manage your product catalog"
        icon={Package}
        rightContent={
          <div className="flex flex-col md:flex-row gap-5 w-full lg:w-auto items-center">
            <div className="bg-secondary/40 backdrop-blur-md px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-white/5 shadow-3xl flex items-center gap-4 w-full md:w-96 group focus-within:border-primary/40 transition-all duration-500">
              <Search size={18} className="text-primary/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-[10px] md:text-[11px] font-black text-white tracking-[0.2em] w-full placeholder:text-white/5 uppercase"
              />
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                formik.resetForm();
                setPreview('');
                setImageFile(null);
                setShowForm(true);
              }}
              className="w-full lg:w-auto flex items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-primary text-secondary rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group font-luxury"
            >
              <Plus size={18} md:size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="whitespace-nowrap">ADD NEW PRODUCT</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {currentItems.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
              className="group relative bg-secondary rounded-2xl p-4 border border-white/5 shadow-3xl transition-all duration-500 hover:border-primary/20"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6 shadow-inner bg-background">
                <img
                  src={product.image?.startsWith('/uploads') ? `${IMAGE_URL}${product.image}` : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-[9px] font-black text-primary uppercase tracking-widest shadow-lg">
                  {product.category}
                </div>

                <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-3 bg-background/80 border border-white/5 rounded-xl text-muted hover:text-primary transition-all shadow-xl backdrop-blur-md"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingId(product._id)}
                    className="p-3 bg-background/80 border border-rose-500/10 rounded-xl text-muted hover:text-rose-500 transition-all shadow-xl backdrop-blur-md"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="bg-rose-500/20 text-rose-500 border border-rose-500/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                      OUT OF STOCK
                    </div>
                  </div>
                )}
              </div>

              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 font-luxury leading-none">{product.name}</h3>
                  <span className="text-xl font-black text-primary leading-none">${product.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3 text-muted text-[9px] font-black uppercase tracking-widest mb-6">
                  <span className="flex items-center gap-1.5">
                    <Package size={12} className="text-primary" /> Stock: {product.stock}
                  </span>
                  <span className="h-1 w-1 bg-white/10 rounded-full" />
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-primary" /> Premium
                  </span>
                </div>

                <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
                   <p className="text-[8px] font-black text-muted/30 uppercase tracking-[0.4em] truncate">PROD-{product._id.slice(-8).toUpperCase()}</p>
                   {product.stock > 0 && product.stock <= 5 && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg animate-pulse">
                      <Zap size={10} className="text-amber-500" />
                      <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest">LOW STOCK</span>
                    </div>
                   )}
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

      {!filteredProducts.length && (
        <div className="flex flex-col items-center justify-center py-40 space-y-10 group">
          <div className="w-32 h-32 bg-secondary/50 rounded-2xl flex items-center justify-center border border-white/5 shadow-3xl text-white/10 group-hover:text-primary/20 transition-all duration-700">
            <Target size={64} strokeWidth={1} className="group-hover:rotate-45 transition-transform duration-1000" />
          </div>
          <p className="text-[11px] font-black text-muted uppercase tracking-[0.6em]">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
}
