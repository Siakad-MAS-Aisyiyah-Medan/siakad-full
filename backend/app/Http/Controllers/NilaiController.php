<?php

namespace App\Http\Controllers;

use App\Models\Nilai;
use App\Services\NilaiService;
use App\Utils\ApiResponse;
use App\Utils\AuditsAdminActions;
use Illuminate\Http\Request;
use InvalidArgumentException;

class NilaiController extends Controller
{
    use AuditsAdminActions;
    public function __construct(
        private NilaiService $nilaiService
    ) {}

    public function guruFormData(Request $request)
    {
        $validated = $request->validate([
            'id_kelas' => 'required|exists:kelas,id_kelas',
            'id_mapel' => 'required|exists:mata_pelajaran,id_mapel',
            'tahun_ajaran' => 'required|string|max:20',
            'semester' => 'required|in:Ganjil,Genap',
        ]);

        try {
            $data = $this->nilaiService->getFormData((int) $request->user()->id_user, $validated);

            return ApiResponse::success($data, 'Berhasil mengambil daftar nilai siswa');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function guruBulkStore(Request $request)
    {
        try {
            $validated = $request->validate([
            'meta' => 'required|array',
            'meta.id_kelas' => 'required|exists:kelas,id_kelas',
            'meta.id_mapel' => 'required|exists:mata_pelajaran,id_mapel',
            'meta.tahun_ajaran' => 'required|string|max:20',
            'meta.semester' => 'required|in:Ganjil,Genap',
            'items' => 'required|array|min:1',
            'items.*.id_user_siswa' => 'required|exists:users,id_user',
            'items.*.nilai_tugas' => 'required|integer|min:0|max:100',
            'items.*.nilai_uts' => 'required|integer|min:0|max:100',
            'items.*.nilai_uas' => 'required|integer|min:0|max:100',
            'items.*.nilai_praktik' => 'nullable|integer|min:0|max:100',
            'items.*.nilai_sikap' => 'nullable|integer|min:0|max:100',
        ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return \App\Utils\ApiResponse::error("Validasi gagal: " . json_encode($e->errors()), 422);
        }

        try {
            $saved = $this->nilaiService->bulkSave((int) $request->user()->id_user, $validated);

            $this->auditAdmin('guru.nilai.bulk_store', null, [
                'id_kelas' => $validated['meta']['id_kelas'],
                'id_mapel' => $validated['meta']['id_mapel'],
                'semester' => $validated['meta']['semester'],
                'tahun_ajaran' => $validated['meta']['tahun_ajaran']
            ]);

            return ApiResponse::success($saved, 'Nilai siswa berhasil disimpan');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        } catch (\Throwable $e) {
            report($e);

            return ApiResponse::error('Gagal menyimpan nilai siswa', 500);
        }
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

        $items = $this->nilaiService->listForSiswa((int) $request->user()->id_user, $validated);

        return ApiResponse::success($items, 'Berhasil mengambil nilai');
    }

    public function siswaRaport(Request $request)
    {
        $validated = $request->validate([
            'semester' => 'required|in:Ganjil,Genap',
            'tahun_ajaran' => 'required|string|max:20',
        ]);

        $raport = $this->nilaiService->raportForSiswa(
            (int) $request->user()->id_user,
            $validated['semester'],
            $validated['tahun_ajaran']
        );

        return ApiResponse::success($raport, 'Berhasil mengambil raport');
    }

    public function kepsekIndex(Request $request)
    {
        try {
            $filters = array_merge(
                $request->only(['id_kelas', 'id_mapel', 'semester', 'tahun_ajaran', 'validated_by_wali']),
                ['per_page' => 1, 'page' => 1]
            );
            if (empty($filters['tahun_ajaran'])) {
                $filters['tahun_ajaran'] = '2025/2026';
            }
            if (empty($filters['semester'])) {
                $filters['semester'] = 'Ganjil';
            }

            $summaryQuery = Nilai::query();
            $perKelas = (clone $summaryQuery)
                ->selectRaw('id_kelas, COUNT(*) as total')
                ->groupBy('id_kelas')
                ->get()
                ->map(fn ($row) => [
                    'id_kelas' => $row->id_kelas,
                    'total' => (int) $row->total,
                ]);

            return ApiResponse::success([
                'summary' => [
                    'total_nilai' => $summaryQuery->count(),
                    'per_kelas' => $perKelas,
                ],
            ], 'Berhasil mengambil rekap nilai');
        } catch (\Throwable $e) {
            report($e);

            return ApiResponse::error('Gagal mengambil data', 500);
        }
    }

    public function adminIndex(Request $request)
    {
        return $this->kepsekIndex($request);
    }

    public function adminStudentRaport(Request $request, int $idUserSiswa)
    {
        $validated = $request->validate([
            'semester' => 'required|in:Ganjil,Genap',
            'tahun_ajaran' => 'required|string|max:20',
        ]);

        $raport = $this->nilaiService->raportForStudent(
            $idUserSiswa,
            $validated['semester'],
            $validated['tahun_ajaran']
        );

        return ApiResponse::success($raport, 'Berhasil mengambil transkrip akademik murid');
    }
}
