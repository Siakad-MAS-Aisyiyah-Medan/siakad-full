import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Download, Eye, Search } from 'lucide-react';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import PageHeader from '@app/shared/components/PageHeader';
import { fetchMuridList } from '@app/shared/akademik/murid/services/murid.service';
import { fetchAdminStudentRaport } from '@app/shared/nilai/admin/services/transkrip.service';
import { fetchTahunAjaran } from '@app/shared/services/tahunAjaran.service';

const DEFAULT_FILTERS = {
  semester: 'Ganjil',
  tahun_ajaran: '2025/2026',
};

export default function AdminTranskripAkademikPage() {
  const [muridList, setMuridList] = useState([]);
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [selectedMurid, setSelectedMurid] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [raport, setRaport] = useState(null);
  const [loadingMurid, setLoadingMurid] = useState(true);
  const [loadingRaport, setLoadingRaport] = useState(false);

  useEffect(() => {
    fetchTahunAjaran().then(data => {
      setTahunAjaranList(data || []);
      const active = data?.find(t => t.is_active);
      if (active) {
        setFilters(p => ({ ...p, tahun_ajaran: active.tahun_ajaran }));
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const loadMurid = async () => {
      setLoadingMurid(true);
      try {
        const items = await fetchMuridList({ per_page: 200 });
        const siswaAktif = items.filter((item) => item.role === 'siswa' && item.siswa);
        setMuridList(siswaAktif);
      } finally {
        setLoadingMurid(false);
      }
    };
    loadMurid();
  }, []);

  useEffect(() => {
    const loadRaport = async () => {
      if (!selectedMurid?.id_user) { setRaport(null); return; }
      setLoadingRaport(true);
      try {
        const data = await fetchAdminStudentRaport(selectedMurid.id_user, filters);
        setRaport(data);
      } catch {
        setRaport(null);
      } finally {
        setLoadingRaport(false);
      }
    };
    loadRaport();
  }, [selectedMurid, filters]);

  const filteredMurid = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return muridList;
    return muridList.filter((item) => {
      const nama = item.siswa?.nama_siswa || '';
      const nisn = item.siswa?.nisn || '';
      return nama.toLowerCase().includes(keyword) || String(nisn).toLowerCase().includes(keyword);
    });
  }, [muridList, search]);

  const rows = raport?.mapel || [];
  const average = rows.length
    ? (rows.reduce((sum, item) => sum + Number(item.nilai_akhir || 0), 0) / rows.length).toFixed(2)
    : '-';
  const predicate = average !== '-' && Number(average) >= 85 ? 'Baik' : average !== '-' && Number(average) >= 75 ? 'Cukup' : average !== '-' ? 'Perlu Bimbingan' : '-';

  if (selectedMurid) {
    return (
      <AdminPageShell>
        <div className="admin-page-wrapper animate-fade-in" style={{ paddingTop: '1rem' }}>
          <PageHeader 
            title="Transkrip Akademik" 
            subtitle={selectedMurid.siswa?.nama_siswa || '-'} 
            onBack={() => setSelectedMurid(null)} 
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Filter Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Tahun Ajaran</label>
                <select
                  value={filters.tahun_ajaran}
                  onChange={(e) => setFilters(p => ({ ...p, tahun_ajaran: e.target.value }))}
                  className="form-control no-print"
                >
                  {tahunAjaranList.map(ta => (
                    <option key={ta.tahun_ajaran} value={ta.tahun_ajaran}>{ta.tahun_ajaran}</option>
                  ))}
                  {tahunAjaranList.length === 0 && <option value="2025/2026">2025/2026</option>}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>Semester</label>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters(p => ({ ...p, semester: e.target.value }))}
                  className="form-control"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            {/* Info Murid */}
            <div className="form-panel">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>Informasi Murid</h3>
                <button type="button" onClick={() => window.print()} className="btn-primary no-print" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                  <Download size={14} />
                  Unduh Transkrip
                </button>
              </div>
              <div style={{ padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {[
                  ['Nama Murid', selectedMurid.siswa?.nama_siswa || '-'],
                  ['NISN', selectedMurid.siswa?.nisn || '-'],
                  ['Kelas', selectedMurid.siswa?.kelas?.nama_kelas || selectedMurid.siswa?.nama_kelas || '-'],
                  ['Semester', filters.semester],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', minWidth: '110px' }}>{label}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', fontWeight: 500 }}>: {value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nilai Table */}
            <div className="form-panel">
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>Daftar Nilai Akademik</h3>
              </div>
              {loadingRaport ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Memuat transkrip...</div>
              ) : (
                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                  <table className="data-table" style={{ border: 'none' }}>
                    <thead>
                      <tr>
                        <th>Mata Pelajaran</th>
                        <th style={{ textAlign: 'center' }}>Tugas</th>
                        <th style={{ textAlign: 'center' }}>UTS</th>
                        <th style={{ textAlign: 'center' }}>UAS</th>
                        <th style={{ textAlign: 'center' }}>Nilai Akhir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((item) => (
                        <tr key={item.id_nilai}>
                          <td style={{ fontWeight: 600 }}>{item.mapel?.nama_mapel || '-'}</td>
                          <td style={{ textAlign: 'center' }}>{item.nilai_tugas ?? '-'}</td>
                          <td style={{ textAlign: 'center' }}>{item.nilai_uts ?? '-'}</td>
                          <td style={{ textAlign: 'center' }}>{item.nilai_uas ?? '-'}</td>
                          <td style={{ textAlign: 'center', fontWeight: 700, color: Number(item.nilai_akhir) >= 75 ? 'var(--color-primary-dark)' : '#dc2626' }}>
                            {item.nilai_akhir ?? '-'}
                          </td>
                        </tr>
                      ))}
                      {!rows.length && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                            Belum ada nilai pada periode ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="form-panel">
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>Ringkasan Akademik</h3>
              </div>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Rata-rata Nilai</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{average}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Predikat</span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    padding: '0.35rem 1rem',
                    borderRadius: '50px',
                    background: predicate === 'Baik' ? 'var(--color-primary-soft)' : predicate === 'Cukup' ? '#fffbeb' : '#fef2f2',
                    color: predicate === 'Baik' ? 'var(--color-primary-dark)' : predicate === 'Cukup' ? '#92400e' : '#991b1b',
                    border: `1px solid ${predicate === 'Baik' ? 'var(--color-primary-light)' : predicate === 'Cukup' ? '#fde68a' : '#fecaca'}`,
                  }}>
                    {predicate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <div className="animate-fade-in" style={{ paddingTop: '1rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
        <PageHeader title="Transkrip Akademik" subtitle="Lihat dan unduh transkrip nilai murid">
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <select
              value={filters.tahun_ajaran}
              onChange={(e) => setFilters(p => ({ ...p, tahun_ajaran: e.target.value }))}
              style={{ height: '38px', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', padding: '0 0.75rem', background: '#fff', color: 'var(--color-text-dark)' }}
            >
              {tahunAjaranList.map(ta => (
                <option key={ta.id_tahun_ajaran} value={ta.tahun_ajaran}>{ta.tahun_ajaran}</option>
              ))}
              {tahunAjaranList.length === 0 && <option value="2025/2026">2025/2026</option>}
            </select>
            <select
              value={filters.semester}
              onChange={(e) => setFilters(p => ({ ...p, semester: e.target.value }))}
              style={{ height: '38px', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', padding: '0 0.75rem', background: '#fff', color: 'var(--color-text-dark)' }}
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
        </PageHeader>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama murid atau NISN..."
            style={{ paddingLeft: '2.5rem', height: '42px', border: '1.5px solid var(--color-border)', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', width: '100%', maxWidth: '400px', background: '#fff', color: 'var(--color-text-dark)' }}
          />
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Murid</th>
                <th>NISN</th>
                <th>Kelas</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loadingMurid ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
                      Memuat data murid...
                    </div>
                  </td>
                </tr>
              ) : filteredMurid.length > 0 ? (
                filteredMurid.slice(0, 15).map((item, idx) => (
                  <tr key={item.id_user}>
                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{item.siswa?.nama_siswa || '-'}</td>
                    <td>{item.siswa?.nisn || '-'}</td>
                    <td>{item.siswa?.kelas?.nama_kelas || item.siswa?.nama_kelas || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedMurid(item)}
                          title="Lihat Transkrip"
                          style={{ 
                            background: 'var(--color-primary)', color: '#fff', border: 'none', 
                            padding: '0.4rem 0.85rem', borderRadius: '8px', display: 'inline-flex', 
                            alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <Eye size={14} />
                          Lihat
                        </button>
                        <button 
                          type="button" 
                          title="Unduh" 
                          style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--color-border)',
                            background: '#fff', color: 'var(--color-text-dark)', cursor: 'pointer', transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontSize: '2rem' }}>📊</div>
                      <p style={{ fontWeight: 600 }}>Data murid tidak ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Menampilkan {Math.min(filteredMurid.length, 15)} dari {filteredMurid.length} murid
        </div>
      </div>
    </AdminPageShell>
  );
}
