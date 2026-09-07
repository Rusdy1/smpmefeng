import React from 'react';
import { X, Calendar, User, Pencil, Trash2 } from 'lucide-react';
import { GalleryItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface GalleryLightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onEdit?: (item: GalleryItem) => void;
  onDelete?: (item: GalleryItem) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ 
  item, 
  onClose,
  onEdit,
  onDelete
}) => {
  const { isAdmin } = useAuth();
  if (!item) return null;

  return (
    <div 
      id="gallery-lightbox-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white animate-in zoom-in-95 duration-200">
        
        {/* Top Control Bar */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {isAdmin && (
            <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-xs p-1 rounded-xl border border-white/10 shadow-lg">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(item);
                  }}
                  className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-white transition-all cursor-pointer"
                  title="Ubah Foto"
                  aria-label="Ubah Foto"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(item);
                  }}
                  className="p-2 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white transition-all cursor-pointer"
                  title="Hapus Foto"
                  aria-label="Hapus Foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-800 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup foto"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* High Res Image (Span 8) */}
          <div className="lg:col-span-8 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[450px]">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="max-h-[75vh] w-auto max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details Sidebar (Span 4) */}
          <div className="lg:col-span-4 p-6 flex flex-col justify-between space-y-6 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md">
                {item.category}
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Tanggal Dokumentasi: <strong className="text-slate-200">{item.date}</strong></span>
              </div>
              {item.authorName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Diunggah oleh: <strong className="text-slate-200">{item.authorName}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
