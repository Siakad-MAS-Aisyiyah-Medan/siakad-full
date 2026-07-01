export const menuByRole = {
  admin: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/admin/dashboard', permission: 'manage_all' },
    { iconKey: 'School', label: 'Profil Sekolah', path: '/admin/profil-sekolah', permission: 'manage_profil_sekolah' },
    { iconKey: 'Settings', label: 'Pengaturan PPDB', path: '/admin/pengaturan-ppdb', permission: 'manage_ppdb' },
    { iconKey: 'CalendarDays', label: 'Tahun Ajaran', path: '/admin/tahun-ajaran', permission: 'manage_tahun_ajaran' },
    { iconKey: 'Bell', label: 'Pengumuman Sekolah', path: '/admin/pengumuman', permission: 'manage_pengumuman' },
    { iconKey: 'Users', label: 'Data Guru', path: '/admin/guru', permission: 'manage_guru' },
    { iconKey: 'GraduationCap', label: 'Data Murid', path: '/admin/murid', permission: 'manage_murid' },
    { iconKey: 'BookOpen', label: 'Data Kelas', path: '/admin/kelas', permission: 'manage_kelas' },
    { iconKey: 'ClipboardList', label: 'Mata Pelajaran', path: '/admin/mapel', permission: 'manage_mapel' },
    { iconKey: 'FileText', label: 'Transkrip Akademik Murid', path: '/admin/transkrip-akademik', permission: 'view_transkrip_murid' },
    { iconKey: 'UserCheck', label: 'Data PPDB', path: '/admin/ppdb', permission: 'manage_ppdb' },
    { iconKey: 'ShieldCheck', label: 'Manajemen Pengguna', path: '/admin/hak-akses', permission: 'manage_users' },
  ],
  kepsek: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/kepala-sekolah/dashboard', permission: 'view_dashboard_kepsek' },
    { iconKey: 'Bell', label: 'Pengumuman Sekolah', path: '/kepala-sekolah/pengumuman', permission: 'view_pengumuman' },
    { iconKey: 'Users', label: 'Data Guru', path: '/kepala-sekolah/data-guru', permission: 'view_data_guru' },
    { iconKey: 'GraduationCap', label: 'Data Murid', path: '/kepala-sekolah/data-murid', permission: 'view_data_siswa' },
    { iconKey: 'BookOpen', label: 'Data Kelas', path: '/kepala-sekolah/data-kelas', permission: 'view_data_kelas' },
    { iconKey: 'ClipboardList', label: 'Mata Pelajaran', path: '/kepala-sekolah/data-mapel', permission: 'view_mapel' },
    { iconKey: 'BarChart3', label: 'Transkrip Akademik', path: '/kepala-sekolah/transkrip-akademik', permission: 'view_transkrip_murid' },
    { iconKey: 'UserCheck', label: 'Data PPDB', path: '/kepala-sekolah/data-ppdb', permission: 'view_data_ppdb' },
  ],
  guru: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/guru/dashboard', permission: 'view_dashboard_guru' },
    { iconKey: 'Bell', label: 'Pengumuman Sekolah', path: '/guru/pengumuman', permission: 'view_pengumuman' },
    { iconKey: 'Users', label: 'Data Murid yang Diajar', path: '/guru/murid', permission: 'view_murid_diajar' },
    { iconKey: 'BookOpen', label: 'Data Kelas yang Diajar', path: '/guru/kelas', permission: 'view_kelas_diajar' },
    { iconKey: 'ClipboardList', label: 'Mata Pelajaran yang Diampu', path: '/guru/mapel', permission: 'view_mapel_diampu' },
    { iconKey: 'FileText', label: 'Daftar Nilai Murid', path: '/guru/nilai', permission: 'manage_nilai_siswa' },
    { iconKey: 'ClipboardList', label: 'Absensi Murid', path: '/guru/absensi', permission: 'manage_absensi_siswa' },
  ],
  siswa: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/siswa/dashboard', permission: 'view_dashboard_siswa' },
    { iconKey: 'Bell', label: 'Pengumuman Sekolah', path: '/siswa/pengumuman', permission: 'view_pengumuman' },
    { iconKey: 'BookOpen', label: 'Data Kelas yang Dimasuki', path: '/siswa/kelas', permission: 'view_kelas_pribadi' },
    { iconKey: 'ClipboardList', label: 'Mata Pelajaran', path: '/siswa/mapel', permission: 'view_mapel' },
    { iconKey: 'ClipboardList', label: 'Transkrip Akademik', path: '/siswa/nilai', permission: 'view_transkrip_pribadi' },
    { iconKey: 'ClipboardList', label: 'Absensi Pribadi', path: '/siswa/absensi', permission: 'view_absensi_pribadi' },
  ],
  calon_siswa: [
    { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/calon-murid/dashboard', permission: 'view_dashboard_calon_siswa' },
    { iconKey: 'FileText', label: 'Formulir Pendaftaran', path: '/ppdb/registrasi', permission: 'manage_formulir_pendaftaran' },
    { iconKey: 'Upload', label: 'Berkas Pendaftaran', path: '/calon-murid/upload-berkas', permission: 'manage_berkas_pendaftaran' },
    { iconKey: 'Send', label: 'Daftarkan Diri', path: '/calon-murid/kirim-pendaftaran', permission: 'submit_pendaftaran' },
    { iconKey: 'ClipboardList', label: 'Status Pendaftaran', path: '/calon-murid/status', permission: 'view_status_pendaftaran' },
  ],
};

export function getMenuForRole(role) {
  return menuByRole[role] || [];
}
