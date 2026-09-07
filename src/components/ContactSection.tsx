import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Navigation, 
  ExternalLink, 
  Send,
  Building,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import { SchoolProfile } from '../types';

interface ContactSectionProps {
  profile: SchoolProfile;
  onOpenMessageModal: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ 
  profile, 
  onOpenMessageModal 
}) => {
  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kontak & Lokasi Kampus</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Kami & Kunjungi Kampus
          </h2>
          <p className="text-slate-600 text-base">
            Kami siap melayani informasi pendaftaran peserta didik baru (PPDB), kerja sama akademik, dan konsultasi edukasi.
          </p>
        </div>

        {/* Layout requirement: Di layar lebar (lg:grid-cols-12), Email/Telepon/Alamat di KIRI dan Peta di KANAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* KOLOM KIRI: Informasi Email, Telepon, Alamat & Jam Layanan (Span 5) */}
          <div id="contact-info-left-column" className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex-1 flex flex-col justify-between">
              
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Layanan Informasi Terpadu</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">Sekretariat & Humas Sekolah</h3>
                </div>

                {/* List: Alamat, Telepon, Email, Jam Kerja */}
                <div className="space-y-4">
                  
                  {/* ALAMAT */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Sekolah</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5 leading-snug">
                        {profile.contact.address}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">Kode Pos: {profile.contact.postalCode}</p>
                    </div>
                  </div>

                  {/* TELEPON & WHATSAPP */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Telepon & WhatsApp</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">
                        <a href={`tel:${profile.contact.phone.replace(/\s+/g, '')}`} className="hover:text-blue-600">
                          {profile.contact.phone}
                        </a>
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                        <a href={profile.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                          WA Center: {profile.contact.whatsapp}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Resmi</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">
                        <a href={`mailto:${profile.contact.email}`} className="hover:text-blue-600">
                          {profile.contact.email}
                        </a>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">Respon rata-rata dalam 1x24 jam kerja</p>
                    </div>
                  </div>

                  {/* JAM KERJA */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Operasional Pelayanan</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-relaxed">
                        {profile.contact.operatingHours}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Call to action modal trigger button */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button
                  id="btn-open-modal-from-contact"
                  onClick={onOpenMessageModal}
                  className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Daftar Sekarang / Formulir Pendaftaran</span>
                </button>
                <p className="text-[11px] text-center text-slate-500 italic">
                  *Formulir pendaftaran wajib melampirkan pas foto, foto ijazah, dan foto KK (.jpeg/.png)
                </p>
              </div>

            </div>

          </div>

          {/* KOLOM KANAN: Peta Interaktif / Google Maps (Span 7) */}
          <div id="contact-map-right-column" className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex-1 flex flex-col justify-between space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <h3 className="text-base font-bold text-slate-900">Peta Lokasi Kampus {profile.name}</h3>
                </div>
                <a
                  href={profile.contact.mapDirectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Responsive Wrapper */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 min-h-[360px] sm:min-h-[420px] flex-1">
                <iframe
                  title={`Peta Lokasi ${profile.name}`}
                  src={profile.contact.mapEmbedUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Direction Guide Note */}
              <div className="px-2 pt-1 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  Lokasi: Jln Poros No.1 SP2 Lallubi, Desa Sumber Makmur
                </span>
                <span className="text-slate-400 hidden sm:inline">Kec. Gane Timur, Kab. Halmahera Selatan</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
