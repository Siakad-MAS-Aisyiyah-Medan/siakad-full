/**
 * Pemetaan route → permission (sinkron dengan menu_items & API di backend).
 * Admin dengan manage_all otomatis lolos semua route (via hasPermission).
 */
export const ROUTE_PERMISSIONS = {
  '/admin/dashboard': 'manage_all',
  '/admin/profil-sekolah': 'manage_all',
  '/admin/pengumuman': 'manage_pengumuman',
  '/admin/prestasi': 'manage_prestasi',
  '/admin/murid': 'manage_murid',
  '/admin/guru': 'manage_guru',
  '/admin/kelas': 'manage_kelas',
  '/admin/mapel': 'manage_mapel',
  '/admin/jadwal': 'manage_jadwal',
  '/admin/ekskul': 'manage_ekskul',
  '/admin/ppdb': 'manage_ppdb',
  '/admin/hak-akses': 'manage_users',
  '/admin/laporan': 'view_laporan',
  '/admin/audit-logs': 'manage_all',

  '/kepsek/dashboard': 'view_dashboard_kepsek',
  '/kepsek/data': 'view_data_siswa',
  '/kepsek/ppdb': 'view_data_siswa',
  '/kepsek/laporan-absensi': 'view_laporan',
  '/kepsek/laporan-nilai': 'view_laporan',
  '/kepsek/laporan': 'view_laporan',
  '/wali/laporan': 'view_absensi_kelas',

  '/guru/dashboard': 'view_dashboard_guru',
  '/guru/jadwal': 'view_jadwal_mengajar',
  '/guru/murid': 'manage_absensi_siswa',
  '/guru/absensi': 'manage_absensi_siswa',
  '/guru/nilai': 'manage_nilai_siswa',
  '/guru/riwayat-absensi': 'view_dashboard_guru',

  '/wali/dashboard': 'view_dashboard_wali',
  '/wali/murid': 'view_siswa_kelas',
  '/wali/absensi': 'view_absensi_kelas',
  '/wali/nilai': 'validate_nilai',
  '/wali/ekskul': 'view_siswa_kelas',

  '/siswa/dashboard': 'view_dashboard_siswa',
  '/siswa/jadwal': 'view_jadwal_siswa',
  '/siswa/absensi': 'view_absensi_pribadi',
  '/siswa/nilai': 'view_nilai_pribadi',

  '/calon-murid/dashboard': 'manage_pendaftaran_pribadi',
  '/calon-murid/formulir': 'manage_pendaftaran_pribadi',
  '/calon-murid/berkas': 'manage_pendaftaran_pribadi',
  '/calon-murid/upload-berkas': 'manage_pendaftaran_pribadi',
  '/calon-murid/pengumuman': 'view_status_pendaftaran',
  '/ppdb/registrasi': 'manage_pendaftaran_pribadi',
  '/calon-murid/status': 'view_status_pendaftaran',
  '/calon-murid/bukti': 'view_status_pendaftaran',
  '/ppdb/dashboard': 'manage_pendaftaran_pribadi',
  '/calon-siswa/dashboard': 'manage_pendaftaran_pribadi',
  '/kepala-sekolah/dashboard': 'view_dashboard_kepsek',
  '/kepala-sekolah/data': 'view_data_siswa',
  '/kepala-sekolah/ppdb': 'view_data_siswa',
  '/kepala-sekolah/laporan': 'view_laporan',
  '/kepala-sekolah/laporan-absensi': 'view_laporan',
  '/kepala-sekolah/laporan-nilai': 'view_laporan',
  '/wali-kelas/dashboard': 'view_dashboard_wali',
  '/wali-kelas/murid': 'view_siswa_kelas',
  '/wali-kelas/absensi': 'view_absensi_kelas',
  '/wali-kelas/nilai': 'validate_nilai',
  '/wali-kelas/laporan': 'view_absensi_kelas',
  '/wali-kelas/ekskul': 'view_siswa_kelas',
};

export function getPermissionForPath(path) {
  return ROUTE_PERMISSIONS[path] ?? null;
}
