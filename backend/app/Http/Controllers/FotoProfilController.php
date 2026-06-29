<?php

namespace App\Http\Controllers;

use App\Utils\ApiResponse;
use App\Utils\AuditsAdminActions;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FotoProfilController extends Controller
{
    use AuditsAdminActions;

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = auth()->user();
        $role = $user->role;
        $profile = $this->getProfile($user, $role);

        if (! $profile) {
            return response()->json(['success' => false, 'message' => 'Profil tidak ditemukan.'], 404);
        }

        if ($profile->foto) {
            $oldPath = str_replace('/storage/', '', $profile->foto);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('foto')->store('profil', 'public');
        $profile->foto = '/storage/'.$path;
        $profile->save();

        $this->auditAdmin('profile.foto.upload', null, ['foto_url' => $profile->foto]);

        return ApiResponse::success(
            ['foto_url' => $profile->foto],
            'Foto profil berhasil diperbarui.'
        );
    }

    public function delete(): JsonResponse
    {
        $user = auth()->user();
        $role = $user->role;
        $profile = $this->getProfile($user, $role);

        if (! $profile) {
            return response()->json(['success' => false, 'message' => 'Profil tidak ditemukan.'], 404);
        }

        if ($profile->foto) {
            $oldPath = str_replace('/storage/', '', $profile->foto);
            Storage::disk('public')->delete($oldPath);
            $profile->foto = null;
            $profile->save();
        }

        $this->auditAdmin('profile.foto.delete', null, []);

        return ApiResponse::success(null, 'Foto profil berhasil dihapus.');
    }

    private function getProfile($user, $role)
    {
        if ($role === 'guru') {
            return $user->guru;
        }
        if ($role === 'siswa') {
            return $user->siswa;
        }
        if ($role === 'kepsek') {
            return $user->kepalaSekolah;
        }
        if ($role === 'admin') {
            return $user->admin;
        }

        return null;
    }
}
