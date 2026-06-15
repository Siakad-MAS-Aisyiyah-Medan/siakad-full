<?php

namespace App\Http\Controllers;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Utils\SearchInput;
use App\Http\Resources\EkskulResource;
use App\Utils\AuditsAdminActions;

use App\Http\Controllers\Controller;
use App\Models\Ekskul;
use App\Utils\ApiResponse;
use Illuminate\Http\Request;

class EkskulController extends Controller
{
    

    public function adminIndex(Request $request)
    {
        $paginator = $this->list(
            $request->query('search'),
            (int) $request->query('per_page', 15)
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data ekstrakurikuler');
    }

    public function adminShow($id)
    {
        return ApiResponse::success(
            $this->find((int) $id),
            'Berhasil mengambil detail ekstrakurikuler'
        );
    }

    public function adminStore(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'nama_ekskul' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'id_pembina' => 'nullable|exists:users,id_user',
            'hari' => 'nullable|string|max:20',
            'jam' => 'nullable|string|max:50',
            'lokasi' => 'nullable|string|max:100',
        ]);

        $item = $this->create($validated);

        return ApiResponse::success($item, 'Ekstrakurikuler berhasil ditambahkan', 201);
    }

    public function adminUpdate(UpdateEkskulRequest $request, $id)
    {
        $item = $this->processUpdate((int) $id, $validated);

        return ApiResponse::success($item, 'Ekstrakurikuler berhasil diperbarui');
    }

    public function adminDestroy($id)
    {
        $this->delete((int) $id);

        return ApiResponse::success(null, 'Ekstrakurikuler berhasil dihapus');
    }

    /**
     * Mengambil daftar ekstrakurikuler untuk publik.
     */
    public function publicIndex()
    {
        $ekskul = Ekskul::orderBy('nama_ekskul', 'asc')->get();

        return ApiResponse::success(
            $ekskul,
            'Data ekstrakurikuler berhasil diambil'
        );
    }

    // --- Inlined from EkskulService ---

    use AuditsAdminActions;
    private function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
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

    private function find(int $id): array
    {
        return (new EkskulResource(Ekskul::with('pembina.guru')->findOrFail($id)))->resolve();
    }

    private function create(array $data): array
    {
        $item = Ekskul::create($data);
        $this->auditAdmin('ekskul.create', $item, ['nama_ekskul' => $item->nama_ekskul]);

        return (new EkskulResource($item->load('pembina.guru')))->resolve();
    }

    private function processUpdate(int $id, array $data): array
    {
        $item = Ekskul::findOrFail($id);
        $item->update($data);
        $this->auditAdmin('ekskul.update', $item, ['nama_ekskul' => $item->nama_ekskul]);

        return (new EkskulResource($item->fresh(['pembina.guru'])))->resolve();
    }

    private function delete(int $id): void
    {
        $item = Ekskul::findOrFail($id);
        $this->auditAdmin('ekskul.delete', $item, ['nama_ekskul' => $item->nama_ekskul]);
        $item->delete();
    }

}