/**
 * Nama tampilan dari profil sesuai role (sinkron dengan User::resolveProfile di backend).
 */
export function getDisplayName(profile, role, fallbackUsername = '') {
  if (!profile) {
    return fallbackUsername || 'Pengguna';
  }

  switch (role) {
    case 'admin':
      return profile.nama_admin || 'Administrator';
    case 'kepsek':
      return profile.nama_kepsek || fallbackUsername || 'Kepala Sekolah';
    case 'guru':
    case 'wali_kelas':
      return profile.nama_guru || fallbackUsername || 'Guru';
    case 'siswa':
      return profile.nama_siswa || fallbackUsername || 'Siswa';
    case 'calon_siswa':
      return profile.nama_lengkap || fallbackUsername || 'Calon Siswa';
    default:
      return fallbackUsername || 'Pengguna';
  }
}

export function getAdminDisplayName(profile) {
  return getDisplayName(profile, 'admin');
}
