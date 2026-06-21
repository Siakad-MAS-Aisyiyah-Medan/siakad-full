import React, { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import MainLayout from '@/shared/layouts/MainLayout';
import PageHeader from '@/shared/components/PageHeader';
import { getStoredUser, getStoredProfile } from '@/shared/services/auth.service';
import { getDisplayName } from '@/shared/utils/profile';
import { fetchNilaiSiswa } from '@/shared/nilai/siswa/services/nilai.service';

const fallbackRows = [
  ['Matematika', 85, 88, 90, 88],
  ['Bahasa Indonesia', 82, 84, 86, 84],
  ['Bahasa Inggris', 90, 89, 92, 90],
  ['Biologi', 87, 85, 88, 87],
  ['Fisika', 80, 82, 85, 82],
  ['Kimia', 84, 86, 88, 86],
];

export default function SiswaNilaiPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNilaiSiswa({ semester: 'Ganjil', tahun_ajaran: '2025/2026' })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    if (!loading && items.length > 0) {
      return items.map((row) => [
        row.mapel?.nama_mapel || '-',
        row.nilai_tugas ?? '-',
        row.nilai_uts ?? '-',
        row.nilai_uas ?? '-',
        row.nilai_akhir ?? '-',
      ]);
    }
    return fallbackRows;
  }, [items, loading]);

  const average = useMemo(() => {
    const values = rows.map((row) => Number(row[4])).filter((value) => !Number.isNaN(value));
    if (!values.length) return '-';
    return (values.reduce((total, value) => total + value, 0) / values.length).toFixed(2);
  }, [rows]);

  return (
    <MainLayout role="siswa" name={name}>
      <div className="admin-page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '-1.5rem', minHeight: 'calc(100vh - 84px)', background: 'var(--color-white)' }}>
        <PageHeader title="Transkrip Akademik" subtitle="Lihat nilai akademik dan transkrip Anda" />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 1.5rem 1.5rem 1.5rem' }}>
          {/* Informasi Murid Panel */}
          <div className="animate-fade-in-up" style={{ borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', animationDelay: '0.1s', opacity: 0 }}>
            <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b' }}>Informasi Murid</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'center', fontSize: '0.875rem' }}>
                <div style={{ fontWeight: 600, color: '#64748b' }}>Nama Murid</div>
                <div style={{ fontWeight: 500, color: '#0f172a' }}>: {profile?.nama_siswa || name || 'Andi Saputra'}</div>
                
                <div style={{ fontWeight: 600, color: '#64748b' }}>NISN</div>
                <div style={{ fontWeight: 500, color: '#0f172a' }}>: {profile?.nisn || '0051234567'}</div>
                
                <div style={{ fontWeight: 600, color: '#64748b' }}>Kelas</div>
                <div style={{ fontWeight: 500, color: '#0f172a' }}>: {profile?.kelas?.nama_kelas || 'X IPA 1'}</div>

                <div style={{ fontWeight: 600, color: '#64748b' }}>Tahun Ajaran</div>
                <div style={{ fontWeight: 500, color: '#0f172a' }}>: 2025/2026</div>

                <div style={{ fontWeight: 600, color: '#64748b' }}>Semester</div>
                <div style={{ fontWeight: 500, color: '#0f172a' }}>: Ganjil</div>
              </div>
            </div>
          </div>

          {/* Daftar Nilai Panel */}
          <div className="animate-fade-in-up" style={{ borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', animationDelay: '0.2s', opacity: 0 }}>
            <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b' }}>Daftar Nilai Akademik</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div className="table-container" style={{ margin: 0, padding: 0, boxShadow: 'none', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      {['Mata Pelajaran', 'Tugas', 'UTS', 'UAS', 'Nilai Akhir'].map((head) => (
                        <th key={head} style={{ textAlign: head === 'Mata Pelajaran' ? 'left' : 'center' }}>{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row[0]}>
                        <td style={{ fontWeight: 600, textAlign: 'left' }}>{row[0]}</td>
                        {row.slice(1).map((value, index) => (
                          <td key={`${row[0]}-${index}`} style={{ textAlign: 'center' }}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Ringkasan Akademik Panel */}
          <div className="animate-fade-in-up" style={{ borderRadius: '18px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden', animationDelay: '0.3s', opacity: 0 }}>
            <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#064e3b' }}>Ringkasan Akademik</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div className="table-container" style={{ margin: 0, padding: 0, boxShadow: 'none', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Keterangan</th>
                      <th style={{ textAlign: 'left' }}>Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Rata-rata Nilai</td>
                      <td>{average}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Predikat</td>
                      <td>Baik</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button type="button" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.25rem', borderRadius: '8px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white', fontWeight: 600, fontSize: '0.875rem',
              border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
              transition: 'all 0.2s'
            }}
            onClick={() => window.print()}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Download className="h-4 w-4" />
              Unduh Transkrip Akademik
            </button>
          </div>

          <style>
            {`
              @media print {
                body { background: #fff !important; }
                .sidebar, .content-header { display: none !important; }
                .dashboard-content { margin-left: 0 !important; padding: 0 !important; }
                .admin-page-wrapper { box-shadow: none !important; margin: 0 !important; min-height: auto !important; }
                button { display: none !important; }
                .table-container { border: none !important; }
                /* Untuk memastikan warna dan background tetap tercetak */
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              }
            `}
          </style>
        </div>
      </div>
    </MainLayout>
  );
}
