import {
  Award,
  BookOpen,
  Building2,
  Dumbbell,
  Gift,
  GraduationCap,
  Heart,
  Library,
  Monitor,
  Church,
  Percent,
  Shield,
  Users,
  UtensilsCrossed,
  Volleyball,
} from 'lucide-react';

/** Fallback statis jika API tidak tersedia */
export const PPDB_DEFAULTS = {
  schoolName: 'MAS Aisyiyah Medan',
  title: 'Penerimaan Peserta Didik Baru',
  academicYear: '2026/2027',
  description:
    'MAS Aisyiyah Medan membuka pendaftaran peserta didik baru Tahun Pelajaran 2026/2027.',
  heroHighlights: [
    { text: 'Gratis uang pembangunan', icon: Gift },
    { text: 'Gratis pendaftaran 20 pendaftar pertama', icon: Award },
    { text: 'Diskon alumni Muhammadiyah/Aisyiyah', icon: Percent },
    { text: 'Gratis SPP bagi anak yatim (syarat berlaku)', icon: Heart },
  ],
  waves: [
    {
      id: 'gelombang-1',
      title: 'Gelombang 1',
      period: 'Januari – Maret 2026',
      badge: 'Dibuka',
      perks: [
        'Gratis uang pembangunan',
        'Gratis uang ekskul 6 bulan untuk juara 1, 2, 3',
      ],
    },
    {
      id: 'gelombang-2',
      title: 'Gelombang 2',
      period: 'April – Juni 2026',
      badge: 'Segera',
      perks: [
        'Gratis uang pembangunan',
        'Gratis uang ekskul 3 bulan untuk juara 1, 2, 3',
      ],
    },
  ],
  promo: [
    {
      title: 'Gratis Biaya Pendaftaran',
      desc: 'Untuk 20 pendaftar pertama pada periode yang ditentukan.',
      icon: Gift,
    },
    {
      title: 'Diskon Alumni 50%',
      desc: 'Alumni SMP/MTs Muhammadiyah/Aisyiyah mendapat diskon khusus.',
      icon: Percent,
    },
    {
      title: 'Gratis SPP Anak Yatim',
      desc: 'Program bantuan SPP bagi anak yatim sesuai ketentuan sekolah.',
      icon: Heart,
    },
    {
      title: 'Lingkungan Islami',
      desc: 'Pembinaan karakter dan keagamaan terintegrasi setiap hari.',
      icon: Church,
    },
    {
      title: 'Guru Berpengalaman',
      desc: 'Tenaga pendidik profesional dan berkompeten di bidangnya.',
      icon: GraduationCap,
    },
    {
      title: 'Pembelajaran Modern',
      desc: 'Kurikulum nasional dengan penguatan IPTEK dan literasi digital.',
      icon: Monitor,
    },
  ],
  requirements: [
    'Mengisi formulir pendaftaran online',
    'Fotokopi akta kelahiran',
    'Fotokopi kartu keluarga',
    'Fotokopi KTP orang tua',
    'Pas foto 3×4 sebanyak 4 lembar',
    'Fotokopi ijazah/SKL legalisir',
    'Fotokopi KIP (jika ada)',
    'NISN',
  ],
  facilities: [
    { name: 'Ruang Kelas Luas', icon: Building2 },
    { name: 'Ruang Perpustakaan', icon: Library },
    { name: 'Mushola', icon: Church },
    { name: 'Lapangan Olahraga', icon: Volleyball },
    { name: 'Ruang Komputer', icon: Monitor },
    { name: 'Ruang Keterampilan', icon: UtensilsCrossed },
  ],
  extracurricular: [
    { name: 'Pramuka', icon: Shield },
    { name: 'Futsal', icon: Dumbbell },
    { name: 'Tapak Suci', icon: Users },
    { name: 'Tahfidz', icon: BookOpen },
    { name: 'Tata Boga', icon: UtensilsCrossed },
  ],
  flow: [
    'Lihat informasi PPDB',
    'Buat akun calon murid',
    'Login calon murid',
    'Isi formulir online',
    'Upload berkas',
    'Submit pendaftaran',
    'Verifikasi admin',
    'Pengumuman hasil',
  ],
  contacts: [
    { name: 'Muharleny Br Damanik, S.Ag', phones: ['+62 813 9686 5480'] },
    { name: 'Sri Wahyuni, S.Pd', phones: ['+62 813 7444 5100'] },
    {
      name: 'Anggi Mira, S.Pd',
      phones: ['+62 813 9686 5480', '+62 813 7444 5100'],
    },
  ],
  address: 'Jl. Demak No. 3, Medan',
};

export const FOOTER_LINKS = [
  { label: 'Beranda Sekolah', href: '/home' },
  { label: 'Daftar Akun', href: '/register-calon-murid' },
  { label: 'Login Calon Murid', href: '/login' },
];
