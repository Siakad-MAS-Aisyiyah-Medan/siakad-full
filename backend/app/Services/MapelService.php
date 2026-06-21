<?php

namespace App\Services;

use App\Http\Resources\MapelResource;
use App\Models\Mapel;
use App\Support\SearchInput;
use App\Utils\AuditsAdminActions;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MapelService
{
    use AuditsAdminActions;

    public function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
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

    public function create(array $data): array
    {
        $mapel = Mapel::create($data);
        $this->auditAdmin('mapel.create', $mapel, ['nama_mapel' => $mapel->nama_mapel]);

        return (new MapelResource($mapel->load('guru.guru')))->resolve();
    }

    public function update(int $id, array $data): array
    {
        $mapel = Mapel::findOrFail($id);
        $mapel->update($data);
        $this->auditAdmin('mapel.update', $mapel, ['nama_mapel' => $mapel->nama_mapel]);

        return (new MapelResource($mapel->fresh(['guru.guru'])))->resolve();
    }

    public function delete(int $id): void
    {
        $mapel = Mapel::findOrFail($id);
        $this->auditAdmin('mapel.delete', $mapel, ['nama_mapel' => $mapel->nama_mapel]);
        $mapel->delete();
    }
}
