import React, { useEffect, useRef, useState } from 'react';
import { Save, Building2, Clock, CreditCard, Globe, DollarSign, Loader2, ShieldCheck, Mail, Phone, MapPin, Upload } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings } from '../redux/slices/settingSlice';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const SettingsSchema = Yup.object().shape({
  salonName: Yup.string().required('Required'),
  tagline: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
});

export default function Settings() {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector((state) => state.settings);
  const logoInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: settings || {
      salonName: '',
      tagline: '',
      email: '',
      phone: '',
      address: '',
      businessHours: [],
      paymentMethods: []
    },
    enableReinitialize: true,
    validationSchema: SettingsSchema,
    onSubmit: async (values) => {
      toast.promise(
        dispatch(updateSettings(values)).unwrap(),
        {
          loading: 'Synchronizing sanctuary parameters...',
          success: 'Sanctuary legacy updated',
          error: 'Parameter synchronization failed'
        }
      );
    },
  });

  if (loading && !settings) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12">
        <div className="flex items-center gap-4 lg:gap-6 relative z-10 transition-all">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-primary shadow-glass shrink-0 transition-transform hover:rotate-6">
            <Building2 size={24} md:size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none italic truncate md:whitespace-normal font-luxury">
              Saloon Manifesto
            </h1>
            <p className="text-muted font-black text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.25em] mt-2 lg:mt-4 opacity-70">
              Configure global business identity and operational protocols
            </p>
          </div>
        </div>

        <button
          onClick={formik.handleSubmit}
          className="flex items-center gap-3 px-6 py-3 lg:px-10 lg:py-5 bg-primary text-secondary lg:rounded-2xl rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all group"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-secondary p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <h3 className="text-lg md:text-xl font-black text-white mb-8 md:mb-10 flex items-center gap-4 uppercase tracking-tighter italic font-luxury">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-background flex items-center justify-center text-primary shadow-inner border border-white/5">
                <Building2 size={24} />
              </div>
              General Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {[
                { name: 'salonName', label: 'Saloon Title', icon: Building2 },
                { name: 'tagline', label: 'Motto / Tagline', icon: ShieldCheck },
                { name: 'email', label: 'Command Email', icon: Mail, type: 'email' },
                { name: 'phone', label: 'Secure Line', icon: Phone }
              ].map((field) => (
                <div key={field.name} className="space-y-3">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-2 flex items-center gap-2 italic">
                    <field.icon size={12} className="text-primary" />
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field.name]}
                    className={`w-full bg-background border-2 ${formik.touched[field.name] && formik.errors[field.name] ? 'border-red-500' : 'border-transparent focus:border-primary/30'} p-4 md:p-5 rounded-2xl outline-none font-bold text-white transition-all shadow-inner`}
                  />
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest pl-2">{formik.errors[field.name]}</p>
                  )}
                </div>
              ))}

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-2 flex items-center gap-2 italic">
                  <MapPin size={12} className="text-primary" />
                  Operational Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                  className={`w-full bg-background border-2 ${formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-transparent focus:border-primary/30'} p-4 md:p-5 rounded-2xl outline-none font-bold text-white transition-all resize-none shadow-inner`}
                />
              </div>
            </div>
          </div>

          <div className="bg-secondary p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <h3 className="text-lg md:text-xl font-black text-white mb-8 md:mb-10 flex items-center gap-4 uppercase tracking-tighter italic font-luxury">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-background flex items-center justify-center text-primary border border-white/5 shadow-inner">
                <Clock size={20} md:size={24} />
              </div>
              Business Protocol (Hours)
            </h3>
            <div className="space-y-3 md:space-y-4">
              {formik.values.businessHours.map((day, index) => (
                <div key={day.day} className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-background rounded-2xl border border-white/5 group hover:border-primary/20 transition-all gap-4 md:gap-0 shadow-inner">
                  <span className="font-black text-[10px] md:text-sm text-white uppercase tracking-tighter italic group-hover:text-primary transition-colors font-luxury">{day.day}</span>
                  <div className="flex flex-col md:flex-row md:items-center justify-between md:justify-end gap-3 md:gap-6 w-full md:w-auto p-2 md:p-0 rounded-xl md:rounded-none">
                    <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none">
                      <input
                        type="time"
                        name={`businessHours[${index}].open`}
                        onChange={formik.handleChange}
                        value={day.open}
                        className="flex-1 md:flex-none bg-background px-2 py-1.5 md:px-4 md:py-2 rounded-xl font-black text-primary outline-none border border-white/5 text-[10px] md:text-xs shadow-inner min-w-0"
                      />
                      <span className="text-muted font-black text-[8px] md:text-[10px] uppercase tracking-widest italic flex-shrink-0">to</span>
                      <input
                        type="time"
                        name={`businessHours[${index}].close`}
                        onChange={formik.handleChange}
                        value={day.close}
                        className="flex-1 md:flex-none bg-background px-2 py-1.5 md:px-4 md:py-2 rounded-xl font-black text-primary outline-none border border-white/5 text-[10px] md:text-xs shadow-inner min-w-0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => formik.setFieldValue(`businessHours[${index}].isOpen`, !day.isOpen)}
                      className={`w-10 h-5 md:w-14 md:h-7 rounded-full relative transition-all duration-500 shadow-inner p-1 flex-shrink-0 ${day.isOpen ? 'bg-emerald-500/80 shadow-lg shadow-emerald-500/20' : 'bg-white/10'}`}
                    >
                      <motion.div
                        animate={{ x: day.isOpen ? (window.innerWidth < 768 ? 20 : 28) : 0 }}
                        className="w-3 h-3 md:w-5 md:h-5 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-10">
          <div className="bg-secondary p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl group text-center flex flex-col items-center">
            <h3 className="text-md md:text-lg font-black text-white mb-6 md:mb-10 uppercase tracking-tighter italic font-luxury">Visual Landmark (Logo)</h3>
            <div
              onClick={() => logoInputRef.current?.click()}
              className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-background border-4 border-dashed border-white/5 flex flex-col items-center justify-center text-muted mb-6 md:mb-8 cursor-pointer hover:border-primary/50 transition-all group overflow-hidden relative shadow-inner"
            >
              {logoPreview || formik.values.logo ? (
                <img src={logoPreview || formik.values.logo} alt="Logo" className="w-full h-full object-cover p-4" />
              ) : (
                <>
                  <Upload size={32} className="group-hover:scale-110 transition-all duration-700 text-white/20" />
                  <span className="text-[8px] md:text-[10px] font-black mt-3 md:mt-4 uppercase tracking-[0.2em] italic">Upload Logo</span>
                </>
              )}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  setLogoPreview(reader.result);
                  formik.setFieldValue('logo', reader.result);
                };
                reader.readAsDataURL(file);
              }}
            />
            <p className="text-[10px] text-muted font-bold leading-loose uppercase tracking-widest italic">
              Requirement Mapping:<br />512x512px Asset Frame<br />SVG or Transparent PNG
            </p>
          </div>

          <div className="bg-secondary p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl">
            <h3 className="text-md md:text-lg font-black text-white mb-8 md:mb-10 uppercase tracking-tighter italic font-luxury">Vault Channels</h3>
            <div className="space-y-4">
              {formik.values.paymentMethods.map((method, index) => (
                <div key={method.name} className="flex xl:flex-row lg:flex-col flex-row xl:items-center lg:items-start items-center justify-between p-4 md:p-6 rounded-2xl border border-white/5 bg-background group hover:border-primary/20 transition-all gap-4 shadow-inner">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-sm border border-white/5 shrink-0">
                      <DollarSign size={18} md:size={22} />
                    </div>
                    <span className="text-[12px] md:text-sm font-black text-white uppercase tracking-tighter italic group-hover:text-primary transition-colors leading-tight font-luxury">
                      {method.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue(`paymentMethods[${index}].isActive`, !method.isActive)}
                    className={`w-12 h-6 md:w-14 md:h-7 rounded-full relative transition-all duration-500 shadow-inner p-1 shrink-0 ${method.isActive ? 'bg-emerald-500/80 shadow-lg shadow-emerald-500/20' : 'bg-white/10'}`}
                  >
                    <motion.div
                      animate={{ x: method.isActive ? (window.innerWidth < 768 ? 24 : 28) : 0 }}
                      className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

