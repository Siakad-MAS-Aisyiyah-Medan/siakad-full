import { Trash2, ShieldCheck, UserSearch } from 'lucide-react';

const PPDB_LABELS = {
  draft: 'Draft',
  diajukan: 'Diajukan',
  revisi: 'Revisi',
  terverifikasi: 'Terverifikasi',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
  daftar_ulang: 'Daftar Ulang',
  menjadi_murid: 'Menjadi Murid',
};

export default function MuridTable({ data, onPromote, onDelete }) {
  return (
    <div className="table-container glass mt-6">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>No</th>
            <th>NISN / Username</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Status</th>
            <th className="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((murid, index) => {
              const nama =
                murid.siswa?.nama_siswa || murid.pendaftaran?.nama_lengkap || '-';
              const ppdbStatus = murid.pendaftaran?.ppdb_status;
              const canPromote =
                murid.role === 'calon_siswa' &&
                ['diterima', 'daftar_ulang'].includes(ppdbStatus) &&
                ppdbStatus !== 'menjadi_murid' &&
                !murid.siswa;

              return (
                <tr key={murid.id_user}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{murid.username}</strong>
                    {murid.siswa?.nis && (
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                        NIS: {murid.siswa.nis}
                      </div>
                    )}
                  </td>
                  <td>{nama}</td>
                  <td>
                    <span className="text-secondary">{murid.email}</span>
                  </td>
                  <td>
                    {murid.role === 'siswa' ? (
                      <span className="badge text-green-500 bg-green-500 bg-opacity-10">
                        Siswa Aktif
                      </span>
                    ) : (
                      <>
                        <span className="badge badge-pending">Calon Siswa</span>
                        {ppdbStatus && (
                          <span
                            className="badge badge-pending"
                            style={{ marginLeft: '0.25rem', fontSize: '0.7rem' }}
                          >
                            {PPDB_LABELS[ppdbStatus] || ppdbStatus}
                          </span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="actions-cell">
                    {canPromote && (
                      <button
                        type="button"
                        onClick={() => onPromote(murid)}
                        className="btn-icon"
                        title="Jadikan Siswa"
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderColor: 'var(--primary)',
                          color: 'var(--primary)',
                        }}
                      >
                        <ShieldCheck size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(murid.id_user)}
                      className="btn-icon delete"
                      title="Hapus Permanen"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-6 text-secondary">
                <UserSearch size={48} className="mx-auto mb-2 opacity-50" />
                Data murid tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
