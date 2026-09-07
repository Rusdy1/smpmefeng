export interface SchoolProfile {
  id?: string;
  name: string;
  tagline: string;
  npsn: string;
  accreditation: string;
  headmaster: {
    name: string;
    title: string;
    photoUrl: string;
    greeting: string;
  };
  vision: string;
  missions: string[];
  history: string;
  stats: {
    students: number;
    teachers: number;
    classrooms: number;
    graduatesSuccessRate: number;
    achievementsCount: number;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    postalCode: string;
    operatingHours: string;
    mapEmbedUrl: string;
    mapDirectLink: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
    whatsapp: string;
    twitter: string;
  };
}

export interface GalleryItem {
  id?: string;
  title: string;
  category: 'Akademik' | 'Ekstrakurikuler' | 'Fasilitas' | 'Prestasi' | 'Kegiatan' | 'Semua';
  imageUrl: string;
  description: string;
  date: string;
  authorName?: string;
  createdAt?: string;
}

export interface AchievementItem {
  id?: string;
  title: string;
  category: string;
  winner: string;
  level: string;
  year: string;
  description: string;
  imageUrl: string;
}

export interface TeacherItem {
  id?: string;
  name: string;
  role: string;
  subject: string;
  education: string;
  photoUrl: string;
}

export interface FacilityItem {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  iconName: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  firstLoginAt: string;
  lastLoginAt: string;
  lastIpOrAgent?: string;
  messageCount?: number;
}

export interface MessageSubmission {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;

  // Formulir Pendaftaran Siswa Baru (PPDB) Fields:
  nisn?: string;
  nik?: string;
  nkk?: string;
  asalSekolah?: string;
  namaIbu?: string;
  namaAyah?: string;

  // 1. Pas Foto Calon Siswa
  photoData: string;
  photoFileName?: string;
  photoFileSize?: number;

  // 2. Foto Ijazah
  fotoIjazahData?: string;
  fotoIjazahFileName?: string;
  fotoIjazahFileSize?: number;

  // 3. Foto Kartu Keluarga (KK)
  fotoKkData?: string;
  fotoKkFileName?: string;
  fotoKkFileSize?: number;

  // Midtrans Payment Information (Biaya Pendaftaran Rp 200.000)
  paymentStatus?: 'pending' | 'settlement' | 'capture' | 'deny' | 'cancel' | 'expire' | 'failure';
  paymentAmount?: number;
  orderId?: string;
  paymentType?: string;
  transactionTime?: string;
  snapToken?: string;
  snapRedirectUrl?: string;

  userId: string;
  userEmail: string;
  userDisplayName?: string;
  userPhotoURL?: string;
  createdAt: string;
  status: 'Baru' | 'Dibaca' | 'Dibalas';
  adminNotes?: string;
}

export type RegistrationSubmission = MessageSubmission;

