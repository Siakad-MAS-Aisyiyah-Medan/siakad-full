<?php

namespace App\Http\Controllers;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Utils\SearchInput;
use App\Models\Siswa;
use App\Models\JadwalPelajaran;
use App\Http\Resources\JadwalResource;
use App\Utils\AuditsAdminActions;

use App\Http\Controllers\Controller;
use App\Exceptions\JadwalConflictException;
use App\Utils\ApiResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class JadwalController extends Controller
{
    

    public function adminMatrix(Request $request, $id_kelas)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'semester' => 'required|in:Ganjil,Genap',
        ]);

        $waktuList = \App\Models\WaktuPelajaran::orderBy('jam_mulai')->get();
        $jadwalList = \App\Models\JadwalPelajaran::with(['mapel', 'guru.guru'])
            ->where('id_kelas', $id_kelas)
            ->where('tahun_ajaran', $request->query('tahun_ajaran'))
            ->where('semester', $request->query('semester'))
            ->get();

        $matrix = [];
        $hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

        foreach ($waktuList as $waktu) {
            $row = [
                'waktu' => $waktu,
                'jadwal' => []
            ];
            foreach ($hariList as $hari) {
                $j = $jadwalList->first(fn($item) => $item->hari === $hari && $item->id_waktu === $waktu->id_waktu);
                $row['jadwal'][$hari] = $j ? (new \App\Http\Resources\JadwalResource($j))->resolve() : null;
            }
            $matrix[] = $row;
        }

        return ApiResponse::success([
            'waktu' => $waktuList,
            'matrix' => $matrix
        ], 'Berhasil mengambil matrix jadwal');
    }

    public function adminStoreMatrix(Request $request, $id_kelas)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'semester' => 'required|in:Ganjil,Genap',
            'jadwal' => 'array',
            'jadwal.*.hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'jadwal.*.id_waktu' => 'required|exists:waktu_pelajaran,id_waktu',
            'jadwal.*.id_mapel' => 'required|exists:mata_pelajaran,id_mapel',
            'jadwal.*.id_guru' => 'required|exists:users,id_user',
            'jadwal.*.ruangan' => 'nullable|string'
        ]);

        \Illuminate\Support\Facades\DB::beginTransaction();
        try {
            \App\Models\JadwalPelajaran::where('id_kelas', $id_kelas)
                ->where('tahun_ajaran', $request->tahun_ajaran)
                ->where('semester', $request->semester)
                ->delete();

            foreach ($request->jadwal ?? [] as $j) {
                $data = array_merge($j, [
                    'id_kelas' => $id_kelas,
                    'tahun_ajaran' => $request->tahun_ajaran,
                    'semester' => $request->semester
                ]);
                $this->create($data);
            }
            
            \Illuminate\Support\Facades\DB::commit();
            return ApiResponse::success(null, 'Jadwal matrix berhasil disimpan');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            if ($e instanceof JadwalConflictException) {
                return $this->conflictResponse($e);
            }
            throw $e;
        }
    }

    public function adminIndex(Request $request)
    {
        $paginator = $this->list(
            $request->query('search'),
            (int) $request->query('per_page', 15)
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data jadwal');
    }

    public function adminStore(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'id_kelas' => 'required|exists:kelas,id_kelas',
            'id_mapel' => 'required|exists:mata_pelajaran,id_mapel',
            'id_guru' => ['required', 'integer', 'exists:users,id_user', new GuruPengampuUser()],
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'id_waktu' => 'required|exists:waktu_pelajaran,id_waktu',
            'ruangan' => 'nullable|string|max:50',
            'tahun_ajaran' => 'required|string|max:20',
            'semester' => 'required|in:Ganjil,Genap',
        ]);

        try {
            $jadwal = $this->create($validated);

            return ApiResponse::success($jadwal, 'Jadwal berhasil ditambahkan', 201);
        } catch (JadwalConflictException $e) {
            return $this->conflictResponse($e);
        } catch (\Throwable $e) {
            report($e);

            return ApiResponse::error('Gagal menyimpan jadwal', 500);
        }
    }

    public function adminUpdate(UpdateJadwalRequest $request, $id)
    {
        try {
            $jadwal = $this->processUpdate((int) $id, $validated);

            return ApiResponse::success($jadwal, 'Jadwal berhasil diperbarui');
        } catch (JadwalConflictException $e) {
            return $this->conflictResponse($e);
        } catch (\Throwable $e) {
            report($e);

            return ApiResponse::error('Gagal memperbarui jadwal', 500);
        }
    }

    public function adminDestroy($id)
    {
        try {
            $this->delete((int) $id);

            return ApiResponse::success(null, 'Jadwal berhasil dihapus');
        } catch (\Throwable $e) {
            report($e);

            return ApiResponse::error('Gagal menghapus jadwal', 500);
        }
    }

    private function adminConflictResponse(JadwalConflictException $e)
    {
        return ApiResponse::error($e->getMessage(), 422, [
            'conflict_type' => $e->conflictType,
        ]);
    }

    public function guruIndex(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'guru') {
            return ApiResponse::error('Akses jadwal mengajar hanya untuk guru.', 403);
        }

        $items = $this->listForGuru(
            (int) $user->id_user,
            $request->query('tahun_ajaran'),
            $request->query('semester')
        );

        return ApiResponse::success($items, 'Berhasil mengambil jadwal mengajar');
    }

    public function siswaIndex(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'siswa') {
            return ApiResponse::error('Akses jadwal pelajaran hanya untuk siswa.', 403);
        }

        try {
            $items = $this->listForSiswa(
                (int) $user->id_user,
                $request->query('tahun_ajaran'),
                $request->query('semester')
            );

            return ApiResponse::success($items, 'Berhasil mengambil jadwal pelajaran');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    // --- Inlined from JadwalService ---

    use AuditsAdminActions;
    

    private function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = JadwalPelajaran::with(['kelas', 'mapel', 'guru.guru', 'waktu']);

        if ($term = SearchInput::escape($search)) {
            $query->where(function ($q) use ($term) {
                $q->where('hari', 'like', "%{$term}%")
                    ->orWhere('ruangan', 'like', "%{$term}%")
                    ->orWhereHas('kelas', fn ($k) => $k->where('nama_kelas', 'like', "%{$term}%"))
                    ->orWhereHas('mapel', fn ($m) => $m->where('nama_mapel', 'like', "%{$term}%"));
            });
        }

        $query->join('waktu_pelajaran', 'jadwal_pelajaran.id_waktu', '=', 'waktu_pelajaran.id_waktu')
            ->select('jadwal_pelajaran.*')
            ->orderBy('hari')
            ->orderBy('waktu_pelajaran.jam_mulai');
        $paginator = $query->paginate($perPage);
        $paginator->getCollection()->transform(
            fn ($item) => (new JadwalResource($item))->resolve()
        );

        return $paginator;
    }

    private function listForGuru(int $userId, ?string $tahunAjaran = null, ?string $semester = null): Collection
    {
        $query = JadwalPelajaran::with(['kelas', 'mapel', 'guru.guru', 'waktu'])
            ->where('id_guru', $userId);

        if ($tahunAjaran) {
            $query->where('tahun_ajaran', $tahunAjaran);
        }
        if ($semester) {
            $query->where('semester', $semester);
        }

        return $query->join('waktu_pelajaran', 'jadwal_pelajaran.id_waktu', '=', 'waktu_pelajaran.id_waktu')
            ->select('jadwal_pelajaran.*')
            ->orderBy('hari')
            ->orderBy('waktu_pelajaran.jam_mulai')
            ->get()->map(
            fn ($item) => (new JadwalResource($item))->resolve()
        );
    }

    private function listForSiswa(int $userId, ?string $tahunAjaran = null, ?string $semester = null): Collection
    {
        $siswa = Siswa::where('id_user', $userId)->first();

        if (!$siswa?->id_kelas) {
            throw new InvalidArgumentException('Anda belum terdaftar di kelas. Hubungi admin sekolah.');
        }

        $query = JadwalPelajaran::with(['kelas', 'mapel', 'guru.guru', 'waktu'])
            ->where('id_kelas', $siswa->id_kelas);

        if ($tahunAjaran) {
            $query->where('tahun_ajaran', $tahunAjaran);
        }
        if ($semester) {
            $query->where('semester', $semester);
        }

        return $query->join('waktu_pelajaran', 'jadwal_pelajaran.id_waktu', '=', 'waktu_pelajaran.id_waktu')
            ->select('jadwal_pelajaran.*')
            ->orderBy('hari')
            ->orderBy('waktu_pelajaran.jam_mulai')
            ->get()->map(
            fn ($item) => (new JadwalResource($item))->resolve()
        );
    }

    private function create(array $data): array
    {
        $data = $this->normalizePayload($data);
        $this->conflicts->assertNoConflict($data);
        $jadwal = JadwalPelajaran::create($data);
        $this->auditAdmin('jadwal.create', $jadwal, ['id_jadwal' => $jadwal->id_jadwal]);

        return (new JadwalResource($jadwal->load(['kelas', 'mapel', 'guru.guru', 'waktu'])))->resolve();
    }

    private function processUpdate(int $id, array $data): array
    {
        $data = $this->normalizePayload($data);
        $this->conflicts->assertNoConflict($data, $id);
        $jadwal = JadwalPelajaran::findOrFail($id);
        $jadwal->update($data);
        $this->auditAdmin('jadwal.update', $jadwal, ['id_jadwal' => $jadwal->id_jadwal]);

        return (new JadwalResource($jadwal->fresh(['kelas', 'mapel', 'guru.guru', 'waktu'])))->resolve();
    }

    private function delete(int $id): void
    {
        $jadwal = JadwalPelajaran::findOrFail($id);
        $this->auditAdmin('jadwal.delete', $jadwal, ['id_jadwal' => $jadwal->id_jadwal]);
        $jadwal->delete();
    }

    private function normalizePayload(array $data): array
    {
        if (array_key_exists('ruangan', $data)) {
            $data['ruangan'] = $data['ruangan'] !== null && trim((string) $data['ruangan']) !== ''
                ? trim((string) $data['ruangan'])
                : null;
        }

        return $data;
    }

}
