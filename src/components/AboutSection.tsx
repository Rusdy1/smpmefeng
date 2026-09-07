import React, { useState } from 'react';
import { 
  Building2, 
  Target, 
  Compass, 
  Award, 
  BookOpen, 
  Users, 
  CheckCircle, 
  Sparkles, 
  Tv, 
  Laptop, 
  FlaskConical, 
  Trophy, 
  Music, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { SchoolProfile, TeacherItem, FacilityItem, AchievementItem } from '../types';
import { initialFacilities, initialTeachers, initialAchievements } from '../data/initialData';
import { TutWuriHandayaniLogo } from './TutWuriHandayaniLogo';

interface AboutSectionProps {
  profile: SchoolProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'fasilitas' | 'guru' | 'prestasi'>('profil');

  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tv': return <Tv className="w-5 h-5 text-blue-600" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-indigo-600" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5 text-emerald-600" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-orange-600" />;
      case 'Music': return <Music className="w-5 h-5 text-purple-600" />;
      default: return <Building2 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="about" className="py-20 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-xs font-bold uppercase tracking-wider">
              <TutWuriHandayaniLogo className="w-4 h-4 object-contain" />
              <span>Tut Wuri Handayani • Profil SMP MEFENG</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mengenal Lebih Dekat SMP MEFENG
          </h2>
          <p className="text-slate-600 text-base">
            Lembaga pendidikan formal berkomitmen tinggi mencetak generasi teladan dengan standar kurikulum unggul, fasilitas modern, dan pengajar berdedikasi di Halmahera Selatan.
          </p>

          {/* Sub-Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('profil')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'profil'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Visi, Misi & Sambutan
            </button>
            <button
              onClick={() => setActiveTab('fasilitas')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'fasilitas'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Fasilitas Kampus ({initialFacilities.length})
            </button>
            <button
              onClick={() => setActiveTab('guru')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'guru'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Dewan Pendidik ({initialTeachers.length})
            </button>
            <button
              onClick={() => setActiveTab('prestasi')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                activeTab === 'prestasi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Rekam Prestasi ({initialAchievements.length})
            </button>
          </div>
        </div>

        {/* TAB 1: PROFIL, SAMBUTAN & VISI MISI */}
        {activeTab === 'profil' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            
            {/* Sambutan Kepala Sekolah Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-52 sm:w-60 h-64 sm:h-72 rounded-3xl bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-100 p-2 overflow-hidden shadow-md border-4 border-white ring-2 ring-blue-500/20 flex items-center justify-center">
                    <img 
                      src={profile.headmaster.photoUrl} 
                      alt={profile.headmaster.name} 
                      className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
                    {profile.headmaster.title}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-5">
                  {profile.headmaster.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Kepala Sekolah SMP MEFENG
                </p>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-xs tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Sambutan Pimpinan Sekolah</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                  "Menumbuhkan Potensi Terbaik Setiap Insan Menuju Masa Depan Gemilang"
                </h3>
                <p className="text-slate-600 text-base leading-relaxed italic">
                  "{profile.headmaster.greeting}"
                </p>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                  <span>• Kurikulum Merdeka Terintegrasi</span>
                  <span>• Akreditasi A Unggul BAN-S/M</span>
                  <span>• Lingkungan Ramah Anak & Berbudaya</span>
                </div>
              </div>
            </div>

            {/* Visi & Misi CSS Grid (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Visi (Span 5) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 shadow-md flex flex-col justify-between space-y-6">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 mb-4">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Visi Sekolah</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 leading-relaxed">
                    "{profile.vision}"
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  Fokus Pembinaan: Karakter Luhur, Kemampuan Nalar Kritis, Literasi Digital, dan Kepedulian Sosial.
                </div>
              </div>

              {/* Misi (Span 7) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Misi Strategis</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Langkah Nyata Mewujudkan Keunggulan
                  </h3>
                </div>

                <ul className="space-y-3.5">
                  {profile.missions.map((mission, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed">{mission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sejarah Singkat */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center">
                  <TutWuriHandayaniLogo className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sejarah & Rekam Jejak</span>
                  <h3 className="text-lg font-bold text-slate-900">Perjalanan Pendidikan SMP MEFENG</h3>
                </div>
              </div>
              <p className="text-slate-600 text-base leading-relaxed">
                {profile.history}
              </p>
            </div>

          </div>
        )}

        {/* TAB 2: FASILITAS KAMPUS (CSS GRID) */}
        {activeTab === 'fasilitas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {initialFacilities.map((fac, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img 
                    src={fac.imageUrl} 
                    alt={fac.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-xs rounded-xl shadow-xs">
                    {getFacilityIcon(fac.iconName)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{fac.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{fac.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>Standar Nasional & Terawat</span>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: DEWAN PENDIDIK (TEACHERS GRID) */}
        {activeTab === 'guru' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 animate-in fade-in duration-300">
            {initialTeachers.map((teacher, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-between group"
              >
                <div className="space-y-4 w-full flex flex-col items-center">
                  <div className="w-32 h-36 rounded-2xl overflow-hidden bg-slate-100 shadow-sm mx-auto ring-2 ring-blue-500/10 border-2 border-white">
                    <img 
                      src={teacher.photoUrl} 
                      alt={teacher.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-full">
                    <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {teacher.role}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 leading-tight">
                      {teacher.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      {teacher.subject}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 w-full text-[11px] text-slate-500 font-medium truncate">
                  {teacher.education}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: REKAM PRESTASI (ACHIEVEMENTS GRID) */}
        {activeTab === 'prestasi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {initialAchievements.map((ach, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={ach.imageUrl} 
                      alt={ach.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs uppercase">
                      Tahun {ach.year}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {ach.level}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {ach.title}
                    </h3>
                    <p className="text-xs text-slate-500 italic">
                      Peraih: <span className="font-semibold text-slate-700">{ach.winner}</span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-bold">
                    <span>{ach.category}</span>
                    <Award className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
