import { Download, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import PageHeader from '@app/shared/components/PageHeader';

function statusLabel(kelas) {
  const status = String(kelas.status || '').toLowerCase();
  if (status === 'aktif') return 'Aktif';
  if (status === 'nonaktif') return 'Nonaktif';
  return Number(kelas.jumlah_siswa || 0) > 0 ? 'Aktif' : 'Nonaktif';
}

export default function KelasTable({
  filteredData,
  searchQuery,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
  isFetching = false,
  readOnly = false,
}) {
  return (
    <div className="admin-page-wrapper animate-fade-in">
      <PageHeader title="Data Kelas" subtitle="Kelola data kelas MAS Aisyiyah Medan">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Cari data kelas..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            style={{ paddingLeft: '2.5rem', height: '38px', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', width: '220px', background: '#fff', color: 'var(--color-text-dark)' }}
          />
        </div>
        {readOnly ? (
          <button type="button" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} />
            Unduh Data
          </button>
        ) : (
          <button type="button" onClick={onAdd} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} />
            Tambah Kelas
          </button>
        )}
      </PageHeader>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tahun Ajaran</th>
              <th>Nama Kelas</th>
              <th>Tingkatan</th>
              <th>Jurusan</th>
              <th>Wali Kelas</th>
              <th>Status</th>
              {!readOnly ? <th style={{ textAlign: 'right' }}>Aksi</th> : null}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={readOnly ? 7 : 8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
                    Memuat data kelas...
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((kelas, idx) => {
                const isAktif = statusLabel(kelas) === 'Aktif';
                return (
                  <tr key={kelas.id_kelas}>
                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                    <td>{kelas.tahun_ajaran || '2025/2026'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{kelas.nama_kelas}</td>
                    <td>
                      <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)' }}>
                        {kelas.tingkat || '-'}
                      </span>
                    </td>
                    <td>{kelas.jurusan || '-'}</td>
                    <td>{kelas.wali_kelas?.nama_guru || 'Belum ditentukan'}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: isAktif ? 'var(--color-primary-soft)' : '#fef2f2',
                        color: isAktif ? 'var(--color-primary-dark)' : '#991b1b',
                        border: `1px solid ${isAktif ? 'var(--color-primary-light)' : '#fecaca'}`,
                      }}>
                        {statusLabel(kelas)}
                      </span>
                    </td>
                    {!readOnly ? (
                      <td>
                        <div className="actions-cell">
                          <button type="button" onClick={() => onEdit && onEdit(kelas)} className="btn-icon edit" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button type="button" onClick={() => onDelete && onDelete(kelas.id_kelas)} className="btn-icon delete" title="Hapus">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={readOnly ? 7 : 8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '2rem' }}>🏫</div>
                    <p style={{ fontWeight: 600 }}>Tidak ada data kelas</p>
                    <p style={{ fontSize: '0.875rem' }}>Tambah kelas baru untuk memulai</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        Menampilkan {filteredData.length} data kelas
      </div>
    </div>
  );
}
