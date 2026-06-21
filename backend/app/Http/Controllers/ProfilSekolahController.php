<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProfilSekolah;
use App\Utils\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfilSekolahController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show()
    {
        $profil = ProfilSekolah::first();
        
        if (!$profil) {
            // Jika belum ada, buat record kosong dengan default
            $profil = ProfilSekolah::create([
                'nama_sekolah' => 'MAS Aisyiyah Medan',
                'hero_subtitle' => 'Pendidikan Berkualitas Berlandaskan Nilai Islami',
                'tentang_kami' => 'MAS Aisyiyah Medan adalah sekolah berprestasi yang berfokus pada pendidikan akhlak dan ilmu pengetahuan.',
                'alamat' => 'Jl. Demak No. 3, Medan',
                'kata_sambutan' => 'Selamat datang di MAS Aisyiyah Medan.',
                'nama_kepsek' => 'Kepala Sekolah MAS Aisyiyah',
                'visi' => 'Menjadi institusi pendidikan Islam terkemuka',
                'misi' => 'Menyelenggarakan pendidikan yang memadukan IPTEK dan IMTAQ'
            ]);
        }

        return ApiResponse::success($profil, 'Profil Sekolah berhasil diambil');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_sekolah' => 'nullable|string|max:255',
            'npsn' => 'nullable|string|max:20',
            'akreditasi' => 'nullable|string|max:10',
            'hero_subtitle' => 'nullable|string|max:255',
            'hero_image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'tentang_kami' => 'nullable|string',
            'alamat' => 'nullable|string',
            'kata_sambutan' => 'nullable|string',
            'nama_kepsek' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:25',
            'email' => 'nullable|email|max:255',
            'foto_kepsek' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'instagram' => 'nullable|string',
            'facebook' => 'nullable|string',
            'youtube' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi Gagal', 422, $validator->errors());
        }

        $profil = ProfilSekolah::first();
        if (!$profil) {
            $profil = new ProfilSekolah();
        }

        $data = $request->except(['foto_kepsek', 'hero_image']);

        if ($request->hasFile('foto_kepsek')) {
            if ($profil->foto_kepsek) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($profil->foto_kepsek);
            }
            $data['foto_kepsek'] = $request->file('foto_kepsek')->store('profil_sekolah', 'public');
        }

        if ($request->hasFile('hero_image')) {
            if ($profil->hero_image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($profil->hero_image);
            }
            $data['hero_image'] = $request->file('hero_image')->store('profil_sekolah', 'public');
        }

        $profil->fill($data);
        $profil->save();

        return ApiResponse::success($profil, 'Profil Sekolah berhasil diperbarui');
    }
}
