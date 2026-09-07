import React, { useEffect, useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Trash2, 
  Search, 
  Filter, 
  Send, 
  AlertCircle,
  Eye,
  CheckCircle,
  MessageCircle,
  Sparkles,
  BarChart3,
  Calendar,
  UserPlus,
  CreditCard
} from 'lucide-react';
import { MessageSubmission, UserProfile } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { 
  subscribeToAllMessages, 
  subscribeToAllUsers, 
  updateMessageStatus, 
  deleteMessage,
  ADMIN_EMAIL
} from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'messages' | 'users' | 'stats'>('messages');
  const [messages, setMessages] = useState<MessageSubmission[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Baru' | 'Dibaca' | 'Dibalas'>('Semua');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);

  useEffect(() => {
    if (!isOpen || !isAdmin) return;

    const unsubMessages = subscribeToAllMessages((data) => {
      setMessages(data);
    });

    const unsubUsers = subscribeToAllUsers((data) => {
      setUsers(data);
    });

    return () => {
      unsubMessages();
      unsubUsers();
    };
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  // Filtered Messages
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.phone.includes(searchQuery) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'Semua' || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => 
    (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status counters
  const newMessagesCount = messages.filter(m => m.status === 'Baru').length;
  const readMessagesCount = messages.filter(m => m.status === 'Dibaca').length;
  const repliedMessagesCount = messages.filter(m => m.status === 'Dibalas').length;

  const handleStatusChange = async (messageId: string, newStatus: 'Baru' | 'Dibaca' | 'Dibalas') => {
    setIsProcessing(messageId);
    try {
      await updateMessageStatus(messageId, newStatus);
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteMessage = (messageId: string, name: string) => {
    setMessageToDelete({ id: messageId, name });
  };

  const handleConfirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    const target = messageToDelete;
    setIsDeletingMessage(true);

    try {
      // 1. Optimistic state update
      setMessages((prev) => prev.filter((m) => m.id !== target.id));
      // 2. Delete from Firestore database
      await deleteMessage(target.id);
      setMessageToDelete(null);
    } catch (e) {
      console.error('Failed to delete message from Firestore:', e);
      setMessageToDelete(null);
    } finally {
      setIsDeletingMessage(false);
    }
  };

  const generateWhatsAppLink = (phone: string, name: string) => {
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }
    const text = encodeURIComponent(`Halo Bpk/Ibu ${name},\nTerima kasih telah menghubungi Kepala Sekolah SMP MEFENG melalui Website Resmi Portfolio Sekolah.\n\nMenanggapi pesan yang telah Anda kirimkan: `);
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div 
      id="owner-dashboard-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Panel Pemilik Sekolah & Administrasi
                </h3>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Owner / Kepala Sekolah
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>SMP MEFENG • Masuk sebagai:</span>
                <span className="font-semibold text-emerald-400">{currentUser?.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('messages'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Pendaftaran & Pesan Masuk</span>
              {newMessagesCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {newMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Pengguna yang Login</span>
              <span className="bg-slate-300 text-slate-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Statistik</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab !== 'stats' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'messages' ? 'Cari nama, pesan, no HP...' : 'Cari nama atau email pengguna...'}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          )}
        </div>

        {/* Tab 1: MESSAGES LIST */}
        {activeTab === 'messages' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Status:
                </span>
                {(['Semua', 'Baru', 'Dibaca', 'Dibalas'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st} {st === 'Baru' && newMessagesCount > 0 ? `(${newMessagesCount})` : ''}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Menampilkan <strong className="text-slate-800">{filteredMessages.length}</strong> pesan
              </p>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="text-center py-16 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700">Tidak ada pesan yang cocok</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== 'Semua' 
                    ? 'Coba sesuaikan kata kunci pencarian atau filter status pesan Anda.'
                    : 'Belum ada pengguna atau pengunjung yang mengirim pesan melalui formulir kontak.'}
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 ${
                    msg.status === 'Baru' 
                      ? 'bg-amber-50/40 border-amber-200 shadow-xs' 
                      : msg.status === 'Dibalas'
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Message Top Bar */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-3">
                      {msg.userPhotoURL ? (
                        <img 
                          src={msg.userPhotoURL} 
                          alt={msg.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{msg.name}</h4>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Akun: {msg.userEmail}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-blue-500" /> {msg.email}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <Phone className="w-3 h-3 text-emerald-600" /> {msg.phone}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status Badges */}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                        msg.status === 'Baru'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : msg.status === 'Dibalas'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {msg.status === 'Baru' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                        {msg.status === 'Dibaca' && <Eye className="w-3 h-3 text-blue-600" />}
                        {msg.status === 'Dibalas' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        <span>Status: {msg.status}</span>
                      </span>

                      {/* Midtrans Payment Status Badge */}
                      {msg.paymentAmount ? (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                          msg.paymentStatus === 'settlement'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          <CreditCard className="w-3 h-3" />
                          <span>
                            {msg.paymentStatus === 'settlement' ? 'Lunas Rp 200.000' : 'Menunggu Bayar Rp 200.000'}
                          </span>
                        </span>
                      ) : null}

                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                      </span>
                    </div>
                  </div>

                  {/* Registration Data if available */}
                  {(msg.nisn || msg.nik || msg.nkk || msg.asalSekolah || msg.namaIbu || msg.namaAyah) ? (
                    <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-blue-950 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                          <UserPlus className="w-3.5 h-3.5 text-blue-700" />
                          <span>Data Lengkap Pendaftaran Siswa</span>
                        </p>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                          PPDB Online
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                        {msg.nisn && (
                          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block font-semibold">NISN</span>
                            <span className="font-bold text-slate-900">{msg.nisn}</span>
                          </div>
                        )}
                        {msg.nik && (
                          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block font-semibold">NIK Siswa</span>
                            <span className="font-bold text-slate-900">{msg.nik}</span>
                          </div>
                        )}
                        {msg.nkk && (
                          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block font-semibold">Nomor KK</span>
                            <span className="font-bold text-slate-900">{msg.nkk}</span>
                          </div>
                        )}
                        {msg.asalSekolah && (
                          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block font-semibold">Asal Sekolah</span>
                            <span className="font-bold text-slate-900">{msg.asalSekolah}</span>
                          </div>
                        )}
                        {msg.namaIbu && (
                          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block font-semibold">Nama Ibu Kandung</span>
                            <span className="font-bold text-slate-900">{msg.namaIbu}</span>
                          </div>
                        )}
                        {msg.namaAyah && (
                          <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block font-semibold">Nama Ayah Kandung</span>
                            <span className="font-bold text-slate-900">{msg.namaAyah}</span>
                          </div>
                        )}
                        {msg.orderId && (
                          <div className="bg-white p-2 rounded-lg border border-indigo-100 shadow-2xs">
                            <span className="text-[10px] text-slate-500 block font-semibold">Order ID Midtrans</span>
                            <span className="font-bold text-indigo-700 font-mono text-[11px] truncate block">{msg.orderId}</span>
                          </div>
                        )}
                        <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                          <span className="text-[10px] text-slate-500 block font-semibold">Biaya & Status</span>
                          <span className={`font-bold ${msg.paymentStatus === 'settlement' ? 'text-emerald-700' : 'text-amber-700'}`}>
                            Rp 200.000 ({msg.paymentStatus === 'settlement' ? 'Lunas' : 'Menunggu'})
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Fallback for regular message */
                    <div className="space-y-2 text-xs">
                      {msg.address && (
                        <div className="flex items-start gap-1.5 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                          <span><strong>Alamat:</strong> {msg.address}</span>
                        </div>
                      )}
                      {msg.message && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                          <strong className="text-slate-900 block mb-1">Isi Pesan:</strong>
                          {msg.message}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Photo Attachments (Pas Foto, Foto Ijazah, Foto KK) */}
                  {(msg.photoData || msg.fotoIjazahData || msg.fotoKkData) && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-900">Berkas Foto & Dokumen Pendukung:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {msg.photoData && (
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
                            <img 
                              src={msg.photoData} 
                              alt="Pas Foto" 
                              onClick={() => setSelectedPhoto(msg.photoData)}
                              className="w-14 h-14 rounded-lg object-cover border border-slate-300 cursor-pointer hover:opacity-85 transition-opacity shrink-0" 
                            />
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-900 truncate">Pas Foto Siswa</p>
                              <button
                                onClick={() => setSelectedPhoto(msg.photoData)}
                                className="mt-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Lihat Penuh</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {msg.fotoIjazahData && (
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
                            <img 
                              src={msg.fotoIjazahData} 
                              alt="Foto Ijazah" 
                              onClick={() => setSelectedPhoto(msg.fotoIjazahData!)}
                              className="w-14 h-14 rounded-lg object-cover border border-slate-300 cursor-pointer hover:opacity-85 transition-opacity shrink-0" 
                            />
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-900 truncate">Foto Ijazah / SKL</p>
                              <button
                                onClick={() => setSelectedPhoto(msg.fotoIjazahData!)}
                                className="mt-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Lihat Penuh</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {msg.fotoKkData && (
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
                            <img 
                              src={msg.fotoKkData} 
                              alt="Foto KK" 
                              onClick={() => setSelectedPhoto(msg.fotoKkData!)}
                              className="w-14 h-14 rounded-lg object-cover border border-slate-300 cursor-pointer hover:opacity-85 transition-opacity shrink-0" 
                            />
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-900 truncate">Foto Kartu Keluarga</p>
                              <button
                                onClick={() => setSelectedPhoto(msg.fotoKkData!)}
                                className="mt-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Lihat Penuh</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons for Owner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-500">Ubah Status:</span>
                      <button
                        onClick={() => handleStatusChange(msg.id!, 'Baru')}
                        disabled={isProcessing === msg.id}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          msg.status === 'Baru' 
                            ? 'bg-amber-600 text-white font-bold' 
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                        }`}
                      >
                        Baru
                      </button>
                      <button
                        onClick={() => handleStatusChange(msg.id!, 'Dibaca')}
                        disabled={isProcessing === msg.id}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          msg.status === 'Dibaca' 
                            ? 'bg-blue-600 text-white font-bold' 
                            : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-800'
                        }`}
                      >
                        Tandai Dibaca
                      </button>
                      <button
                        onClick={() => handleStatusChange(msg.id!, 'Dibalas')}
                        disabled={isProcessing === msg.id}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          msg.status === 'Dibalas' 
                            ? 'bg-emerald-600 text-white font-bold' 
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                      >
                        Tandai Selesai / Dibalas
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* WhatsApp Quick Reply */}
                      <a
                        href={generateWhatsAppLink(msg.phone, msg.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                        title="Balas cepat via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Balas WhatsApp</span>
                      </a>

                      {/* Email Quick Reply */}
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent('Tanggapan Pesan dari Kepala Sekolah SMP MEFENG')}&body=${encodeURIComponent(`Halo ${msg.name},\n\nTerima kasih telah menghubungi SMP MEFENG...\n\nSalam,\nRusdi Ishak, S.Pd.\nKepala Sekolah SMP MEFENG`)}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                        title="Balas via Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Kirim Email</span>
                      </a>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (msg.id) {
                            handleDeleteMessage(msg.id, msg.name);
                          }
                        }}
                        disabled={isProcessing === msg.id || isDeletingMessage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition-all shadow-2xs hover:shadow-sm cursor-pointer disabled:opacity-50"
                        title="Hapus Data Ini"
                        aria-label="Hapus Data Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: LOGGED-IN USERS LIST */}
        {activeTab === 'users' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Daftar Pengguna yang Pernah / Sedang Login
                </h4>
                <p className="text-xs text-slate-500">
                  Riwayat akun Google yang terautentikasi dan tersimpan di database Firestore.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl">
                Total: {filteredUsers.length} Pengguna
              </span>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700">Tidak ada pengguna ditemukan</h4>
                <p className="text-xs text-slate-500">Coba periksa kata kunci pencarian Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredUsers.map((u) => {
                  const isUserOwner = u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || u.role === 'admin';
                  const userMessagesCount = messages.filter(m => m.userEmail === u.email || m.userId === u.uid).length;

                  return (
                    <div 
                      key={u.uid}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isUserOwner 
                          ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                          : 'bg-white border-slate-200 shadow-xs hover:border-blue-300'
                      }`}
                    >
                      {u.photoURL ? (
                        <img 
                          src={u.photoURL} 
                          alt={u.displayName} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-base shrink-0 shadow-xs">
                          {(u.displayName || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-sm font-bold text-slate-900 truncate">
                            {u.displayName}
                          </h5>
                          {isUserOwner ? (
                            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                              Pemilik
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                              Pengunjung
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Login: {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                          </span>
                          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {userMessagesCount} pesan dikirim
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: STATS & SUMMARY */}
        {activeTab === 'stats' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Total Pesan</span>
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-blue-950">{messages.length}</p>
                <p className="text-xs text-blue-700/80">Semua formulir kontak masuk</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pesan Baru</span>
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-3xl font-extrabold text-amber-950">{newMessagesCount}</p>
                <p className="text-xs text-amber-700/80">Perlu ditindaklanjuti</p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Selesai / Dibalas</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-emerald-950">{repliedMessagesCount}</p>
                <p className="text-xs text-emerald-700/80">Telah ditanggapi Kepala Sekolah</p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Pengguna Login</span>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-extrabold text-purple-950">{users.length}</p>
                <p className="text-xs text-purple-700/80">Akun Google terdaftar</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Informasi Hak Akses & Privasi</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Hanya akun resmi pemilik aplikasi (<strong>{ADMIN_EMAIL}</strong>) yang memiliki hak istimewa untuk melihat seluruh daftar pengunjung yang login dan semua pesan masuk dari pengunjung. Pengunjung biasa yang melakukan login hanya dapat mengirim pesan konsultasi/pertanyaan dan melihat riwayat pesan milik akun mereka sendiri.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Confirm Delete Message Modal */}
      <ConfirmModal
        isOpen={Boolean(messageToDelete)}
        onClose={() => setMessageToDelete(null)}
        onConfirm={handleConfirmDeleteMessage}
        title="Hapus Pesan Masuk"
        message="Apakah Anda yakin ingin menghapus pesan ini secara permanen dari kotak masuk administrasi?"
        itemName={messageToDelete ? `Pesan dari: ${messageToDelete.name}` : undefined}
        confirmLabel="Ya, Hapus Pesan"
        cancelLabel="Batal"
        isDeleting={isDeletingMessage}
      />

      {/* Selected Photo Viewer */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[85vh] p-2 bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            <img src={selectedPhoto} alt="Foto Lampiran" className="max-h-[80vh] w-auto object-contain rounded-2xl" />
            <button 
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-slate-900/80 text-white p-2.5 rounded-full hover:bg-slate-900 cursor-pointer transition-colors shadow-lg"
              title="Tutup Foto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
