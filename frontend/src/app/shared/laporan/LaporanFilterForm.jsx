import { Search } from 'lucide-react';
import { PPDB_STATUS } from './constants';

const NEEDS_SEMESTER = ['absensi_siswa', 'absensi_guru', 'nilai', 'jadwal'];

export default function LaporanFilterForm({
  jenis,
  filters,
  kelasList,
  mapelList,
  loading,
  onChange,
  onSubmit,
  showKelas = true,
  showMapel = true,
}) {
  const needsPeriod = NEEDS_SEMESTER.includes(jenis);

  return (
    <form onSubmit={onSubmit} className="form-panel glass p-6 mt-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {needsPeriod && (
          <>
            <div className="input-group">
              <label>Tahun Ajaran *</label>
              <input
                type="text"
                name="tahun_ajaran"
                value={filters.tahun_ajaran}
                onChange={onChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Semester *</label>
              <select name="semester" value={filters.semester} onChange={onChange} required>
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </>
        )}

        {showKelas && ['siswa', 'absensi_siswa', 'nilai', 'jadwal'].includes(jenis) && (
          <div className="input-group">
            <label>Kelas</label>
            <select name="id_kelas" value={filters.id_kelas} onChange={onChange}>
              <option value="">Semua kelas</option>
              {kelasList.map((k) => (
                <option key={k.id_kelas} value={k.id_kelas}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
          </div>
        )}

        {showMapel && ['absensi_siswa', 'nilai', 'jadwal'].includes(jenis) && (
          <div className="input-group">
            <label>Mata Pelajaran</label>
            <select name="id_mapel" value={filters.id_mapel} onChange={onChange}>
              <option value="">Semua mapel</option>
              {mapelList.map((m) => (
                <option key={m.id_mapel} value={m.id_mapel}>
                  {m.nama_mapel}
                </option>
              ))}
            </select>
          </div>
        )}

        {['absensi_siswa', 'absensi_guru', 'ppdb'].includes(jenis) && (
          <>
            <div className="input-group">
              <label>Tanggal Dari</label>
              <input type="date" name="tanggal_dari" value={filters.tanggal_dari} onChange={onChange} />
            </div>
            <div className="input-group">
              <label>Tanggal Sampai</label>
              <input type="date" name="tanggal_sampai" value={filters.tanggal_sampai} onChange={onChange} />
            </div>
            <div className="input-group">
              <label>Bulan (YYYY-MM)</label>
              <input type="month" name="bulan" value={filters.bulan} onChange={onChange} />
            </div>
          </>
        )}

        {jenis === 'ppdb' && (
          <div className="input-group">
            <label>Status PPDB</label>
            <select name="status" value={filters.status} onChange={onChange}>
              {PPDB_STATUS.map((s) => (
                <option key={s.value || 'all'} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {jenis === 'guru' && (
          <div className="input-group">
            <label>Role</label>
            <select name="role" value={filters.role} onChange={onChange}>
              <option value="">Semua</option>
              <option value="guru">Guru</option>
              <option value="wali_kelas">Wali Kelas</option>
            </select>
          </div>
        )}

        {['siswa', 'guru', 'ppdb'].includes(jenis) && (
          <div className="input-group">
            <label>Cari</label>
            <input type="text" name="search" value={filters.search} onChange={onChange} placeholder="Nama..." />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button type="submit" className="btn-primary" disabled={loading}>
          <Search size={18} /> {loading ? 'Memuat...' : 'Tampilkan Laporan'}
        </button>
      </div>
    </form>
  );
}
