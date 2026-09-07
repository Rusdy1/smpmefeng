import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Calendar, 
  User, 
  Maximize2, 
  Pencil,
  Trash2
} from 'lucide-react';
import { GalleryItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { TutWuriHandayaniLogo } from './TutWuriHandayaniLogo';

interface GallerySectionProps {
  galleries: GalleryItem[];
  onSelectImage: (item: GalleryItem) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (item: GalleryItem) => void;
  onDeleteImage: (item: GalleryItem) => void;
}

const CATEGORIES = ['Semua', 'Kegiatan', 'Prestasi', 'Fasilitas', 'Ekstrakurikuler', 'Akademik'];

export const GallerySection: React.FC<GallerySectionProps> = ({
  galleries,
  onSelectImage,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteImage
}) => {
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const filteredGalleries = selectedCategory === 'Semua' 
    ? galleries 
    : galleries.filter(item => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Dokumentasi & Galeri Sekolah</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                <TutWuriHandayaniLogo className="w-3.5 h-3.5 object-contain" />
                <span>Kemendikbudristek</span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Galeri Kegiatan & Momen Bersejarah
            </h2>
            <p className="text-slate-600 text-base">
              Sorotan aktivitas belajar, kompetisi sains, kreativitas seni, dan kebersamaan di lingkungan SMP MEFENG Halmahera Selatan.
            </p>
          </div>

          {/* Action to Add Gallery - ONLY shown when Admin is logged in, using icon only */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                id="btn-add-gallery-item"
                type="button"
                onClick={onOpenAddModal}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center group cursor-pointer"
                title="Tambah Foto Galeri"
                aria-label="Tambah Foto Galeri"
              >
                <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Category Filters (CSS Flexbox) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery CSS Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGalleries.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => onSelectImage(item)}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] sm:aspect-square"
            >
              {/* Main Photo */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />

              {/* Gradient Shade Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Bar: Badges & Admin Actions (Icon Only) */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-slate-900 shadow-xs pointer-events-none">
                  {item.category}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Admin Only: Ubah & Hapus Buttons (Icons Only) */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-xs p-1 rounded-xl border border-white/10 shadow-lg">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEditModal(item);
                        }}
                        className="p-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        title="Ubah Foto"
                        aria-label="Ubah Foto"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteImage(item);
                        }}
                        className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        title="Hapus Foto"
                        aria-label="Hapus Foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="relative p-4 space-y-1 text-white">
                <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-300 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {item.date}
                  </span>
                  {item.authorName && (
                    <span className="flex items-center gap-1 truncate max-w-[120px]">
                      <User className="w-3 h-3 text-emerald-400" />
                      {item.authorName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGalleries.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
            <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Belum ada foto dalam kategori ini</h3>
            <p className="text-xs text-slate-500 mt-1">Pilih kategori lain atau tambahkan foto baru ke Firestore.</p>
          </div>
        )}

      </div>
    </section>
  );
};
