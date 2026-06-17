import MainLayout from '@app/shared/layouts/MainLayout';
import JadwalScheduleView from '@app/shared/components/JadwalScheduleView';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { useJadwalGuru } from '@app/shared/jadwal/guru/hooks/useJadwalGuru';

export default function GuruJadwalPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  const { items, loading, error } = useJadwalGuru();

  return (
    <MainLayout role="guru" name={name}>
      {loading && (
        <div className="glass p-6 text-secondary">Memuat jadwal mengajar...</div>
      )}
      {error && !loading && (
        <div className="glass p-6 text-red-500" style={{ borderRadius: '12px' }}>
          {error}
        </div>
      )}
      {!loading && !error && (
        <JadwalScheduleView
          title="Jadwal Mengajar"
          subtitle="Daftar jadwal pelajaran yang Anda ampu."
          items={items}
          showKelas
          emptyMessage="Belum ada jadwal mengajar untuk akun Anda."
        />
      )}
    </MainLayout>
  );
}
