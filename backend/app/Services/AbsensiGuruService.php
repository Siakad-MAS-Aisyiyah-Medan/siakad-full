<?php

namespace App\Services;

use App\Http\Resources\AbsensiGuruResource;
use App\Models\Absensi;
use App\Models\AbsensiGuru;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class AbsensiGuruService
{
    /** Batas jam masuk dianggap terlambat (format H:i) */
    private const JAM_MASUK_BATAS = '07:30:00';

    public function checkIn(int $guruId, ?string $keterangan = null): array
    {
        return $this->upsertHarian($guruId, function (AbsensiGuru $row) use ($keterangan) {
            $now = Carbon::now();
            $row->jam_masuk = $now->format('H:i:s');
            $row->status = $this->resolveStatusFromJamMasuk($row->jam_masuk);
            if ($keterangan) {
                $row->keterangan = $keterangan;
            }
        });
    }

    public function checkOut(int $guruId, ?string $keterangan = null): array
    {
        return $this->upsertHarian($guruId, function (AbsensiGuru $row) use ($keterangan) {
            $row->jam_pulang = Carbon::now()->format('H:i:s');
            if ($keterangan) {
                $row->keterangan = $keterangan;
            }
            if (!$row->jam_masuk) {
                $row->status = Absensi::STATUS_ALPA;
            }
        });
    }

    public function listForGuru(int $guruId, array $filters = []): Collection
    {
        $query = AbsensiGuru::with('guru.guru')->where('id_user_guru', $guruId);
        $this->applyFilters($query, $filters);

        return $query->orderByDesc('tanggal')->get()->map(
            fn ($item) => (new AbsensiGuruResource($item))->resolve()
        );
    }

    public function listAdmin(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = AbsensiGuru::with('guru.guru');
        $this->applyFilters($query, $filters);

        $paginator = $query->orderByDesc('tanggal')->paginate($perPage);
        $paginator->getCollection()->transform(
            fn ($item) => (new AbsensiGuruResource($item))->resolve()
        );

        return $paginator;
    }

    public function rekap(array $filters = []): array
    {
        $query = AbsensiGuru::query();
        $this->applyFilters($query, $filters);

        $rows = $query->selectRaw('status, COUNT(*) as total')->groupBy('status')->pluck('total', 'status');

        $total = $rows->sum();
        $breakdown = [];
        foreach (Absensi::statusLabels() as $code => $label) {
            $breakdown[] = [
                'status' => $code,
                'label' => $label,
                'total' => (int) ($rows[$code] ?? 0),
            ];
        }

        return [
            'total' => $total,
            'breakdown' => $breakdown,
        ];
    }

    private function upsertHarian(int $guruId, callable $mutator): array
    {
        $user = User::findOrFail($guruId);
        if ($user->role !== 'guru') {
            throw new InvalidArgumentException('Hanya guru yang dapat absen.');
        }

        return DB::transaction(function () use ($guruId, $mutator) {
            $today = Carbon::today()->toDateString();
            $row = AbsensiGuru::firstOrNew([
                'id_user_guru' => $guruId,
                'tanggal' => $today,
            ]);

            if (!$row->exists) {
                $row->tahun_ajaran = $this->currentTahunAjaran();
                $row->semester = $this->currentSemester();
                $row->status = Absensi::STATUS_HADIR;
            }

            $mutator($row);
            $row->save();

            return (new AbsensiGuruResource($row->load('guru.guru')))->resolve();
        });
    }

    private function resolveStatusFromJamMasuk(string $jamMasuk): string
    {
        return $jamMasuk > self::JAM_MASUK_BATAS
            ? Absensi::STATUS_TERLAMBAT
            : Absensi::STATUS_HADIR;
    }

    private function currentTahunAjaran(): string
    {
        $year = (int) date('Y');
        $month = (int) date('n');

        return $month >= 7 ? "{$year}/".($year + 1) : ($year - 1)."/{$year}";
    }

    private function currentSemester(): string
    {
        $month = (int) date('n');

        return ($month >= 7 || $month <= 12) ? 'Ganjil' : 'Genap';
    }

    private function applyFilters($query, array $filters): void
    {
        if (!empty($filters['bulan'])) {
            $start = Carbon::createFromFormat('Y-m', $filters['bulan'])->startOfMonth();
            $filters['tanggal_dari'] = $start->toDateString();
            $filters['tanggal_sampai'] = $start->copy()->endOfMonth()->toDateString();
        }

        if (!empty($filters['id_user_guru'])) {
            $query->where('id_user_guru', $filters['id_user_guru']);
        }
        if (!empty($filters['tanggal_dari'])) {
            $query->whereDate('tanggal', '>=', $filters['tanggal_dari']);
        }
        if (!empty($filters['tanggal_sampai'])) {
            $query->whereDate('tanggal', '<=', $filters['tanggal_sampai']);
        }
        if (!empty($filters['semester'])) {
            $query->where('semester', $filters['semester']);
        }
        if (!empty($filters['tahun_ajaran'])) {
            $query->where('tahun_ajaran', $filters['tahun_ajaran']);
        }
    }
}
