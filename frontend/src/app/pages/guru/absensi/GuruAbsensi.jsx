// GuruAbsensi.jsx
// PERBAIKAN UTAMA:
// Sebelumnya: daftarList diambil dari localStorage('mock_daftar_absensi') → data palsu
// Sesudahnya:  daftarList diambil dari API /api/guru/absensi/siswa/rekap → data nyata

import { useGuruAbsensi } from './hooks/useGuruAbsensi';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';

export default function GuruAbsensi() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  const {
    // State data
    jadwalList,
    daftarList,        // ← sekarang dari API, bukan localStorage
    formData,
    siswaList,

    // State UI
    isLoading,
    isLoadingDaftar,   // ← loading state khusus untuk daftarList
    isSubmitting,
    error,

    // Filter & form state
    filter,
    selectedJadwal,
    absensiMap,

    // Handler
    handleFilterChange,
    handleJadwalSelect,
    handleStatusChange,
    handleSubmit,
    handleIsiAbsensi,
    resetForm,
  } = useGuruAbsensi();

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="guru-absensi-page">
        <div className="page-header">
          <h1>Input Absensi Siswa</h1>
          <p className="text-muted">Pilih jadwal dan tanggal untuk mengisi atau melihat absensi</p>
        </div>

        {/* ── Filter Panel ── */}
        <div className="card filter-panel">
          <div className="filter-grid">
            <div className="form-group">
              <label>Tahun Ajaran</label>
              <select
                value={filter.id_tahun_ajaran}
                onChange={(e) => handleFilterChange('id_tahun_ajaran', e.target.value)}
              >
                <option value="">-- Pilih Tahun Ajaran --</option>
                {filter.tahunAjaranOptions?.map((ta) => (
                  <option key={ta.id} value={ta.id}>{ta.nama}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mata Pelajaran / Jadwal</label>
              <select
                value={filter.id_jadwal}
                onChange={(e) => handleFilterChange('id_jadwal', e.target.value)}
                disabled={!filter.id_tahun_ajaran}
              >
                <option value="">-- Pilih Jadwal --</option>
                {jadwalList.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nama_mapel} – {j.nama_kelas} ({j.hari}, {j.jam_mulai})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Daftar Pertemuan (dari API, bukan localStorage) ── */}
        <div className="card">
          <div className="card-header">
            <h2>Riwayat Pertemuan</h2>
            <button
              className="btn btn-primary"
              onClick={() => handleIsiAbsensi()}
              disabled={!filter.id_jadwal || !filter.id_tahun_ajaran}
            >
              + Isi Absensi Baru
            </button>
          </div>

          <div className="card-body">
            {isLoadingDaftar ? (
              <div className="loading-state">
                <span className="spinner" />
                <p>Memuat riwayat pertemuan...</p>
              </div>
            ) : daftarList.length === 0 ? (
              <div className="empty-state">
                <p>Belum ada absensi yang diinput untuk jadwal ini.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tanggal</th>
                    <th>Pertemuan ke-</th>
                    <th>Hadir</th>
                    <th>Izin</th>
                    <th>Sakit</th>
                    <th>Alfa</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarList.map((item, index) => (
                    <tr key={item.id ?? item.tanggal}>
                      <td>{index + 1}</td>
                      <td>{item.tanggal}</td>
                      <td>{item.pertemuan_ke ?? '-'}</td>
                      <td className="text-success">{item.hadir ?? 0}</td>
                      <td className="text-warning">{item.izin ?? 0}</td>
                      <td className="text-info">{item.sakit ?? 0}</td>
                      <td className="text-danger">{item.alfa ?? 0}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleJadwalSelect(item)}
                        >
                          Lihat / Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Form Input Absensi (muncul setelah jadwal dipilih) ── */}
        {selectedJadwal && (
          <div className="card form-absensi">
            <div className="card-header">
              <h2>
                Input Absensi – {selectedJadwal.tanggal}
              </h2>
              <button className="btn btn-ghost" onClick={resetForm}>✕ Tutup</button>
            </div>

            <div className="card-body">
              {isLoading ? (
                <div className="loading-state">
                  <span className="spinner" />
                  <p>Memuat data siswa...</p>
                </div>
              ) : (
                <>
                  <table className="table table-absensi">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama Siswa</th>
                        <th>NIS</th>
                        <th>H</th>
                        <th>I</th>
                        <th>S</th>
                        <th>A</th>
                        <th>T</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siswaList.map((siswa, index) => {
                        const current = absensiMap[siswa.id] ?? { status: 'H', keterangan: '' };
                        return (
                          <tr key={siswa.id}>
                            <td>{index + 1}</td>
                            <td>{siswa.nama}</td>
                            <td>{siswa.nis}</td>
                            {['H', 'I', 'S', 'A', 'T'].map((status) => (
                              <td key={status} className="text-center">
                                <input
                                  type="radio"
                                  name={`status_${siswa.id}`}
                                  value={status}
                                  checked={current.status === status}
                                  onChange={() => handleStatusChange(siswa.id, 'status', status)}
                                />
                              </td>
                            ))}
                            <td>
                              <input
                                type="text"
                                className="input-keterangan"
                                placeholder="opsional"
                                value={current.keterangan}
                                onChange={(e) =>
                                  handleStatusChange(siswa.id, 'keterangan', e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {error && <p className="text-danger">{error}</p>}

                  <div className="form-actions">
                    <button className="btn btn-ghost" onClick={resetForm}>
                      Batal
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting || siswaList.length === 0}
                    >
                      {isSubmitting ? 'Menyimpan...' : 'Simpan Absensi'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
