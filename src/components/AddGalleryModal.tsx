import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Plus, UploadCloud, AlertCircle, Edit3, Check } from 'lucide-react';
import { addGalleryItem, updateGalleryItem } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import { GalleryItem } from '../types';

interface AddGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: GalleryItem | null;
}

const CATEGORIES: GalleryItem['category'][] = ['Kegiatan', 'Prestasi', 'Fasilitas', 'Ekstrakurikuler', 'Akademik'];

export const AddGalleryModal: React.FC<AddGalleryModalProps> = ({ isOpen, onClose, editItem }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('Kegiatan');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title || '');
      setCategory(editItem.category || 'Kegiatan');
      setImageUrl(editItem.imageUrl || '');
      setDescription(editItem.description || '');
      setDate(editItem.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    } else {
      setTitle('');
      setCategory('Kegiatan');
      setImageUrl('');
      setDescription('');
      setDate(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    }
    setError('');
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!title.trim() || !imageUrl.trim() || !description.trim()) {
      setError('Harap lengkapi semua kolom.');
      return;
    }

    setSubmitting(true);
    try {
      if (editItem && editItem.id) {
        await updateGalleryItem(editItem.id, {
          title: title.trim(),
          category,
          imageUrl: imageUrl.trim(),
          description: description.trim(),
          date: date.trim(),
          authorName: editItem.authorName || currentUser.displayName || 'Staf Sekolah'
        });
      } else {
        await addGalleryItem({
          title: title.trim(),
          category,
          imageUrl: imageUrl.trim(),
          description: description.trim(),
          date: date.trim(),
          authorName: currentUser.displayName || 'Staf Sekolah'
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving gallery item:', err);
      setError(err?.message || 'Gagal menyimpan foto ke Firestore.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {editItem ? (
              <Edit3 className="w-5 h-5 text-amber-400" />
            ) : (
              <ImageIcon className="w-5 h-5 text-emerald-400" />
            )}
            <h3 className="text-lg font-bold">
              {editItem ? 'Ubah Informasi Foto Galeri' : 'Tambah Foto Galeri Sekolah'}
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Judul Foto / Kegiatan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Juara 1 Lomba Robotika 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Tanggal Kegiatan</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">URL Gambar (Cloudinary / Unsplash) *</label>
            <input
              type="url"
              required
              placeholder="https://res.cloudinary.com/... atau https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Deskripsi Singkat *</label>
            <textarea
              required
              rows={3}
              placeholder="Deskripsi kegiatan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editItem ? 'Simpan Perubahan' : 'Simpan Foto'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
