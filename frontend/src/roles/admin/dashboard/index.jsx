import React, { useEffect, useState } from 'react';
import { BookOpen, ClipboardList, GraduationCap, Users, Activity } from 'lucide-react';
import AdminPageShell from '@/shared/components/AdminPageShell';
import { fetchAdminDashboardStats } from '@/shared/services/dashboard.service';
import { useAuditLogs } from '@/shared/akademik/audit-logs/hooks/useAuditLogs';

const CARD_THEMES = [
  { gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', shadow: 'rgba(5, 150, 105, 0.3)' },
  { gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', shadow: 'rgba(59, 130, 246, 0.3)' },
  { gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', shadow: 'rgba(245, 158, 11, 0.3)' },
  { gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', shadow: 'rgba(139, 92, 246, 0.3)' },
];

function StatCard({ label, value, icon, loading, theme, delay }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        borderRadius: '18px',
        padding: '1.5rem 1.5rem',
        background: theme.gradient,
        boxShadow: `0 8px 24px ${theme.shadow}`,
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-30%', left: '-5%',
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
      }} />
      <div className="flex items-center justify-between gap-4" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {loading ? '...' : value || 0}
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            {label}
          </p>
        </div>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.2)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [realStats, setRealStats] = useState({
    total_guru: 0,
    total_murid: 0,
    total_mapel: 0,
    total_kelas: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const audit = useAuditLogs();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchAdminDashboardStats();
        setRealStats((previousStats) => data?.stats || previousStats);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const stats = [
    { label: 'Total Murid', value: realStats.total_murid, icon: <GraduationCap className="h-7 w-7" /> },
    { label: 'Total Guru', value: realStats.total_guru, icon: <Users className="h-7 w-7" /> },
    { label: 'Mata Pelajaran', value: realStats.total_mapel, icon: <ClipboardList className="h-7 w-7" /> },
    { label: 'Total Kelas', value: realStats.total_kelas, icon: <BookOpen className="h-7 w-7" /> },
  ];

  return (
    <AdminPageShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6">


        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} theme={CARD_THEMES[i]} loading={isLoading} delay={i * 0.08} />
          ))}
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
          <div style={{
            padding: '1.15rem 1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#059669',
            }}>
              <Activity className="h-4 w-4" />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b' }}>Audit Log</h2>
          </div>
          <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '450px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafb' }}>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Waktu</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Aktor</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Aksi</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subjek</th>
                </tr>
              </thead>
              <tbody>
                {audit.loading ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                      <div className="animate-pulse" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid #e2e8f0', borderTopColor: '#059669', borderRadius: '50%' }} />
                        Memuat audit log...
                      </div>
                    </td>
                  </tr>
                ) : audit.items.length ? (
                  audit.items.map((item, index) => {
                    let dateStr = item.created_at || item.waktu;
                    if (typeof dateStr === 'string' && dateStr.endsWith('Z')) {
                      dateStr = dateStr.slice(0, -1);
                    }
                    const dateObj = new Date(dateStr);
                    const formattedDate = isNaN(dateObj.getTime()) ? '-' : dateObj.toLocaleString('id-ID', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    });
                    
                    const actorName = item.actor?.role || item.actor?.username || item.aktor || '-';
                    let modelName = '';
                    if (item.subject_type) {
                        modelName = item.subject_type.split('\\\\').pop(); // e.g. App\Models\User -> User
                    }
                    
                    let metaInfo = '';
                    if (item.meta && typeof item.meta === 'object') {
                        if (item.meta.keys) {
                            metaInfo = ` (${item.meta.keys.length} item)`;
                        } else if (item.meta.key) {
                            metaInfo = ` (${item.meta.key})`;
                        }
                    }

                    // Jika backend memberikan subject_name (nama asli orang/objek), gunakan itu!
                    const displayRole = item.subject_role || modelName;
                    const subjectDisplay = item.subject_name 
                        ? `${item.subject_name} (${displayRole})`
                        : (modelName ? `${modelName} #${item.subject_id}${metaInfo}` : (item.subject || item.subjek || '-'));

                    return (
                      <tr key={item.id || index} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '0.85rem 1.5rem', fontSize: '0.85rem', color: '#334155' }}>{formattedDate}</td>
                        <td style={{ padding: '0.85rem 1.5rem', fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>{actorName}</td>
                        <td style={{ padding: '0.85rem 1.5rem' }}>
                          <span style={{ padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: '#ecfdf5', color: '#059669' }}>
                            {item.action || item.aksi || '-'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                          {subjectDisplay}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                      Belum ada aktivitas tercatat
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{
            padding: '0.75rem 1.5rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.78rem',
            color: '#94a3b8',
          }}>
            Total {audit.meta?.total || 0} entri
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
