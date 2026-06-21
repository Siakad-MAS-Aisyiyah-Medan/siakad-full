<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BiodataController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $user = auth()->user();
        $role = $user->role;

        if ($role === 'guru') {
            $validated = $request->validate([
                'nip_nuptk' => 'nullable|string|max:50',
                'nama_guru' => 'required|string|max:255',
                'jenis_kelamin' => 'nullable|string|in:L,P',
                'tgl_lahir' => 'nullable|date',
                'agama' => 'nullable|string|max:50',
                'alamat' => 'nullable|string',
                'no_hp' => 'nullable|string|max:20',
            ]);
            $profile = $user->guru;
            if (!$profile) {
                $profile = new \App\Models\Guru(['id_user' => $user->id_user]);
            }
            $profile->fill($validated);
            $profile->save();
        } elseif ($role === 'siswa') {
            $validated = $request->validate([
                'nisn' => 'nullable|string|max:20',
                'nis' => 'nullable|string|max:20',
                'nama_siswa' => 'required|string|max:255',
                'tempat_lahir' => 'nullable|string|max:100',
                'tgl_lahir' => 'nullable|date',
                'jenis_kelamin' => 'nullable|string|in:L,P',
                'agama' => 'nullable|string|max:50',
                'alamat' => 'nullable|string',
                'nama_wali' => 'nullable|string|max:255',
                'no_hp_wali' => 'nullable|string|max:20',
            ]);
            $profile = $user->siswa;
            if (!$profile) {
                $profile = new \App\Models\Siswa(['id_user' => $user->id_user]);
            }
            $profile->fill($validated);
            $profile->save();
        } elseif ($role === 'kepsek') {
            $validated = $request->validate([
                'nip' => 'nullable|string|max:50',
                'nama_lengkap' => 'required|string|max:255',
                'jenis_kelamin' => 'nullable|string|in:L,P',
                'tgl_lahir' => 'nullable|date',
                'no_hp' => 'nullable|string|max:20',
                'alamat' => 'nullable|string',
            ]);
            $validated['nama_kepsek'] = $validated['nama_lengkap'];
            unset($validated['nama_lengkap']);
            $profile = $user->kepalaSekolah;
            if (!$profile) {
                $profile = new \App\Models\KepalaSekolah(['id_user' => $user->id_user]);
            }
            $profile->fill($validated);
            $profile->save();
        } elseif ($role === 'admin') {
            $validated = $request->validate([
                'nip' => 'nullable|string|max:50',
                'nama_lengkap' => 'required|string|max:255',
                'no_hp' => 'nullable|string|max:20',
            ]);
            $validated['nama_admin'] = $validated['nama_lengkap'];
            unset($validated['nama_lengkap']);
            $profile = $user->admin;
            if (!$profile) {
                $profile = new \App\Models\Admin(['id_user' => $user->id_user]);
            }
            $profile->fill($validated);
            $profile->save();
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Role tidak memiliki biodata.'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Biodata berhasil diperbarui.',
            'data' => $profile
        ]);
    }
}
