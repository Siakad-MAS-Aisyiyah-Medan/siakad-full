import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { fetchNilaiSiswa, fetchRaport } from '@app/shared/nilai/siswa/services/nilai.service';

export default function SiswaNilaiPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  const [tab, setTab] = useState('daftar');
  const [items, setItems] = useState([]);
  const [raport, setRaport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    semester: 'Ganjil',
    tahun_ajaran: '2025/2026',
  });

  const loadDaftar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNilaiSiswa(filters);
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat nilai');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadRaport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRaport(filters);
      setRaport(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat rapor');
      setRaport(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (tab === 'daftar') loadDaftar();
    else loadRaport();
  }, [tab, loadDaftar, loadRaport]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <MainLayout role="siswa" name={name}>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Nilai Pribadi</h2>
            <p>Nilai yang sudah divalidasi wali kelas.</p>
          </div>
          <div className="header-actions gap-2">
            <button
              type="button"
              className={tab === 'daftar' ? 'btn-primary' : 'btn-outline'}
              onClick={() => setTab('daftar')}
            >
              Daftar Nilai
            </button>
            <button
              type="button"
              className={tab === 'raport' ? 'btn-primary' : 'btn-outline'}
              onClick={() => setTab('raport')}
            >
              Rapor
            </button>
          </div>
        </div>

        <div className="form-panel glass p-4 mt-4 grid grid-cols-2 gap-4">
          <div className="input-group">
            <label>Semester</label>
            <select name="semester" value={filters.semester} onChange={handleFilterChange}>
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
          <div className="input-group">
            <label>Tahun Ajaran</label>
            <input
              type="text"
              name="tahun_ajaran"
              value={filters.tahun_ajaran}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {error && (
          <div className="glass p-4 mt-4 text-red-500" style={{ borderRadius: '12px' }}>
            {error}
          </div>
        )}

        {tab === 'daftar' && (
          <div className="table-container glass mt-6">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mapel</th>
                  <th>Semester</th>
                  <th>Tugas</th>
                  <th>UTS</th>
                  <th>UAS</th>
                  <th>Akhir</th>
                  <th>Predikat</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6">
                      Memuat...
                    </td>
                  </tr>
                ) : items.length > 0 ? (
                  items.map((row) => (
                    <tr key={row.id_nilai}>
                      <td>{row.mapel?.nama_mapel || '-'}</td>
                      <td>
                        {row.semester} {row.tahun_ajaran}
                      </td>
                      <td>{row.nilai_tugas}</td>
                      <td>{row.nilai_uts}</td>
                      <td>{row.nilai_uas}</td>
                      <td>{row.nilai_akhir}</td>
                      <td>
                        <span className="badge badge-success">{row.predikat}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-16 text-secondary">
                      Belum ada nilai tervalidasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'raport' && !loading && raport && (
          <div className="glass p-6 mt-6">
            <h3 className="font-semibold mb-2">Rapor {raport.semester} — {raport.tahun_ajaran}</h3>
            <p className="text-secondary mb-4">
              {raport.siswa?.nama_siswa} · {raport.siswa?.kelas} · NISN {raport.siswa?.nisn}
            </p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mapel</th>
                  <th>Akhir</th>
                  <th>Predikat</th>
                  <th>Sikap</th>
                </tr>
              </thead>
              <tbody>
                {(raport.mapel || []).map((m) => (
                  <tr key={m.id_nilai}>
                    <td>{m.mapel?.nama_mapel}</td>
                    <td>{m.nilai_akhir}</td>
                    <td>{m.predikat}</td>
                    <td>{m.nilai_sikap ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 font-semibold">Rata-rata: {raport.rata_rata ?? '-'}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

