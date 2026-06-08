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

export function resolveIcon(key, fallback = Gift) {
  if (!key || typeof key !== 'string') return fallback;
  return ICON_MAP[key.toLowerCase().trim()] ?? fallback;
}
