<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Guru;
use App\Models\KepalaSekolah;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Seeder;

class SiakadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Admin
        $adminUser = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'email' => 'admin@siakad.com',
                'password' => 'password',
                'role' => 'admin',
                'status_aktif' => true,
            ]
        );
        $adminUser->forceFill(['role' => 'admin', 'status_aktif' => true])->save();
        Admin::updateOrCreate(['id_user' => $adminUser->id_user], [
            'id_user' => $adminUser->id_user,
            'nip' => '123456789',
            'nama_admin' => 'Administrator',
            'no_hp' => '081234567890',
        ]);

        // 2. Seed Kepala Sekolah
        $kepsekUser = User::firstOrCreate(
            ['username' => 'kepsek'],
            [
                'email' => 'kepsek@siakad.com',
                'password' => 'password',
                'role' => 'kepsek',
                'status_aktif' => true,
            ]
        );
        $kepsekUser->forceFill(['role' => 'kepsek', 'status_aktif' => true])->save();
        KepalaSekolah::updateOrCreate(['id_user' => $kepsekUser->id_user], [
            'id_user' => $kepsekUser->id_user,
            'nip' => '987654321',
            'nama_kepsek' => 'Dr. H. Budi Santoso',
            'no_hp' => '081298765432',
        ]);

        // 3. Seed Guru
        $guruUser = User::firstOrCreate(
            ['username' => 'guru'],
            [
                'email' => 'guru@siakad.com',
                'password' => 'password',
                'role' => 'guru',
                'status_aktif' => true,
            ]
        );
        $guruUser->forceFill(['role' => 'guru', 'status_aktif' => true])->save();
        Guru::updateOrCreate(['id_user' => $guruUser->id_user], [
            'id_user' => $guruUser->id_user,
            'nip' => '1122334455',
            'nama_guru' => 'Siti Aminah, S.Pd',
            'jenis_kelamin' => 'P',
            'agama' => 'Islam',
            'alamat' => 'Jl. Pendidikan No. 45, Kota ABC',
            'no_hp' => '082133445566',
        ]);

        // 4. Seed Siswa
        $siswaUser = User::firstOrCreate(
            ['username' => 'siswa'],
            [
                'email' => 'siswa@siakad.com',
                'password' => 'password',
                'role' => 'siswa',
                'status_aktif' => true,
            ]
        );
        $siswaUser->forceFill(['role' => 'siswa', 'status_aktif' => true])->save();
        Siswa::updateOrCreate(['id_user' => $siswaUser->id_user], [
            'id_user' => $siswaUser->id_user,
            'nisn' => '0011223344',
            'nis' => '10001',
            'nama_siswa' => 'Rizky Pratama',
            'tempat_lahir' => 'Jakarta',
            'tgl_lahir' => '2008-05-15',
            'jenis_kelamin' => 'L',
            'agama' => 'Islam',
            'alamat' => 'Perumahan Indah Blok C1 No. 5',
            'nama_wali' => 'Bambang Pratama',
            'no_hp_wali' => '081255667788',
        ]);
    }
}
