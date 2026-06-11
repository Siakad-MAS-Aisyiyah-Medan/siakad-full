import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import {
  BookOpen,
  FileText,
  Settings,
  ShieldCheck,
  Database,
  Code,
  Shield,
} from 'lucide-react';

// ─── Data konfigurasi tiap card ────────────────────────────────────────────
const SETTING_CARDS = [
  {
    id: 'tahun-ajaran',
    icon: BookOpen,
    title: 'Tahun Ajaran Aktif',
    description: 'Atur tahun ajaran dan semester yang sedang berjalan.',
    preview: (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Tahun Ajaran</span>
          <span className="text-sm font-semibold text-emerald-600">2026/2027</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Semester</span>
          <span className="text-sm font-medium text-slate-700">Ganjil</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Digunakan oleh</span>
          <span className="text-sm font-medium text-slate-700">Murid, Kelas, Jadwal</span>
        </div>
      </div>
    ),
    buttonLabel: 'Kelola Tahun Ajaran',
    path: '/admin/pengaturan/tahun-ajaran',
  },
  {
    id: 'ppdb',
    icon: FileText,
    title: 'Pengaturan PPDB',
    description: 'Konfigurasi pendaftaran peserta didik baru.',
    preview: (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Status</span>
          <span className="text-sm font-semibold text-emerald-600">Dibuka</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Periode</span>
          <span className="text-sm font-medium text-slate-700">1 Jan – 30 Jun 2026</span>
        </div>
      </div>
    ),
    buttonLabel: 'Kelola PPDB',
    path: '/admin/ppdb',
  },
  {
    id: 'hak-akses',
    icon: ShieldCheck,
    title: 'Hak Akses Sistem',
    description: 'Kelola izin menu dan fitur untuk setiap role pengguna.',
    preview: (
      <div className="space-y-2">
        <span className="text-sm text-slate-500 block">Role terdaftar:</span>
        <div className="flex flex-wrap gap-2">
          {['Admin', 'Kepsek', 'Guru', 'Siswa', 'Calon Siswa'].map((role) => (
            <span
              key={role}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-xs font-medium"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    ),
    buttonLabel: 'Kelola Hak Akses',
    path: '/admin/hak-akses',
  },
  {
    id: 'akademik',
    icon: Settings,
    title: 'Pengaturan Akademik',
    description: 'Atur parameter akademik yang digunakan sistem.',
    preview: (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Maks. Siswa/Kelas</span>
          <span className="text-sm font-medium text-slate-700">36</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Jurusan IPA</span>
          <span className="text-sm font-semibold text-emerald-600">Aktif</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Jurusan IPS</span>
          <span className="text-sm font-semibold text-emerald-600">Aktif</span>
        </div>
      </div>
    ),
    buttonLabel: 'Kelola Akademik',
    path: '/admin/mapel',
  },
];

const INFO_ITEMS = [
  { icon: Settings,  label: 'Versi Sistem',    value: 'v1.0.0',     color: 'emerald' },
  { icon: Database,  label: 'Database',         value: 'MySQL',      color: 'blue'    },
  { icon: Code,      label: 'Backend',          value: 'Laravel',    color: 'red'     },
  { icon: Code,      label: 'Frontend',         value: 'React',      color: 'cyan'    },
  { icon: Shield,    label: 'Terakhir Backup',  value: '10 Jun 2026',color: 'emerald' },
];

// ─── Komponen Card ──────────────────────────────────────────────────────────
function SettingCard({ card, onNavigate }) {
  const Icon = card.icon;
  return (
    <div className="bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 rounded-2xl p-6 flex flex-col">
      {/* Ikon */}
      <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100 mb-4">
        <Icon size={22} strokeWidth={1.5} />
      </div>

      {/* Judul & Deskripsi */}
      <h3 className="text-base font-bold text-slate-800 mb-1">{card.title}</h3>
      <p className="text-sm text-slate-500 mb-4">{card.description}</p>

      {/* Preview — flex-1 agar tombol selalu di bawah */}
      <div className="flex-1">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          {card.preview}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-4 border-t border-slate-100 mt-4">
        <button
          onClick={() => onNavigate(card.path)}
          className="w-full h-[42px] bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 hover:shadow-md hover:shadow-emerald-500/20 active:scale-[0.98]"
        >
          {card.buttonLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Komponen Info ──────────────────────────────────────────────────────────
function InfoCard({ item }) {
  const Icon = item.icon;
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col items-center justify-center text-center cursor-default">
      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
        <Icon size={18} />
      </div>
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
        {item.label}
      </div>
      <div className="font-bold text-slate-700 text-base">{item.value}</div>
    </div>
  );
}

// ─── Halaman Utama ──────────────────────────────────────────────────────────
export default function PengaturanSistemPage() {
  const navigate = useNavigate();

  return (
    <AdminPageShell>
      <div className="data-panel view-list">

        {/* Header */}
        <div className="panel-header glass mb-8 py-4 px-6 rounded-2xl">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shrink-0">
              <Settings size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pengaturan Sistem</h2>
              <p className="text-slate-500 text-sm mt-0.5 max-w-xl">
                Kelola konfigurasi utama sistem akademik, tahun ajaran, PPDB, hak akses, dan pengaturan operasional sekolah.
              </p>
            </div>
          </div>
        </div>

        {/* Grid Card 2×2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {SETTING_CARDS.map((card) => (
            <SettingCard key={card.id} card={card} onNavigate={navigate} />
          ))}
        </div>

        {/* Informasi Sistem */}
        <h3 className="text-base font-bold text-slate-700 mb-4">Informasi Sistem</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {INFO_ITEMS.map((item) => (
            <InfoCard key={item.label} item={item} />
          ))}
        </div>

      </div>
    </AdminPageShell>
  );
}
