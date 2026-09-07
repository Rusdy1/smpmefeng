import React from 'react';
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  ExternalLink, 
  ShieldCheck,
  ArrowUp
} from 'lucide-react';
import { SchoolProfile } from '../types';
import { TutWuriHandayaniLogo } from './TutWuriHandayaniLogo';

interface FooterProps {
  profile: SchoolProfile;
  onOpenMessageModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenMessageModal }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 border-t border-slate-800">
      
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Siap Bergabung dengan Keluarga Besar {profile.name}?
            </h3>
            <p className="text-sm text-slate-400">
              Pendaftaran Peserta Didik Baru (PPDB) & Konsultasi Edukasi Terbuka Setiap Hari Kerja.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMessageModal}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Daftar Siswa Baru
            </button>
            <a
              href={profile.socialMedia.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Chat WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: School Identity (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1.5 border border-slate-700 shadow-xs flex items-center justify-center">
                <TutWuriHandayaniLogo className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {profile.name}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {profile.tagline}. Institusi pendidikan modern berfokus pada keunggulan akademik, sains teknologi (STEM), dan pembentukan budi pekerti luhur.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>NPSN: {profile.npsn} • Akreditasi A (Unggul)</span>
            </div>
          </div>

          {/* Col 2: Navigasi Cepat (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Navigasi</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => scrollToSection('beranda')} className="hover:text-blue-400 transition-colors">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors">
                  About (Tentang Kami)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('gallery')} className="hover:text-blue-400 transition-colors">
                  Gallery (Galeri Foto)
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="hover:text-blue-400 transition-colors">
                  Contact (Kontak & Peta)
                </button>
              </li>
              <li>
                <button onClick={onOpenMessageModal} className="text-blue-400 hover:underline">
                  Pendaftaran Siswa Baru
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Kontak Cepat (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Sekretariat</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{profile.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profile.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{profile.contact.email}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: MEDIA SOSIAL RESMI (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Media Sosial Resmi</h4>
            <p className="text-xs text-slate-400">
              Ikuti kabar terbaru dan konten edukasi menarik kami di seluruh kanal media sosial:
            </p>

            {/* Social Media Links Grid */}
            <div className="flex flex-wrap gap-2.5">
              
              {/* Instagram */}
              <a
                id="social-instagram"
                href={profile.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Sekolah"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                id="social-youtube"
                href={profile.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Sekolah"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                id="social-facebook"
                href={profile.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Sekolah"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                id="social-tiktok"
                href={profile.socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Sekolah"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-neutral-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.71 1.28-.06 2.45-.89 2.87-2.08.2-.55.26-1.14.26-1.72V.02z"/>
                </svg>
              </a>

              {/* WhatsApp Direct */}
              <a
                id="social-whatsapp"
                href={profile.socialMedia.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Resmi"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                id="social-twitter"
                href={profile.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter Sekolah"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

            </div>

            <div className="pt-2">
              <p className="text-[11px] text-slate-500">
                Pusat Bantuan & Pengaduan Layanan Sekolah: <span className="text-slate-300">08.00 - 15.00 WIB</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex items-center justify-center text-xs text-slate-500">
          <p id="copyright-text" className="text-center">
            Copyright © {currentYear} <strong>{profile.name}</strong>. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>

      </div>
    </footer>
  );
};
