import LaporanPage from '@app/shared/laporan/LaporanPage';

export default function WaliLaporanPage() {
  return (
    <LaporanPage
      apiPath="/wali/laporan"
      layoutRole="wali_kelas"
      title="Laporan Kelas"
      subtitle="Laporan siswa, absensi, nilai, dan jadwal kelas perwalian Anda."
      initialJenis="absensi_siswa"
      showMapel
    />
  );
}
