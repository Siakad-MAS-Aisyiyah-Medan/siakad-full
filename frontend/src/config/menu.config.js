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
    { iconKey: 'ClipboardList', label: 'Mata Pelajaran', path: '/admin/mapel' },
    { iconKey: 'Calendar', label: 'Jadwal Pelajaran', path: '/admin/jadwal' },
    { iconKey: 'UserCheck', label: 'Verifikasi PPDB', path: '/admin/ppdb' },
    { iconKey: 'Settings', label: 'Akun & Hak Akses', path: '/admin/hak-akses' },
    { iconKey: 'FileText', label: 'Laporan', path: '/admin/laporan' },
    { iconKey: 'BarChart3', label: 'Absensi Guru', path: '/admin/absensi-guru' },
  ],
  kepsek: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/kepala-sekolah/dashboard' },
    { iconKey: 'Users', label: 'Data Murid & Guru', path: '/kepala-sekolah/data' },
    { iconKey: 'UserCheck', label: 'Data PPDB Baru', path: '/kepala-sekolah/ppdb' },
    { iconKey: 'BarChart3', label: 'Absensi Guru', path: '/kepala-sekolah/absensi-guru' },
    { iconKey: 'ClipboardList', label: 'Laporan Absensi Murid', path: '/kepala-sekolah/laporan-absensi' },
    { iconKey: 'FileText', label: 'Laporan Nilai Murid', path: '/kepala-sekolah/laporan-nilai' },
    { iconKey: 'FileText', label: 'Pusat Laporan', path: '/kepala-sekolah/laporan' },
  ],
  guru: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/guru/dashboard' },
    { iconKey: 'Calendar', label: 'Jadwal Mengajar', path: '/guru/jadwal' },
    { iconKey: 'Users', label: 'Data Murid', path: '/guru/murid' },
    { iconKey: 'ClipboardList', label: 'Kelola Absensi', path: '/guru/absensi' },
    { iconKey: 'FileText', label: 'Kelola Nilai', path: '/guru/nilai' },
    { iconKey: 'Calendar', label: 'Riwayat Absensiku', path: '/guru/riwayat-absensi' },
  ],
  wali_kelas: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/wali-kelas/dashboard' },
    { iconKey: 'Users', label: 'Data Murid Kelas', path: '/wali-kelas/murid' },
    { iconKey: 'BarChart3', label: 'Rekap Absensi Kelas', path: '/wali-kelas/absensi' },
    { iconKey: 'FileText', label: 'Leger & Validasi Nilai', path: '/wali-kelas/nilai' },
    { iconKey: 'BarChart3', label: 'Laporan Kelas', path: '/wali-kelas/laporan' },
    { iconKey: 'Star', label: 'Kepribadian & Ekskul', path: '/wali-kelas/ekskul' },
  ],
  siswa: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/siswa/dashboard' },
    { iconKey: 'Calendar', label: 'Jadwal Pelajaran', path: '/siswa/jadwal' },
    { iconKey: 'ClipboardList', label: 'Riwayat Absensi', path: '/siswa/absensi' },
    { iconKey: 'FileText', label: 'Nilai Pribadi', path: '/siswa/nilai' },
  ],
  calon_siswa: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/calon-murid/dashboard' },
    { iconKey: 'FileText', label: 'Formulir Pendaftaran', path: '/ppdb/registrasi' },
    { iconKey: 'Upload', label: 'Upload Berkas', path: '/calon-murid/upload-berkas' },
    { iconKey: 'ClipboardList', label: 'Status Pendaftaran', path: '/calon-murid/status' },
    { iconKey: 'Bell', label: 'Pengumuman', path: '/calon-murid/pengumuman' },
  ],
};

export function getMenuForRole(role) {
  return menuByRole[role] || [];
}

