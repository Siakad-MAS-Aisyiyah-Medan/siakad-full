<?php

namespace App\Http\Controllers;

use App\Http\Resources\AbsensiGuruResource;
use App\Http\Resources\AbsensiResource;
use App\Models\Absensi;
use App\Models\AbsensiGuru;
use App\Models\JadwalPelajaran;
use App\Models\Mapel;
use App\Models\User;
use App\Services\AbsensiSiswaService;
use App\Utils\ApiResponse;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use InvalidArgumentException;

class AbsensiController extends Controller
{
    protected AbsensiSiswaService $absensiService;

    public function __construct(AbsensiSiswaService $absensiService)
    {
        $this->absensiService = $absensiService;
    }

    public function adminGuruIndex(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer',
        ]);

        $paginator = $this->listAdmin(
            $validated,
            (int) $request->input('per_page', 15)
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data absensi guru');
    }

    public function adminGuruRekap(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer',
        ]);

        $rekap = $this->rekap($validated);

        return ApiResponse::success($rekap, 'Berhasil mengambil rekap absensi guru');
    }

    public function guruFormData(Request $request)
    {
        $validated = $request->validate([
            'id_kelas' => 'required|exists:kelas,id_kelas',
            'id_mapel' => 'required|exists:mata_pelajaran,id_mapel',
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'tahun_ajaran' => 'required|string|max:20',
            'semester' => 'required|in:Ganjil,Genap',
            'id_jadwal' => 'nullable|exists:jadwal_pelajaran,id_jadwal',
        ]);

        try {
            $data = $this->absensiService->getFormData(
                (int) auth()->id(),
                $validated
            );

            return ApiResponse::success($data, 'Berhasil mengambil daftar siswa');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function guruBulkStore(Request $request)
    {
        $validated = $request->validate([
            'meta' => 'required|array',
            'meta.id_kelas' => 'required|exists:kelas,id_kelas',
            'meta.id_mapel' => 'required|exists:mata_pelajaran,id_mapel',
            'meta.tanggal' => 'required|date',
            'meta.jam_mulai' => 'required|date_format:H:i',
            'meta.jam_selesai' => 'required|date_format:H:i|after:meta.jam_mulai',
            'meta.tahun_ajaran' => 'required|string|max:20',
            'meta.semester' => 'required|in:Ganjil,Genap',
            'meta.id_jadwal' => 'nullable|exists:jadwal_pelajaran,id_jadwal',
            'items' => 'required|array|min:1',
            'items.*.id_user_siswa' => 'required|exists:users,id_user',
            'items.*.status' => ['required', Rule::in(['H', 'A', 'I', 'S', 'T'])],
            'items.*.keterangan' => 'nullable|string|max:255',
        ]);

        try {
            $saved = $this->absensiService->bulkSave(
                (int) auth()->id(),
                $validated
            );

            return ApiResponse::success($saved, 'Absensi siswa berhasil disimpan');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        } catch (\Throwable $e) {
            report($e);

            return ApiResponse::error('Gagal menyimpan absensi siswa', 500);
        }
    }

    public function guruRekapSiswa(Request $request)
    {
        $validated = $request->validate([
            'id_kelas' => 'nullable|exists:kelas,id_kelas',
            'id_mapel' => 'nullable|exists:mata_pelajaran,id_mapel',
            'tanggal_dari' => 'nullable|date',
            'tanggal_sampai' => 'nullable|date|after_or_equal:tanggal_dari',
            'semester' => 'nullable|in:Ganjil,Genap',
            'tahun_ajaran' => 'nullable|string|max:20',
            'bulan' => ['nullable', 'regex:/^\d{4}-\d{2}$/'],
        ]);

        try {
            $rekap = $this->rekapSiswa(
                $validated,
                (int) auth()->id()
            );

            return ApiResponse::success($rekap, 'Berhasil mengambil rekap absensi siswa');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function guruHistoryAbsensi(Request $request)
    {
        $validated = $request->validate([
            'id_kelas' => 'required|exists:kelas,id_kelas',
            'id_mapel' => 'required|exists:mata_pelajaran,id_mapel',
        ]);

        try {
            $history = $this->absensiService->getHistoryMeetings(
                (int) auth()->id(),
                $validated
            );

            return ApiResponse::success($history, 'Berhasil mengambil riwayat absensi pertemuan');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function guruDeleteMeeting(Request $request)
    {
        $validated = $request->validate([
            'id_kelas' => 'required|exists:kelas,id_kelas',
            'id_mapel' => 'required|exists:mata_pelajaran,id_mapel',
            'tanggal' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ]);

        try {
            $this->absensiService->deleteMeeting((int) auth()->id(), $validated);
            return ApiResponse::success(null, 'Data absensi pertemuan berhasil dihapus');
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }
    }

    public function guruCheckIn(Request $request)
    {
        $validated = $request->validate([
            'keterangan' => 'nullable|string|max:500',
        ]);

        try {
            $data = $this->checkIn(
                (int) auth()->id(),
                $request->input('keterangan')
            );

            return ApiResponse::success($data, 'Absen masuk berhasil dicatat');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function guruCheckOut(Request $request)
    {
        $validated = $request->validate([
            'keterangan' => 'nullable|string|max:500',
        ]);

        try {
            $data = $this->checkOut(
                (int) auth()->id(),
                $request->input('keterangan')
            );

            return ApiResponse::success($data, 'Absen pulang berhasil dicatat');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function guruRiwayatGuru(Request $request)
    {
        $validated = $request->validate([
            'tanggal_dari' => 'nullable|date',
            'tanggal_sampai' => 'nullable|date|after_or_equal:tanggal_dari',
            'semester' => 'nullable|in:Ganjil,Genap',
            'tahun_ajaran' => 'nullable|string|max:20',
        ]);

        $items = $this->listForGuru(
            (int) auth()->id(),
            $validated
        );

        return ApiResponse::success($items, 'Berhasil mengambil riwayat absensi guru');
    }

    public function siswaIndex(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran' => 'nullable|string|max:20',
            'semester' => 'nullable|in:Ganjil,Genap',
            'tanggal_dari' => 'nullable|date',
            'tanggal_sampai' => 'nullable|date|after_or_equal:tanggal_dari',
            'id_mapel' => 'nullable|exists:mata_pelajaran,id_mapel',
        ]);

        $items = $this->listForSiswa(
            (int) auth()->id(),
            $validated
        );

        return ApiResponse::success($items, 'Berhasil mengambil riwayat absensi');
    }

    private function listForSiswa(int $userId, array $filters = []): Collection
    {
        $query = Absensi::with(['kelas', 'mapel', 'guruPencatat.guru'])
            ->where('id_user_siswa', $userId);

        $this->applyFiltersSiswa($query, $filters);

        return $query->orderByDesc('tanggal')->orderBy('jam_mulai')->get()->map(
            fn ($item) => (new AbsensiResource($item))->resolve()
        );
    }

    private function rekapSiswa(array $filters = [], ?int $guruId = null): array
    {
        $query = Absensi::query();
        if ($guruId !== null) {
            $this->applyGuruRekapScope($query, $guruId, $filters);
        }
        $this->applyFiltersSiswa($query, $filters);

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

    public function kepsekSiswa(Request $request)
    {
        $rekap = $this->rekapSiswa($request->only([
            'id_kelas', 'id_mapel', 'tanggal_dari', 'tanggal_sampai', 'semester', 'tahun_ajaran', 'bulan',
        ]));

        return ApiResponse::success($rekap, 'Berhasil mengambil laporan absensi siswa');
    }

    public function kepsekGuru(Request $request)
    {
        $rekap = $this->rekap($request->only([
            'id_user_guru', 'tanggal_dari', 'tanggal_sampai', 'semester', 'tahun_ajaran', 'bulan',
        ]));

        return ApiResponse::success($rekap, 'Berhasil mengambil laporan absensi guru');
    }

    // --- Inlined from AbsensiGuruService ---

    /** Batas jam masuk dianggap terlambat (format H:i) */
    private const JAM_MASUK_BATAS = '07:30:00';

    private function checkIn(int $guruId, ?string $keterangan = null): array
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

    private function checkOut(int $guruId, ?string $keterangan = null): array
    {
        return $this->upsertHarian($guruId, function (AbsensiGuru $row) use ($keterangan) {
            $row->jam_pulang = Carbon::now()->format('H:i:s');
            if ($keterangan) {
                $row->keterangan = $keterangan;
            }
            if (! $row->jam_masuk) {
                $row->status = Absensi::STATUS_ALPA;
            }
        });
    }

    private function listForGuru(int $guruId, array $filters = []): Collection
    {
        $query = AbsensiGuru::with('guru.guru')->where('id_user_guru', $guruId);
        $this->applyFilters($query, $filters);

        return $query->orderByDesc('tanggal')->get()->map(
            fn ($item) => (new AbsensiGuruResource($item))->resolve()
        );
    }

    private function listAdmin(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = AbsensiGuru::with('guru.guru');
        $this->applyFilters($query, $filters);

        $paginator = $query->orderByDesc('tanggal')->paginate($perPage);
        $paginator->getCollection()->transform(
            fn ($item) => (new AbsensiGuruResource($item))->resolve()
        );

        return $paginator;
    }

    private function rekap(array $filters = []): array
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

            if (! $row->exists) {
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
        if (! empty($filters['bulan'])) {
            $start = Carbon::createFromFormat('Y-m', $filters['bulan'])->startOfMonth();
            $filters['tanggal_dari'] = $start->toDateString();
            $filters['tanggal_sampai'] = $start->copy()->endOfMonth()->toDateString();
        }

        if (! empty($filters['id_user_guru'])) {
            $query->where('id_user_guru', $filters['id_user_guru']);
        }
        if (! empty($filters['tanggal_dari'])) {
            $query->whereDate('tanggal', '>=', $filters['tanggal_dari']);
        }
        if (! empty($filters['tanggal_sampai'])) {
            $query->whereDate('tanggal', '<=', $filters['tanggal_sampai']);
        }
        if (! empty($filters['semester'])) {
            $query->where('semester', $filters['semester']);
        }
        if (! empty($filters['tahun_ajaran'])) {
            $query->where('tahun_ajaran', $filters['tahun_ajaran']);
        }
    }

    // --- Inlined from AbsensiSiswaService ---

    private function applyFiltersSiswa($query, array $filters): void
    {
        if (! empty($filters['bulan'])) {
            $start = Carbon::createFromFormat('Y-m', $filters['bulan'])->startOfMonth();
            $filters['tanggal_dari'] = $start->toDateString();
            $filters['tanggal_sampai'] = $start->copy()->endOfMonth()->toDateString();
        }

        if (! empty($filters['id_kelas'])) {
            $query->where('id_kelas', $filters['id_kelas']);
        }
        if (! empty($filters['id_mapel'])) {
            $query->where('id_mapel', $filters['id_mapel']);
        }
        if (! empty($filters['id_user_siswa'])) {
            $query->where('id_user_siswa', $filters['id_user_siswa']);
        }
        if (! empty($filters['tanggal_dari'])) {
            $query->whereDate('tanggal', '>=', $filters['tanggal_dari']);
        }
        if (! empty($filters['tanggal_sampai'])) {
            $query->whereDate('tanggal', '<=', $filters['tanggal_sampai']);
        }
        if (! empty($filters['semester'])) {
            $query->where('semester', $filters['semester']);
        }
        if (! empty($filters['tahun_ajaran'])) {
            $query->where('tahun_ajaran', $filters['tahun_ajaran']);
        }
    }

    private function assertGuruCanRecord(int $guruId, int $mapelId): void
    {
        $user = User::findOrFail($guruId);

        if ($user->role === 'admin') {
            return;
        }

        if ($user->role !== 'guru') {
            throw new InvalidArgumentException('Hanya guru yang dapat mencatat absensi siswa.');
        }

        $mapel = Mapel::findOrFail($mapelId);
        if ((int) $mapel->id_guru !== $guruId) {
            throw new InvalidArgumentException('Anda bukan pengampu mata pelajaran ini.');
        }
    }

    private function applyGuruRekapScope($query, int $guruId, array $filters): void
    {
        $user = User::findOrFail($guruId);

        if ($user->role === 'admin') {
            if (! empty($filters['id_mapel'])) {
                $query->where('id_mapel', $filters['id_mapel']);
            }
            if (! empty($filters['id_kelas'])) {
                $query->where('id_kelas', $filters['id_kelas']);
            }

            return;
        }

        $mapelIds = Mapel::where('id_guru', $guruId)->pluck('id_mapel');

        if ($mapelIds->isEmpty()) {
            throw new InvalidArgumentException('Anda belum ditugaskan mengampu mata pelajaran.');
        }

        if (! empty($filters['id_mapel'])) {
            $mapelId = (int) $filters['id_mapel'];
            if (! $mapelIds->contains($mapelId)) {
                throw new InvalidArgumentException('Anda bukan pengampu mata pelajaran ini.');
            }
            $query->where('id_mapel', $mapelId);
        } else {
            $query->whereIn('id_mapel', $mapelIds);
        }

        if (! empty($filters['id_kelas'])) {
            $kelasId = (int) $filters['id_kelas'];
            $teachesKelas = JadwalPelajaran::where('id_guru', $guruId)
                ->where('id_kelas', $kelasId)
                ->exists();

            if (! $teachesKelas) {
                throw new InvalidArgumentException('Anda tidak mengampu kelas ini.');
            }

            // Apply filter only after validation passes
            $query->where('id_kelas', $kelasId);
        }
    }
}
