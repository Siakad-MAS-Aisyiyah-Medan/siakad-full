/**
 * FALLBACK menu per role — dipakai hanya jika API login tidak mengembalikan menus.
 * Sumber utama: tabel menu_items (RBAC) via backend PermissionService.
 */
export const menuByRole = {
  admin: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { iconKey: 'School', label: 'Profil Sekolah', path: '/admin/profil-sekolah' },
    { iconKey: 'School', label: 'Pengumuman Sekolah', path: '/admin/pengumuman' },
    { iconKey: 'Users', label: 'Data Guru', path: '/admin/guru' },
    { iconKey: 'GraduationCap', label: 'Data Murid', path: '/admin/murid' },
    { iconKey: 'BookOpen', label: 'Data Kelas', path: '/admin/kelas' },
    { iconKey: 'BookOpen', label: 'Mata Pelajaran', path: '/admin/mapel' },
    { iconKey: 'UserCheck', label: 'Verifikasi PPDB', path: '/admin/ppdb' },
    { iconKey: 'ClipboardList', label: 'Kelola Absensi', path: '/guru/absensi' },
    { iconKey: 'FileText', label: 'Kelola Nilai', path: '/guru/nilai' },
    { iconKey: 'Settings', label: 'Manajemen Pengguna', path: '/admin/hak-akses' },
    { iconKey: 'Settings2', label: 'Pengaturan', path: '/admin/pengaturan' },
    { iconKey: 'CalendarDays', label: 'Tahun Ajaran', path: '/admin/pengaturan/tahun-ajaran' },
  ],
  kepsek: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/kepala-sekolah/dashboard' },
    { iconKey: 'User', label: 'Profil Saya', path: '/kepala-sekolah/profil-saya' },
    { iconKey: 'School', label: 'Profil Sekolah', path: '/kepala-sekolah/profil-sekolah' },
    { iconKey: 'Bell', label: 'Berita & Pengumuman', path: '/kepala-sekolah/pengumuman' },
    { iconKey: 'UserCheck', label: 'Data PPDB Baru', path: '/kepala-sekolah/data-ppdb' },
    { iconKey: 'GraduationCap', label: 'Data Murid', path: '/kepala-sekolah/data-murid' },
    { iconKey: 'Users', label: 'Data Guru', path: '/kepala-sekolah/data-guru' },
    { iconKey: 'BookOpen', label: 'Data Kelas', path: '/kepala-sekolah/data-kelas' },
    { iconKey: 'BookOpen', label: 'Mata Pelajaran', path: '/kepala-sekolah/data-mapel' },
    { iconKey: 'ClipboardList', label: 'Laporan Absensi Murid', path: '/kepala-sekolah/laporan-absensi' },
    { iconKey: 'FileText', label: 'Laporan Nilai Murid', path: '/kepala-sekolah/laporan-nilai' },
    { iconKey: 'Settings2', label: 'Pengaturan', path: '/kepala-sekolah/pengaturan' },
  ],
  guru: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/guru/dashboard' },
    { iconKey: 'User', label: 'Profil Saya', path: '/guru/profil-saya' },
    { iconKey: 'Bell', label: 'Pengumuman', path: '/guru/pengumuman' },
    { iconKey: 'Calendar', label: 'Jadwal Mengajar', path: '/guru/jadwal' },
    { iconKey: 'BookOpen', label: 'Data Kelas', path: '/guru/kelas' },
    { iconKey: 'Layers', label: 'Data Mapel', path: '/guru/mapel' },
    { iconKey: 'Users', label: 'Data Murid', path: '/guru/murid' },
    { iconKey: 'ClipboardList', label: 'Kelola Absensi', path: '/guru/absensi' },
    { iconKey: 'FileText', label: 'Kelola Nilai', path: '/guru/nilai' },
    { iconKey: 'Calendar', label: 'Riwayat Absensiku', path: '/guru/riwayat-absensi' },
    { iconKey: 'Settings2', label: 'Pengaturan', path: '/guru/pengaturan' },
  ],
  wali_kelas: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/wali-kelas/dashboard' },
    { iconKey: 'Bell', label: 'Pengumuman', path: '/wali-kelas/pengumuman' },
    { iconKey: 'Users', label: 'Data Murid Kelas', path: '/wali-kelas/murid' },
    { iconKey: 'BarChart3', label: 'Rekap Absensi Kelas', path: '/wali-kelas/absensi' },
    { iconKey: 'FileText', label: 'Leger & Validasi Nilai', path: '/wali-kelas/nilai' },
    { iconKey: 'BarChart3', label: 'Laporan Kelas', path: '/wali-kelas/laporan' },
    { iconKey: 'Star', label: 'Kepribadian & Ekskul', path: '/wali-kelas/ekskul' },
    { iconKey: 'Settings2', label: 'Pengaturan', path: '/wali-kelas/pengaturan' },
  ],
  siswa: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/siswa/dashboard' },
    { iconKey: 'User', label: 'Profil Saya', path: '/siswa/profil-saya' },
    { iconKey: 'BookOpen', label: 'Info Kelas', path: '/siswa/kelas' },
    { iconKey: 'Bell', label: 'Pengumuman', path: '/siswa/pengumuman' },
    { iconKey: 'Calendar', label: 'Jadwal Pelajaran', path: '/siswa/jadwal' },
    { iconKey: 'ClipboardList', label: 'Riwayat Absensi', path: '/siswa/absensi' },
    { iconKey: 'FileText', label: 'Nilai Pribadi', path: '/siswa/nilai' },
    { iconKey: 'Settings2', label: 'Pengaturan', path: '/siswa/pengaturan' },
  ],
  calon_siswa: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/calon-murid/dashboard' },
    { iconKey: 'FileText', label: 'Formulir Pendaftaran', path: '/ppdb/registrasi' },
    { iconKey: 'Upload', label: 'Upload Berkas', path: '/calon-murid/upload-berkas' },
    { iconKey: 'ClipboardList', label: 'Status Pendaftaran', path: '/calon-murid/status' },
    { iconKey: 'Bell', label: 'Pengumuman', path: '/calon-murid/pengumuman' },
    { iconKey: 'Settings2', label: 'Pengaturan', path: '/calon-murid/pengaturan' },
  ],
};

export function getMenuForRole(role) {
  return menuByRole[role] || [];
}

