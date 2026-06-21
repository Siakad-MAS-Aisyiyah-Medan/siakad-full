import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardList, GraduationCap, Megaphone, Users, ChevronRight } from 'lucide-react';
import { getJsonItem } from '@/shared/utils/storage';
import { getDisplayName } from '@/shared/utils/profile';
import MainLayout from '@/shared/layouts/MainLayout';
import { fetchPengumumanList } from '@/shared/pengumuman/services/pengumuman.service';
import { fetchAdminDashboardStats } from '@/shared/services/dashboard.service';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch {
    return dateString;
  }
};



function StatCard({ value, label, icon, gradient, shadow, delay }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        borderRadius: '18px',
        padding: '1.35rem 1.35rem',
        background: gradient,
        boxShadow: `0 8px 24px ${shadow}`,
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>{label}</p>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          {createElement(icon, { className: 'h-6 w-6', strokeWidth: 1.7 })}
        </div>
      </div>
    </div>
  );
}

export default function GuruDashboard() {
  const user = getJsonItem('user');
  const profile = getJsonItem('profile');
  const name = getDisplayName(profile, user?.role ?? 'guru', user?.username);

  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    total_murid: 0,
    total_guru: 0,
    total_mapel: 0,
    total_kelas: 0,
  });

  useEffect(() => {
    let active = true;
    
    Promise.all([
      fetchAdminDashboardStats().catch(() => ({ stats: {} })),
      fetchPengumumanList({ per_page: 4 }).catch(() => ([]))
    ]).then(([dashboardRes, newsRes]) => {
      if (active) {
        if (dashboardRes?.stats) setStats(dashboardRes.stats);
        if (newsRes && Array.isArray(newsRes)) setAnnouncements(newsRes);
      }
    });

    return () => { active = false; };
  }, []);

  return (
    <MainLayout role="guru" name={name}>
      <div className="mx-auto flex max-w-[1160px] flex-col gap-6 px-5 py-6">
        <div className="animate-fade-in">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#064e3b', letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Selamat datang di panel guru</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Murid" value={stats.total_murid} icon={GraduationCap} gradient="linear-gradient(135deg, #059669 0%, #10b981 100%)" shadow="rgba(5, 150, 105, 0.3)" delay={0.1} />
        <StatCard label="Total Guru" value={stats.total_guru} icon={Users} gradient="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)" shadow="rgba(59, 130, 246, 0.3)" delay={0.2} />
        <StatCard label="Mata Pelajaran" value={stats.total_mapel} icon={ClipboardList} gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)" shadow="rgba(245, 158, 11, 0.3)" delay={0.3} />
        <StatCard label="Total Kelas" value={stats.total_kelas} icon={BookOpen} gradient="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)" shadow="rgba(139, 92, 246, 0.3)" delay={0.4} />
      </div>

        <div
          className="animate-fade-in-up"
          style={{
            borderRadius: '18px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            animationDelay: '0.3s',
            opacity: 0,
          }}
        >
          <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Megaphone className="h-4 w-4" />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b' }}>Pengumuman Terbaru</h2>
          </div>

          <div style={{ padding: '0.25rem 0.5rem' }}>
            {announcements.length > 0 ? (
              announcements.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem', padding: '0.85rem 1rem',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background 0.15s', borderRadius: '8px', cursor: 'default',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#334155' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.judul}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDate(item.tanggal_publikasi)}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                Belum ada pengumuman terbaru
              </div>
            )}
          </div>

          <Link
            to="/guru/pengumuman"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.85rem 1.5rem', borderTop: '1px solid #f1f5f9',
              fontSize: '0.85rem', fontWeight: 600, color: '#059669',
              textDecoration: 'none', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>Lihat Semua Pengumuman</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
