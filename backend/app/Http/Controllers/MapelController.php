<?php

namespace App\Http\Controllers;

use App\Http\Resources\MapelResource;
use App\Models\Mapel;
use App\Utils\ApiResponse;
use App\Utils\AuditsAdminActions;
use App\Utils\SearchInput;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class MapelController extends Controller
{
    public function index(Request $request)
    {
        $paginator = $this->list(
            $request->query('search'),
            (int) $request->query('per_page', 15)
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data mata pelajaran');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_mapel' => 'required|string|max:100',
            'id_guru' => 'required|exists:users,id_user',
            'tingkat' => 'required|in:X,XI,XII',
            'kelompok_mapel' => 'nullable|string|max:100',
            'id_kelas' => 'nullable|array',
            'id_kelas.*' => 'exists:kelas,id_kelas',
        ]);

        $mapel = $this->create($validated);

        return ApiResponse::success($mapel, 'Mata pelajaran berhasil ditambahkan', 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_mapel' => 'required|string|max:100',
            'id_guru' => 'required|exists:users,id_user',
            'tingkat' => 'required|in:X,XI,XII',
            'kelompok_mapel' => 'nullable|string|max:100',
            'id_kelas' => 'nullable|array',
            'id_kelas.*' => 'exists:kelas,id_kelas',
        ]);

        $mapel = $this->processUpdate((int) $id, $validated);

        return ApiResponse::success($mapel, 'Mata pelajaran berhasil diperbarui');
    }

    public function destroy($id)
    {
        $this->delete((int) $id);

        return ApiResponse::success(null, 'Mata pelajaran berhasil dihapus');
    }

    // --- Inlined from MapelService ---

    use AuditsAdminActions;

    private function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Mapel::with(['guru.guru', 'kelas']);
        $user = auth()->user();

        if ($user && $user->role === 'siswa') {
            $siswa = \App\Models\Siswa::where('id_user', $user->id_user)->first();
            if ($siswa && $siswa->id_kelas) {
                $query->whereHas('kelas', function ($q) use ($siswa) {
                    $q->where('kelas_mapel.id_kelas', $siswa->id_kelas);
                });
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        if ($term = SearchInput::escape($search)) {
            $query->where(function ($q) use ($term) {
                $q->where('nama_mapel', 'like', "%{$term}%")
                    ->orWhereHas('guru.guru', fn ($g) => $g->where('nama_guru', 'like', "%{$term}%"));
            });
        }

        $paginator = $query->orderBy('nama_mapel')->paginate($perPage);
        $paginator->getCollection()->transform(
            fn ($item) => (new MapelResource($item))->resolve()
        );

        return $paginator;
    }

    private function create(array $data): array
    {
        $idKelas = $data['id_kelas'] ?? [];
        unset($data['id_kelas']);
        
        $mapel = Mapel::create($data);
        $mapel->kelas()->sync($idKelas);
        
        $this->auditAdmin('mapel.create', $mapel, ['nama_mapel' => $mapel->nama_mapel]);

        return (new MapelResource($mapel->load(['guru.guru', 'kelas'])))->resolve();
    }

    private function processUpdate(int $id, array $data): array
    {
        $idKelas = $data['id_kelas'] ?? [];
        unset($data['id_kelas']);
        
        $mapel = Mapel::findOrFail($id);
        $mapel->update($data);
        $mapel->kelas()->sync($idKelas);
        
        $this->auditAdmin('mapel.update', $mapel, ['nama_mapel' => $mapel->nama_mapel]);

        return (new MapelResource($mapel->fresh(['guru.guru', 'kelas'])))->resolve();
    }

    private function delete(int $id): void
    {
        $mapel = Mapel::findOrFail($id);
        $this->auditAdmin('mapel.delete', $mapel, ['nama_mapel' => $mapel->nama_mapel]);
        $mapel->delete();
    }
}
