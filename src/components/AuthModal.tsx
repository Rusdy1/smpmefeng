import React from 'react';
import { X, ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { requireAuthModal, closeAuthModal, loginWithGoogle } = useAuth();

  if (!requireAuthModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-7 space-y-6 animate-in zoom-in-95">
        
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto shadow-xs">
          <GraduationCap className="w-8 h-8 text-amber-500" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            Masuk dengan Akun Google
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Untuk mengirim pesan terverifikasi, menyimpan dokumen lampiran, dan berinteraksi dengan database Firestore sekolah, silakan login dengan akun Google aktif Anda.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => loginWithGoogle()}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Autentikasi Aman Resmi Firebase</span>
        </div>

      </div>
    </div>
  );
};
