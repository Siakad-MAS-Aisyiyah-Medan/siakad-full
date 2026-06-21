import { Download, Pencil, Plus, Search, Trash2 } from 'lucide-react';

import PageHeader from '@/shared/components/PageHeader';

import { exportToCsv } from '@/shared/utils/exportCsv';

export default function MapelTable({
  filteredData,
  searchQuery,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
  isFetching = false,
  readOnly = false,
}) {
  const handleDownload = () => {
    const dataToExport = filteredData.map(item => ({
      'Nama Mata Pelajaran': item.nama_mapel || '-',
      'Guru Pengampu': item.guru?.nama_guru || 'Belum ditentukan',
      'Tingkatan': item.tingkat || '-',
      'Status': 'Aktif',
    }));
    exportToCsv('Data_Mata_Pelajaran.csv', dataToExport);
  };

  return (
    <div className="admin-page-wrapper animate-fade-in">
      <PageHeader title="Mata Pelajaran" subtitle="Kelola data mata pelajaran MAS Aisyiyah Medan">
        {readOnly && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Cari mata pelajaran..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              style={{ paddingLeft: '2.5rem', height: '38px', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '0.875rem', outline: 'none', width: '220px', background: '#fff', color: 'var(--color-text-dark)' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {readOnly ? (
            <button type="button" onClick={handleDownload} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} />
              Unduh Data
            </button>
          ) : (
            <>
              <button type="button" onClick={handleDownload} className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff' }}>
                <Download size={16} />
                Unduh Data
              </button>
              <button type="button" onClick={onAdd} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} />
                Tambah Mapel
              </button>
            </>
          )}
        </div>
      </PageHeader>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Mata Pelajaran</th>
              <th>Guru Pengampu</th>
              <th>Tingkatan</th>
              {readOnly ? <th>Status</th> : <th style={{ textAlign: 'right' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
                    Memuat mata pelajaran...
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((mapel, idx) => (
                <tr key={mapel.id_mapel}>
                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{mapel.nama_mapel}</td>
                  <td>{mapel.guru?.nama_guru || 'Belum ditentukan'}</td>
                  <td>
                    <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)' }}>
                      {mapel.tingkat || '-'}
                    </span>
                  </td>
                  {readOnly ? (
                    <td>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)', border: '1px solid var(--color-primary-light)' }}>
                        Aktif
                      </span>
                    </td>
                  ) : (
                    <td>
                      <div className="actions-cell">
                        <button type="button" onClick={() => onEdit && onEdit(mapel)} className="btn-icon edit" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button type="button" onClick={() => onDelete && onDelete(mapel.id_mapel)} className="btn-icon delete" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '2rem' }}>📚</div>
                    <p style={{ fontWeight: 600 }}>Tidak ada data mata pelajaran</p>
                    <p style={{ fontSize: '0.875rem' }}>Tambah mata pelajaran untuk memulai</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        Menampilkan {filteredData.length} mata pelajaran
      </div>
    </div>
  );
}
