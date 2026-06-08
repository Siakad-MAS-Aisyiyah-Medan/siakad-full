import LaporanPage from '@app/shared/laporan/LaporanPage';

export default function AdminLaporanPage() {
  return (
    <LaporanPage
      apiPath="/laporan"
      layoutRole="admin"
      useAdminShell
      title="Laporan Sekolah"
      subtitle="Kelola dan unduh laporan akademik, absensi, PPDB, dan rekap data sekolah."
      initialJenis="siswa"
    />
  );
}
