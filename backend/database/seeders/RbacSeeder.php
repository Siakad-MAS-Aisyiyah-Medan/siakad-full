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

        $permissions = [
            ['key' => 'manage_all', 'name' => 'Kelola Semua', 'group' => 'admin'],
            ['key' => 'manage_users', 'name' => 'Kelola Pengguna', 'group' => 'admin'],
            ['key' => 'manage_murid', 'name' => 'Kelola Murid', 'group' => 'admin'],
            ['key' => 'manage_guru', 'name' => 'Kelola Guru', 'group' => 'admin'],
            ['key' => 'manage_kelas', 'name' => 'Kelola Kelas', 'group' => 'admin'],
            ['key' => 'manage_mapel', 'name' => 'Kelola Mapel', 'group' => 'admin'],
            ['key' => 'manage_jadwal', 'name' => 'Kelola Jadwal', 'group' => 'admin'],
            ['key' => 'manage_ppdb', 'name' => 'Kelola PPDB', 'group' => 'admin'],
            ['key' => 'manage_pengumuman', 'name' => 'Kelola Pengumuman', 'group' => 'admin'],
            ['key' => 'manage_prestasi', 'name' => 'Kelola Prestasi', 'group' => 'admin'],
            ['key' => 'manage_ekskul', 'name' => 'Kelola Ekskul', 'group' => 'admin'],
            ['key' => 'manage_absensi_guru', 'name' => 'Kelola Absensi Guru', 'group' => 'admin'],
            ['key' => 'view_laporan', 'name' => 'Lihat Laporan', 'group' => 'admin'],
            ['key' => 'view_dashboard_kepsek', 'name' => 'Dashboard Kepsek', 'group' => 'kepsek'],
            ['key' => 'view_data_guru', 'name' => 'Lihat Data Guru', 'group' => 'kepsek'],
            ['key' => 'view_data_siswa', 'name' => 'Lihat Data Siswa', 'group' => 'kepsek'],
            ['key' => 'view_dashboard_guru', 'name' => 'Dashboard Guru', 'group' => 'guru'],
            ['key' => 'view_jadwal_mengajar', 'name' => 'Jadwal Mengajar', 'group' => 'guru'],
            ['key' => 'manage_absensi_siswa', 'name' => 'Kelola Absensi Siswa', 'group' => 'guru'],
            ['key' => 'manage_nilai_siswa', 'name' => 'Kelola Nilai Siswa', 'group' => 'guru'],
            ['key' => 'view_dashboard_siswa', 'name' => 'Dashboard Siswa', 'group' => 'siswa'],
            ['key' => 'view_jadwal_siswa', 'name' => 'Jadwal Siswa', 'group' => 'siswa'],
            ['key' => 'view_absensi_pribadi', 'name' => 'Absensi Pribadi', 'group' => 'siswa'],
            ['key' => 'view_nilai_pribadi', 'name' => 'Nilai Pribadi', 'group' => 'siswa'],
            ['key' => 'view_dashboard_calon_siswa', 'name' => 'Dashboard Calon Siswa', 'group' => 'calon_siswa'],
            ['key' => 'manage_pendaftaran_pribadi', 'name' => 'Kelola Pendaftaran', 'group' => 'calon_siswa'],
            ['key' => 'view_status_pendaftaran', 'name' => 'Status Pendaftaran', 'group' => 'calon_siswa'],
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(['key' => $perm['key']], $perm);
        }

        $allPermissionIds = Permission::pluck('id_permission', 'key');

        $roles = [
            ['key' => 'admin', 'name' => 'Administrator', 'redirect_path' => '/admin/dashboard', 'permissions' => ['manage_all']],
            ['key' => 'kepsek', 'name' => 'Kepala Sekolah', 'redirect_path' => '/kepsek/dashboard', 'permissions' => [
                'view_dashboard_kepsek', 'view_laporan', 'view_data_guru', 'view_data_siswa',
            ]],
            ['key' => 'guru', 'name' => 'Guru', 'redirect_path' => '/guru/dashboard', 'permissions' => [
                'view_dashboard_guru', 'view_jadwal_mengajar', 'manage_absensi_siswa', 'manage_nilai_siswa',
            ]],
            ['key' => 'siswa', 'name' => 'Siswa', 'redirect_path' => '/siswa/dashboard', 'permissions' => [
                'view_dashboard_siswa', 'view_jadwal_siswa', 'view_absensi_pribadi', 'view_nilai_pribadi',
            ]],
            ['key' => 'calon_siswa', 'name' => 'Calon Siswa', 'redirect_path' => '/calon-murid/dashboard', 'permissions' => [
                'view_dashboard_calon_siswa', 'manage_pendaftaran_pribadi', 'view_status_pendaftaran',
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
            ['permission_key' => 'manage_all', 'icon_key' => 'School', 'label' => 'Profil Sekolah', 'path' => '/admin/profil-sekolah', 'sort_order' => 20],
            ['permission_key' => 'manage_pengumuman', 'icon_key' => 'Bell', 'label' => 'Pengumuman Sekolah', 'path' => '/admin/pengumuman', 'sort_order' => 30],
            ['permission_key' => 'manage_prestasi', 'icon_key' => 'Star', 'label' => 'Berita & Prestasi', 'path' => '/admin/prestasi', 'sort_order' => 40],
            ['permission_key' => 'manage_guru', 'icon_key' => 'Users', 'label' => 'Data Guru', 'path' => '/admin/guru', 'sort_order' => 50],
            ['permission_key' => 'manage_murid', 'icon_key' => 'GraduationCap', 'label' => 'Data Murid', 'path' => '/admin/murid', 'sort_order' => 60],
            ['permission_key' => 'manage_kelas', 'icon_key' => 'BookOpen', 'label' => 'Data Kelas', 'path' => '/admin/kelas', 'sort_order' => 70],
            ['permission_key' => 'manage_jadwal', 'icon_key' => 'Calendar', 'label' => 'Jadwal Pelajaran', 'path' => '/admin/jadwal', 'sort_order' => 90],
            ['permission_key' => 'manage_ekskul', 'icon_key' => 'Star', 'label' => 'Ekstrakurikuler', 'path' => '/admin/ekskul', 'sort_order' => 100],
            ['permission_key' => 'manage_ppdb', 'icon_key' => 'UserCheck', 'label' => 'Verifikasi PPDB', 'path' => '/admin/ppdb', 'sort_order' => 110],
            ['permission_key' => 'manage_users', 'icon_key' => 'Settings', 'label' => 'Akun & Hak Akses', 'path' => '/admin/hak-akses', 'sort_order' => 120],
            ['permission_key' => 'manage_all', 'icon_key' => 'Shield', 'label' => 'Audit Log', 'path' => '/admin/audit-logs', 'sort_order' => 125],
            ['permission_key' => 'view_laporan', 'icon_key' => 'FileText', 'label' => 'Laporan', 'path' => '/admin/laporan', 'sort_order' => 130],

            ['permission_key' => 'view_dashboard_kepsek', 'icon_key' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/kepsek/dashboard', 'sort_order' => 10],
            ['permission_key' => 'view_dashboard_kepsek', 'icon_key' => 'User', 'label' => 'Data Diri', 'path' => '/kepsek/data-diri', 'sort_order' => 15],
            ['permission_key' => 'view_dashboard_kepsek', 'icon_key' => 'School', 'label' => 'Profil Sekolah', 'path' => '/kepsek/profil-sekolah', 'sort_order' => 20],
            ['permission_key' => 'view_dashboard_kepsek', 'icon_key' => 'Bell', 'label' => 'Berita & Pengumuman', 'path' => '/kepsek/pengumuman', 'sort_order' => 25],
            ['permission_key' => 'view_data_siswa', 'icon_key' => 'UserCheck', 'label' => 'Data PPDB Baru', 'path' => '/kepsek/data-ppdb', 'sort_order' => 30],
            ['permission_key' => 'view_data_siswa', 'icon_key' => 'GraduationCap', 'label' => 'Data Murid', 'path' => '/kepsek/data-murid', 'sort_order' => 35],
            ['permission_key' => 'view_data_guru', 'icon_key' => 'Users', 'label' => 'Data Guru', 'path' => '/kepsek/data-guru', 'sort_order' => 40],
            ['permission_key' => 'view_data_siswa', 'icon_key' => 'BookOpen', 'label' => 'Data Kelas', 'path' => '/kepsek/data-kelas', 'sort_order' => 45],
            ['permission_key' => 'view_laporan', 'icon_key' => 'ClipboardList', 'label' => 'Laporan Absensi Murid', 'path' => '/kepsek/laporan-absensi', 'sort_order' => 50],
            ['permission_key' => 'view_laporan', 'icon_key' => 'FileText', 'label' => 'Laporan Nilai Murid', 'path' => '/kepsek/laporan-nilai', 'sort_order' => 55],
            ['permission_key' => 'view_dashboard_guru', 'icon_key' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/guru/dashboard', 'sort_order' => 10],
            ['permission_key' => 'view_jadwal_mengajar', 'icon_key' => 'Calendar', 'label' => 'Jadwal Mengajar', 'path' => '/guru/jadwal', 'sort_order' => 20],
            ['permission_key' => 'manage_absensi_siswa', 'icon_key' => 'ClipboardList', 'label' => 'Kelola Absensi', 'path' => '/guru/absensi', 'sort_order' => 30],
            ['permission_key' => 'manage_nilai_siswa', 'icon_key' => 'FileText', 'label' => 'Kelola Nilai', 'path' => '/guru/nilai', 'sort_order' => 40],
            ['permission_key' => 'view_dashboard_siswa', 'icon_key' => 'LayoutDashboard', 'label' => 'Dashboard', 'path' => '/siswa/dashboard', 'sort_order' => 10],
            ['permission_key' => 'view_jadwal_siswa', 'icon_key' => 'Calendar', 'label' => 'Jadwal Pelajaran', 'path' => '/siswa/jadwal', 'sort_order' => 20],
            ['permission_key' => 'view_absensi_pribadi', 'icon_key' => 'ClipboardList', 'label' => 'Riwayat Absensi', 'path' => '/siswa/absensi', 'sort_order' => 30],
            ['permission_key' => 'view_nilai_pribadi', 'icon_key' => 'FileText', 'label' => 'Nilai Pribadi', 'path' => '/siswa/nilai', 'sort_order' => 40],
            ['permission_key' => 'view_dashboard_calon_siswa', 'icon_key' => 'LayoutDashboard', 'label' => 'PPDB', 'path' => '/ppdb/dashboard', 'sort_order' => 10],
        ];

        foreach ($menus as $menu) {
            MenuItem::updateOrCreate(['path' => $menu['path']], $menu);
        }
    }
}
