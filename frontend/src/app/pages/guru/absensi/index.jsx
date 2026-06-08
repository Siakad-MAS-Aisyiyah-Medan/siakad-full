import { useState, useEffect, useCallback } from 'react';
import apiClient from '@app/shared/services/apiClient';
import { unwrapData } from '@app/shared/services/apiHelpers';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import RekapAbsensiCard from '@app/shared/components/RekapAbsensiCard';

export default function WaliAbsensiPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/wali/absensi/rekap');
      setData(unwrapData(response));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat rekap');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <MainLayout role="wali_kelas" name={name}>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Rekap Absensi Kelas</h2>
            <p>Ringkasan kehadiran siswa di kelas perwalian Anda.</p>
          </div>
        </div>

        {loading && <p className="text-secondary mt-4">Memuat rekap...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {!loading && !error && data && (
          <>
            {data.kelas && (
              <p className="mt-4">
                Kelas: <strong>{data.kelas.nama_kelas}</strong>
              </p>
            )}
            <RekapAbsensiCard rekap={data.rekap} title="Rekap Kehadiran Siswa" />
          </>
        )}
      </div>
    </MainLayout>
  );
}
