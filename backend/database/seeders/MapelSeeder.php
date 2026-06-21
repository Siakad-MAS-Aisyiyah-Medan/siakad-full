<?php

namespace Database\Seeders;

use App\Models\Mapel;
use Illuminate\Database\Seeder;

class MapelSeeder extends Seeder
{
    public function run(): void
    {
        $mapels = [
            'Al-Qur\'an Hadis',
            'Akidah Akhlak',
            'Fikih',
            'Sejarah Kebudayaan Islam',
            'Pendidikan Pancasila dan Kewarganegaraan',
            'Bahasa Indonesia',
            'Bahasa Arab',
            'Matematika',
            'Sejarah Indonesia',
            'Bahasa Inggris',
            'Seni Budaya',
            'Pendidikan Jasmani, Olahraga, dan Kesehatan',
            'Prakarya dan Kewirausahaan',
            'Biologi',
            'Fisika',
            'Kimia',
            'Geografi',
            'Ekonomi',
            'Sosiologi',
            'Ilmu Tafsir',
            'Ilmu Hadis',
        ];

        foreach ($mapels as $nama_mapel) {
            Mapel::firstOrCreate(['nama_mapel' => $nama_mapel]);
        }
    }
}
