<?php

namespace App\Http\Controllers;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Utils\SearchInput;
use App\Http\Resources\BeritaResource;
use App\Utils\AuditsAdminActions;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Utils\ApiResponse;
use Illuminate\Http\Request;

class BeritaController extends Controller
{
    

    public function adminIndex(Request $request)
    {
        $paginator = $this->list(
            $request->query('search'),
            $request->query('kategori'),
            (int) $request->query('per_page', 15)
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data berita & prestasi');
    }

    public function adminShow($id)
    {
        return ApiResponse::success(
            $this->find((int) $id),
            'Berhasil mengambil detail artikel'
        );
    }

    public function adminStore(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'kategori' => 'required|in:Berita,Prestasi',
            'gambar' => 'nullable|string|max:500',
            'tanggal_publikasi' => 'nullable|date',
            'is_published' => 'sometimes|boolean',
        ]);

        $item = $this->create($validated);

        return ApiResponse::success($item, 'Artikel berhasil ditambahkan', 201);
    }

    public function adminUpdate(UpdateBeritaRequest $request, $id)
    {
        $item = $this->processUpdate((int) $id, $validated);

        return ApiResponse::success($item, 'Artikel berhasil diperbarui');
    }

    public function adminDestroy($id)
    {
        $this->delete((int) $id);

        return ApiResponse::success(null, 'Artikel berhasil dihapus');
    }

    /**
     * Mengambil daftar berita/prestasi yang sudah dipublikasi.
     * Tampilan untuk publik (tanpa login).
     */
    public function publicIndex()
    {
        // Ambil berita yang di-publish, urutkan dari yang terbaru
        $berita = Berita::where('is_published', true)
            ->orderByDesc('tanggal_publikasi')
            ->orderByDesc('id')
            ->get();

        return ApiResponse::success(
            $berita,
            'Berita berhasil diambil'
        );
    }

    /**
     * Mengambil detail satu berita.
     */
    public function publicShow($id)
    {
        $berita = Berita::where('is_published', true)->findOrFail($id);

        return ApiResponse::success(
            $berita,
            'Detail berita berhasil diambil'
        );
    }

    // --- Inlined from BeritaService ---

    use AuditsAdminActions;
    private function list(?string $search = null, ?string $kategori = null, int $perPage = 15): LengthAwarePaginator
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

    private function find(int $id): array
    {
        return (new BeritaResource(Berita::findOrFail($id)))->resolve();
    }

    private function create(array $data): array
    {
        $data['tanggal_publikasi'] = $data['tanggal_publikasi'] ?? now()->toDateString();
        $item = Berita::create($data);
        $this->auditAdmin('berita.create', $item, ['judul' => $item->judul]);

        return (new BeritaResource($item))->resolve();
    }

    private function processUpdate(int $id, array $data): array
    {
        $item = Berita::findOrFail($id);
        $item->update($data);
        $this->auditAdmin('berita.update', $item, ['judul' => $item->judul]);

        return (new BeritaResource($item->fresh()))->resolve();
    }

    private function delete(int $id): void
    {
        $item = Berita::findOrFail($id);
        $this->auditAdmin('berita.delete', $item, ['judul' => $item->judul]);
        $item->delete();
    }

}