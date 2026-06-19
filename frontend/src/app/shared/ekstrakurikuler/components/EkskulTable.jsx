import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import PageHeader from '@app/shared/components/PageHeader';

export default function EkskulTable({
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
    <div className="data-panel view-list" style={{ paddingTop: '1rem' }}>
      <PageHeader title="Ekstrakurikuler" subtitle="Kelola daftar kegiatan ekstrakurikuler dan pembina di sekolah.">
        <div className="search-box" style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ color: 'var(--color-text-muted)', marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Cari ekskul..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent' }}
          />
        </div>
        {!readOnly && (
          <button type="button" onClick={onAdd} className="btn-primary">
            <Plus size={18} /> Tambah Ekskul
          </button>
        )}
      </PageHeader>

      <div className="table-container glass mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>No</th>
              <th>Nama Ekskul</th>
              <th>Pembina</th>
              <th>Jadwal</th>
              <th>Lokasi</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan="6" className="py-16 text-secondary">
                  <div className="flex flex-col items-center justify-center w-full">
                    <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #e2e8f0', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p className="mt-2 text-center">Memuat data ekstrakurikuler...</p>
                  </div>
                  <style>
                    {`
                      @keyframes spin {
                        to { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id_ekskul}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.nama_ekskul}</strong>
                  </td>
                  <td>{item.pembina?.nama_guru || '-'}</td>
                  <td>
                    {[item.hari, item.jam].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td>{item.lokasi || '-'}</td>
                  <td className="actions-cell">
                    <button type="button" onClick={() => onEdit && onEdit(item)} className="btn-icon edit" title={readOnly ? "Detail" : "Edit"}>
                      {readOnly ? <Search size={16} /> : <Edit2 size={16} />}
                    </button>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(item.id_ekskul)}
                        className="btn-icon delete"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-16 text-secondary">
                  Belum ada data ekstrakurikuler.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
