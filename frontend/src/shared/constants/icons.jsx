import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  Settings,
  User,
  ShieldCheck,
  ClipboardList,
  BarChart3,
  FileText,
  Calendar,
  CalendarDays,
  Bell,
  School,
  Star,
  Upload,
  Settings2,
  Folder,
  Send,
} from 'lucide-react';

export const menuIcons = {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  Settings,
  User,
  ShieldCheck,
  ClipboardList,
  BarChart3,
  FileText,
  Calendar,
  CalendarDays,
  Bell,
  School,
  Star,
  Upload,
  Settings2,
  Folder,
  Send,
};

export function renderMenuIcon(iconKey, size = 20) {
  const Icon = menuIcons[iconKey];
  return Icon ? <Icon size={size} /> : null;
}
