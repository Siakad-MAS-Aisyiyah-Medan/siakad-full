import { Search, Plus, Edit2, Trash2, Book } from 'lucide-react';

export default function MapelTable({
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
          <h2>Data Mata Pelajaran</h2>
          <p>Kelola daftar mata pelajaran beserta guru pengampunya.</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari mapel atau guru..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: '260px' }}
            />
          </div>
          <button type="button" onClick={onAdd} className="btn-primary">
            <Plus size={18} /> Tambah Mapel
          </button>
        </div>
      </div>

      <div className="table-container glass mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>No</th>
              <th>Nama Mata Pelajaran</th>
              <th>Guru Pengampu</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((mapel, index) => (
                <tr key={mapel.id_mapel}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{mapel.nama_mapel}</strong>
                  </td>
                  <td>
                    {mapel.guru?.profile?.nama_guru || (
                      <span className="text-secondary italic">Tidak ditemukan</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button type="button" onClick={() => onEdit(mapel)} className="btn-icon edit" title="Edit Data">
                      <Edit2 size={16} />
                    </button>
                    <button type="button" onClick={() => onDelete(mapel.id_mapel)} className="btn-icon delete" title="Hapus Data">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-secondary">
                  <Book size={48} className="mx-auto mb-2 opacity-50" />
                  Data mata pelajaran kosong atau tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
