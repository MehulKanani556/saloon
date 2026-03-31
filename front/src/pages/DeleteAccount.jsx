import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Trash2, AlertTriangle, ShieldAlert, LogOut, ChevronRight, X, AlertCircle } from 'lucide-react';
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
    <UserPanelLayout title="Delete ID">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card backdrop-blur-3xl border border-red-500/20 rounded-[3.5rem] p-8 lg:p-16 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] ring-1 ring-white/5"
        >
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
          
          <div className="flex items-center gap-8 mb-16 pb-12 border-b border-white/5 relative z-10">
            <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_15px_40px_rgba(239,68,68,0.2)]">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-[-0.05em] italic font-luxury leading-none mb-3">Identity <span className="text-red-500/50">Dissolution</span></h2>
              <p className="text-muted/40 text-[10px] font-black uppercase tracking-[0.5em] italic flex items-center gap-3">
                <AlertCircle size={14} className="text-red-500/40" /> Irreversible Digital Detachment
              </p>
            </div>
          </div>

          <div className="space-y-16 relative z-10">
            <div className="bg-background/40 border border-red-500/10 rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-12 backdrop-blur-md shadow-inner">
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 animate-pulse">
                <ShieldAlert className="text-red-500" size={36} />
              </div>
              <div className="text-center md:text-left space-y-8">
                <p className="text-[16px] font-black text-red-500 uppercase tracking-[0.4em] italic mb-6 font-luxury leading-none shadow-sm">Critical Protocol Warning</p>
                <div className="space-y-6 text-[12px] text-muted/60 font-black uppercase leading-relaxed tracking-[0.3em] italic">
                  <p className="flex items-center gap-5 justify-center md:justify-start group cursor-default hover:text-white transition-colors duration-500">
                    <span className="w-2 h-2 rounded-full bg-red-500/50 group-hover:scale-150 transition-transform" /> 
                    Immediate detachment from the public matrix.
                  </p>
                  <p className="flex items-center gap-5 justify-center md:justify-start group cursor-default hover:text-white transition-colors duration-500">
                    <span className="w-2 h-2 rounded-full bg-red-500/50 group-hover:scale-150 transition-transform" /> 
                    Archival of all ritual history and aesthetic metadata.
                  </p>
                  <p className="flex items-center gap-5 justify-center md:justify-start group cursor-default hover:text-white transition-colors duration-500">
                    <span className="w-2 h-2 rounded-full bg-red-500/50 group-hover:scale-150 transition-transform" /> 
                    Permanent revocation of all synchronization access.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 text-center space-y-12">
              <p className="text-muted/30 text-[11px] font-black uppercase tracking-[0.6em] italic animate-pulse">Confirm final authorization sequence?</p>
              
              <button 
                onClick={() => setShowConfirm(true)}
                className="w-full bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-transparent py-8 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.5em] text-red-500 hover:text-white transition-all duration-700 shadow-2xl hover:shadow-[0_25px_60px_rgba(239,68,68,0.3)] group flex items-center justify-center gap-8 active:scale-[0.98] font-luxury italic"
              >
                Initalize Final Dissolution Protocol
                <ChevronRight size={24} className="group-hover:translate-x-4 transition-transform duration-700" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/95 backdrop-blur-2xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="bg-dark-card border border-red-500/30 p-12 md:p-20 rounded-[4rem] w-full max-w-2xl relative shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] overflow-hidden ring-1 ring-white/10"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
                
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="absolute right-12 top-12 text-muted/30 hover:text-white transition-all duration-500 hover:rotate-90 scale-125"
                >
                  <X size={32} />
                </button>

                <div className="text-center">
                  <div className="w-28 h-28 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 animate-bounce shadow-[0_20px_50px_rgba(239,68,68,0.2)] border border-red-500/30 text-red-500">
                    <ShieldAlert size={56} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[-0.05em] italic mb-6 font-luxury leading-none">Authorization <span className="text-red-500/50">Core</span></h3>
                  <p className="text-muted/40 text-[11px] font-black uppercase tracking-[0.4em] mb-16 max-w-sm mx-auto italic leading-relaxed">Provide synchronization key to finalize matrix removal.</p>

                  <div className="space-y-12 text-left">
                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-muted/30 uppercase tracking-[0.6em] pl-4 italic">Security Key (Password)</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-background/40 border border-white/5 p-8 rounded-[2.5rem] outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all duration-1000 font-black text-xl tracking-[0.8em] text-red-500 text-center uppercase"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 pt-10">
                      <button 
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 px-12 py-7 border border-white/5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-white/5 text-muted/40 hover:text-white transition-all duration-700 italic font-luxury"
                      >
                        Abort Sequence
                      </button>
                      <button 
                        onClick={handleDissolve}
                        disabled={loading || !password}
                        className="flex-1 px-12 py-7 bg-red-600 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] shadow-[0_25px_60px_rgba(220,38,38,0.4)] disabled:opacity-10 flex items-center justify-center gap-5 transition-all duration-700 hover:scale-[1.05] active:translate-y-1 italic font-luxury"
                      >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <Trash2 size={24} />}
                        Final Dissolve
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
