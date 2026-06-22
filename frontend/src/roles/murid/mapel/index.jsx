import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Layers, Search, User } from 'lucide-react';
import MainLayout from '@/shared/layouts/MainLayout';
import PageHeader from '@/shared/components/PageHeader';
import { getStoredProfile, getStoredUser } from '@/shared/services/auth.service';
import apiClient from '@/shared/services/apiClient';
import { getDisplayName } from '@/shared/utils/profile';

export default function SiswaMapelPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  const [mapelList, setMapelList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMapel = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/mapel');
        const payload = response.data?.data;
        const items = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        setMapelList(items);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat mata pelajaran');
      } finally {
        setLoading(false);
      }
    };

    fetchMapel();
  }, []);

  const filteredMapel = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return mapelList;
    return mapelList.filter((mapel) => {
      const guru = mapel.guru?.nama_guru || mapel.guru?.guru?.nama_guru || mapel.guru?.profile?.nama_guru || '';
      return [
        mapel.nama_mapel,
        mapel.tingkat,
        mapel.kelompok_mapel,
        guru,
      ].some((value) => String(value || '').toLowerCase().includes(keyword));
    });
  }, [mapelList, search]);

  return (
    <MainLayout role="siswa" name={name}>
      <div className="admin-page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '-1.5rem', minHeight: 'calc(100vh - 84px)', background: 'var(--color-white)' }}>
        <PageHeader title="Mata Pelajaran" subtitle="Daftar mata pelajaran yang tersedia dalam sistem akademik sekolah.">
          <div className="animate-fade-in" style={{ position: 'relative', width: '260px', animationDelay: '0.1s' }}>
            <Search style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', width: '16px', height: '16px' }} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari mata pelajaran..."
              style={{
                width: '100%', height: '38px', padding: '0 1rem 0 2.25rem',
                borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff',
                fontSize: '0.85rem', color: '#334155', outline: 'none', transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
            />
          </div>
        </PageHeader>

        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div className="animate-fade-in-up" style={{ padding: '1rem 1.25rem', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>Memuat mata pelajaran...</div>
          ) : filteredMapel.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredMapel.map((mapel, i) => {
                const guru = mapel.guru?.nama_guru || mapel.guru?.guru?.nama_guru || mapel.guru?.profile?.nama_guru || mapel.guru?.name;
                return (
                  <div key={mapel.id_mapel} className="animate-fade-in-up" style={{
                    borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)', padding: '1.5rem',
                    transition: 'all 0.2s', animationDelay: `${i * 0.05}s`, opacity: 0,
                    animationFillMode: 'forwards', cursor: 'default'
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={22} strokeWidth={2} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mapel.nama_mapel}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                            <Layers size={14} /> Kelas {mapel.tingkat || 'Semua'} - {mapel.kelompok_mapel || 'Umum'}
                          </p>
                          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                            <User size={14} /> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{guru || 'Guru belum ditentukan'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '5rem 0', textAlign: 'center', color: '#94a3b8', background: '#f8fafb', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p style={{ fontSize: '0.95rem' }}>Tidak ada mata pelajaran yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
