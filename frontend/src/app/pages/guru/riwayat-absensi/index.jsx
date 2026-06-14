import { useState, useEffect, useCallback } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { checkInGuru, checkOutGuru, fetchRiwayatGuru } from '@app/shared/absensi/guru/services/absensi.service';
import { absensiStatusLabel } from '@app/shared/constants/absensiStatus';
import { toastSuccess, toastError } from '@app/shared/hooks/useConfirm';

export default function GuruRiwayatAbsensiPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  const role = user?.role === 'wali_kelas' ? 'wali_kelas' : 'guru';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRiwayatGuru();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCheckIn = async () => {
    setActing(true);
    try {
      await checkInGuru();
      toastSuccess('Berhasil', 'Absen masuk dicatat');
      load();
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Gagal absen masuk');
    } finally {
      setActing(false);
    }
  };

  const handleCheckOut = async () => {
    setActing(true);
    try {
      await checkOutGuru();
      toastSuccess('Berhasil', 'Absen pulang dicatat');
      load();
    } catch (err) {
      toastError('Gagal', err.response?.data?.message || 'Gagal absen pulang');
    } finally {
      setActing(false);
    }
  };

  return (
    <MainLayout role={role} name={name}>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Riwayat Absensiku</h2>
            <p>Absen masuk / pulang dan riwayat kehadiran harian Anda.</p>
          </div>
          <div className="header-actions gap-2">
            <button type="button" onClick={handleCheckIn} className="btn-primary" disabled={acting}>
              <LogIn size={18} /> Absen Masuk
            </button>
            <button type="button" onClick={handleCheckOut} className="btn-outline" disabled={acting}>
              <LogOut size={18} /> Absen Pulang
            </button>
          </div>
        </div>

        <div className="table-container glass mt-6">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Pulang</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-16 text-secondary">
                    Memuat...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((row) => (
                  <tr key={row.id_absensi_guru}>
                    <td>{row.tanggal}</td>
                    <td>{(row.jam_masuk || '').slice(0, 5) || '-'}</td>
                    <td>{(row.jam_pulang || '').slice(0, 5) || '-'}</td>
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
                    Belum ada riwayat absensi.
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
