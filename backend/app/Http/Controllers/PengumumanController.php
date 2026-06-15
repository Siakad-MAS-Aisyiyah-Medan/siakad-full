<?php

namespace App\Http\Controllers;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Utils\SearchInput;
use App\Utils\AuditsAdminActions;

use App\Http\Controllers\Controller;
use App\Http\Resources\PengumumanResource;
use App\Models\Pengumuman;
use App\Utils\ApiResponse;
use Illuminate\Http\Request;

class PengumumanController extends Controller
{
    

    public function adminIndex(Request $request)
    {
        $paginator = $this->list(
            $request->query('search'),
            (int) $request->query('per_page', 15)
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data pengumuman');
    }

    public function adminShow($id)
    {
        return ApiResponse::success(
            $this->find((int) $id),
            'Berhasil mengambil detail pengumuman'
        );
    }

    public function adminStore(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'tanggal_publikasi' => 'nullable|date',
            'akses' => 'required|in:umum,internal',
            'kategori' => 'nullable|string|max:100',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $item = $this->create($validated);

        return ApiResponse::success($item, 'Pengumuman berhasil ditambahkan', 201);
    }

    public function adminUpdate(UpdatePengumumanRequest $request, $id)
    {
        $item = $this->processUpdate((int) $id, $validated);

        return ApiResponse::success($item, 'Pengumuman berhasil diperbarui');
    }

    public function adminDestroy($id)
    {
        $this->delete((int) $id);

        return ApiResponse::success(null, 'Pengumuman berhasil dihapus');
    }

    /**
     * Mengambil daftar pengumuman yang sudah dipublikasi.
     * Tampilan untuk publik (tanpa login).
     */
    public function publicIndex()
    {
        // Ambil pengumuman yang di-publish, urutkan dari yang terbaru
        $pengumuman = Pengumuman::where('is_published', true)
            ->orderByDesc('tanggal_publikasi')
            ->orderByDesc('id')
            ->paginate(12);

        return ApiResponse::paginated(
            $pengumuman,
            'Berita dan pengumuman berhasil diambil',
            fn ($item) => (new PengumumanResource($item))->resolve()
        );
    }

    /**
     * Mengambil detail satu pengumuman.
     */
    public function publicShow($id)
    {
        // Pastikan hanya pengumuman yang di-publish yang bisa dilihat publik
        $pengumuman = Pengumuman::where('is_published', true)->findOrFail($id);

        return ApiResponse::success(
            (new PengumumanResource($pengumuman))->resolve(),
            'Detail berita berhasil diambil'
        );
    }

    // --- Inlined from PengumumanService ---

    use AuditsAdminActions;
    private function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = Pengumuman::query()->with('penulis')->orderByDesc('tanggal_publikasi')->orderByDesc('id');

        if ($term = SearchInput::escape($search)) {
            $query->where(function ($q) use ($term) {
                $q->where('judul', 'like', "%{$term}%")
                    ->orWhere('isi', 'like', "%{$term}%");
            });
        }

        $paginator = $query->paginate($perPage);
        $paginator->getCollection()->transform(
            fn ($item) => (new PengumumanResource($item))->resolve()
        );

        return $paginator;
    }

    private function find(int $id): array
    {
        return (new PengumumanResource(Pengumuman::with('penulis')->findOrFail($id)))->resolve();
    }

    private function create(array $data): array
    {
        if (isset($data['thumbnail']) && $data['thumbnail'] instanceof \Illuminate\Http\UploadedFile) {
            $path = $data['thumbnail']->store('pengumuman', 'public');
            $data['thumbnail'] = '/storage/' . $path;
        }

        $data['tanggal_publikasi'] = $data['tanggal_publikasi'] ?? now()->toDateString();
        $data['penulis_id'] = auth()->id();
        $item = Pengumuman::create($data);
        $this->auditAdmin('pengumuman.create', $item, ['judul' => $item->judul]);

        return (new PengumumanResource($item))->resolve();
    }

    private function processUpdate(int $id, array $data): array
    {
        $item = Pengumuman::findOrFail($id);

        if (isset($data['thumbnail']) && $data['thumbnail'] instanceof \Illuminate\Http\UploadedFile) {
            if ($item->thumbnail) {
                $oldPath = str_replace('/storage/', '', $item->thumbnail);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $data['thumbnail']->store('pengumuman', 'public');
            $data['thumbnail'] = '/storage/' . $path;
        }

        $item->update($data);
        $this->auditAdmin('pengumuman.update', $item, ['judul' => $item->judul]);

        return (new PengumumanResource($item->fresh()))->resolve();
    }

    private function delete(int $id): void
    {
        $item = Pengumuman::findOrFail($id);
        $this->auditAdmin('pengumuman.delete', $item, ['judul' => $item->judul]);
        $item->delete();
    }

}