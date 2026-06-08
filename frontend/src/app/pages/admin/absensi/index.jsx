import AdminPageShell from '@app/shared/components/AdminPageShell';
import RekapAbsensiCard from '@app/shared/components/RekapAbsensiCard';
import { useAbsensiGuru } from '@app/shared/absensi/admin-guru/hooks/useAbsensiGuru';

export default function AbsensiGuruPage() {
  const { items, rekap, loading, absensiStatusLabel } = useAbsensiGuru();

  return (
    <AdminPageShell title="Absensi Guru" subtitle="Pantau kehadiran guru dan pegawai sekolah per hari.">
      <RekapAbsensiCard rekap={rekap} title="Rekap Absensi Guru" />

      <div className="table-container glass mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Guru</th>
              <th>Tanggal</th>
              <th>Masuk</th>
              <th>Pulang</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6">
                  Memuat...
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((row, i) => (
                <tr key={row.id_absensi_guru}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{row.guru?.nama_guru || '-'}</strong>
                  </td>
                  <td>{row.tanggal}</td>
                  <td>{(row.jam_masuk || '').slice(0, 5) || '-'}</td>
                  <td>{(row.jam_pulang || '').slice(0, 5) || '-'}</td>
                  <td>{row.status_label || absensiStatusLabel(row.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-secondary">
                  Belum ada data absensi guru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminPageShell>
  );
}
