import { useState, useCallback } from 'react';
import { CheckCircle, Search } from 'lucide-react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { fetchLeger, validateNilai } from '@app/shared/nilai/wali/services/nilai.service';
import { toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

export default function WaliNilaiPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  const [filters, setFilters] = useState({
    semester: 'Ganjil',
    tahun_ajaran: '2025/2026',
  });
  const [leger, setLeger] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [selected, setSelected] = useState([]);

  const loadLeger = useCallback(async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const data = await fetchLeger(filters);
      setLeger(data);
      setSelected([]);
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Gagal memuat leger');
      setLeger(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const pending = (leger?.items || []).filter((i) => !i.validated_by_wali).map((i) => i.id_nilai);
    setSelected(selected.length === pending.length ? [] : pending);
  };

  const handleValidate = async (all = false) => {
    setValidating(true);
    try {
      const payload = {
        semester: filters.semester,
        tahun_ajaran: filters.tahun_ajaran,
        id_nilai: all ? undefined : selected,
      };
      const result = await validateNilai(payload);
      toastSuccess('Berhasil', `${result.validated_count} nilai divalidasi`);
      await loadLeger();
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Gagal validasi nilai');
    } finally {
      setValidating(false);
    }
  };

  return (
    <MainLayout role="wali_kelas" name={name}>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Leger & Validasi Nilai</h2>
            <p>Validasi nilai rapor kelas perwalian Anda.</p>
          </div>
        </div>

        <form onSubmit={loadLeger} className="form-panel glass p-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label>Semester</label>
              <select
                name="semester"
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
            <div className="input-group">
              <label>Tahun Ajaran</label>
              <input
                type="text"
                value={filters.tahun_ajaran}
                onChange={(e) => setFilters({ ...filters, tahun_ajaran: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-4" disabled={loading}>
            <Search size={18} /> {loading ? 'Memuat...' : 'Muat Leger'}
          </button>
        </form>

        {leger && (
          <>
            <div className="glass p-4 mt-4 flex gap-4 flex-wrap">
              <span>Kelas: <strong>{leger.kelas?.nama_kelas}</strong></span>
              <span>Total: {leger.summary?.total}</span>
              <span>Tervalidasi: {leger.summary?.validated}</span>
              <span>Belum: {leger.summary?.belum_validasi}</span>
            </div>

            <div className="header-actions gap-2 mt-4 flex">
              <button
                type="button"
                className="btn-outline"
                onClick={toggleAll}
                disabled={!leger.items?.length}
              >
                Pilih semua belum valid
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleValidate(false)}
                disabled={validating || selected.length === 0}
              >
                <CheckCircle size={18} /> Validasi terpilih ({selected.length})
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleValidate(true)}
                disabled={validating}
              >
                Validasi semua
              </button>
            </div>

            <div className="table-container glass mt-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Siswa</th>
                    <th>Mapel</th>
                    <th>Tugas</th>
                    <th>UTS</th>
                    <th>UAS</th>
                    <th>Akhir</th>
                    <th>Predikat</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(leger.items || []).map((row) => (
                    <tr key={row.id_nilai}>
                      <td>
                        {!row.validated_by_wali && (
                          <input
                            type="checkbox"
                            checked={selected.includes(row.id_nilai)}
                            onChange={() => toggleSelect(row.id_nilai)}
                          />
                        )}
                      </td>
                      <td>{row.siswa?.nama_siswa}</td>
                      <td>{row.mapel?.nama_mapel}</td>
                      <td>{row.nilai_tugas}</td>
                      <td>{row.nilai_uts}</td>
                      <td>{row.nilai_uas}</td>
                      <td>{row.nilai_akhir}</td>
                      <td>{row.predikat}</td>
                      <td>
                        {row.validated_by_wali ? (
                          <span className="badge badge-success">Valid</span>
                        ) : (
                          <span className="badge badge-pending">Belum</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
