<?php

namespace App\Services;

use App\Utils\AuditsAdminActions;
use App\Models\User;
use App\Models\Siswa;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use InvalidArgumentException;

class MuridService
{
    use AuditsAdminActions;
    public function __construct(private EnrollmentService $enrollment)
    {
    }

    public function listMurid(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = User::query()
            ->with(['siswa.kelas', 'pendaftaran'])
            ->whereIn('role', ['siswa', 'calon_siswa']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('siswa', fn ($s) => $s->where('nama_siswa', 'like', "%{$search}%"))
                    ->orWhereHas('pendaftaran', fn ($p) => $p->where('nama_lengkap', 'like', "%{$search}%"));
            });
        }

        return $query->orderByDesc('id_user')->paginate($perPage);
    }

    public function getStats(): array
    {
        return [
            'total_murid' => User::whereIn('role', ['siswa', 'calon_siswa'])->count(),
            'siswa_aktif' => User::where('role', 'siswa')->count(),
            'calon_siswa' => User::where('role', 'calon_siswa')->count(),
            'alumni' => User::where('role', 'alumni')->count(),
        ];
    }

    public function createMurid(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['nama_siswa'],
                'username' => $data['username'],
                'email' => $data['email'] ?? null,
                'password' => Hash::make($data['password']),
                'role' => 'siswa',
                'status_aktif' => $data['status_aktif'] ?? true,
            ]);

            $user->siswa()->create([
                'nama_siswa' => $data['nama_siswa'],
                'nisn' => $data['nisn'] ?? null,
                'nis' => $data['nis'] ?? null,
                'jenis_kelamin' => $data['jenis_kelamin'],
                'tempat_lahir' => $data['tempat_lahir'] ?? null,
                'tanggal_lahir' => $data['tanggal_lahir'] ?? null,
                'alamat' => $data['alamat'] ?? null,
                'no_hp' => $data['no_hp'] ?? null,
                'tahun_masuk' => $data['tahun_masuk'],
                'tahun_lulus' => $data['tahun_lulus'] ?? null,
                'id_kelas' => $data['id_kelas'] ?? null,
            ]);

            $fresh = $user->fresh(['siswa']);
            $this->auditAdmin('murid.create', $fresh, ['username' => $fresh->username]);
            return $fresh;
        });
    }

    public function updateMurid(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        if (!in_array($user->role, ['siswa', 'calon_siswa'], true)) {
            throw new InvalidArgumentException('User bukan murid/calon siswa.');
        }

        if (array_key_exists('role', $data) && $data['role'] !== $user->role) {
            if ($data['role'] === 'siswa') {
                throw new InvalidArgumentException(
                    'Promosi ke siswa hanya melalui aksi Jadikan Siswa (enroll).'
                );
            }
            throw new InvalidArgumentException('Perubahan role tidak diizinkan melalui update.');
        }

        DB::transaction(function () use ($user, $data) {
            $user->update([
                'status_aktif' => $data['status_aktif'] ?? $user->status_aktif,
            ]);

            if ($user->siswa) {
                $siswaData = [];
                $fields = ['nama_siswa', 'nisn', 'nis', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'no_hp', 'tahun_masuk', 'tahun_lulus', 'id_kelas'];
                foreach ($fields as $field) {
                    if (array_key_exists($field, $data)) {
                        $siswaData[$field] = $data[$field];
                    }
                }
                
                if (!empty($siswaData)) {
                    $user->siswa->update($siswaData);
                }
            }
        });

        $fresh = $user->fresh(['siswa', 'pendaftaran']);
        $this->auditAdmin('murid.update', $fresh, ['username' => $fresh->username]);

        return $fresh;
    }

    public function deleteMurid(int $id): void
    {
        $user = User::findOrFail($id);
        if (!in_array($user->role, ['siswa', 'calon_siswa'], true)) {
            throw new InvalidArgumentException('User bukan murid/calon siswa.');
        }
        $this->auditAdmin('murid.delete', $user, ['username' => $user->username]);
        $user->delete();
    }

    public function enrollMurid(int $id, ?int $idKelas = null): array
    {
        return $this->enrollment->enrollCalonSiswa($id, $idKelas);
    }
}
