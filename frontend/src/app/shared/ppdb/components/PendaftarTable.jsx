import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function PendaftarTable({ items, loading }) {
  if (loading) {
    return <p className="text-center p-6">Memuat data pendaftar...</p>;
  }

  if (!items?.length) {
    return <p className="text-center p-6">Belum ada data pendaftar.</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>No</th>
          <th>No. Registrasi</th>
          <th>Nama</th>
          <th>NISN</th>
          <th>Status</th>
          <th className="text-right">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {items.map((row, i) => (
          <tr key={row.id || row.id_pendaftaran}>
            <td>{i + 1}</td>
            <td>{row.no_registrasi || '-'}</td>
            <td>{row.nama_lengkap}</td>
            <td>{row.nisn || row.user?.username}</td>
            <td>
              <StatusBadge status={row.status || row.ppdb_status} />
            </td>
            <td className="text-right">
              <Link to={`/admin/ppdb/${row.id || row.id_pendaftaran}`} className="btn-secondary sm">
                Detail
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
