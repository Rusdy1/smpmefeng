import React, { useState } from 'react';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Mail, 
  MessageSquare, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  History,
  Sparkles,
  Phone,
  LayoutDashboard,
  Users,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TutWuriHandayaniLogo } from './TutWuriHandayaniLogo';

interface HeaderProps {
  onOpenMessageModal: () => void;
  onOpenUserMessagesModal: () => void;
  onOpenOwnerDashboardModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMessageModal, 
  onOpenUserMessagesModal,
  onOpenOwnerDashboardModal
}) => {
  const { currentUser, isAdmin, loginWithGoogle, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Banner Info */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              NPSN: 60203264 • Halmahera Selatan, Maluku Utara
            </span>
            <span className="text-slate-400">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3 h-3 text-amber-400" />
              +62 823-1216-8914
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-blue-400" />
              rusdiishak82@admin.smp.belajar.id
            </span>
            <span className="text-slate-500">•</span>
            <span>Kec. Gane Timur</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & School Name */}
          <div 
            id="brand-logo"
            onClick={() => scrollToSection('beranda')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-xl bg-white p-1.5 border border-slate-200 shadow-sm flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
              <TutWuriHandayaniLogo className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                  SMP MEFENG
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                SP2 Lallubi • Halmahera Selatan
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-link-beranda"
              onClick={() => scrollToSection('beranda')}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100/80 transition-colors"
            >
              Beranda
            </button>
            <button
              id="nav-link-about"
              onClick={() => scrollToSection('about')}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100/80 transition-colors"
            >
              About
            </button>
            <button
              id="nav-link-gallery"
              onClick={() => scrollToSection('gallery')}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100/80 transition-colors"
            >
              Gallery
            </button>
            <button
              id="nav-link-contact"
              onClick={() => scrollToSection('contact')}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100/80 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Controls: Pesan CTA & Google Auth */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* If Owner/Admin is logged in, show Owner Panel Button */}
            {currentUser && isAdmin && (
              <button
                id="btn-open-owner-dashboard-header"
                onClick={onOpenOwnerDashboardModal}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer border border-amber-600/30"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-900" />
                <span>Panel Pemilik Sekolah</span>
              </button>
            )}

            {/* Tombol Daftar (Memicu Modal Form Pendaftaran) */}
            <button
              id="btn-open-daftar-header"
              onClick={onOpenMessageModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar</span>
            </button>

            {/* Google Authentication Control */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer ${
                    isAdmin 
                      ? 'border-amber-400 bg-amber-50/60 hover:bg-amber-100/80'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100'
                  }`}
                  aria-expanded={userDropdownOpen}
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      referrerPolicy="no-referrer"
                      className={`w-8 h-8 rounded-full object-cover ring-2 ${isAdmin ? 'ring-amber-500' : 'ring-blue-500/20'}`}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[120px] leading-tight">
                      {currentUser.displayName || 'Akun Google'}
                    </p>
                    <p className={`text-[10px] font-semibold leading-none flex items-center gap-0.5 mt-0.5 ${
                      isAdmin ? 'text-amber-700 font-extrabold' : 'text-emerald-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                      {isAdmin ? '👑 Pemilik Sekolah' : 'Google Aktif'}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-slate-400 font-medium">Masuk Sebagai</p>
                        {isAdmin && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Owner / Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{currentUser.displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    {/* Admin Dashboard Option */}
                    {isAdmin && (
                      <button
                        id="btn-dropdown-owner-dashboard"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenOwnerDashboardModal();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-amber-900 bg-amber-50/70 hover:bg-amber-100 flex items-center gap-2.5 transition-colors cursor-pointer border-b border-amber-100"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                        <span>Panel Pemilik (Lihat Login & Pesan)</span>
                      </button>
                    )}
                    
                    {/* User messages */}
                    <button
                      id="btn-dropdown-my-messages"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenUserMessagesModal();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <History className="w-4 h-4 text-blue-500" />
                      <span>{isAdmin ? 'Pesan Keluar Saya' : 'Riwayat Pesan Saya'}</span>
                    </button>

                    <button
                      id="btn-dropdown-logout"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors border-t border-slate-100 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-google-login-header"
                onClick={() => loginWithGoogle()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-2xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Login Google</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => scrollToSection('beranda')}
              className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              About (Tentang Kami)
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              Gallery (Galeri Foto)
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              Contact (Kontak & Peta)
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {/* If Owner/Admin, prominent button in mobile */}
            {currentUser && isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOwnerDashboardModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-950" />
                <span>Buka Panel Pemilik Sekolah</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMessageModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-semibold text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Siswa Baru</span>
            </button>

            {currentUser ? (
              <div className="pt-2 flex flex-col gap-2">
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  {currentUser.photoURL && (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || ''} 
                      className="w-9 h-9 rounded-full"
                    />
                  )}
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.displayName}</p>
                      {isAdmin && (
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                          Owner
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenUserMessagesModal();
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <History className="w-4 h-4 text-blue-600" />
                  <span>Riwayat Pesan Terkirim</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun Google</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  loginWithGoogle();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-center flex items-center justify-center gap-2 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Masuk dengan Akun Google</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

