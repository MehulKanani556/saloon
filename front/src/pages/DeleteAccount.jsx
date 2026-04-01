import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Trash2, AlertTriangle, ShieldAlert, LogOut, ChevronRight, X, AlertCircle, Loader2, ShieldX } from 'lucide-react';
import { logoutUser } from '../redux/slices/authSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';
import UserPanelLayout from '../components/public/UserPanelLayout';
import { deleteAccount } from '../redux/slices/authSlice';

export default function DeleteAccount() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleDissolve = async () => {
    setLoading(true);
    const result = await dispatch(deleteAccount({ password }));
    setLoading(false);
    if (!result.error) {
      window.location.href = '/';
    }
  };

  return (
    <UserPanelLayout title="Account Closure">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/40 backdrop-blur-3xl border border-red-500/20 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-red-500/5"
        >
          {/* Subtle Warning Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6 pb-6 border-b border-white/5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-lg shadow-red-500/10 shrink-0">
              <ShieldX size={32} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase leading-none">Account <span className="text-red-500 italic">Closure</span></h2>
              <p className="text-muted/40 text-[11px] font-medium tracking-widest uppercase">Permanent removal of your atelier profile and history</p>
            </div>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-6 md:p-8 space-y-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={18} />
                <p className="text-[12px] font-bold text-red-500 uppercase tracking-widest leading-none">Irreversible Action Warning</p>
              </div>
              
              <div className="space-y-4 text-[13px] text-muted/60 font-medium leading-relaxed">
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/40 mt-1.5 shrink-0" />
                  <p>Removal of your digital footprint from the Salon atelier matrix.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/40 mt-1.5 shrink-0" />
                  <p>Permanent archival of all reservation history and aesthetic records.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/40 mt-1.5 shrink-0" />
                  <p>Revocation of all membership privileges and synchronization access.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-transparent py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] text-red-500 hover:text-white transition-all shadow-xl hover:shadow-red-500/20 group flex items-center justify-center gap-4 active:scale-[0.99]"
              >
                Begin Account Closure
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 20 }}
                className="bg-secondary p-8 md:p-12 border border-red-500/20 rounded-3xl w-full max-w-xl relative shadow-3xl overflow-hidden"
              >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

                <button
                  onClick={() => setShowConfirm(false)}
                  className="absolute right-6 top-6 p-2 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-white transition-all hover:rotate-90"
                >
                  <X size={18} />
                </button>

                <div className="text-center space-y-10">
                  <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20 shadow-lg text-red-500">
                    <ShieldAlert size={32} strokeWidth={1.5} />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight leading-none">Security <span className="text-red-500 italic">Auth</span></h3>
                    <p className="text-muted/40 text-[11px] font-bold uppercase tracking-[0.25em] max-w-xs mx-auto leading-relaxed">
                      Confirm your identity to finalize the removal process.
                    </p>
                  </div>

                  <div className="space-y-8 text-left">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-muted/30 uppercase tracking-[0.2em] ml-2">Verification Key</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-red-500/40 focus:ring-4 focus:ring-red-500/5 transition-all font-bold text-lg text-red-500 text-center tracking-widest uppercase"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 text-muted hover:text-white transition-all"
                      >
                        Abort Closure
                      </button>
                      <button
                        onClick={handleDissolve}
                        disabled={loading || !password}
                        className="flex-1 px-8 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 disabled:opacity-30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        Final Closure
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
