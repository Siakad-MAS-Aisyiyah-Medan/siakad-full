<?php

namespace App\Services;

use App\Utils\AuditsAdminActions;
use App\Models\Ekskul;
use App\Models\Guru;
use App\Models\JadwalPelajaran;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class GuruService
{
    use AuditsAdminActions;
    public function listGuru(?string $search = null, int $perPage = 15, ?string $role = null): LengthAwarePaginator
    {
        $roles = $role && in_array($role, ['guru', 'wali_kelas'], true)
            ? [$role]
            : ['guru', 'wali_kelas'];

        $query = User::with('guru')->whereIn('role', $roles);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('guru', fn ($g) => $g->where('nama_guru', 'like', "%{$search}%"));
            });
        }

        return $query->orderByDesc('id_user')->paginate($perPage);
    }

    public function createGuru(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => $data['password'],
                'status_aktif' => true,
            ]);
            $user->role = $data['role'];
            $user->save();

            $fotoPath = null;
            if (isset($data['foto']) && $data['foto'] instanceof \Illuminate\Http\UploadedFile) {
                $fotoPath = '/storage/' . $data['foto']->store('guru', 'public');
            }

            Guru::create([
                'id_user' => $user->id_user,
                'nip_nuptk' => $data['nip_nuptk'],
                'nama_guru' => $data['nama_guru'],
                'jenis_kelamin' => $data['jenis_kelamin'],
                'agama' => $data['agama'],
                'alamat' => $data['alamat'],
                'no_hp' => $data['no_hp'],
                'status' => $data['status'],
                'foto' => $fotoPath,
            ]);

            $created = User::with('guru')->findOrFail($user->id_user);
            $this->auditAdmin('guru.create', $created, ['username' => $created->username]);

            return $created;
        });
    }

    public function updateGuru(int $id, array $data): User
    {
        return DB::transaction(function () use ($id, $data) {
            $user = User::findOrFail($id);

            if (!in_array($user->role, ['guru', 'wali_kelas'], true)
                && !in_array($data['role'] ?? '', ['guru', 'wali_kelas'], true)) {
                throw new InvalidArgumentException('User bukan guru/wali kelas.');
            }

            if ($user->role === 'wali_kelas' && $data['role'] === 'guru') {
                $this->assertNotAssignedAsWaliKelas($id);
            }

            $user->fill([
                'username' => $data['username'],
                'email' => $data['email'],
                'status_aktif' => $data['status_aktif'] ?? $user->status_aktif,
            ]);
            $user->role = $data['role'];
            $user->save();

            if (!empty($data['password'])) {
                $user->update(['password' => $data['password']]);
            }

            $guru = Guru::where('id_user', $id)->first();
            $fotoPath = $guru ? $guru->foto : null;

            if (isset($data['foto']) && $data['foto'] instanceof \Illuminate\Http\UploadedFile) {
                if ($fotoPath) {
                    $oldPath = str_replace('/storage/', '', $fotoPath);
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                }
                $fotoPath = '/storage/' . $data['foto']->store('guru', 'public');
            }

            $profilePayload = [
                'nip_nuptk' => $data['nip_nuptk'],
                'nama_guru' => $data['nama_guru'],
                'jenis_kelamin' => $data['jenis_kelamin'],
                'agama' => $data['agama'],
                'alamat' => $data['alamat'],
                'no_hp' => $data['no_hp'],
                'status' => $data['status'],
                'foto' => $fotoPath,
            ];

            if ($guru) {
                $guru->update($profilePayload);
            } else {
                Guru::create(array_merge(['id_user' => $id], $profilePayload));
            }

            $updated = User::with('guru')->findOrFail($id);
            $this->auditAdmin('guru.update', $updated, ['username' => $updated->username]);

            return $updated;
        });
    }

    public function deleteGuru(int $id): void
    {
        DB::transaction(function () use ($id) {
            $user = User::findOrFail($id);

            if (!in_array($user->role, ['guru', 'wali_kelas'], true)) {
                throw new InvalidArgumentException('User bukan guru/wali kelas.');
            }

            $this->assertCanDeleteGuru($id);

            $this->auditAdmin('guru.delete', $user, ['username' => $user->username]);
            $user->delete();
        });
    }

    private function assertNotAssignedAsWaliKelas(int $userId): void
    {
        if (Kelas::where('id_wali_kelas', $userId)->exists()) {
            throw new InvalidArgumentException(
                'Guru masih ditugaskan sebagai wali kelas. Lepaskan penugasan di menu Kelas terlebih dahulu.'
            );
        }
    }

    private function assertCanDeleteGuru(int $userId): void
    {
        if (Kelas::where('id_wali_kelas', $userId)->exists()) {
            throw new InvalidArgumentException(
                'Guru tidak dapat dihapus karena masih menjadi wali kelas. Ubah wali kelas terlebih dahulu.'
            );
        }

        if (Mapel::where('id_guru', $userId)->exists()) {
            throw new InvalidArgumentException(
                'Guru tidak dapat dihapus karena masih menjadi pengampu mata pelajaran.'
            );
        }

        if (JadwalPelajaran::where('id_guru', $userId)->exists()) {
            throw new InvalidArgumentException(
                'Guru tidak dapat dihapus karena masih memiliki jadwal mengajar.'
            );
        }

        if (Ekskul::where('id_pembina', $userId)->exists()) {
            throw new InvalidArgumentException(
                'Guru tidak dapat dihapus karena masih menjadi pembina ekstrakurikuler.'
            );
        }
    }
}
