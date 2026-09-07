import React from 'react';
import { 
  Award, 
  Users, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp,
  ShieldAlert,
  UserPlus
} from 'lucide-react';
import { SchoolProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { TutWuriHandayaniLogo } from './TutWuriHandayaniLogo';

interface HeroProps {
  profile: SchoolProfile;
  onOpenMessageModal: () => void;
  onExploreGallery: () => void;
  onOpenOwnerDashboard?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  profile, 
  onOpenMessageModal, 
  onExploreGallery,
  onOpenOwnerDashboard
}) => {
  const { currentUser, isAdmin, loginWithGoogle } = useAuth();

  return (
    <section id="beranda" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-8 pb-16 lg:py-20">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Main: Content (Full Width Centered) */}
        <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center text-center">
            
            {/* Accreditation & Tut Wuri Handayani Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-bold shadow-xs">
                <TutWuriHandayaniLogo className="w-5 h-5 object-contain" />
                <span>Tut Wuri Handayani • Kemendikbudristek</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs sm:text-sm font-semibold shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                <Award className="w-4 h-4 text-amber-500" />
                <span>Sekolah Berakreditasi A • NPSN: {profile.npsn}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-3xl">
              Mewujudkan Generasi Unggul Berakhlak Mulia & Berdaya Saing Global
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {profile.tagline}. Melalui kurikulum terpadu berbasis teknologi sains (STEM), pembinaan karakter budi pekerti, dan fasilitas laboratorium modern bertaraf internasional.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                id="hero-cta-daftar"
                onClick={onOpenMessageModal}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-base shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-cta-gallery"
                onClick={onExploreGallery}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-base shadow-2xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Lihat Galeri Prestasi</span>
              </button>
            </div>

            {/* Google Account Quick Status Indicator */}
            <div className={`w-full max-w-2xl p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm ${
              isAdmin 
                ? 'bg-amber-50/80 border-amber-300' 
                : 'bg-slate-100/90 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                {currentUser ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-800">
                      {isAdmin ? '👑 Akun Pemilik Sekolah:' : '👤 Akun Pengunjung:'}
                    </span>
                    <span className={`font-semibold ${isAdmin ? 'text-amber-800' : 'text-emerald-700'}`}>
                      {currentUser.displayName || currentUser.email}
                    </span>
                    {isAdmin && (
                      <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Hak Akses Penuh
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>Login Akun Google untuk mengirim pesan & konsultasi sekolah</span>
                  </div>
                )}
              </div>

              {currentUser && isAdmin && onOpenOwnerDashboard && (
                <button
                  onClick={onOpenOwnerDashboard}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  Buka Panel Pemilik
                </button>
              )}

              {!currentUser && (
                <button
                  onClick={() => loginWithGoogle()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Login Sekarang
                </button>
              )}
            </div>

            {/* Value Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kurikulum Merdeka + STEM</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengajar Berkualifikasi S2/S3</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fasilitas & Lab Lengkap</span>
              </div>
            </div>

        </div>

      </div>
    </section>
  );
};
