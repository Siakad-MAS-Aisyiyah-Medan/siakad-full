<?php

namespace App\Services;

use App\Utils\AuditsAdminActions;
use App\Http\Resources\JadwalResource;
use App\Models\JadwalPelajaran;
use App\Models\Siswa;
use App\Support\SearchInput;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use InvalidArgumentException;

class JadwalService
{
    use AuditsAdminActions;
    public function __construct(private JadwalConflictService $conflicts)
    {
    }

    public function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
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

    public function listForGuru(int $userId, ?string $tahunAjaran = null, ?string $semester = null): Collection
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

    public function listForSiswa(int $userId, ?string $tahunAjaran = null, ?string $semester = null): Collection
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

    public function create(array $data): array
    {
        $data = $this->normalizePayload($data);
        $this->conflicts->assertNoConflict($data);
        $jadwal = JadwalPelajaran::create($data);
        $this->auditAdmin('jadwal.create', $jadwal, ['id_jadwal' => $jadwal->id_jadwal]);

        return (new JadwalResource($jadwal->load(['kelas', 'mapel', 'guru.guru', 'waktu'])))->resolve();
    }

    public function update(int $id, array $data): array
    {
        $data = $this->normalizePayload($data);
        $this->conflicts->assertNoConflict($data, $id);
        $jadwal = JadwalPelajaran::findOrFail($id);
        $jadwal->update($data);
        $this->auditAdmin('jadwal.update', $jadwal, ['id_jadwal' => $jadwal->id_jadwal]);

        return (new JadwalResource($jadwal->fresh(['kelas', 'mapel', 'guru.guru', 'waktu'])))->resolve();
    }

    public function delete(int $id): void
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
