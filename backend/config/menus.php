<?php

/**
 * Sidebar menus filtered by permission (not hardcoded role-only).
 * Disusun mengikuti UC01-UC31 pada dokumen use case.
 */
return [
    ['permission' => 'manage_all', 'iconKey' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/admin/dashboard'],
    ['permission' => 'manage_profil_sekolah', 'iconKey' => 'School', 'label' => 'Profil Sekolah', 'path' => '/admin/profil-sekolah'],
    ['permission' => 'manage_tahun_ajaran', 'iconKey' => 'CalendarDays', 'label' => 'Tahun Ajaran', 'path' => '/admin/tahun-ajaran'],
    ['permission' => 'manage_pengumuman', 'iconKey' => 'Bell', 'label' => 'Pengumuman Sekolah', 'path' => '/admin/pengumuman'],
    ['permission' => 'manage_guru', 'iconKey' => 'Users', 'label' => 'Data Guru', 'path' => '/admin/guru'],
    ['permission' => 'manage_murid', 'iconKey' => 'GraduationCap', 'label' => 'Data Murid', 'path' => '/admin/murid'],
    ['permission' => 'manage_kelas', 'iconKey' => 'BookOpen', 'label' => 'Data Kelas', 'path' => '/admin/kelas'],
    ['permission' => 'manage_mapel', 'iconKey' => 'ClipboardList', 'label' => 'Mata Pelajaran', 'path' => '/admin/mapel'],
    ['permission' => 'view_transkrip_murid', 'iconKey' => 'FileText', 'label' => 'Transkrip Akademik Murid', 'path' => '/admin/transkrip-akademik'],
    ['permission' => 'manage_ppdb', 'iconKey' => 'UserCheck', 'label' => 'Data PPDB', 'path' => '/admin/ppdb'],
    ['permission' => 'manage_users', 'iconKey' => 'ShieldCheck', 'label' => 'Akun Pengguna & Hak Akses', 'path' => '/admin/hak-akses'],
    ['permission' => 'manage_pengaturan_akun', 'iconKey' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/admin/pengaturan'],

    ['permission' => 'view_dashboard_kepsek', 'iconKey' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/kepala-sekolah/dashboard'],
    ['permission' => 'manage_profil_pribadi', 'iconKey' => 'User', 'label' => 'Profil Pribadi', 'path' => '/kepala-sekolah/profil-saya'],
    ['permission' => 'view_pengumuman', 'iconKey' => 'Bell', 'label' => 'Pengumuman Sekolah', 'path' => '/kepala-sekolah/pengumuman'],
    ['permission' => 'view_data_guru', 'iconKey' => 'Users', 'label' => 'Data Guru', 'path' => '/kepala-sekolah/data-guru'],
    ['permission' => 'view_data_siswa', 'iconKey' => 'GraduationCap', 'label' => 'Data Murid', 'path' => '/kepala-sekolah/data-murid'],
    ['permission' => 'view_data_kelas', 'iconKey' => 'BookOpen', 'label' => 'Data Kelas', 'path' => '/kepala-sekolah/data-kelas'],
    ['permission' => 'view_mapel', 'iconKey' => 'ClipboardList', 'label' => 'Mata Pelajaran', 'path' => '/kepala-sekolah/data-mapel'],
    ['permission' => 'view_transkrip_murid', 'iconKey' => 'FileText', 'label' => 'Transkrip Akademik Murid', 'path' => '/kepala-sekolah/transkrip-akademik'],
    ['permission' => 'view_data_ppdb', 'iconKey' => 'UserCheck', 'label' => 'Data PPDB', 'path' => '/kepala-sekolah/data-ppdb'],
    ['permission' => 'manage_pengaturan_akun', 'iconKey' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/kepala-sekolah/pengaturan'],

    ['permission' => 'view_dashboard_guru', 'iconKey' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/guru/dashboard'],
    ['permission' => 'manage_profil_pribadi', 'iconKey' => 'User', 'label' => 'Profil Pribadi', 'path' => '/guru/profil-saya'],
    ['permission' => 'view_pengumuman', 'iconKey' => 'Bell', 'label' => 'Pengumuman Sekolah', 'path' => '/guru/pengumuman'],
    ['permission' => 'view_murid_diajar', 'iconKey' => 'Users', 'label' => 'Data Murid yang Diajar', 'path' => '/guru/murid'],
    ['permission' => 'view_kelas_diajar', 'iconKey' => 'BookOpen', 'label' => 'Data Kelas yang Diajar', 'path' => '/guru/kelas'],
    ['permission' => 'view_mapel_diampu', 'iconKey' => 'ClipboardList', 'label' => 'Mata Pelajaran yang Diampu', 'path' => '/guru/mapel'],
    ['permission' => 'manage_nilai_siswa', 'iconKey' => 'FileText', 'label' => 'Nilai Akademik Murid', 'path' => '/guru/nilai'],
    ['permission' => 'manage_absensi_siswa', 'iconKey' => 'ClipboardList', 'label' => 'Absensi Murid', 'path' => '/guru/absensi'],
    ['permission' => 'manage_pengaturan_akun', 'iconKey' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/guru/pengaturan'],

    ['permission' => 'view_dashboard_siswa', 'iconKey' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/siswa/dashboard'],
    ['permission' => 'manage_profil_pribadi', 'iconKey' => 'User', 'label' => 'Profil Pribadi', 'path' => '/siswa/profil-saya'],
    ['permission' => 'view_pengumuman', 'iconKey' => 'Bell', 'label' => 'Pengumuman Sekolah', 'path' => '/siswa/pengumuman'],
    ['permission' => 'view_kelas_pribadi', 'iconKey' => 'BookOpen', 'label' => 'Data Kelas yang Dimasuki', 'path' => '/siswa/kelas'],
    ['permission' => 'view_mapel', 'iconKey' => 'ClipboardList', 'label' => 'Mata Pelajaran', 'path' => '/siswa/mapel'],
    ['permission' => 'view_transkrip_pribadi', 'iconKey' => 'FileText', 'label' => 'Transkrip Akademik Pribadi', 'path' => '/siswa/nilai'],
    ['permission' => 'view_absensi_pribadi', 'iconKey' => 'ClipboardList', 'label' => 'Absensi Pribadi', 'path' => '/siswa/absensi'],
    ['permission' => 'manage_pengaturan_akun', 'iconKey' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/siswa/pengaturan'],

    ['permission' => 'view_dashboard_calon_siswa', 'iconKey' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/calon-murid/dashboard'],
    ['permission' => 'manage_formulir_pendaftaran', 'iconKey' => 'FileText', 'label' => 'Formulir Pendaftaran', 'path' => '/ppdb/registrasi'],
    ['permission' => 'manage_berkas_pendaftaran', 'iconKey' => 'Upload', 'label' => 'Berkas Pendaftaran', 'path' => '/calon-murid/upload-berkas'],
    ['permission' => 'view_status_pendaftaran', 'iconKey' => 'ClipboardList', 'label' => 'Status Pendaftaran', 'path' => '/calon-murid/status'],
    ['permission' => 'manage_pengaturan_akun', 'iconKey' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/calon-murid/pengaturan'],
];
