import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export default function EkskulTable({
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
          <h2>Ekstrakurikuler</h2>
          <p>Kelola daftar kegiatan ekstrakurikuler dan pembina di sekolah.</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari ekskul..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button type="button" onClick={onAdd} className="btn-primary">
            <Plus size={18} /> Tambah Ekskul
          </button>
        </div>
      </div>

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
            {filteredData.length > 0 ? (
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
                    <button type="button" onClick={() => onEdit(item)} className="btn-icon edit" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id_ekskul)}
                      className="btn-icon delete"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-secondary">
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
