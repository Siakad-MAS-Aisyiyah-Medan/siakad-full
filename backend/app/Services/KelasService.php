<?php

namespace App\Services;

use App\Utils\AuditsAdminActions;
use App\Http\Resources\KelasResource;
use App\Models\Kelas;
use App\Support\SearchInput;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class KelasService
{
    use AuditsAdminActions;
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Kelas::with(['waliKelas.guru'])->withCount(['jadwal', 'siswa']);

        if (!empty($filters['search'])) {
            $term = SearchInput::escape($filters['search']);
            $query->where('nama_kelas', 'like', "%{$term}%");
        }

        if (!empty($filters['tingkat']) && $filters['tingkat'] !== 'Semua') {
            $query->where('tingkat', $filters['tingkat']);
        }

        if (!empty($filters['jurusan']) && $filters['jurusan'] !== 'Semua') {
            $query->where('jurusan', $filters['jurusan']);
        }

        $paginator = $query->orderBy('nama_kelas')->paginate($perPage);
        $paginator->getCollection()->transform(
            fn ($item) => (new KelasResource($item))->resolve()
        );

        return $paginator;
    }

    public function getStats(): array
    {
        return [
            'total_kelas' => Kelas::count(),
            'ipa' => Kelas::where('jurusan', 'IPA')->count(),
            'ips' => Kelas::where('jurusan', 'IPS')->count(),
            'belum_ada_wali' => Kelas::whereNull('id_wali_kelas')->count(),
        ];
    }

    public function create(array $data): array
    {
        $kelas = Kelas::create($data);
        $this->auditAdmin('kelas.create', $kelas, ['nama_kelas' => $kelas->nama_kelas]);

        return (new KelasResource($kelas->load('waliKelas.guru')))->resolve();
    }

    public function update(int $id, array $data): array
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->update($data);
        $this->auditAdmin('kelas.update', $kelas, ['nama_kelas' => $kelas->nama_kelas]);

        return (new KelasResource($kelas->fresh(['waliKelas.guru'])))->resolve();
    }

    public function delete(int $id): void
    {
        $kelas = Kelas::findOrFail($id);
        $this->auditAdmin('kelas.delete', $kelas, ['nama_kelas' => $kelas->nama_kelas]);
        $kelas->delete();
    }
}
