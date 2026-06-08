import { getJsonItem } from '@app/shared/utils/storage';
import { getDisplayName } from '@app/shared/utils/profile';
import MainLayout from '@app/shared/layouts/MainLayout';
import { Users } from 'lucide-react';

export default function WaliKelasDashboard() {
  const user = getJsonItem('user');
  const profile = getJsonItem('profile');
  const name = getDisplayName(profile, user?.role ?? 'wali_kelas', user?.username);

  return (
    <MainLayout role="wali_kelas" name={name}>
      <div className="welcome-banner glass animate-fade-in">
        <div className="banner-icon">
          <Users size={48} className="text-secondary" />
        </div>
        <div className="banner-text">
          <h2>Panel Wali Kelas</h2>
          <p>Kelola kelas perwalian Anda. Pantau absensi harian dan rekapitulasi nilai (Leger) murid dengan mudah.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <h3>Total Murid Perwalian</h3>
          <p className="stat-value">32 Murid</p>
        </div>
        <div className="stat-card glass">
          <h3>Kehadiran Hari Ini</h3>
          <p className="stat-value">95%</p>
        </div>
      </div>
    </MainLayout>
  );
}
