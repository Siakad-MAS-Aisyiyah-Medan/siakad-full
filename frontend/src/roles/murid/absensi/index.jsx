import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@/shared/services/auth.service';
import { getDisplayName } from '@/shared/utils/profile';
import { fetchAbsensiSiswa } from '@/shared/absensi/siswa/services/absensi.service';
import { absensiStatusLabel } from '@/shared/constants/absensiStatus';

import PageHeader from '@/shared/components/PageHeader';

export default function SiswaAbsensiPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAbsensiSiswa();
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat absensi');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <MainLayout role="siswa" name={name}>
      <div className="data-panel view-list" style={{ paddingTop: '1rem' }}>
        <PageHeader title="Riwayat Absensi" subtitle="Kehadiran Anda per mata pelajaran." />

        {error && (
          <div className="glass p-4 mt-4 text-red-500" style={{ borderRadius: '12px' }}>
            {error}
          </div>
        )}

        <div className="table-container glass mt-6">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Mapel</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-6">
                    Memuat...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((row) => (
                  <tr key={row.id_absensi}>
                    <td>{row.tanggal}</td>
                    <td>
                      {(row.jam_mulai || '').slice(0, 5)} – {(row.jam_selesai || '').slice(0, 5)}
                    </td>
                    <td>{row.mapel?.nama_mapel || '-'}</td>
                    <td>
                      <span className="badge badge-pending">
                        {row.status_label || absensiStatusLabel(row.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-16 text-secondary">
                    Belum ada data absensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

