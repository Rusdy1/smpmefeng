import React, { useEffect, useState } from 'react';
import { 
  X, 
  History, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  CheckCircle,
  FileText,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { MessageSubmission } from '../types';
import { subscribeToUserMessages, updateRegistrationPayment } from '../services/firestoreService';
import { payWithSnap } from '../services/midtransService';
import { useAuth } from '../context/AuthContext';

interface UserMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserMessagesModal: React.FC<UserMessagesModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<MessageSubmission[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !currentUser) return;

    const unsubscribe = subscribeToUserMessages(currentUser.uid, (data) => {
      setMessages(data);
    });

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  return (
    <div 
      id="user-messages-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/20 flex items-center justify-center text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Riwayat Pesan Terkirim</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Data tersimpan di Firebase Firestore untuk akun {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-700">Belum ada pesan terkirim</h4>
              <p className="text-xs text-slate-500">
                Pesan yang Anda kirim melalui formulir kontak akan muncul di sini secara real-time.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={msg.id || index}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{msg.name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{msg.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      Status: {msg.status || 'Baru'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString('id-ID') : ''}
                    </span>
                  </div>
                </div>

                {/* Registration Data if available */}
                {(msg.nisn || msg.nik || msg.nkk || msg.asalSekolah || msg.namaIbu || msg.namaAyah) ? (
                  <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs space-y-2">
                    <p className="font-bold text-blue-900 uppercase tracking-wide text-[11px]">
                      Data Pendaftaran Calon Siswa
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                      {msg.nisn && <div><span className="text-slate-400 block text-[10px]">NISN:</span><strong>{msg.nisn}</strong></div>}
                      {msg.nik && <div><span className="text-slate-400 block text-[10px]">NIK:</span><strong>{msg.nik}</strong></div>}
                      {msg.nkk && <div><span className="text-slate-400 block text-[10px]">NKK:</span><strong>{msg.nkk}</strong></div>}
                      {msg.asalSekolah && <div><span className="text-slate-400 block text-[10px]">Asal Sekolah:</span><strong>{msg.asalSekolah}</strong></div>}
                      {msg.namaIbu && <div><span className="text-slate-400 block text-[10px]">Nama Ibu:</span><strong>{msg.namaIbu}</strong></div>}
                      {msg.namaAyah && <div><span className="text-slate-400 block text-[10px]">Nama Ayah:</span><strong>{msg.namaAyah}</strong></div>}
                    </div>

                    {/* Midtrans Payment Details & Pay Action */}
                    {msg.paymentAmount && (
                      <div className="pt-2 border-t border-blue-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                          <span className="font-semibold text-slate-700">Biaya Pendaftaran:</span>
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            msg.paymentStatus === 'settlement'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            Rp 200.000 ({msg.paymentStatus === 'settlement' ? 'Lunas' : 'Menunggu Pembayaran'})
                          </span>
                        </div>

                        {msg.paymentStatus !== 'settlement' && (msg.snapToken || msg.snapRedirectUrl) && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (msg.snapToken) {
                                await payWithSnap(msg.snapToken, {
                                  onSuccess: async (res) => {
                                    if (msg.id) {
                                      await updateRegistrationPayment(msg.id, {
                                        paymentStatus: 'settlement',
                                        paymentType: res.payment_type || 'online',
                                        transactionTime: res.transaction_time || new Date().toISOString()
                                      });
                                    }
                                  }
                                });
                              } else if (msg.snapRedirectUrl) {
                                window.open(msg.snapRedirectUrl, '_blank');
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Bayar Sekarang (Rp 200.000)</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <p><strong className="text-slate-700">Telepon:</strong> {msg.phone}</p>
                      <p><strong className="text-slate-700">Alamat:</strong> {msg.address}</p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <p className="font-semibold text-slate-900 mb-1">Isi Pesan:</p>
                      <p>{msg.message}</p>
                    </div>
                  </>
                )}

                {/* Photo Attachments (Pas Foto, Ijazah, KK) */}
                {(msg.photoData || msg.fotoIjazahData || msg.fotoKkData) && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-slate-700">Berkas Dokumen Terlampir:</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {msg.photoData && (
                        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg">
                          <img 
                            src={msg.photoData} 
                            alt="Pas Foto" 
                            onClick={() => setSelectedPhoto(msg.photoData)}
                            className="w-12 h-12 rounded object-cover border border-slate-300 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-800">Pas Foto</p>
                            <button
                              onClick={() => setSelectedPhoto(msg.photoData)}
                              className="text-[11px] text-blue-600 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Lihat</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.fotoIjazahData && (
                        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg">
                          <img 
                            src={msg.fotoIjazahData} 
                            alt="Foto Ijazah" 
                            onClick={() => setSelectedPhoto(msg.fotoIjazahData!)}
                            className="w-12 h-12 rounded object-cover border border-slate-300 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-800">Foto Ijazah</p>
                            <button
                              onClick={() => setSelectedPhoto(msg.fotoIjazahData!)}
                              className="text-[11px] text-blue-600 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Lihat</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.fotoKkData && (
                        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg">
                          <img 
                            src={msg.fotoKkData} 
                            alt="Foto KK" 
                            onClick={() => setSelectedPhoto(msg.fotoKkData!)}
                            className="w-12 h-12 rounded object-cover border border-slate-300 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-800">Foto KK</p>
                            <button
                              onClick={() => setSelectedPhoto(msg.fotoKkData!)}
                              className="text-[11px] text-blue-600 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>Lihat</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Selected Photo Viewer inside modal */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-xl max-h-[85vh] p-2 bg-white rounded-2xl overflow-hidden">
              <img src={selectedPhoto} alt="Foto Penuh" className="max-h-[80vh] w-auto object-contain rounded-xl" />
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 bg-slate-900/80 text-white p-1.5 rounded-full hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
