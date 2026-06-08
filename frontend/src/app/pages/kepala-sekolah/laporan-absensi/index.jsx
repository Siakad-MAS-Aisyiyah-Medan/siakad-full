import LaporanPage from '@app/shared/laporan/LaporanPage';

export default function KepsekLaporanAbsensiPage({ initialTab = 'siswa' }) {
  const initialJenis = initialTab === 'guru' ? 'absensi_guru' : 'absensi_siswa';

  return (
    <LaporanPage
      apiPath="/kepsek/laporan"
      layoutRole="kepsek"
      title="Laporan Absensi"
      subtitle="Rekap kehadiran siswa dan guru untuk supervisi."
      initialJenis={initialJenis}
    />
  );
}
