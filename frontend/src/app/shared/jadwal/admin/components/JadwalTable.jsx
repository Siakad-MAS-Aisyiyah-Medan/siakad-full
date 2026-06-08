import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

function formatJam(mulai, selesai) {
  const a = (mulai || '').slice(0, 5);
  const b = (selesai || '').slice(0, 5);
  return a && b ? `${a} - ${b}` : '-';
}

export default function JadwalTable({
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
          <h2>Jadwal Pelajaran Sekolah</h2>
          <p>Kelola jadwal pertemuan tatap muka di setiap kelas.</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari kelas, mapel, guru..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button type="button" onClick={onAdd} className="btn-primary">
            <Plus size={18} /> Tambah Jadwal
          </button>
        </div>
      </div>

      <div className="table-container glass mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Hari</th>
              <th>Jam</th>
              <th>Kelas</th>
              <th>Mata Pelajaran</th>
              <th>Guru</th>
              <th>Ruangan</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id_jadwal}>
                  <td>
                    <span className="badge badge-pending">{item.hari}</span>
                  </td>
                  <td>{formatJam(item.jam_mulai, item.jam_selesai)}</td>
                  <td>
                    <strong>{item.kelas?.nama_kelas || '-'}</strong>
                  </td>
                  <td>{item.mapel?.nama_mapel || '-'}</td>
                  <td className="text-secondary">{item.guru?.nama_guru || '-'}</td>
                  <td>{item.ruangan || '-'}</td>
                  <td className="actions-cell">
                    <button type="button" onClick={() => onEdit(item)} className="btn-icon edit" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id_jadwal)}
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
                <td colSpan="7" className="text-center p-6 text-secondary">
                  Belum ada data jadwal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

