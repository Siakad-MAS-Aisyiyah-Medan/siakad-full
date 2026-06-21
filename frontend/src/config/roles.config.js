export const ROLES = {
  ADMIN: 'admin',
  KEPSEK: 'kepsek',
  GURU: 'guru',
  SISWA: 'siswa',
  CALON_SISWA: 'calon_siswa',
};

export const ADMIN_INHERITS = [
  ROLES.KEPSEK,
  ROLES.GURU,
  ROLES.SISWA,
  ROLES.CALON_SISWA,
];

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.KEPSEK]: 'Kepala Sekolah',
  [ROLES.GURU]: 'Guru',
  [ROLES.SISWA]: 'Siswa',
  [ROLES.CALON_SISWA]: 'Calon Siswa',
};

export function getDashboardComponentKey(role) {
  return role;
}
