import { useEffect } from 'react';
import MainLayout from '@app/shared/layouts/MainLayout';
import AdminPageShell from '../components/AdminPageShell';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '../utils/profile';
import { JENIS_LAPORAN, JENIS_BY_ROLE } from './constants';
import { useLaporan } from './useLaporan';
import LaporanFilterForm from './LaporanFilterForm';
import LaporanSummary from './LaporanSummary';
import LaporanTable from './LaporanTable';
import ExportPlaceholder from './ExportPlaceholder';

export default function LaporanPage({
  apiPath,
  layoutRole,
  title = 'Laporan',
  subtitle = 'Filter, ringkasan, dan data detail laporan sekolah.',
  initialJenis = 'siswa',
  useAdminShell = false,
  showKelas = true,
  showMapel = true,
}) {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  const role = layoutRole || user?.role;

  const allowed = JENIS_BY_ROLE[role] || JENIS_BY_ROLE.admin;
  const jenisOptions = JENIS_LAPORAN.filter((j) => allowed.includes(j.value));

  const {
    jenis,
    setJenis,
    filters,
    data,
    loading,
    kelasList,
    mapelList,
    load,
    loadOptions,
    handleFilterChange,
    setPage,
    setFilters,
  } = useLaporan(apiPath, initialJenis);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    load({ page: 1 });
  };

  const handleExport = () => {
    import('@app/shared/utils/exportCsv').then(({ exportToCsv }) => {
      if (!data?.items) return;
      
      const isNilai = jenis === 'nilai';
      const isAbsensi = jenis === 'absensi';
      
      const dataToExport = data.items.map(item => {
        if (isNilai) {
          return {
            'Nama Lengkap': item.siswa?.nama_siswa || '-',
            'Kelas': item.siswa?.kelas?.nama_kelas || '-',
            'Mata Pelajaran': item.mapel?.nama_mapel || '-',
            'Tahun Ajaran': item.tahun_ajaran || '-',
            'Semester': item.semester || '-',
            'Nilai Akhir': item.nilai_akhir !== null ? item.nilai_akhir : '-',
            'Predikat': item.predikat || '-'
          };
        }
        if (isAbsensi) {
          return {
            'Tanggal': item.tanggal || '-',
            'Nama Siswa': item.siswa?.nama_siswa || '-',
            'Kelas': item.kelas?.nama_kelas || '-',
            'Status Kehadiran': item.status === 'H' ? 'Hadir' : (item.status === 'A' ? 'Alpa' : (item.status === 'I' ? 'Izin' : (item.status === 'S' ? 'Sakit' : 'Terlambat'))),
            'Keterangan': item.keterangan || '-'
          };
        }
        return item; // Fallback
      });

      exportToCsv(`laporan_${jenis}.csv`, dataToExport);
    });
  };

  const content = (
    <>
      <div className="data-panel view-list">
        {!useAdminShell ? (
          <div className="panel-header glass">
            <div className="header-text">
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
            <div className="header-actions gap-2">
              <ExportPlaceholder onExport={handleExport} title="Unduh Laporan" />
            </div>
          </div>
        ) : (
          <div className="flex justify-end mb-2">
            <ExportPlaceholder onExport={handleExport} title="Unduh Laporan" />
          </div>
        )}

        <div className="form-panel glass p-4 mt-4">
          <div className="input-group max-w-md">
            <label>Jenis Laporan</label>
            <select
              value={jenis}
              onChange={(e) => {
                setJenis(e.target.value);
                setFilters((prev) => ({ ...prev, page: 1 }));
              }}
            >
              {jenisOptions.map((j) => (
                <option key={j.value} value={j.value}>
                  {j.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <LaporanFilterForm
          jenis={jenis}
          filters={filters}
          kelasList={kelasList}
          mapelList={mapelList}
          loading={loading}
          onChange={handleFilterChange}
          onSubmit={handleSubmit}
          showKelas={showKelas}
          showMapel={showMapel}
        />
      </div>

      {data && (
        <>
          <LaporanSummary jenis={jenis} summary={data.summary} />
          <LaporanTable
            jenis={jenis}
            items={data.items}
            meta={data.meta}
            loading={loading}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );

  if (useAdminShell) {
    return <AdminPageShell title={title} subtitle={subtitle}>{content}</AdminPageShell>;
  }

  return (
    <MainLayout role={role} name={name}>
      {content}
    </MainLayout>
  );
}
