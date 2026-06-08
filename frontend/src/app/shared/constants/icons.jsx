import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  Settings,
  ClipboardList,
  BarChart3,
  FileText,
  Calendar,
  Bell,
  School,
  Star,
  Upload,
} from 'lucide-react';

export const menuIcons = {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  Settings,
  ClipboardList,
  BarChart3,
  FileText,
  Calendar,
  Bell,
  School,
  Star,
  Upload,
};

export function renderMenuIcon(iconKey, size = 20) {
  const Icon = menuIcons[iconKey];
  return Icon ? <Icon size={size} /> : null;
}
