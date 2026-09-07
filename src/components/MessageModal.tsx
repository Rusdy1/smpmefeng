import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  School,
  Fingerprint,
  Users,
  FileText,
  Image as ImageIcon,
  Trash2,
  UserPlus,
  CreditCard,
  ShieldCheck,
  ExternalLink,
  Check
} from 'lucide-react';
import { submitMessage, updateRegistrationPayment } from '../services/firestoreService';
import { createRegistrationTransaction, payWithSnap, REGISTRATION_FEE } from '../services/midtransService';
import { useAuth } from '../context/AuthContext';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmitted?: () => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccessSubmitted
}) => {
  const { currentUser, loginWithGoogle } = useAuth();
  
  // Form States - Data Calon Siswa
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nisn, setNisn] = useState('');
  const [nik, setNik] = useState('');
  const [nkk, setNkk] = useState('');
  const [asalSekolah, setAsalSekolah] = useState('');

  // Data Orang Tua
  const [namaIbu, setNamaIbu] = useState('');
  const [namaAyah, setNamaAyah] = useState('');
  
  // Dokumen 1: Pas Foto Calon Siswa
  const [photoData, setPhotoData] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [photoFileSize, setPhotoFileSize] = useState<number>(0);
  const [photoError, setPhotoError] = useState<string>('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Dokumen 2: Foto Ijazah
  const [fotoIjazahData, setFotoIjazahData] = useState<string>('');
  const [fotoIjazahFileName, setFotoIjazahFileName] = useState<string>('');
  const [fotoIjazahFileSize, setFotoIjazahFileSize] = useState<number>(0);
  const [fotoIjazahError, setFotoIjazahError] = useState<string>('');
  const ijazahInputRef = useRef<HTMLInputElement>(null);

  // Dokumen 3: Foto KK (Kartu Keluarga)
  const [fotoKkData, setFotoKkData] = useState<string>('');
  const [fotoKkFileName, setFotoKkFileName] = useState<string>('');
  const [fotoKkFileSize, setFotoKkFileSize] = useState<number>(0);
  const [fotoKkError, setFotoKkError] = useState<string>('');
  const kkInputRef = useRef<HTMLInputElement>(null);
  
  // Submission & Validation States
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Midtrans Payment States
  const [orderId, setOrderId] = useState<string>('');
  const [snapToken, setSnapToken] = useState<string>('');
  const [snapRedirectUrl, setSnapRedirectUrl] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'settlement' | 'error'>('idle');
  const [paymentType, setPaymentType] = useState<string>('');
  const [submittedDocId, setSubmittedDocId] = useState<string>('');

  // Auto-fill logged in user email & name if available
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.displayName || '');
      if (!email) setEmail(currentUser.email || '');
    }
  }, [currentUser, isOpen]);

  // Reset form when closed or after success
  const resetForm = () => {
    setName(currentUser?.displayName || '');
    setEmail(currentUser?.email || '');
    setPhone('');
    setNisn('');
    setNik('');
    setNkk('');
    setAsalSekolah('');
    setNamaIbu('');
    setNamaAyah('');

    setPhotoData('');
    setPhotoFileName('');
    setPhotoFileSize(0);
    setPhotoError('');

    setFotoIjazahData('');
    setFotoIjazahFileName('');
    setFotoIjazahFileSize(0);
    setFotoIjazahError('');

    setFotoKkData('');
    setFotoKkFileName('');
    setFotoKkFileSize(0);
    setFotoKkError('');

    setErrorMessage('');
    setIsSuccess(false);
    setOrderId('');
    setSnapToken('');
    setSnapRedirectUrl('');
    setPaymentStatus('idle');
    setPaymentType('');
    setSubmittedDocId('');
  };

  if (!isOpen) return null;

  // Process and compress image file to standard JPEG (max 1000px)
  const processImageFile = (
    file: File
  ): Promise<{ dataUrl: string; fileName: string; fileSize: number }> => {
    return new Promise((resolve, reject) => {
      const validExtensions = ['.jpg', '.jpeg', '.png'];
      const fileName = file.name.toLowerCase();
      const isExtensionValid = validExtensions.some(ext => fileName.endsWith(ext));
      const isMimeValid = file.type === 'image/jpeg' || file.type === 'image/png';

      if (!isExtensionValid || !isMimeValid) {
        reject(new Error('Format foto tidak valid! Wajib file berekstensi .JPEG atau .PNG.'));
        return;
      }

      if (file.size > 8 * 1024 * 1024) {
        reject(new Error('Ukuran file maksimal 8 MB.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1000;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              dataUrl: e.target?.result as string,
              fileName: file.name,
              fileSize: file.size
            });
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          const approxSize = Math.round((compressedDataUrl.length * 3) / 4);
          resolve({
            dataUrl: compressedDataUrl,
            fileName: file.name,
            fileSize: approxSize
          });
        };
        img.onerror = () => {
          resolve({
            dataUrl: e.target?.result as string,
            fileName: file.name,
            fileSize: file.size
          });
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Gagal membaca berkas foto.'));
      reader.readAsDataURL(file);
    });
  };

  // 1. Handle Pas Foto
  const handlePhotoUpload = async (file: File | null) => {
    setPhotoError('');
    if (!file) return;
    try {
      const res = await processImageFile(file);
      setPhotoData(res.dataUrl);
      setPhotoFileName(res.fileName);
      setPhotoFileSize(res.fileSize);
    } catch (err: any) {
      setPhotoError(err.message || 'Gagal mengunggah foto.');
      setPhotoData('');
      setPhotoFileName('');
      setPhotoFileSize(0);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  // 2. Handle Foto Ijazah
  const handleIjazahUpload = async (file: File | null) => {
    setFotoIjazahError('');
    if (!file) return;
    try {
      const res = await processImageFile(file);
      setFotoIjazahData(res.dataUrl);
      setFotoIjazahFileName(res.fileName);
      setFotoIjazahFileSize(res.fileSize);
    } catch (err: any) {
      setFotoIjazahError(err.message || 'Gagal mengunggah foto ijazah.');
      setFotoIjazahData('');
      setFotoIjazahFileName('');
      setFotoIjazahFileSize(0);
      if (ijazahInputRef.current) ijazahInputRef.current.value = '';
    }
  };

  // 3. Handle Foto KK
  const handleKkUpload = async (file: File | null) => {
    setFotoKkError('');
    if (!file) return;
    try {
      const res = await processImageFile(file);
      setFotoKkData(res.dataUrl);
      setFotoKkFileName(res.fileName);
      setFotoKkFileSize(res.fileSize);
    } catch (err: any) {
      setFotoKkError(err.message || 'Gagal mengunggah foto KK.');
      setFotoKkData('');
      setFotoKkFileName('');
      setFotoKkFileSize(0);
      if (kkInputRef.current) kkInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setPhotoError('');
    setFotoIjazahError('');
    setFotoKkError('');

    // Ensure user is logged in with Google
    if (!currentUser) {
      setErrorMessage('Anda wajib login dengan Akun Google terlebih dahulu sebelum melakukan pendaftaran.');
      return;
    }

    // Explicit validation check
    if (!name.trim()) {
      setErrorMessage('Nama lengkap calon siswa wajib diisi.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email aktif wajib diisi.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Nomor telepon / WhatsApp wajib diisi.');
      return;
    }
    if (!nisn.trim()) {
      setErrorMessage('NISN (Nomor Induk Siswa Nasional) wajib diisi.');
      return;
    }
    if (!nik.trim()) {
      setErrorMessage('NIK (Nomor Induk Kependudukan) wajib diisi.');
      return;
    }
    if (!nkk.trim()) {
      setErrorMessage('Nomor Kartu Keluarga (NKK) wajib diisi.');
      return;
    }
    if (!asalSekolah.trim()) {
      setErrorMessage('Asal sekolah sebelumnya wajib diisi.');
      return;
    }
    if (!namaIbu.trim()) {
      setErrorMessage('Nama ibu kandung wajib diisi.');
      return;
    }
    if (!namaAyah.trim()) {
      setErrorMessage('Nama ayah kandung wajib diisi.');
      return;
    }

    // Foto validation
    if (!photoData) {
      setPhotoError('Pas foto calon siswa wajib diunggah (.jpeg atau .png).');
      return;
    }
    if (!fotoIjazahData) {
      setFotoIjazahError('Foto ijazah / SKL wajib diunggah (.jpeg atau .png).');
      return;
    }
    if (!fotoKkData) {
      setFotoKkError('Foto Kartu Keluarga (KK) wajib diunggah (.jpeg atau .png).');
      return;
    }

    setSubmitting(true);
    const generatedOrderId = `PPDB-${Date.now().toString().slice(-6)}-${nisn.trim().slice(-4)}`;
    setOrderId(generatedOrderId);

    try {
      // 1. Create transaction token on Midtrans backend
      let midtransToken = '';
      let midtransRedirectUrl = '';

      try {
        const tx = await createRegistrationTransaction({
          orderId: generatedOrderId,
          customerDetails: {
            firstName: name.trim(),
            email: email.trim(),
            phone: phone.trim()
          },
          grossAmount: REGISTRATION_FEE
        });
        midtransToken = tx.token;
        midtransRedirectUrl = tx.redirect_url;
        setSnapToken(tx.token);
        setSnapRedirectUrl(tx.redirect_url);
      } catch (midtransErr: any) {
        console.error('Midtrans initialization failed:', midtransErr);
        setErrorMessage(
          `Gagal menghubungkan ke Midtrans: ${midtransErr.message || 'Periksa server key atau koneksi internet.'}`
        );
        setSubmitting(false);
        return;
      }

      // 2. Save registration data in Firestore with pending payment status
      const savedDoc = await submitMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nisn: nisn.trim(),
        nik: nik.trim(),
        nkk: nkk.trim(),
        asalSekolah: asalSekolah.trim(),
        namaIbu: namaIbu.trim(),
        namaAyah: namaAyah.trim(),
        photoData,
        photoFileName,
        photoFileSize,
        fotoIjazahData,
        fotoIjazahFileName,
        fotoIjazahFileSize,
        fotoKkData,
        fotoKkFileName,
        fotoKkFileSize,
        message: `Pendaftaran Siswa Baru (Biaya Rp 200.000) - Asal Sekolah: ${asalSekolah.trim()} | NISN: ${nisn.trim()} | Orang Tua: ${namaAyah.trim()} & ${namaIbu.trim()}`,
        address: `Asal Sekolah: ${asalSekolah.trim()}`,
        userId: currentUser.uid,
        userEmail: currentUser.email || email,
        userDisplayName: currentUser.displayName || name,
        userPhotoURL: currentUser.photoURL || undefined,
        paymentStatus: 'pending',
        paymentAmount: REGISTRATION_FEE,
        orderId: generatedOrderId,
        snapToken: midtransToken,
        snapRedirectUrl: midtransRedirectUrl
      });

      setSubmittedDocId(savedDoc.id);

      // 3. Launch Midtrans Snap Popup for immediate payment
      try {
        await payWithSnap(midtransToken, {
          onSuccess: async (result: any) => {
            console.log('Midtrans Snap Success:', result);
            try {
              await updateRegistrationPayment(savedDoc.id, {
                paymentStatus: 'settlement',
                paymentType: result.payment_type || 'online',
                transactionTime: result.transaction_time || new Date().toISOString(),
                orderId: generatedOrderId,
                paymentAmount: REGISTRATION_FEE
              });
            } catch (updateErr) {
              console.warn('Failed to update Firestore payment status:', updateErr);
            }
            setPaymentStatus('settlement');
            setPaymentType(result.payment_type || 'Midtrans');
            setIsSuccess(true);
            if (onSuccessSubmitted) onSuccessSubmitted();
          },
          onPending: async (result: any) => {
            console.log('Midtrans Snap Pending:', result);
            try {
              await updateRegistrationPayment(savedDoc.id, {
                paymentStatus: 'pending',
                paymentType: result.payment_type || 'virtual_account',
                transactionTime: result.transaction_time || new Date().toISOString(),
                orderId: generatedOrderId,
                paymentAmount: REGISTRATION_FEE
              });
            } catch (updateErr) {
              console.warn('Failed to update Firestore pending status:', updateErr);
            }
            setPaymentStatus('pending');
            setPaymentType(result.payment_type || 'Menunggu Pembayaran');
            setIsSuccess(true);
            if (onSuccessSubmitted) onSuccessSubmitted();
          },
          onError: (result: any) => {
            console.error('Midtrans Snap Error:', result);
            setPaymentStatus('error');
            setIsSuccess(true);
            if (onSuccessSubmitted) onSuccessSubmitted();
          },
          onClose: () => {
            console.log('User closed Midtrans Snap without finishing payment');
            setPaymentStatus('pending');
            setIsSuccess(true);
            if (onSuccessSubmitted) onSuccessSubmitted();
          }
        });
      } catch (snapLaunchError: any) {
        console.warn('Direct Snap popup launch fallback:', snapLaunchError);
        setPaymentStatus('pending');
        setIsSuccess(true);
        if (onSuccessSubmitted) onSuccessSubmitted();
      }
    } catch (err: any) {
      console.error('Error submitting registration:', err);
      setErrorMessage(err?.message || 'Gagal menyimpan formulir pendaftaran. Periksa koneksi internet Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  // Re-open Snap Payment Popup for the current transaction
  const handleReopenSnap = async () => {
    if (snapToken) {
      try {
        await payWithSnap(snapToken, {
          onSuccess: async (result: any) => {
            if (submittedDocId) {
              await updateRegistrationPayment(submittedDocId, {
                paymentStatus: 'settlement',
                paymentType: result.payment_type || 'online',
                transactionTime: result.transaction_time || new Date().toISOString(),
                orderId,
                paymentAmount: REGISTRATION_FEE
              });
            }
            setPaymentStatus('settlement');
            setPaymentType(result.payment_type || 'Midtrans');
            if (onSuccessSubmitted) onSuccessSubmitted();
          },
          onPending: async (result: any) => {
            setPaymentStatus('pending');
            setPaymentType(result.payment_type || 'Menunggu Pembayaran');
          },
          onError: () => {
            setPaymentStatus('error');
          },
          onClose: () => {}
        });
        return;
      } catch (err) {
        console.warn('Error launching Snap on reopen:', err);
      }
    }

    if (snapRedirectUrl) {
      window.open(snapRedirectUrl, '_blank');
    }
  };

  return (
    <div 
      id="registration-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="registration-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200"
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">Formulir Pendaftaran Siswa Baru</h3>
              <p className="text-xs text-blue-100 mt-0.5">SMP MEFENG — Semua kolom bertanda bintang (*) wajib diisi</p>
            </div>
          </div>

          <button
            id="btn-close-registration-modal"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 max-h-[82vh] overflow-y-auto">
          
          {/* SUCCESS STATE */}
          {isSuccess ? (
            <div className="text-center py-8 space-y-5">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                paymentStatus === 'settlement' 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {paymentStatus === 'settlement' ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  <CreditCard className="w-9 h-9" />
                )}
              </div>

              <div>
                <h4 className="text-2xl font-bold text-slate-900">
                  {paymentStatus === 'settlement' 
                    ? 'Pendaftaran & Pembayaran Berhasil!' 
                    : 'Pendaftaran Berhasil Dikirim!'}
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mt-1.5">
                  {paymentStatus === 'settlement' ? (
                    <>Terima kasih, <strong>{name}</strong>. Data pendaftaran dan pembayaran biaya pendaftaran sebesar <strong>Rp 200.000</strong> telah berhasil diverifikasi oleh Midtrans.</>
                  ) : (
                    <>Terima kasih, <strong>{name}</strong>. Formulir calon siswa dan dokumen Anda telah tersimpan di database sekolah SMP MEFENG.</>
                  )}
                </p>
              </div>

              {/* Status Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-xs text-slate-800 text-left space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Status Pembayaran:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    paymentStatus === 'settlement'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {paymentStatus === 'settlement' ? 'LUNAS (Rp 200.000)' : 'MENUNGGU PEMBAYARAN (Rp 200.000)'}
                  </span>
                </div>
                {orderId && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">No. Transaksi (Order ID):</span>
                    <span className="font-mono font-semibold text-blue-700">{orderId}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Biaya Pendaftaran:</span>
                  <span className="font-bold text-slate-900">Rp 200.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nama Calon Siswa:</span>
                  <span className="font-semibold">{name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">NISN:</span>
                  <span className="font-semibold">{nisn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Asal Sekolah:</span>
                  <span className="font-semibold">{asalSekolah}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {paymentStatus !== 'settlement' && (
                  <button
                    type="button"
                    onClick={handleReopenSnap}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Bayar Sekarang (Midtrans)</span>
                  </button>
                )}

                {paymentStatus !== 'settlement' && snapRedirectUrl && (
                  <a
                    href={snapRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <span>Halaman Midtrans (Tab Baru)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Tutup / Selesai
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Google Auth Requirement Warning / Info */}
              {!currentUser ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Wajib login dengan Akun Google terlebih dahulu untuk mendaftar secara terverifikasi.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => loginWithGoogle()}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-xs cursor-pointer"
                  >
                    Login Google Sekarang
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-3 text-xs text-blue-900">
                  <div className="flex items-center gap-2">
                    {currentUser.photoURL && (
                      <img 
                        src={currentUser.photoURL} 
                        alt="" 
                        className="w-6 h-6 rounded-full ring-1 ring-blue-400"
                      />
                    )}
                    <span>Pendaftar Terverifikasi: <strong className="font-semibold">{currentUser.displayName || currentUser.email}</strong></span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">Terverifikasi</span>
                </div>
              )}

              {/* General Error Notice */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SECTION 1: DATA CALON SISWA */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">1. Data Calon Siswa</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nama Lengkap */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700">
                      Nama Lengkap Siswa <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        placeholder="Contoh: Muhammad Rusdi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700">
                      Email Aktif <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Nomor Telepon / WA */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-phone" className="block text-xs font-bold text-slate-700">
                      Nomor Telepon / WhatsApp <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-phone"
                        type="tel"
                        required
                        placeholder="081234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Asal Sekolah */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-asal-sekolah" className="block text-xs font-bold text-slate-700">
                      Asal Sekolah (SD/MI) <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <School className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-asal-sekolah"
                        type="text"
                        required
                        placeholder="Contoh: SD Negeri 1 Mefeng"
                        value={asalSekolah}
                        onChange={(e) => setAsalSekolah(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* NISN */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-nisn" className="block text-xs font-bold text-slate-700">
                      NISN (Nomor Induk Siswa Nasional) <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Fingerprint className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-nisn"
                        type="text"
                        required
                        placeholder="Contoh: 0081234567"
                        value={nisn}
                        onChange={(e) => setNisn(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* NIK */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-nik" className="block text-xs font-bold text-slate-700">
                      NIK (Nomor Induk Kependudukan Siswa) <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Fingerprint className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-nik"
                        type="text"
                        required
                        placeholder="16 digit NIK"
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* NKK */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="reg-nkk" className="block text-xs font-bold text-slate-700">
                      NKK (Nomor Kartu Keluarga) <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-nkk"
                        type="text"
                        required
                        placeholder="16 digit Nomor Kartu Keluarga"
                        value={nkk}
                        onChange={(e) => setNkk(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DATA ORANG TUA */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">2. Data Orang Tua</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nama Ibu */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-nama-ibu" className="block text-xs font-bold text-slate-700">
                      Nama Ibu Kandung <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-nama-ibu"
                        type="text"
                        required
                        placeholder="Contoh: Siti Aminah"
                        value={namaIbu}
                        onChange={(e) => setNamaIbu(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Nama Ayah */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-nama-ayah" className="block text-xs font-bold text-slate-700">
                      Nama Ayah Kandung <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-nama-ayah"
                        type="text"
                        required
                        placeholder="Contoh: Abdullah Ishak"
                        value={namaAyah}
                        onChange={(e) => setNamaAyah(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: UNGGAH FOTO & DOKUMEN */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">3. Unggah Berkas Foto Dokumen</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    Wajib .JPEG / .PNG
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* UPLOAD 1: PAS FOTO */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Pas Foto Siswa <span className="text-rose-500 font-extrabold">*</span>
                    </label>

                    <input
                      ref={photoInputRef}
                      id="input-file-pas-foto"
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePhotoUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {!photoData ? (
                      <div
                        onClick={() => photoInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files?.[0]) handlePhotoUpload(e.dataTransfer.files[0]);
                        }}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                          photoError 
                            ? 'border-rose-400 bg-rose-50/50' 
                            : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-blue-600 mb-2">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Pilih Pas Foto</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Format .JPEG/.PNG</p>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                        <img
                          src={photoData}
                          alt="Pas Foto"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-300 shrink-0"
                        />
                        <div className="overflow-hidden flex-1 text-left">
                          <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>Pas Foto OK</span>
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{photoFileName}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoData('');
                            setPhotoFileName('');
                            setPhotoFileSize(0);
                            if (photoInputRef.current) photoInputRef.current.value = '';
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-100/80 rounded-lg transition-colors cursor-pointer"
                          title="Hapus foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {photoError && <p className="text-[11px] text-rose-600 font-medium">{photoError}</p>}
                  </div>

                  {/* UPLOAD 2: FOTO IJAZAH */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Foto Ijazah / SKL <span className="text-rose-500 font-extrabold">*</span>
                    </label>

                    <input
                      ref={ijazahInputRef}
                      id="input-file-ijazah"
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleIjazahUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {!fotoIjazahData ? (
                      <div
                        onClick={() => ijazahInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files?.[0]) handleIjazahUpload(e.dataTransfer.files[0]);
                        }}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                          fotoIjazahError 
                            ? 'border-rose-400 bg-rose-50/50' 
                            : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 mb-2">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Pilih Foto Ijazah</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Format .JPEG/.PNG</p>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                        <img
                          src={fotoIjazahData}
                          alt="Foto Ijazah"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-300 shrink-0"
                        />
                        <div className="overflow-hidden flex-1 text-left">
                          <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>Ijazah OK</span>
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{fotoIjazahFileName}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFotoIjazahData('');
                            setFotoIjazahFileName('');
                            setFotoIjazahFileSize(0);
                            if (ijazahInputRef.current) ijazahInputRef.current.value = '';
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-100/80 rounded-lg transition-colors cursor-pointer"
                          title="Hapus foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {fotoIjazahError && <p className="text-[11px] text-rose-600 font-medium">{fotoIjazahError}</p>}
                  </div>

                  {/* UPLOAD 3: FOTO KK */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Foto Kartu Keluarga (KK) <span className="text-rose-500 font-extrabold">*</span>
                    </label>

                    <input
                      ref={kkInputRef}
                      id="input-file-kk"
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleKkUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {!fotoKkData ? (
                      <div
                        onClick={() => kkInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files?.[0]) handleKkUpload(e.dataTransfer.files[0]);
                        }}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                          fotoKkError 
                            ? 'border-rose-400 bg-rose-50/50' 
                            : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-emerald-600 mb-2">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Pilih Foto KK</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Format .JPEG/.PNG</p>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                        <img
                          src={fotoKkData}
                          alt="Foto Kartu Keluarga"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-300 shrink-0"
                        />
                        <div className="overflow-hidden flex-1 text-left">
                          <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>Foto KK OK</span>
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{fotoKkFileName}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFotoKkData('');
                            setFotoKkFileName('');
                            setFotoKkFileSize(0);
                            if (kkInputRef.current) kkInputRef.current.value = '';
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-100/80 rounded-lg transition-colors cursor-pointer"
                          title="Hapus foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {fotoKkError && <p className="text-[11px] text-rose-600 font-medium">{fotoKkError}</p>}
                  </div>

                </div>
              </div>

              {/* Section 4: Biaya Pendaftaran & Pembayaran Online Midtrans */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-slate-50 border border-blue-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-700" />
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      4. Biaya Pendaftaran Calon Siswa (Midtrans)
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
                    Rp 200.000
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Biaya Administrasi & Seleksi Masuk</p>
                      <p className="text-[11px] text-slate-500">Biaya pendaftaran resmi calon siswa baru SMP MEFENG Tahun Ajaran 2026/2027.</p>
                    </div>
                    <span className="text-base font-extrabold text-blue-700 whitespace-nowrap">
                      Rp 200.000
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700 mr-1">Metode Pembayaran Resmi:</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">QRIS</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">GoPay</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">ShopeePay</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">Transfer Bank (BCA, BNI, BRI, Mandiri)</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">Indomaret / Alfamart</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pembayaran diproses secara aman & otomatis terhubung dengan <strong>Midtrans Payment Gateway</strong>.</span>
                </div>
              </div>

              {/* Submit Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  id="btn-submit-registration-form"
                  type="submit"
                  disabled={submitting || !currentUser}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all ${
                    submitting || !currentUser
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 shadow-blue-500/25 cursor-pointer'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menghubungkan Midtrans...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Bayar & Daftar Sekarang (Rp 200.000)</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
