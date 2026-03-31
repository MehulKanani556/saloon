import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Trash2, AlertTriangle, ShieldAlert, LogOut, ChevronRight, X, AlertCircle } from 'lucide-react';
import { logoutUser } from '../redux/slices/authSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';
import UserPanelLayout from '../components/public/UserPanelLayout';

export default function DeleteAccount() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleDissolve = async () => {
    setLoading(true);
    try {
      await api.delete('/auth/profile', { data: { password } });
      toast.success('Identity matrix dissolved successfully');
      dispatch(logoutUser());
      window.location.href = '/';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Dissolution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserPanelLayout title="Delete Account">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/40 backdrop-blur-3xl border border-red-500/10 rounded-3xl p-6 lg:p-10 relative overflow-hidden"
        >
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-6 mb-12 pb-10 border-b border-red-500/5">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-inner">
              <Trash2 size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Identity Dissolution</h2>
              <p className="text-red-500/50 text-[10px] font-black uppercase tracking-[0.3em]">Permanent removal of your digital footprint from the matrix</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-start gap-4 ring-1 ring-red-500/10">
              <AlertTriangle className="text-red-500 shrink-0 mt-1" size={24} />
              <div>
                <p className="text-[12px] font-black text-red-500 uppercase tracking-widest mb-2">Critical Protocol Warning</p>
                <div className="space-y-3 text-[11px] text-slate-400 font-bold uppercase leading-relaxed tracking-wider italic">
                  <p>• Your personal identity records will be detached from the public matrix.</p>
                  <p>• All scheduled rituals and aesthetic history will be archived (soft-deleted).</p>
                  <p>• Access credentials will be permanently revoked.</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-12 text-center italic">Are you absolutely certain you wish to initiate the dissolution sequence?</p>
              
              <button 
                onClick={() => setShowConfirm(true)}
                className="w-full bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-red-500 hover:text-white transition-all shadow-xl hover:shadow-red-500/20 group flex items-center justify-center gap-4"
              >
                Start Dissolution Process
                <ChevronRight size={16} className="group-hover:translate-x-3 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 border border-red-500/20 p-10 rounded-[2.5rem] w-full max-w-lg relative shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />
                
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="text-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse shadow-inner shadow-red-500/20 border border-red-500/10 text-red-500">
                    <ShieldAlert size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-3">System Override Required</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10 max-w-xs mx-auto italic">Confirm this terminal command to dissolve your identity from the collective matrix.</p>

                  <div className="space-y-6">
                    <div className="space-y-3 text-left">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Input Matrix Key (Password)</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/50 border border-red-500/10 p-5 rounded-2xl outline-none focus:border-red-500/50 transition-all font-black text-sm tracking-widest text-red-500"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 px-8 py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 text-slate-400 transition-all"
                      >
                        Abort
                      </button>
                      <button 
                        onClick={handleDissolve}
                        disabled={loading || !password}
                        className="flex-1 px-8 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 disabled:opacity-50"
                      >
                        {loading ? 'Dissolving...' : 'Finalize'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </UserPanelLayout>
  );
}
