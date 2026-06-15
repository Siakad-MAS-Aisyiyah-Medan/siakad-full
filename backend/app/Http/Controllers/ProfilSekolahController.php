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
                'nama_sekolah' => 'Sistem Informasi Akademik',
                'hero_subtitle' => 'Sistem Informasi Akademik Terpadu',
                'tentang_kami' => 'Sistem informasi akademik berbasis web.',
                'alamat' => '-',
                'kata_sambutan' => 'Selamat datang di Sistem Informasi Akademik.',
                'nama_kepsek' => '-',
                'visi' => '-',
                'misi' => '-'
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
            'hero_subtitle' => 'nullable|string|max:255',
            'tentang_kami' => 'nullable|string',
            'alamat' => 'nullable|string',
            'kata_sambutan' => 'nullable|string',
            'nama_kepsek' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:25',
            'foto_kepsek' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi Gagal', 422, $validator->errors());
        }

        $profil = ProfilSekolah::first();
        if (!$profil) {
            $profil = new ProfilSekolah();
        }

        $data = $request->except('foto_kepsek');

        if ($request->hasFile('foto_kepsek')) {
            if ($profil->foto_kepsek) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($profil->foto_kepsek);
            }
            $data['foto_kepsek'] = $request->file('foto_kepsek')->store('profil_sekolah', 'public');
        }

        $profil->fill($data);
        $profil->save();

        return ApiResponse::success($profil, 'Profil Sekolah berhasil diperbarui');
    }
}
