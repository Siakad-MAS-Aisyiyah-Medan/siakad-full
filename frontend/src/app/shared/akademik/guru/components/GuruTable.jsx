import { Search, Plus, Edit2, Trash2, UserX } from 'lucide-react';

export default function GuruTable({
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
          <h2>Data Guru & Pegawai</h2>
          <p>Manajemen tenaga pendidik beserta hak akses login sistem.</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari guru berdasarkan nama atau username..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: '260px' }}
            />
          </div>
          <button type="button" onClick={onAdd} className="btn-primary">
            <Plus size={18} /> Tambah Data
          </button>
        </div>
      </div>

      <div className="table-container glass mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama Lengkap</th>
              <th>Username/NIP</th>
              <th>Email</th>
              <th>Posisi</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((guru) => (
                <tr key={guru.id_user}>
                  <td>
                    <strong>{guru.profile?.nama_guru}</strong>
                  </td>
                  <td>{guru.username}</td>
                  <td>
                    <span className="text-secondary">{guru.email}</span>
                  </td>
                  <td>
                    <span
                      className={`badge lowercase ${guru.role === 'wali_kelas' ? 'badge-pending' : ''}`}
                    >
                      {guru.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button type="button" onClick={() => onEdit(guru)} className="btn-icon edit" title="Edit Data">
                      <Edit2 size={16} />
                    </button>
                    <button type="button" onClick={() => onDelete(guru.id_user)} className="btn-icon delete" title="Hapus Data">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-secondary">
                  <UserX size={48} className="mx-auto mb-2 opacity-50" />
                  Data tenaga pendidik tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
