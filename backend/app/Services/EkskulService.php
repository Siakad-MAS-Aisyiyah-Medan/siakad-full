<?php

namespace App\Services;

use App\Utils\AuditsAdminActions;
use App\Http\Resources\EkskulResource;
use App\Models\Ekskul;
use App\Support\SearchInput;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EkskulService
{
    use AuditsAdminActions;
    public function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Ekskul::with(['pembina.guru'])->orderBy('nama_ekskul');

        if ($term = SearchInput::escape($search)) {
            $query->where(function ($q) use ($term) {
                $q->where('nama_ekskul', 'like', "%{$term}%")
                    ->orWhere('lokasi', 'like', "%{$term}%")
                    ->orWhereHas('pembina.guru', fn ($g) => $g->where('nama_guru', 'like', "%{$term}%"));
            });
        }

        $paginator = $query->paginate($perPage);
        $paginator->getCollection()->transform(
            fn ($item) => (new EkskulResource($item))->resolve()
        );

        return $paginator;
    }

    public function find(int $id): array
    {
        return (new EkskulResource(Ekskul::with('pembina.guru')->findOrFail($id)))->resolve();
    }

    public function create(array $data): array
    {
        $item = Ekskul::create($data);
        $this->auditAdmin('ekskul.create', $item, ['nama_ekskul' => $item->nama_ekskul]);

        return (new EkskulResource($item->load('pembina.guru')))->resolve();
    }

    public function update(int $id, array $data): array
    {
        $item = Ekskul::findOrFail($id);
        $item->update($data);
        $this->auditAdmin('ekskul.update', $item, ['nama_ekskul' => $item->nama_ekskul]);

        return (new EkskulResource($item->fresh(['pembina.guru'])))->resolve();
    }

    public function delete(int $id): void
    {
        $item = Ekskul::findOrFail($id);
        $this->auditAdmin('ekskul.delete', $item, ['nama_ekskul' => $item->nama_ekskul]);
        $item->delete();
    }
}
