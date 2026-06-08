import LaporanPage from '@app/shared/laporan/LaporanPage';

export default function KepsekLaporanNilaiPage() {
  return (
    <LaporanPage
      apiPath="/kepsek/laporan"
      layoutRole="kepsek"
      title="Laporan Nilai Murid"
      subtitle="Rekap nilai siswa per kelas, semester, dan predikat."
      initialJenis="nilai"
    />
  );
}
