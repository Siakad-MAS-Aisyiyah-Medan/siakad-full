/** Semua role yang tersedia di sistem */
export const ROLES = {
  ADMIN: 'admin',
  KEPSEK: 'kepsek',
  GURU: 'guru',
  WALI_KELAS: 'wali_kelas',
  SISWA: 'siswa',
  CALON_SISWA: 'calon_siswa',
};

/** Admin dapat mengakses semua fitur role lain */
export const ADMIN_INHERITS = [
  ROLES.KEPSEK,
  ROLES.GURU,
  ROLES.WALI_KELAS,
  ROLES.SISWA,
  ROLES.CALON_SISWA,
];

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.KEPSEK]: 'Kepala Sekolah',
  [ROLES.GURU]: 'Guru',
  [ROLES.WALI_KELAS]: 'Wali Kelas',
  [ROLES.SISWA]: 'Siswa',
  [ROLES.CALON_SISWA]: 'Calon Siswa',
};

export function getDashboardComponentKey(role) {
  return role;
}
