import LaporanPage from '@app/shared/laporan/LaporanPage';

export default function KepsekLaporanHubPage({ initialJenis = 'siswa' }) {
  const titles = {
    siswa: ['Data Murid', 'Laporan data siswa terdaftar.'],
    ppdb: ['Data PPDB', 'Laporan pendaftaran siswa baru.'],
  };
  const [title, subtitle] = titles[initialJenis] || ['Pusat Laporan', 'Semua jenis laporan sekolah (read-only).'];

  return (
    <LaporanPage
      apiPath="/kepsek/laporan"
      layoutRole="kepsek"
      title={title}
      subtitle={subtitle}
      initialJenis={initialJenis}
    />
  );
}
