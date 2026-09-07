import React, { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MessageModal } from './components/MessageModal';
import { UserMessagesModal } from './components/UserMessagesModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { GalleryLightbox } from './components/GalleryLightbox';
import { AddGalleryModal } from './components/AddGalleryModal';
import { AuthModal } from './components/AuthModal';
import { BackToTop } from './components/BackToTop';
import { ConfirmModal } from './components/ConfirmModal';

import { SchoolProfile, GalleryItem } from './types';
import { initialSchoolProfile, initialGalleries } from './data/initialData';
import { 
  seedFirestoreIfEmpty, 
  getSchoolProfile, 
  subscribeToGalleries,
  deleteGalleryItem
} from './services/firestoreService';
import { useAntiInspect } from './hooks/useAntiInspect';

function MainApp() {
  // Apply anti-inspect security protections (disable right-click, block F12, Ctrl+Shift+I, etc.)
  useAntiInspect();

  const [profile, setProfile] = useState<SchoolProfile>(initialSchoolProfile);
  const [galleries, setGalleries] = useState<GalleryItem[]>(initialGalleries);
  
  // Modals state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isUserMessagesOpen, setIsUserMessagesOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<GalleryItem | null>(null);
  const [isDeletingGallery, setIsDeletingGallery] = useState(false);

  useEffect(() => {
    // 1. Initial firestore seed check
    seedFirestoreIfEmpty();

    // 2. Fetch profile from Firestore
    getSchoolProfile().then((data) => {
      if (data) setProfile(data);
    });

    // 3. Realtime subscription to galleries from Firestore
    const unsubscribeGalleries = subscribeToGalleries((items) => {
      if (items && items.length > 0) {
        setGalleries(items);
      }
    });

    return () => {
      unsubscribeGalleries();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenAddModal = () => {
    setEditingGalleryItem(null);
    setIsAddGalleryOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setIsAddGalleryOpen(true);
  };

  const handleDeleteGallery = (item: GalleryItem) => {
    setGalleryToDelete(item);
  };

  const handleConfirmDeleteGallery = async () => {
    if (!galleryToDelete) return;
    const target = galleryToDelete;
    setIsDeletingGallery(true);

    try {
      // 1. Instant optimistic state update
      setGalleries((prev) => 
        prev.filter((g) => {
          if (target.id && g.id) return g.id !== target.id;
          return g.imageUrl !== target.imageUrl;
        })
      );

      // 2. Delete from Firestore database
      await deleteGalleryItem(target);

      // 3. Close Lightbox if the active item was deleted
      if (
        selectedGalleryItem && 
        ((target.id && selectedGalleryItem.id === target.id) || selectedGalleryItem.imageUrl === target.imageUrl)
      ) {
        setSelectedGalleryItem(null);
      }

      setGalleryToDelete(null);
    } catch (err) {
      console.error('Failed to delete gallery item from Firestore:', err);
      // Close confirmation dialog even if error
      setGalleryToDelete(null);
    } finally {
      setIsDeletingGallery(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Semantic HTML5 Header */}
      <Header
        onOpenMessageModal={() => setIsMessageModalOpen(true)}
        onOpenUserMessagesModal={() => setIsUserMessagesOpen(true)}
        onOpenOwnerDashboardModal={() => setIsOwnerDashboardOpen(true)}
      />

      {/* Semantic HTML5 Main */}
      <main className="flex-1">
        {/* Section 1: Beranda / Hero */}
        <Hero
          profile={profile}
          onOpenMessageModal={() => setIsMessageModalOpen(true)}
          onExploreGallery={() => scrollToSection('gallery')}
          onOpenOwnerDashboard={() => setIsOwnerDashboardOpen(true)}
        />

        {/* Section 2: About (Visi Misi, Fasilitas, Guru, Prestasi) */}
        <AboutSection profile={profile} />

        {/* Section 3: Gallery (Galeri Kegiatan & Momen) */}
        <GallerySection
          galleries={galleries}
          onSelectImage={(item) => setSelectedGalleryItem(item)}
          onOpenAddModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
          onDeleteImage={handleDeleteGallery}
        />

        {/* Section 4: Contact (Kiri: Email, Telepon, Alamat | Kanan: Peta) */}
        <ContactSection
          profile={profile}
          onOpenMessageModal={() => setIsMessageModalOpen(true)}
        />
      </main>

      {/* Semantic HTML5 Footer (Copyright & Social Media Links) */}
      <Footer
        profile={profile}
        onOpenMessageModal={() => setIsMessageModalOpen(true)}
      />

      {/* Modals & Dialogs */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        onSuccessSubmitted={() => {
          // Success handled in modal
        }}
      />

      <UserMessagesModal
        isOpen={isUserMessagesOpen}
        onClose={() => setIsUserMessagesOpen(false)}
      />

      <OwnerDashboardModal
        isOpen={isOwnerDashboardOpen}
        onClose={() => setIsOwnerDashboardOpen(false)}
      />

      <GalleryLightbox
        item={selectedGalleryItem}
        onClose={() => setSelectedGalleryItem(null)}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteGallery}
      />

      <AddGalleryModal
        isOpen={isAddGalleryOpen}
        onClose={() => {
          setIsAddGalleryOpen(false);
          setEditingGalleryItem(null);
        }}
        editItem={editingGalleryItem}
      />

      <ConfirmModal
        isOpen={Boolean(galleryToDelete)}
        onClose={() => setGalleryToDelete(null)}
        onConfirm={handleConfirmDeleteGallery}
        title="Hapus Foto Galeri"
        message="Apakah Anda yakin ingin menghapus foto ini dari galeri sekolah SMP MEFENG? Tindakan ini akan menghapus data dari sistem."
        itemName={galleryToDelete?.title}
        confirmLabel="Ya, Hapus Foto"
        cancelLabel="Batal"
        isDeleting={isDeletingGallery}
      />

      <AuthModal />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
