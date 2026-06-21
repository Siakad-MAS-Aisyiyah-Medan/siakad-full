import { Book, Users, GraduationCap, Calendar } from 'lucide-react';

export const SCHOOL_NAME = 'MAS Aisyiyah Medan';
export const SCHOOL_TAGLINE = 'Madrasah Aliyah Aisyiyah Medan';

export const NAV_ITEMS = [
  { id: 'home', label: 'Beranda' },
  { id: 'profil', label: 'Profil Sekolah' },
  { id: 'berita', label: 'Pengumuman' },
];

export const STATS = [
  { id: 'siswa', label: 'Siswa Aktif', value: '850+', icon: Users },
  { id: 'guru', label: 'Tenaga Pendidik', value: '48', icon: GraduationCap },
  { id: 'mapel', label: 'Mata Pelajaran', value: '24', icon: Book },
  { id: 'tahun', label: 'Tahun Berdiri', value: '1985', icon: Calendar },
];

export const FOOTER_LINKS = [
  { label: 'Beranda', sectionId: 'home' },
  { label: 'Profil Sekolah', sectionId: 'profil' },
  { label: 'Pengumuman', sectionId: 'berita' },
];
