import { getJsonItem } from '@app/shared/utils/storage';
import { getDisplayName } from '@app/shared/utils/profile';
import MainLayout from '@app/shared/layouts/MainLayout';
import { Users } from 'lucide-react';

export default function KepsekDashboard() {
  const user = getJsonItem('user');
  const profile = getJsonItem('profile');
  const name = getDisplayName(profile, user?.role ?? 'kepsek', user?.username);

  return (
    <MainLayout role="kepsek" name={name}>
      <div className="welcome-banner glass animate-fade-in">
        <div className="banner-icon">
          <Users size={48} className="text-emerald-500" />
        </div>
        <div className="banner-text">
          <h2>Panel Kepala Sekolah</h2>
          <p>Pantau perkembangan akademik, kinerja guru, dan statistik siswa secara real-time.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <h3>Kehadiran Guru</h3>
          <p className="stat-value">98%</p>
        </div>
        <div className="stat-card glass">
          <h3>Rata-rata Nilai Siswa</h3>
          <p className="stat-value">84.5</p>
        </div>
      </div>
    </MainLayout>
  );
}
