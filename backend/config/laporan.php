<?php

return [
    'jenis' => [
        'siswa',
        'guru',
        'ppdb',
        'absensi_siswa',
        'absensi_guru',
        'nilai',
        'jadwal',
    ],

    'per_page_default' => 25,
    'per_page_max' => 100,

    'role_jenis' => [
        'admin' => ['siswa', 'guru', 'ppdb', 'absensi_siswa', 'absensi_guru', 'nilai', 'jadwal'],
        'kepsek' => ['siswa', 'guru', 'ppdb', 'absensi_siswa', 'absensi_guru', 'nilai', 'jadwal'],
        'guru' => ['absensi_siswa', 'nilai', 'jadwal'],
        'siswa' => ['absensi_siswa', 'nilai', 'jadwal'],
    ],
];
