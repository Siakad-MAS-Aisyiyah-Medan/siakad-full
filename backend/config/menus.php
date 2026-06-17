<?php

/**
 * Sidebar menus filtered by permission (not hardcoded role-only).
 */
return [
    [
        'permission' => 'view_dashboard_kepsek',
        'iconKey' => 'LayoutDashboard',
        'label' => 'Dashboard',
        'path' => '/kepsek/dashboard',
    ],
    [
        'permission' => 'manage_all',
        'iconKey' => 'LayoutDashboard',
        'label' => 'Dashboard',
        'path' => '/admin/dashboard',
    ],
    [
        'permission' => 'manage_all',
        'iconKey' => 'School',
        'label' => 'Profil Sekolah',
        'path' => '/admin/profil-sekolah',
    ],
    [
        'permission' => 'manage_pengumuman',
        'iconKey' => 'Bell',
        'label' => 'Pengumuman Sekolah',
        'path' => '/admin/pengumuman',
    ],
    [
        'permission' => 'manage_prestasi',
        'iconKey' => 'Star',
        'label' => 'Berita & Prestasi',
        'path' => '/admin/prestasi',
    ],
    [
        'permission' => 'manage_guru',
        'iconKey' => 'Users',
        'label' => 'Data Guru',
        'path' => '/admin/guru',
    ],
    [
        'permission' => 'manage_murid',
        'iconKey' => 'GraduationCap',
        'label' => 'Data Murid',
        'path' => '/admin/murid',
    ],
    [
        'permission' => 'manage_kelas',
        'iconKey' => 'BookOpen',
        'label' => 'Data Kelas',
        'path' => '/admin/kelas',
    ],
    [
        'permission' => 'manage_mapel',
        'iconKey' => 'ClipboardList',
        'label' => 'Mata Pelajaran',
        'path' => '/admin/mapel',
    ],
    [
        'permission' => 'manage_jadwal',
        'iconKey' => 'Calendar',
        'label' => 'Jadwal Pelajaran',
        'path' => '/admin/jadwal',
    ],
    [
        'permission' => 'manage_ekskul',
        'iconKey' => 'Star',
        'label' => 'Ekstrakurikuler',
        'path' => '/admin/ekskul',
    ],
    [
        'permission' => 'manage_ppdb',
        'iconKey' => 'UserCheck',
        'label' => 'Verifikasi PPDB',
        'path' => '/admin/ppdb',
    ],
    [
        'permission' => 'manage_users',
        'iconKey' => 'Settings',
        'label' => 'Akun & Hak Akses',
        'path' => '/admin/hak-akses',
    ],
    [
        'permission' => 'manage_all',
        'iconKey' => 'Shield',
        'label' => 'Audit Log',
        'path' => '/admin/audit-logs',
    ],
    [
        'permission' => 'view_laporan',
        'iconKey' => 'FileText',
        'label' => 'Laporan',
        'path' => '/admin/laporan',
    ],

    [
        'permission' => 'view_dashboard_guru',
        'iconKey' => 'LayoutDashboard',
        'label' => 'Dashboard',
        'path' => '/guru/dashboard',
    ],
    [
        'permission' => 'view_jadwal_mengajar',
        'iconKey' => 'Calendar',
        'label' => 'Jadwal Mengajar',
        'path' => '/guru/jadwal',
    ],
    [
        'permission' => 'manage_absensi_siswa',
        'iconKey' => 'ClipboardList',
        'label' => 'Kelola Absensi',
        'path' => '/guru/absensi',
    ],
    [
        'permission' => 'manage_nilai_siswa',
        'iconKey' => 'FileText',
        'label' => 'Kelola Nilai',
        'path' => '/guru/nilai',
    ],
    [
        'permission' => 'view_dashboard_siswa',
        'iconKey' => 'LayoutDashboard',
        'label' => 'Dashboard',
        'path' => '/siswa/dashboard',
    ],
    [
        'permission' => 'view_jadwal_siswa',
        'iconKey' => 'Calendar',
        'label' => 'Jadwal Pelajaran',
        'path' => '/siswa/jadwal',
    ],
    [
        'permission' => 'view_absensi_pribadi',
        'iconKey' => 'ClipboardList',
        'label' => 'Riwayat Absensi',
        'path' => '/siswa/absensi',
    ],
    [
        'permission' => 'view_nilai_pribadi',
        'iconKey' => 'FileText',
        'label' => 'Nilai Pribadi',
        'path' => '/siswa/nilai',
    ],
    [
        'permission' => 'view_dashboard_calon_siswa',
        'iconKey' => 'LayoutDashboard',
        'label' => 'Status Pendaftaran',
        'path' => '/ppdb/dashboard',
    ],
    [
        'permission' => 'view_data_siswa',
        'iconKey' => 'Users',
        'label' => 'Data Murid & Guru',
        'path' => '/kepsek/data',
    ],
    [
        'permission' => 'manage_ppdb',
        'iconKey' => 'UserCheck',
        'label' => 'Data PPDB Baru',
        'path' => '/kepsek/ppdb',
    ],
    [
        'permission' => 'view_laporan',
        'iconKey' => 'BarChart3',
        'label' => 'Laporan Absensi Guru',
        'path' => '/kepsek/absensi-guru',
    ],
];
