import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronRight, ClipboardList, Clock3, GraduationCap, Megaphone, Users, XCircle } from 'lucide-react';
import { getJsonItem } from '@app/shared/utils/storage';
import { getDisplayName } from '@app/shared/utils/profile';
import MainLayout from '@app/shared/layouts/MainLayout';

const topCards = [
  { label: 'Total Murid', value: '125', icon: GraduationCap, gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', shadow: 'rgba(5, 150, 105, 0.3)' },
  { label: 'Total Guru', value: '18', icon: Users, gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', shadow: 'rgba(59, 130, 246, 0.3)' },
  { label: 'Mata Pelajaran', value: '12', icon: ClipboardList, gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', shadow: 'rgba(245, 158, 11, 0.3)' },
  { label: 'Total Kelas', value: '24', icon: BookOpen, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', shadow: 'rgba(139, 92, 246, 0.3)' },
];

const ppdbRows = [
  { label: 'Total Pendaftar', value: '125', icon: Users, color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Diterima', value: '80', icon: CheckCircle2, color: '#059669', bg: '#ecfdf5' },
  { label: 'Ditolak', value: '25', icon: XCircle, color: '#ef4444', bg: '#fef2f2' },
  { label: 'Menunggu', value: '20', icon: Clock3, color: '#f59e0b', bg: '#fffbeb' },
];

const announcements = [
  { title: 'PPDB Tahun Ajaran 2026/2027 Telah Dibuka', date: '01/06/2026' },
  { title: 'Libur Hari Raya Idul Adha 1447 H', date: '25/05/2026' },
  { title: 'Rapat Guru dan Staf', date: '20/05/2026' },
  { title: 'Pengumpulan Raport Semester Genap', date: '15/05/2026' },
  { title: 'Ujian Akhir Semester Genap', date: '10/05/2026' },
];

function StatCard({ value, label, icon, gradient, shadow, delay }) {
  return (
    <div className="animate-fade-in-up" style={{ borderRadius: '18px', padding: '1.35rem', background: gradient, boxShadow: `0 8px 24px ${shadow}`, color: '#fff', position: 'relative', overflow: 'hidden', animationDelay: `${delay}s`, opacity: 0 }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>{label}</p>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {createElement(icon, { className: 'h-6 w-6', strokeWidth: 1.7 })}
        </div>
      </div>
    </div>
  );
}

export default function KepsekDashboard() {
  const user = getJsonItem('user');
  const profile = getJsonItem('profile');
  const name = getDisplayName(profile, user?.role ?? 'kepsek', user?.username);

  return (
    <MainLayout role="kepsek" name={name}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-5 py-6">
        <div className="animate-fade-in">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#064e3b', letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Ringkasan data sekolah</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {topCards.map((card, i) => (
            <StatCard key={card.label} {...card} delay={i * 0.08} />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {/* PPDB Summary */}
          <div className="animate-fade-in-up" style={{ borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', animationDelay: '0.3s', opacity: 0 }}>
            <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                <Users className="h-4 w-4" />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b' }}>Ringkasan PPDB</h2>
            </div>
            <div style={{ padding: '0.5rem' }}>
              {ppdbRows.map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '10px', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {createElement(item.icon, { className: 'h-4 w-4', strokeWidth: 2 })}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <Link to="/kepala-sekolah/data-ppdb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6', textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span>Lihat Detail PPDB</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Announcements */}
          <div className="animate-fade-in-up" style={{ borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', animationDelay: '0.35s', opacity: 0 }}>
            <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <Megaphone className="h-4 w-4" />
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b' }}>Pengumuman Terbaru</h2>
            </div>
            <div style={{ padding: '0.25rem 0.5rem' }}>
              {announcements.map((item) => (
                <div key={`${item.title}-${item.date}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s', borderRadius: '8px' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <span>{item.title}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{item.date}</span>
                </div>
              ))}
            </div>
            <Link to="/kepala-sekolah/pengumuman" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem', fontWeight: 600, color: '#059669', textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span>Lihat Semua Pengumuman</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
