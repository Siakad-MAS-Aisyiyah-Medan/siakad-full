import { getJsonItem } from '@app/shared/utils/storage';
import { getDisplayName } from '@app/shared/utils/profile';
import MainLayout from '@app/shared/layouts/MainLayout';
import { Users } from 'lucide-react';

export default function GuruDashboard() {
  const user = getJsonItem('user');
  const profile = getJsonItem('profile');
  const name = getDisplayName(profile, user?.role ?? 'guru', user?.username);

  return (
    <MainLayout role="guru" name={name}>
      <div className="welcome-banner glass animate-fade-in">
        <div className="banner-icon">
          <Users size={48} className="text-secondary" />
        </div>
        <div className="banner-text">
          <h2>Panel Guru</h2>
          <p>Kelola jadwal mengajar, absensi murid, dan nilai akademik sesuai mata pelajaran yang Anda ampu.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <h3>Aktivitas Mengajar</h3>
          <p className="stat-value">Aktif</p>
        </div>
        <div className="stat-card glass">
          <h3>Kelola Akademik</h3>
          <p className="stat-value">Nilai & Absensi</p>
        </div>
      </div>
    </MainLayout>
  );
}
