<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RbacSeeder extends Seeder
{
    public function run(): void
    {
        User::where('role', 'wali_kelas')->update(['role' => 'guru']);

        if ($waliRole = Role::where('key', 'wali_kelas')->first()) {
            $waliRole->permissions()->detach();
            $waliRole->delete();
        }

        Permission::whereIn('key', [
            'view_dashboard_wali',
            'view_siswa_kelas',
            'view_absensi_kelas',
            'validate_nilai',
        ])->get()->each(function (Permission $permission) {
            $permission->roles()->detach();
            $permission->delete();
        });

        MenuItem::where('path', 'like', '/wali%')->delete();
        MenuItem::where('path', 'like', '/kepsek%')->delete();
        MenuItem::where('path', '/admin/pengaturan/tahun-ajaran')->delete();
        MenuItem::whereIn('label', ['Riwayat Absensi', 'Nilai Pribadi', 'Data PPDB Baru', 'Data Diri'])->delete();

        $permissions = [
            ['key' => 'manage_all', 'name' => 'Kelola Semua', 'group' => 'admin'],
            ['key' => 'manage_profil_sekolah', 'name' => 'Kelola Profil Sekolah', 'group' => 'admin'],
            ['key' => 'manage_tahun_ajaran', 'name' => 'Kelola Tahun Ajaran', 'group' => 'admin'],
            ['key' => 'manage_pengumuman', 'name' => 'Kelola Pengumuman Sekolah', 'group' => 'admin'],
            ['key' => 'manage_guru', 'name' => 'Kelola Data Guru', 'group' => 'admin'],
            ['key' => 'manage_murid', 'name' => 'Kelola Data Murid', 'group' => 'admin'],
            ['key' => 'manage_kelas', 'name' => 'Kelola Data Kelas', 'group' => 'admin'],
            ['key' => 'manage_mapel', 'name' => 'Kelola Mata Pelajaran', 'group' => 'admin'],
            ['key' => 'manage_ppdb', 'name' => 'Kelola Data PPDB', 'group' => 'admin'],
            ['key' => 'manage_users', 'name' => 'Kelola Akun Pengguna dan Hak Akses', 'group' => 'admin'],

            ['key' => 'view_dashboard_kepsek', 'name' => 'Dashboard Kepala Sekolah', 'group' => 'kepsek'],
            ['key' => 'view_dashboard_guru', 'name' => 'Dashboard Guru', 'group' => 'guru'],
            ['key' => 'view_dashboard_siswa', 'name' => 'Dashboard Murid', 'group' => 'siswa'],
            ['key' => 'view_dashboard_calon_siswa', 'name' => 'Dashboard Calon Murid', 'group' => 'calon_siswa'],

            ['key' => 'manage_profil_pribadi', 'name' => 'Kelola Profil Pribadi', 'group' => 'shared'],
            ['key' => 'manage_pengaturan_akun', 'name' => 'Kelola Pengaturan Akun Pribadi', 'group' => 'shared'],
            ['key' => 'view_pengumuman', 'name' => 'Lihat Pengumuman Sekolah', 'group' => 'shared'],
            ['key' => 'view_data_guru', 'name' => 'Lihat Data Guru', 'group' => 'kepsek'],
            ['key' => 'view_data_siswa', 'name' => 'Lihat Data Murid', 'group' => 'kepsek'],
            ['key' => 'view_data_kelas', 'name' => 'Lihat Data Kelas', 'group' => 'kepsek'],
            ['key' => 'view_mapel', 'name' => 'Lihat Mata Pelajaran', 'group' => 'shared'],
            ['key' => 'view_data_ppdb', 'name' => 'Lihat Data PPDB', 'group' => 'kepsek'],
            ['key' => 'view_transkrip_murid', 'name' => 'Lihat Transkrip Akademik Murid', 'group' => 'kepsek'],
            ['key' => 'view_murid_diajar', 'name' => 'Lihat Data Murid yang Diajar', 'group' => 'guru'],
            ['key' => 'view_kelas_diajar', 'name' => 'Lihat Data Kelas yang Diajar', 'group' => 'guru'],
            ['key' => 'view_mapel_diampu', 'name' => 'Lihat Mata Pelajaran yang Diampu', 'group' => 'guru'],
            ['key' => 'manage_nilai_siswa', 'name' => 'Kelola Nilai Akademik Murid', 'group' => 'guru'],
            ['key' => 'manage_absensi_siswa', 'name' => 'Kelola Absensi Murid', 'group' => 'guru'],
            ['key' => 'view_kelas_pribadi', 'name' => 'Lihat Data Kelas yang Dimasuki', 'group' => 'siswa'],
            ['key' => 'view_transkrip_pribadi', 'name' => 'Lihat Transkrip Akademik Pribadi', 'group' => 'siswa'],
            ['key' => 'view_absensi_pribadi', 'name' => 'Lihat Absensi Pribadi', 'group' => 'siswa'],
            ['key' => 'view_nilai_pribadi', 'name' => 'Lihat Nilai Pribadi', 'group' => 'siswa'],
            ['key' => 'manage_pendaftaran_pribadi', 'name' => 'Kelola Pendaftaran Pribadi', 'group' => 'calon_siswa'],
            ['key' => 'manage_formulir_pendaftaran', 'name' => 'Kelola Formulir Pendaftaran', 'group' => 'calon_siswa'],
            ['key' => 'manage_berkas_pendaftaran', 'name' => 'Kelola Berkas Pendaftaran', 'group' => 'calon_siswa'],
            ['key' => 'submit_pendaftaran', 'name' => 'Kirim Pendaftaran', 'group' => 'calon_siswa'],
            ['key' => 'view_status_pendaftaran', 'name' => 'Lihat Status Pendaftaran', 'group' => 'calon_siswa'],
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(['key' => $perm['key']], $perm);
        }

        $allPermissionIds = Permission::pluck('id_permission', 'key');

        $roles = [
            ['key' => 'admin', 'name' => 'Administrator', 'redirect_path' => '/admin/dashboard', 'permissions' => ['manage_all']],
            ['key' => 'kepsek', 'name' => 'Kepala Sekolah', 'redirect_path' => '/kepala-sekolah/dashboard', 'permissions' => [
                'view_dashboard_kepsek', 'manage_profil_pribadi', 'manage_pengaturan_akun', 'view_pengumuman',
                'view_data_guru', 'view_data_siswa', 'view_data_kelas', 'view_mapel', 'view_transkrip_murid',
                'view_data_ppdb',
            ]],
            ['key' => 'guru', 'name' => 'Guru', 'redirect_path' => '/guru/dashboard', 'permissions' => [
                'view_dashboard_guru', 'manage_profil_pribadi', 'manage_pengaturan_akun', 'view_pengumuman',
                'view_murid_diajar', 'view_kelas_diajar', 'view_mapel_diampu', 'manage_nilai_siswa',
                'manage_absensi_siswa',
            ]],
            ['key' => 'siswa', 'name' => 'Murid', 'redirect_path' => '/siswa/dashboard', 'permissions' => [
                'view_dashboard_siswa', 'manage_profil_pribadi', 'manage_pengaturan_akun', 'view_pengumuman',
                'view_kelas_pribadi', 'view_mapel', 'view_transkrip_pribadi', 'view_absensi_pribadi',
                'view_nilai_pribadi',
            ]],
            ['key' => 'calon_siswa', 'name' => 'Calon Murid', 'redirect_path' => '/calon-murid/dashboard', 'permissions' => [
                'view_dashboard_calon_siswa', 'manage_pengaturan_akun', 'manage_pendaftaran_pribadi',
                'manage_formulir_pendaftaran', 'manage_berkas_pendaftaran', 'submit_pendaftaran',
                'view_status_pendaftaran',
            ]],
        ];

        foreach ($roles as $roleData) {
            $role = Role::updateOrCreate(
                ['key' => $roleData['key']],
                [
                    'name' => $roleData['name'],
                    'redirect_path' => $roleData['redirect_path'],
                ]
            );

            if (in_array('manage_all', $roleData['permissions'], true)) {
                $role->permissions()->sync($allPermissionIds->values()->all());
            } else {
                $ids = collect($roleData['permissions'])
                    ->map(fn (string $key) => $allPermissionIds->get($key))
                    ->filter()
                    ->values()
                    ->all();
                $role->permissions()->sync($ids);
            }
        }

        $menus = [
            ['permission_key' => 'manage_all', 'icon_key' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/admin/dashboard', 'sort_order' => 10],
            ['permission_key' => 'manage_profil_sekolah', 'icon_key' => 'School', 'label' => 'Profil Sekolah', 'path' => '/admin/profil-sekolah', 'sort_order' => 20],
            ['permission_key' => 'manage_tahun_ajaran', 'icon_key' => 'CalendarDays', 'label' => 'Tahun Ajaran', 'path' => '/admin/tahun-ajaran', 'sort_order' => 30],
            ['permission_key' => 'manage_pengumuman', 'icon_key' => 'Bell', 'label' => 'Pengumuman Sekolah', 'path' => '/admin/pengumuman', 'sort_order' => 40],
            ['permission_key' => 'manage_guru', 'icon_key' => 'Users', 'label' => 'Data Guru', 'path' => '/admin/guru', 'sort_order' => 50],
            ['permission_key' => 'manage_murid', 'icon_key' => 'GraduationCap', 'label' => 'Data Murid', 'path' => '/admin/murid', 'sort_order' => 60],
            ['permission_key' => 'manage_kelas', 'icon_key' => 'BookOpen', 'label' => 'Data Kelas', 'path' => '/admin/kelas', 'sort_order' => 70],
            ['permission_key' => 'manage_mapel', 'icon_key' => 'ClipboardList', 'label' => 'Mata Pelajaran', 'path' => '/admin/mapel', 'sort_order' => 80],
            ['permission_key' => 'view_transkrip_murid', 'icon_key' => 'FileText', 'label' => 'Transkrip Akademik Murid', 'path' => '/admin/transkrip-akademik', 'sort_order' => 90],
            ['permission_key' => 'manage_ppdb', 'icon_key' => 'UserCheck', 'label' => 'Data PPDB', 'path' => '/admin/ppdb', 'sort_order' => 100],
            ['permission_key' => 'manage_users', 'icon_key' => 'ShieldCheck', 'label' => 'Akun Pengguna & Hak Akses', 'path' => '/admin/hak-akses', 'sort_order' => 110],
            ['permission_key' => 'manage_pengaturan_akun', 'icon_key' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/admin/pengaturan', 'sort_order' => 120],

            ['permission_key' => 'view_dashboard_kepsek', 'icon_key' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/kepala-sekolah/dashboard', 'sort_order' => 210],
            ['permission_key' => 'manage_profil_pribadi', 'icon_key' => 'User', 'label' => 'Profil Pribadi', 'path' => '/kepala-sekolah/profil-saya', 'sort_order' => 220],
            ['permission_key' => 'view_pengumuman', 'icon_key' => 'Bell', 'label' => 'Pengumuman Sekolah', 'path' => '/kepala-sekolah/pengumuman', 'sort_order' => 230],
            ['permission_key' => 'view_data_guru', 'icon_key' => 'Users', 'label' => 'Data Guru', 'path' => '/kepala-sekolah/data-guru', 'sort_order' => 240],
            ['permission_key' => 'view_data_siswa', 'icon_key' => 'GraduationCap', 'label' => 'Data Murid', 'path' => '/kepala-sekolah/data-murid', 'sort_order' => 250],
            ['permission_key' => 'view_data_kelas', 'icon_key' => 'BookOpen', 'label' => 'Data Kelas', 'path' => '/kepala-sekolah/data-kelas', 'sort_order' => 260],
            ['permission_key' => 'view_mapel', 'icon_key' => 'ClipboardList', 'label' => 'Mata Pelajaran', 'path' => '/kepala-sekolah/data-mapel', 'sort_order' => 270],
            ['permission_key' => 'view_transkrip_murid', 'icon_key' => 'FileText', 'label' => 'Transkrip Akademik Murid', 'path' => '/kepala-sekolah/transkrip-akademik', 'sort_order' => 280],
            ['permission_key' => 'view_data_ppdb', 'icon_key' => 'UserCheck', 'label' => 'Data PPDB', 'path' => '/kepala-sekolah/data-ppdb', 'sort_order' => 290],
            ['permission_key' => 'manage_pengaturan_akun', 'icon_key' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/kepala-sekolah/pengaturan', 'sort_order' => 300],

            ['permission_key' => 'view_dashboard_guru', 'icon_key' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/guru/dashboard', 'sort_order' => 410],
            ['permission_key' => 'manage_profil_pribadi', 'icon_key' => 'User', 'label' => 'Profil Pribadi', 'path' => '/guru/profil-saya', 'sort_order' => 420],
            ['permission_key' => 'view_pengumuman', 'icon_key' => 'Bell', 'label' => 'Pengumuman Sekolah', 'path' => '/guru/pengumuman', 'sort_order' => 430],
            ['permission_key' => 'view_murid_diajar', 'icon_key' => 'Users', 'label' => 'Data Murid yang Diajar', 'path' => '/guru/murid', 'sort_order' => 440],
            ['permission_key' => 'view_kelas_diajar', 'icon_key' => 'BookOpen', 'label' => 'Data Kelas yang Diajar', 'path' => '/guru/kelas', 'sort_order' => 450],
            ['permission_key' => 'view_mapel_diampu', 'icon_key' => 'ClipboardList', 'label' => 'Mata Pelajaran yang Diampu', 'path' => '/guru/mapel', 'sort_order' => 460],
            ['permission_key' => 'manage_nilai_siswa', 'icon_key' => 'FileText', 'label' => 'Nilai Akademik Murid', 'path' => '/guru/nilai', 'sort_order' => 470],
            ['permission_key' => 'manage_absensi_siswa', 'icon_key' => 'ClipboardList', 'label' => 'Absensi Murid', 'path' => '/guru/absensi', 'sort_order' => 480],
            ['permission_key' => 'manage_pengaturan_akun', 'icon_key' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/guru/pengaturan', 'sort_order' => 490],

            ['permission_key' => 'view_dashboard_siswa', 'icon_key' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/siswa/dashboard', 'sort_order' => 610],
            ['permission_key' => 'manage_profil_pribadi', 'icon_key' => 'User', 'label' => 'Profil Pribadi', 'path' => '/siswa/profil-saya', 'sort_order' => 620],
            ['permission_key' => 'view_pengumuman', 'icon_key' => 'Bell', 'label' => 'Pengumuman Sekolah', 'path' => '/siswa/pengumuman', 'sort_order' => 630],
            ['permission_key' => 'view_kelas_pribadi', 'icon_key' => 'BookOpen', 'label' => 'Data Kelas yang Dimasuki', 'path' => '/siswa/kelas', 'sort_order' => 640],
            ['permission_key' => 'view_mapel', 'icon_key' => 'ClipboardList', 'label' => 'Mata Pelajaran', 'path' => '/siswa/mapel', 'sort_order' => 650],
            ['permission_key' => 'view_transkrip_pribadi', 'icon_key' => 'FileText', 'label' => 'Transkrip Akademik Pribadi', 'path' => '/siswa/nilai', 'sort_order' => 660],
            ['permission_key' => 'view_absensi_pribadi', 'icon_key' => 'ClipboardList', 'label' => 'Absensi Pribadi', 'path' => '/siswa/absensi', 'sort_order' => 670],
            ['permission_key' => 'manage_pengaturan_akun', 'icon_key' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/siswa/pengaturan', 'sort_order' => 680],

            ['permission_key' => 'view_dashboard_calon_siswa', 'icon_key' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/calon-murid/dashboard', 'sort_order' => 810],
            ['permission_key' => 'manage_formulir_pendaftaran', 'icon_key' => 'FileText', 'label' => 'Formulir Pendaftaran', 'path' => '/ppdb/registrasi', 'sort_order' => 820],
            ['permission_key' => 'manage_berkas_pendaftaran', 'icon_key' => 'Upload', 'label' => 'Berkas Pendaftaran', 'path' => '/calon-murid/upload-berkas', 'sort_order' => 830],
            ['permission_key' => 'view_status_pendaftaran', 'icon_key' => 'ClipboardList', 'label' => 'Status Pendaftaran', 'path' => '/calon-murid/status', 'sort_order' => 840],
            ['permission_key' => 'manage_pengaturan_akun', 'icon_key' => 'Settings2', 'label' => 'Pengaturan Akun Pribadi', 'path' => '/calon-murid/pengaturan', 'sort_order' => 850],
        ];

        foreach ($menus as $menu) {
            MenuItem::updateOrCreate(['path' => $menu['path']], $menu);
        }
    }
}
