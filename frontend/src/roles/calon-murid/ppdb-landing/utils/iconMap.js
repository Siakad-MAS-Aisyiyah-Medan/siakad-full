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

const ICON_MAP = {
  gift: Gift,
  award: Award,
  percent: Percent,
  heart: Heart,
  church: Church,
  graduation: GraduationCap,
  monitor: Monitor,
  building: Building2,
  library: Library,
  volleyball: Volleyball,
  utensils: UtensilsCrossed,
  shield: Shield,
  dumbbell: Dumbbell,
  users: Users,
  book: BookOpen,
};

export function guessIconKey(text) {
  if (!text || typeof text !== 'string') return null;
  const lower = text.toLowerCase();
  
  if (lower.includes('komputer') || lower.includes('lab') || lower.includes('tik')) return 'monitor';
  if (lower.includes('perpustakaan') || lower.includes('baca') || lower.includes('buku') || lower.includes('tahfidz') || lower.includes('alquran')) return 'book';
  if (lower.includes('mushola') || lower.includes('masjid') || lower.includes('agama') || lower.includes('ibadah')) return 'church';
  if (lower.includes('olahraga') || lower.includes('lapangan') || lower.includes('futsal') || lower.includes('basket') || lower.includes('voli')) return 'volleyball';
  if (lower.includes('seni') || lower.includes('musik') || lower.includes('tari')) return 'heart';
  if (lower.includes('pramuka') || lower.includes('paskibra') || lower.includes('pmr') || lower.includes('keamanan') || lower.includes('tapak suci') || lower.includes('beladiri')) return 'shield';
  if (lower.includes('boga') || lower.includes('masak') || lower.includes('keterampilan') || lower.includes('kantin')) return 'utensils';
  if (lower.includes('kelas') || lower.includes('gedung') || lower.includes('ruang')) return 'building';
  if (lower.includes('siswa') || lower.includes('osis') || lower.includes('rohis')) return 'users';

  return null;
}

export function resolveIcon(key, fallback = Gift) {
  if (!key || typeof key !== 'string') return fallback;
  return ICON_MAP[key.toLowerCase().trim()] ?? fallback;
}
