<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\JadwalPelajaran;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\User;
use App\Utils\ApiResponse;
use App\Utils\AuditsAdminActions;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class GuruController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer',
            'role' => 'nullable|in:guru',
        ]);

        $paginator = $this->listGuru(
            $validated['search'] ?? null,
            (int) ($validated['per_page'] ?? 15),
            $validated['role'] ?? null
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data guru');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'nama_guru' => 'required|string|max:255',
            'nip' => 'required|string|min:10|max:50|unique:guru,nip',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|string|max:50',
            'alamat' => 'required|string',
            'no_hp' => 'required|string|max:20',
            'role' => 'required|in:guru',
            'status' => 'required|in:aktif,nonaktif',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            $guru = $this->createGuru($validated);

            return ApiResponse::success($guru, 'Data Guru berhasil ditambahkan', 201);
        } catch (\Throwable $e) {
            report($e);

            return ApiResponse::error('Gagal menyimpan data guru', 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'username' => 'required|unique:users,username,'.$id.',id_user',
            'email' => 'required|email|unique:users,email,'.$id.',id_user',
            'password' => 'nullable|min:8',
            'nama_guru' => 'required|string|max:255',
            'nip' => 'required|string|min:10|max:50|unique:guru,nip,'.$id.',id_user',
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|string|max:50',
            'alamat' => 'required|string',
            'no_hp' => 'required|string|max:20',
            'role' => 'required|in:guru',
            'status' => 'required|in:aktif,nonaktif',
            'status_aktif' => 'nullable|boolean',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            $guru = $this->updateGuru((int) $id, $validated);

            return ApiResponse::success($guru, 'Data Guru berhasil diperbarui');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        } catch (\Throwable $e) {
            report($e);

            return ApiResponse::error('Gagal memperbarui data guru', 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->deleteGuru((int) $id);

            return ApiResponse::success(null, 'Data Guru berhasil dihapus');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        } catch (\Throwable $e) {
            report($e);

            return ApiResponse::error('Gagal menghapus data guru', 500);
        }
    }

    // --- Inlined from GuruService ---

    use AuditsAdminActions;

    private function listGuru(?string $search = null, int $perPage = 15, ?string $role = null): LengthAwarePaginator
    {
        $query = User::with('guru')->where('role', 'guru');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('guru', fn ($g) => $g->where('nama_guru', 'like', "%{$search}%"));
            });
        }

        return $query->orderByDesc('id_user')->paginate($perPage);
    }

    private function createGuru(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['nama_guru'],
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => $data['role'],
                'status_aktif' => true,
                'status_akun' => $data['status'],
            ]);

            $fotoPath = null;
            if (isset($data['foto']) && $data['foto'] instanceof UploadedFile) {
                $fotoPath = '/storage/'.$data['foto']->store('guru', 'public');
            }

            Guru::create([
                'id_user' => $user->id_user,
                'nip' => $data['nip'],
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

    private function updateGuru(int $id, array $data): User
    {
        return DB::transaction(function () use ($id, $data) {
            $user = User::findOrFail($id);

            if ($user->role !== 'guru' && ($data['role'] ?? '') !== 'guru') {
                throw new InvalidArgumentException('User bukan guru.');
            }

            $user->fill([
                'name' => $data['nama_guru'],
                'username' => $data['username'],
                'email' => $data['email'],
                'status_aktif' => $data['status_aktif'] ?? $user->status_aktif,
            ]);
            $user->role = $data['role'];
            $user->save();

            if (! empty($data['password'])) {
                $user->update(['password' => $data['password']]);
            }

            $guru = Guru::where('id_user', $id)->first();
            $fotoPath = $guru ? $guru->foto : null;

            if (isset($data['foto']) && $data['foto'] instanceof UploadedFile) {
                if ($fotoPath) {
                    $oldPath = str_replace('/storage/', '', $fotoPath);
                    Storage::disk('public')->delete($oldPath);
                }
                $fotoPath = '/storage/'.$data['foto']->store('guru', 'public');
            }

            $profilePayload = [
                'nip' => $data['nip'],
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

    private function deleteGuru(int $id): void
    {
        DB::transaction(function () use ($id) {
            $user = User::findOrFail($id);

            if ($user->role !== 'guru') {
                throw new InvalidArgumentException('User bukan guru.');
            }

            $this->assertCanDeleteGuru($id);

            // Menonaktifkan akun user
            $user->update(['status_aktif' => false]);

            // Menonaktifkan profil guru
            Guru::where('id_user', $id)->update(['status' => 'nonaktif']);

            $this->auditAdmin('guru.deactivate', $user, ['username' => $user->username]);
        });
    }

    private function assertCanDeleteGuru(int $userId): void
    {
        if (Kelas::where('id_wali_kelas', $userId)->exists()) {
            throw new InvalidArgumentException(
                'Guru tidak dapat dinonaktifkan karena masih menjadi wali kelas. Ubah wali kelas terlebih dahulu.'
            );
        }

        if (Mapel::where('id_guru', $userId)->exists()) {
            throw new InvalidArgumentException(
                'Guru tidak dapat dinonaktifkan karena masih menjadi pengampu mata pelajaran.'
            );
        }

        if (JadwalPelajaran::where('id_guru', $userId)->exists()) {
            throw new InvalidArgumentException(
                'Guru tidak dapat dinonaktifkan karena masih memiliki jadwal mengajar.'
            );
        }

    }
}
