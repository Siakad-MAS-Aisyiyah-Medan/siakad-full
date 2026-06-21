<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use App\Utils\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PpdbSettingController extends Controller
{
    /**
     * Get all PPDB settings
     */
    public function getSettings()
    {
        $keys = [
            'ppdb_judul',
            'ppdb_tahun_ajaran',
            'ppdb_deskripsi',
            'ppdb_hero_highlights',
            'ppdb_gelombang',
            'ppdb_promo',
            'ppdb_persyaratan',
            'ppdb_fasilitas',
            'ppdb_ekstrakurikuler',
            'ppdb_alur',
            'ppdb_kontak',
            'ppdb_alamat',
            'ppdb_brosur',
        ];

        $defaults = [
            'ppdb_judul' => 'Penerimaan Peserta Didik Baru',
            'ppdb_tahun_ajaran' => '2026/2027',
            'ppdb_deskripsi' => 'MAS Aisyiyah Medan membuka pendaftaran peserta didik baru Tahun Pelajaran 2026/2027. Buat akun calon murid, lengkapi formulir dan berkas, lalu pantau status pendaftaran secara online.',
            'ppdb_hero_highlights' => [
                ['teks' => 'Gratis uang pembangunan', 'ikon' => 'gift'],
                ['teks' => 'Gratis pendaftaran 20 pendaftar pertama', 'ikon' => 'award'],
                ['teks' => 'Diskon alumni Muhammadiyah/Aisyiyah', 'ikon' => 'percent'],
                ['teks' => 'Gratis SPP bagi anak yatim (syarat berlaku)', 'ikon' => 'heart'],
            ],
            'ppdb_gelombang' => [
                [
                    'id' => 'gelombang-1',
                    'judul' => 'Gelombang 1',
                    'periode' => 'Januari – Maret 2026',
                    'badge' => 'Dibuka',
                    'keuntungan' => [
                        'Gratis uang pembangunan',
                        'Gratis uang ekskul 6 bulan untuk juara 1, 2, 3',
                    ],
                ],
                [
                    'id' => 'gelombang-2',
                    'judul' => 'Gelombang 2',
                    'periode' => 'April – Juni 2026',
                    'badge' => 'Segera',
                    'keuntungan' => [
                        'Gratis uang pembangunan',
                        'Gratis uang ekskul 3 bulan untuk juara 1, 2, 3',
                    ],
                ],
            ],
            'ppdb_promo' => [
                [
                    'judul' => 'Gratis Biaya Pendaftaran',
                    'deskripsi' => 'Untuk 20 pendaftar pertama pada periode yang ditentukan.',
                    'ikon' => 'gift',
                ],
                [
                    'judul' => 'Diskon Alumni 50%',
                    'deskripsi' => 'Alumni SMP/MTs Muhammadiyah/Aisyiyah mendapat diskon khusus.',
                    'ikon' => 'percent',
                ],
                [
                    'judul' => 'Gratis SPP Anak Yatim',
                    'deskripsi' => 'Program bantuan SPP bagi anak yatim sesuai ketentuan sekolah.',
                    'ikon' => 'heart',
                ],
                [
                    'judul' => 'Lingkungan Islami',
                    'deskripsi' => 'Pembinaan karakter dan keagamaan terintegrasi setiap hari.',
                    'ikon' => 'church',
                ],
                [
                    'judul' => 'Guru Berpengalaman',
                    'deskripsi' => 'Tenaga pendidik profesional dan berkompeten di bidangnya.',
                    'ikon' => 'graduation',
                ],
                [
                    'judul' => 'Pembelajaran Modern',
                    'deskripsi' => 'Kurikulum nasional dengan penguatan IPTEK dan literasi digital.',
                    'ikon' => 'monitor',
                ],
            ],
            'ppdb_persyaratan' => [
                'Mengisi formulir pendaftaran online',
                'Fotokopi akta kelahiran',
                'Fotokopi kartu keluarga',
                'Fotokopi KTP orang tua',
                'Pas foto 3×4 sebanyak 4 lembar',
                'Fotokopi ijazah/SKL legalisir',
                'Fotokopi KIP (jika ada)',
                'NISN',
            ],
            'ppdb_fasilitas' => [
                ['nama' => 'Ruang Kelas Luas', 'ikon' => 'building'],
                ['nama' => 'Ruang Perpustakaan', 'ikon' => 'library'],
                ['nama' => 'Mushola', 'ikon' => 'church'],
                ['nama' => 'Lapangan Olahraga', 'ikon' => 'volleyball'],
                ['nama' => 'Ruang Komputer', 'ikon' => 'monitor'],
                ['nama' => 'Ruang Keterampilan', 'ikon' => 'utensils'],
            ],
            'ppdb_ekstrakurikuler' => [
                ['nama' => 'Pramuka', 'ikon' => 'shield'],
                ['nama' => 'Futsal', 'ikon' => 'dumbbell'],
                ['nama' => 'Tapak Suci', 'ikon' => 'users'],
                ['nama' => 'Tahfidz', 'ikon' => 'book'],
                ['nama' => 'Tata Boga', 'ikon' => 'utensils'],
            ],
            'ppdb_alur' => [
                'Lihat informasi PPDB',
                'Buat akun calon murid',
                'Login calon murid',
                'Isi formulir online',
                'Upload berkas',
                'Submit pendaftaran',
                'Verifikasi admin',
                'Pengumuman hasil',
            ],
            'ppdb_kontak' => [
                [
                    'nama' => 'Muharleny Br Damanik, S.Ag',
                    'telepon' => ['+62 813 9686 5480'],
                ],
                [
                    'nama' => 'Sri Wahyuni, S.Pd',
                    'telepon' => ['+62 813 7444 5100'],
                ],
                [
                    'nama' => 'Anggi Mira, S.Pd',
                    'telepon' => ['+62 813 9686 5480', '+62 813 7444 5100'],
                ],
            ],
            'ppdb_alamat' => 'Jl. Demak No. 3, Medan',
            'ppdb_brosur' => null,
        ];

        $settings = [];
        foreach ($keys as $key) {
            $val = SystemSetting::getValue($key);
            // Decode JSON if it's an array field
            if (in_array($key, [
                'ppdb_hero_highlights', 'ppdb_gelombang', 'ppdb_promo', 
                'ppdb_persyaratan', 'ppdb_fasilitas', 'ppdb_ekstrakurikuler', 
                'ppdb_alur', 'ppdb_kontak'
            ])) {
                $decoded = $val ? json_decode($val, true) : null;
                $settings[$key] = (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) ? $decoded : ($defaults[$key] ?? null);
            } else {
                $settings[$key] = $val ?: ($defaults[$key] ?? null);
            }
        }

        return ApiResponse::success($settings, 'Pengaturan PPDB berhasil diambil');
    }

    /**
     * Save PPDB settings
     */
    public function updateSettings(Request $request)
    {
        $data = $request->except('ppdb_brosur_file');

        $jsonKeys = [
            'ppdb_hero_highlights', 'ppdb_gelombang', 'ppdb_promo', 
            'ppdb_persyaratan', 'ppdb_fasilitas', 'ppdb_ekstrakurikuler', 
            'ppdb_alur', 'ppdb_kontak'
        ];

        foreach ($data as $key => $value) {
            if (in_array($key, $jsonKeys)) {
                $valToSave = is_array($value) ? json_encode($value) : (is_string($value) ? $value : json_encode([]));
                SystemSetting::setValue($key, $valToSave);
            } else {
                SystemSetting::setValue($key, $value);
            }
        }

        // Handle file upload
        if ($request->hasFile('ppdb_brosur_file')) {
            $file = $request->file('ppdb_brosur_file');
            $path = $file->store('ppdb/brosur', 'public');
            $url = Storage::disk('public')->url($path);
            SystemSetting::setValue('ppdb_brosur', $url);
        }

        return ApiResponse::success(null, 'Pengaturan PPDB berhasil disimpan');
    }
}
