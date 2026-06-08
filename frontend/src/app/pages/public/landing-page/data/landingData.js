import { Award, Book, Heart, Star, Users, GraduationCap, Trophy, Calendar } from 'lucide-react';

export const SCHOOL_NAME = 'MAS Aisyiyah Medan';
export const SCHOOL_TAGLINE = 'Madrasah Aliyah Aisyiyah Medan';

export const NAV_ITEMS = [
  { id: 'home', label: 'Beranda' },
  { id: 'profil', label: 'Profil Sekolah' },
  { id: 'berita', label: 'Berita & Prestasi' },
  { id: 'ekskul', label: 'Ekstrakurikuler' },
];

export const STATS = [
  { id: 'siswa', label: 'Siswa Aktif', value: '850+', icon: Users },
  { id: 'guru', label: 'Tenaga Pendidik', value: '48', icon: GraduationCap },
  { id: 'prestasi', label: 'Prestasi Nasional', value: '120+', icon: Trophy },
  { id: 'tahun', label: 'Tahun Berdiri', value: '1985', icon: Calendar },
];

export const NEWS_DATA = [
  {
    id: 1,
    title: 'Juara 1 Lomba MTK Nasional',
    date: '12 April 2026',
    category: 'Prestasi',
    image: Award,
    excerpt: 'Siswa MAS Aisyiyah meraih prestasi membanggakan di tingkat nasional.',
  },
  {
    id: 2,
    title: 'Kegiatan Bakti Sosial 2026',
    date: '10 April 2026',
    category: 'Berita',
    image: Users,
    excerpt: 'Seluruh siswa berpartisipasi dalam agenda tahunan bakti sosial.',
  },
  {
    id: 3,
    title: 'Peresmian Laboratorium Baru',
    date: '05 April 2026',
    category: 'Berita',
    image: Book,
    excerpt: 'Fasilitas baru untuk mendukung praktik sains dan riset siswa.',
  },
];

export const EKSKUL_DATA = [
  {
    name: 'Pramuka',
    desc: 'Melatih kedisiplinan dan kemandirian siswa melalui kegiatan kepanduan.',
    icon: Award,
  },
  {
    name: 'PMR',
    desc: 'Siswa dilatih sigap dalam memberikan pertolongan pertama.',
    icon: Heart,
  },
  {
    name: 'Seni Tari',
    desc: 'Melestarikan budaya melalui tarian tradisional dan kreasi modern.',
    icon: Star,
  },
  {
    name: 'Futsal',
    desc: 'Mengembangkan sportivitas, kerja tim, dan jiwa kompetitif sehat.',
    icon: Trophy,
  },
  {
    name: 'Rohis',
    desc: 'Memperdalam pemahaman agama dan membangun karakter islami.',
    icon: Book,
  },
  {
    name: 'English Club',
    desc: 'Meningkatkan kemampuan berbahasa Inggris secara aktif dan kreatif.',
    icon: GraduationCap,
  },
];

export const FOOTER_LINKS = [
  { label: 'Beranda', sectionId: 'home' },
  { label: 'Profil Sekolah', sectionId: 'profil' },
  { label: 'Berita & Prestasi', sectionId: 'berita' },
  { label: 'Ekstrakurikuler', sectionId: 'ekskul' },
];
