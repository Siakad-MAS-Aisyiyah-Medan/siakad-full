<?php

namespace App\Services;

use App\Utils\AuditsAdminActions;
use App\Http\Resources\BeritaResource;
use App\Models\Berita;
use App\Support\SearchInput;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BeritaService
{
    use AuditsAdminActions;
    public function list(?string $search = null, ?string $kategori = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Berita::query()->orderByDesc('tanggal_publikasi')->orderByDesc('id');

        if ($kategori && in_array($kategori, ['Berita', 'Prestasi'], true)) {
            $query->where('kategori', $kategori);
        }

        if ($term = SearchInput::escape($search)) {
            $query->where(function ($q) use ($term) {
                $q->where('judul', 'like', "%{$term}%")
                    ->orWhere('isi', 'like', "%{$term}%");
            });
        }

        $paginator = $query->paginate($perPage);
        $paginator->getCollection()->transform(
            fn ($item) => (new BeritaResource($item))->resolve()
        );

        return $paginator;
    }

    public function find(int $id): array
    {
        return (new BeritaResource(Berita::findOrFail($id)))->resolve();
    }

    public function create(array $data): array
    {
        $data['tanggal_publikasi'] = $data['tanggal_publikasi'] ?? now()->toDateString();
        $item = Berita::create($data);
        $this->auditAdmin('berita.create', $item, ['judul' => $item->judul]);

        return (new BeritaResource($item))->resolve();
    }

    public function update(int $id, array $data): array
    {
        $item = Berita::findOrFail($id);
        $item->update($data);
        $this->auditAdmin('berita.update', $item, ['judul' => $item->judul]);

        return (new BeritaResource($item->fresh()))->resolve();
    }

    public function delete(int $id): void
    {
        $item = Berita::findOrFail($id);
        $this->auditAdmin('berita.delete', $item, ['judul' => $item->judul]);
        $item->delete();
    }
}
