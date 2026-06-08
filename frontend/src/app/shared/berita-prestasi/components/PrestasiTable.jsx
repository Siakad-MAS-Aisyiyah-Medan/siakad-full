import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export default function PrestasiTable({
  filteredData,
  searchQuery,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="data-panel view-list">
      <div className="panel-header glass">
        <div className="header-text">
          <h2>Berita & Prestasi Sekolah</h2>
          <p>Publikasikan kabar terbaru dan pencapaian siswa ke landing page.</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button type="button" onClick={onAdd} className="btn-primary">
            <Plus size={18} /> Tambah Artikel
          </button>
        </div>
      </div>

      <div className="table-container glass mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>No</th>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.judul}</strong>
                  </td>
                  <td>
                    <span
                      className={`badge ${item.kategori === 'Prestasi' ? 'text-orange-500 bg-orange-500 bg-opacity-10' : 'badge-pending'}`}
                    >
                      {item.kategori}
                    </span>
                  </td>
                  <td>{item.tanggal_publikasi || '-'}</td>
                  <td>
                    <span className={`badge ${item.is_published ? 'badge-success' : 'badge-pending'}`}>
                      {item.is_published ? 'Publik' : 'Draft'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button type="button" onClick={() => onEdit(item)} className="btn-icon edit" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button type="button" onClick={() => onDelete(item.id)} className="btn-icon delete" title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-secondary">
                  Belum ada data berita atau prestasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
