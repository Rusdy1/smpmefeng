import { SchoolProfile, GalleryItem, AchievementItem, TeacherItem, FacilityItem } from '../types';

export const initialSchoolProfile: SchoolProfile = {
  name: 'SMP MEFENG',
  tagline: 'Mewujudkan Generasi Cerdas, Berkarakter, Mandiri, Berakhlak Mulia & Berdaya Saing di Bumi Saruma',
  npsn: '60203264',
  accreditation: 'Akreditasi Resmi Kemendikbudristek',
  headmaster: {
    name: 'Rusdi Ishak, S.Pd.',
    title: 'Kepala Sekolah SMP MEFENG',
    photoUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787202498/YHUDIX_1.png',
    greeting: 'Assalamu’alaikum Warahmatullahi Wabarakatuh dan Salam Sejahtera. Selamat datang di Website Resmi Portfolio SMP MEFENG. Kami berkomitmen untuk terus meningkatkan mutu pendidikan, integritas moral, kepemimpinan, dan kreativitas siswa di Halmahera Selatan, Maluku Utara.'
  },
  vision: 'Terwujudnya peserta didik yang beriman, bertaqwa, berprestasi, berwawasan lingkungan, serta unggul dalam ilmu pengetahuan dan teknologi di era digital.',
  missions: [
    'Menyelenggarakan proses pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan (PAIKEM).',
    'Menumbuhkembangkan penghayatan terhadap ajaran agama dan norma budaya luhur bangsa.',
    'Meningkatkan kompetensi pendidik dan tenaga kependidikan secara berkelanjutan.',
    'Menyediakan dan mengoptimalkan sarana prasarana penunjang kegiatan belajar mengajar berbasis teknologi informasi.',
    'Mewujudkan peserta didik cinta kebersihan dan peduli lingkungan.',
    'Membangun kemitraan yang sinergis antara sekolah, komite, orang tua, dan masyarakat sekitar.'
  ],
  history: 'SMP MEFENG didirikan sebagai wujud dedikasi untuk mencerdaskan kehidupan bangsa di wilayah SP2 Lalubi, Desa Sumber Makmur, Kecamatan Gane Timur, Kabupaten Halmahera Selatan, Provinsi Maluku Utara. Sejak awal berdiri, sekolah terus bertumbuh membina potensi putra-putri daerah dengan semangat kebersamaan dan prestasi yang membanggakan.',
  stats: {
    students: 280,
    teachers: 22,
    classrooms: 9,
    graduatesSuccessRate: 100,
    achievementsCount: 38
  },
  contact: {
    email: 'rusdiishak82@admin.smp.belajar.id',
    phone: '+62 823-1216-8914',
    whatsapp: '+62 823-1216-8914',
    address: 'Jln Poros No.1 trans SP2 Lalubi Desa Sumber Makmur Kec Gane Timur Kab Halmahera Selatan Provinsi Maluku Utara',
    postalCode: '97783',
    operatingHours: 'Senin - Jumat: 07.15 - 14.30 WIT | Sabtu: 07.15 - 12.30 WIT',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Desa+Sumber+Makmur+Gane+Timur+Halmahera+Selatan+Maluku+Utara&t=&z=13&ie=UTF8&iwloc=&output=embed',
    mapDirectLink: 'https://www.google.com/maps/search/?api=1&query=Jln+Poros+No.1+trans+SP2+Lalubi+Desa+Sumber+Makmur+Kec+Gane+Timur+Kab+Halmahera+Selatan+Provinsi+Maluku+Utara'
  },
  socialMedia: {
    instagram: 'https://instagram.com/smpmefeng_official',
    facebook: 'https://facebook.com/smpmefeng',
    youtube: 'https://youtube.com/@smpmefeng',
    tiktok: 'https://tiktok.com/@smpmefeng',
    whatsapp: 'https://wa.me/6282312168914',
    twitter: 'https://twitter.com/smpmefeng'
  }
};

export const initialGalleries: GalleryItem[] = [
  {
    title: 'Syukuran & Pelepasan Kelulusan Siswa SMP MEFENG',
    category: 'Kegiatan',
    imageUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787212512/IMG20230513130134.jpg',
    description: 'Momen penuh kebersamaan dan rasa syukur dewan guru serta siswa-siswi SMP MEFENG setelah menempuh dan menyelesaikan rangkaian Ujian Sekolah.',
    date: '13 Mei 2023',
    authorName: 'Sivitas SMP MEFENG'
  },
  {
    title: 'Kegiatan Masa Pengenalan Lingkungan Sekolah (MPLS) Daring & Edukatif',
    category: 'Kegiatan',
    imageUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787211374/IMG20260723151505.jpg',
    description: 'Pelaksanaan MPLS interaktif mengenalkan kultur belajar, visi misi, nilai budi pekerti, dan profil pendidik SMP MEFENG kepada peserta didik baru.',
    date: '23 Juli 2024',
    authorName: 'Panitia MPLS SMP MEFENG'
  },
  {
    title: 'Upacara Bendera Khidmat Sivitas Akademika SMP MEFENG',
    category: 'Kegiatan',
    imageUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787210606/upacara.jpg',
    description: 'Upacara bendera rutin dan pembinaan karakter disiplin yang diikuti oleh seluruh dewan guru dan peserta didik di halaman utama SMP MEFENG.',
    date: '15 Januari 2024',
    authorName: 'Humas SMP MEFENG'
  },
  {
    title: 'Pelaksanaan Ujian Sekolah Berbasis Komputer & Asesmen',
    category: 'Akademik',
    imageUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787210313/IMG20230509111429.jpg',
    description: 'Suasana pelaksanaan Ujian Sekolah tertib, mandiri, dan berintegritas tinggi untuk mengukur capaian kompetensi siswa SMP MEFENG.',
    date: '09 Mei 2023',
    authorName: 'Panitia Ujian Sekolah'
  },
  {
    title: 'Kegiatan Kepramukaan & Pendidikan Karakter Lapangan',
    category: 'Ekstrakurikuler',
    imageUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787210021/pramuka.jpg',
    description: 'Latihan kepramukaan, kerja sama tim, pembentukan kepribadian tangguh dan kepemimpinan generasi muda di Gugus Depan SMP MEFENG.',
    date: '18 Oktober 2023',
    authorName: 'Pembina Pramuka'
  },
  {
    title: 'Laboratorium Komputer & Coding Club STEM',
    category: 'Fasilitas',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    description: 'Praktikum pemrograman web, robotika, dan kecerdasan buatan di Lab Komputer berkecepatan tinggi.',
    date: '12 September 2025',
    authorName: 'Tim IT Sekolah'
  },
  {
    title: 'Juara 1 Lomba Cerdas Cermat Sains Tingkat Nasional',
    category: 'Prestasi',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    description: 'Tim Cerdas Cermat SMP MEFENG berhasil meraih piala bergilir Menteri Pendidikan Tut Wuri Handayani.',
    date: '05 Oktober 2025',
    authorName: 'Pembina OSIS'
  },
  {
    title: 'Pentas Seni Budaya Nusantara & Tari Tradisional',
    category: 'Ekstrakurikuler',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    description: 'Penampilan memukau tarian daerah Maluku Utara dan seni nusantara oleh siswa berbakat.',
    date: '20 November 2025',
    authorName: 'Sanggar Seni'
  },
  {
    title: 'Perpustakaan Digital Terintegrasi & Cozy Reading Corner',
    category: 'Fasilitas',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    description: 'Koleksi 20.000+ e-book dan ruang baca modern yang nyaman untuk riset dan diskusi siswa.',
    date: '08 Januari 2026',
    authorName: 'Kepala Perpustakaan'
  },
  {
    title: 'Karya Wisata Ilmiah & Studi Lapangan Konservasi Alam',
    category: 'Kegiatan',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    description: 'Eksplorasi ekosistem hutan mangrove dan observasi keanekaragaman hayati.',
    date: '22 April 2026',
    authorName: 'Panitia Field Trip'
  }
];

export const initialFacilities: FacilityItem[] = [
  {
    name: 'Smart Classrooms',
    description: 'Ruang kelas ber-AC dilengkapi Interactive Flat Panel Touchscreen, proyektor laser, dan sound system terintegrasi.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    iconName: 'Tv'
  },
  {
    name: 'Laboratorium Komputer & AI',
    description: '40 unit PC spesifikasi tinggi dengan koneksi internet fiber optik 1 Gbps untuk coding dan multimedia.',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
    iconName: 'Laptop'
  },
  {
    name: 'Laboratorium Sains Lengkap',
    description: 'Peralatan lab Fisika, Kimia, dan Biologi berstandar keamanan internasional dengan lemari asam dan mikroskop digital.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    iconName: 'FlaskConical'
  },
  {
    name: 'Perpustakaan & Ruang Multimedia',
    description: 'Pusat sumber belajar dengan puluhan ribu koleksi buku fisik, e-journal internasional, dan area santai.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
    iconName: 'BookOpen'
  },
  {
    name: 'Sport Center & Lapangan Indoor',
    description: 'Lapangan serbaguna untuk Futsal, Basket, Voli, Badminton, serta fasilitas atletik berstandar nasional.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    iconName: 'Trophy'
  },
  {
    name: 'Auditorium & Panggung Budaya',
    description: 'Gedung serbaguna berkapasitas 800 orang untuk seminar nasional, pertunjukan drama, dan wisuda akbar.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    iconName: 'Music'
  }
];

export const initialAchievements: AchievementItem[] = [
  {
    title: 'Medali Emas Olimpiade Sains Nasional (OSN) Matematika',
    category: 'Sains & Teknologi',
    winner: 'Ahmad Faiz & Tim',
    level: 'Nasional',
    year: '2025',
    description: 'Meraih skor sempurna dalam pemecahan soal kalkulus tingkat lanjut.',
    imageUrl: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Juara 1 World Youth Robot Championship',
    category: 'Robotika & AI',
    winner: 'Khadijah Putri & Naufal Rizky',
    level: 'Internasional (Tokyo)',
    year: '2025',
    description: 'Menciptakan robot pembersih sampah sungai otomatis bertenaga surya.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Grand Prix Paduan Suara & Orkestra Remaja',
    category: 'Seni Musik',
    winner: 'Harapan Bangsa Youth Choir',
    level: 'Tingkat Provinsi & Nasional',
    year: '2026',
    description: 'Membawakan aransemen lagu daerah Nusantara dengan harmonisasi 4 suara.',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Juara 1 DBL Basketball Championship Series',
    category: 'Olahraga',
    winner: 'Tim Basket Putra Garuda',
    level: 'Regional DKI Jakarta',
    year: '2026',
    description: 'Menumbangkan 32 tim sekolah unggulan dalam turnamen prestisius tahunan.',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80'
  }
];

export const initialTeachers: TeacherItem[] = [
  {
    name: 'Rusdi Ishak, S.Pd.',
    role: 'Kepala Sekolah SMP MEFENG',
    subject: 'Manajemen Pendidikan & Kepemimpinan Sekolah',
    education: 'Sarjana Pendidikan (S.Pd.)',
    photoUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787202498/YHUDIX_1.png'
  },
  {
    name: 'Radit',
    role: 'Dewan Guru & Tenaga Pendidik',
    subject: 'Bidang Pembelajaran & Bimbingan Peserta Didik',
    education: 'Tenaga Pendidik Profesional',
    photoUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787211287/FOTO_RADIT.png'
  },
  {
    name: 'Dewan Pendidik SMP MEFENG',
    role: 'Dewan Guru & Tenaga Pendidik',
    subject: 'Bidang Studi Kurikulum Merdeka',
    education: 'Tenaga Pendidik Profesional',
    photoUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787209822/IMAT.jpg'
  },
  {
    name: 'Dewan Pendidik SMP MEFENG',
    role: 'Dewan Guru & Tenaga Pendidik',
    subject: 'Bidang Pembinaan Karakter & Akademik',
    education: 'Tenaga Pendidik Profesional',
    photoUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787209813/AL_MAMA.jpg'
  },
  {
    name: 'Dewan Pendidik SMP MEFENG',
    role: 'Dewan Guru & Tenaga Pendidik',
    subject: 'Bidang Pengajaran & Kesiswaan',
    education: 'Tenaga Pendidik Profesional',
    photoUrl: 'https://res.cloudinary.com/bzjlphdy/image/upload/v1787210045/editPhoto_20230510_082430.jpg'
  }
];
