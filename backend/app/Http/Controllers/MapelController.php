<?php

namespace App\Http\Controllers;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Utils\SearchInput;
use App\Models\Mapel;
use App\Http\Resources\MapelResource;
use App\Utils\AuditsAdminActions;

use App\Http\Controllers\Controller;
use App\Utils\ApiResponse;
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

    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'nama_mapel' => 'required|string|max:100',
            'id_guru' => 'required|exists:users,id_user',
            'tingkat' => 'required|in:X,XI,XII',
            'kelompok_mapel' => 'nullable|string|max:100',
        ]);

        $mapel = $this->create($validated);

        return ApiResponse::success($mapel, 'Mata pelajaran berhasil ditambahkan', 201);
    }

    public function update(UpdateMapelRequest $request, $id)
    {
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
        $query = Mapel::with(['guru.guru']);

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
        $mapel = Mapel::create($data);
        $this->auditAdmin('mapel.create', $mapel, ['nama_mapel' => $mapel->nama_mapel]);

        return (new MapelResource($mapel->load('guru.guru')))->resolve();
    }

    private function processUpdate(int $id, array $data): array
    {
        $mapel = Mapel::findOrFail($id);
        $mapel->update($data);
        $this->auditAdmin('mapel.update', $mapel, ['nama_mapel' => $mapel->nama_mapel]);

        return (new MapelResource($mapel->fresh(['guru.guru'])))->resolve();
    }

    private function delete(int $id): void
    {
        $mapel = Mapel::findOrFail($id);
        $this->auditAdmin('mapel.delete', $mapel, ['nama_mapel' => $mapel->nama_mapel]);
        $mapel->delete();
    }

}