import { getJsonItem } from '@app/shared/utils/storage';
import { getDisplayName } from '@app/shared/utils/profile';
import MainLayout from '@app/shared/layouts/MainLayout';
import { User } from 'lucide-react';

export default function SiswaDashboard() {
  const user = getJsonItem('user');
  const profile = getJsonItem('profile');
  const name = getDisplayName(profile, user?.role ?? 'siswa', user?.username);

  return (
    <MainLayout role="siswa" name={name}>
      <div className="welcome-banner glass animate-fade-in">
        <div className="banner-icon">
          <User size={48} className="text-orange-500" />
        </div>
        <div className="banner-text">
          <h2>Panel Siswa</h2>
          <p>
            Cek jadwal pelajaran, hasil studi, dan informasi penting lainnya tentang pendidikan Anda.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <h3>IPK Saat Ini</h3>
          <p className="stat-value">3.75</p>
        </div>
        <div className="stat-card glass">
          <h3>Presensi</h3>
          <p className="stat-value">95%</p>
        </div>
      </div>
    </MainLayout>
  );
}
