<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\EnrollmentService;
use App\Utils\ApiResponse;
use App\Utils\AuditsAdminActions;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;

class MuridController extends Controller
{
    public function __construct(private EnrollmentService $enrollment) {}

    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer',
            'id_kelas' => 'nullable|integer',
        ]);

        $paginator = $this->listMurid(
            $validated['search'] ?? null,
            (int) ($validated['per_page'] ?? 15),
            $validated['id_kelas'] ?? null
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data murid');
    }

    public function stats()
    {
        $stats = $this->getStats();

        return ApiResponse::success($stats, 'Berhasil mengambil statistik murid');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:users,username',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|string|min:6',
            'nama_siswa' => 'required|string',
            'nisn' => 'nullable|string|min:10|unique:siswa,nisn',
            'nis' => 'nullable|string',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'tahun_masuk' => 'required|integer',
            'tahun_lulus' => 'nullable|integer',
            'id_kelas' => 'nullable|exists:kelas,id_kelas',
            'status_aktif' => 'nullable|boolean',
        ]);

        try {
            $user = $this->createMurid($validated);

            return ApiResponse::success($user, 'Murid berhasil ditambahkan', 201);
        } catch (\Exception $e) {
            return ApiResponse::error('Gagal menambahkan murid: '.$e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'username' => 'nullable|string',
                'email' => 'nullable|email',
                'password' => 'nullable|string|min:6',
                'role' => 'nullable|in:siswa,calon_siswa',
                'nama_siswa' => 'required|string',
                'nisn' => 'nullable|string|min:10|unique:siswa,nisn,'.$id.',id_user',
                'nis' => 'nullable|string',
                'jenis_kelamin' => 'required|in:L,P',
                'tempat_lahir' => 'nullable|string',
                'tanggal_lahir' => 'nullable|date',
                'alamat' => 'nullable|string',
                'no_hp' => 'nullable|string',
                'tahun_masuk' => 'nullable|integer',
                'tahun_lulus' => 'nullable|integer',
                'id_kelas' => 'nullable|exists:kelas,id_kelas',
                'status_aktif' => 'nullable|boolean',
            ]);
            $user = $this->updateMurid((int) $id, $validated);

            return ApiResponse::success($user, 'Status Murid diperbarui');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function enroll(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'id_kelas' => 'nullable|exists:kelas,id_kelas',
            ]);
            $result = $this->enrollMurid((int) $id, $validated['id_kelas'] ?? null);

            return ApiResponse::success($result, 'Calon siswa berhasil dipromosikan menjadi siswa');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function destroy($id)
    {
        try {
            $this->deleteMurid((int) $id);

            return ApiResponse::success(null, 'Data murid berhasil dihapus permanen');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    // --- Inlined from MuridService ---

    use AuditsAdminActions;

    private function listMurid(?string $search = null, int $perPage = 15, ?int $idKelas = null): LengthAwarePaginator
    {
        $query = User::query()
            ->with(['siswa.kelas', 'pendaftaran'])
            ->where('role', 'siswa');

        if ($idKelas) {
            $query->whereHas('siswa', fn ($s) => $s->where('id_kelas', $idKelas));
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('siswa', fn ($s) => $s
                        ->where('nama_siswa', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%"))
                    ->orWhereHas('siswa.kelas', fn ($k) => $k
                        ->where('nama_kelas', 'like', "%{$search}%"))
                    ->orWhereHas('pendaftaran', fn ($p) => $p->where('nama_lengkap', 'like', "%{$search}%"));
            });
        }

        return $query->orderByDesc('id_user')->paginate($perPage);
    }

    private function getStats(): array
    {
        return [
            'total_murid' => User::where('role', 'siswa')->count(),
            'siswa_aktif' => User::where('role', 'siswa')->count(),
            'calon_siswa' => User::where('role', 'calon_siswa')->count(),
            'alumni' => User::where('role', 'alumni')->count(),
        ];
    }

    private function createMurid(array $data): User
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
                'nisn' => $data['nisn'] ?? $data['username'],
                'nis' => $data['nis'] ?? $this->enrollment->generateUniqueNis(),
                'jenis_kelamin' => $data['jenis_kelamin'],
                'tempat_lahir' => $data['tempat_lahir'] ?? '-',
                'tgl_lahir' => $data['tanggal_lahir'] ?? now()->toDateString(),
                'agama' => $data['agama'] ?? 'Islam',
                'alamat' => $data['alamat'] ?? null,
                'nama_wali' => $data['nama_wali'] ?? '-',
                'no_hp_wali' => $data['no_hp_wali'] ?? ($data['no_hp'] ?? '-'),
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

    private function updateMurid(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        if (! in_array($user->role, ['siswa', 'calon_siswa'], true)) {
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
                        // Prevent wiping NOT NULL columns
                        if (($field === 'nis' || $field === 'nisn') && $data[$field] === null) {
                            continue;
                        }
                        $siswaData[$field === 'tanggal_lahir' ? 'tgl_lahir' : $field] = $data[$field];
                    }
                }

                if (! empty($siswaData)) {
                    $user->siswa->update($siswaData);
                }
            }
        });

        $fresh = $user->fresh(['siswa', 'pendaftaran']);
        $this->auditAdmin('murid.update', $fresh, ['username' => $fresh->username]);

        return $fresh;
    }

    private function deleteMurid(int $id): void
    {
        $user = User::findOrFail($id);
        if (! in_array($user->role, ['siswa', 'calon_siswa'], true)) {
            throw new InvalidArgumentException('User bukan murid/calon siswa.');
        }
        $this->auditAdmin('murid.delete', $user, ['username' => $user->username]);
        $user->delete();
    }

    private function enrollMurid(int $id, ?int $idKelas = null): array
    {
        return $this->enrollment->enrollCalonSiswa($id, $idKelas);
    }
}
