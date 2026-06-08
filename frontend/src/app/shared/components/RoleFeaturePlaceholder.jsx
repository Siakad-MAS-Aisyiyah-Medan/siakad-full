import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '../utils/profile';

export default function RoleFeaturePlaceholder({ title, description }) {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="glass p-8 animate-fade-in" style={{ borderRadius: '16px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>
          {title}
        </h2>
        <p className="text-secondary" style={{ marginBottom: '1rem' }}>
          {description || 'Fitur ini sedang disiapkan. Struktur route dan permission sudah tersedia.'}
        </p>
        <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
          Anda tetap dapat menggunakan menu lain yang sudah aktif.
        </p>
      </div>
    </MainLayout>
  );
}
