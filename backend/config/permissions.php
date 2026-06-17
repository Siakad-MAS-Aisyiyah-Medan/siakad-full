<?php

/**
 * RBAC fallback (jika tabel roles/permissions belum di-seed).
 * Sumber utama: database + RbacSeeder.
 */
return [
    'all' => [
        'manage_all',
        'manage_users',
        'manage_murid',
        'manage_guru',
        'manage_kelas',
        'manage_mapel',
        'manage_jadwal',
        'manage_ppdb',
        'manage_pengumuman',
        'manage_prestasi',
        'manage_ekskul',
        'manage_absensi_guru',
        'view_laporan',
        'view_dashboard_kepsek',
        'view_dashboard_guru',
        'view_dashboard_siswa',
        'view_dashboard_calon_siswa',
        'view_data_guru',
        'view_data_siswa',
        'view_jadwal_mengajar',
        'manage_absensi_siswa',
        'manage_nilai_siswa',
        'view_jadwal_siswa',
        'view_absensi_pribadi',
        'view_nilai_pribadi',
        'manage_pendaftaran_pribadi',
        'view_status_pendaftaran',
    ],

    'role_permissions' => [
        'admin' => ['manage_all'],
        'kepsek' => [
            'view_dashboard_kepsek',
            'view_laporan',
            'view_data_guru',
            'view_data_siswa',
        ],
        'guru' => [
            'view_dashboard_guru',
            'view_jadwal_mengajar',
            'manage_absensi_siswa',
            'manage_nilai_siswa',
        ],
        'siswa' => [
            'view_dashboard_siswa',
            'view_jadwal_siswa',
            'view_absensi_pribadi',
            'view_nilai_pribadi',
        ],
        'calon_siswa' => [
            'view_dashboard_calon_siswa',
            'manage_pendaftaran_pribadi',
            'view_status_pendaftaran',
        ],
    ],

    'admin_inherits_all' => true,

    'redirect_paths' => [
        'admin' => '/admin/dashboard',
        'kepsek' => '/kepsek/dashboard',
        'guru' => '/guru/dashboard',
        'siswa' => '/siswa/dashboard',
        'calon_siswa' => '/calon-murid/dashboard',
    ],
];
