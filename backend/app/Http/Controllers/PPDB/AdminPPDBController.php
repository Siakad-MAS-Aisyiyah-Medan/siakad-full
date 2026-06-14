<?php

namespace App\Http\Controllers\PPDB;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IndexPpdbRequest;
use App\Http\Requests\PPDB\AdminRevisiRequest;
use App\Http\Requests\PPDB\JadikanMuridRequest;
use App\Http\Resources\PpdbResource;
use App\Services\PpdbService;
use InvalidArgumentException;

class AdminPPDBController extends Controller
{
    public function __construct(private PpdbService $ppdb)
    {
    }

    public function index(IndexPpdbRequest $request)
    {
        $paginator = $this->ppdb->adminList(
            $request->validated('search'),
            $request->validated('status'),
            (int) $request->validated('per_page', 15)
        );

        $paginator->getCollection()->transform(
            fn ($row) => PpdbResource::admin($row)->resolve()
        );

        return ApiResponse::paginated($paginator, 'Daftar pendaftar PPDB');
    }

    public function stats()
    {
        // Calculate stats
        $all = \App\Models\Pendaftaran::query()->get(['status_pendaftaran', 'ppdb_status']);
        
        $menunggu = 0;
        $diterima = 0;
        $ditolak = 0;

        foreach ($all as $p) {
            $status = $p->status_pendaftaran ?? $p->ppdb_status;
            if (in_array($status, ['diajukan', 'terverifikasi', 'revisi', 'draft', 'submitted', 'verified'])) {
                $menunggu++;
            } elseif ($status === 'diterima' || $status === 'accepted') {
                $diterima++;
            } elseif ($status === 'ditolak' || $status === 'rejected') {
                $ditolak++;
            }
        }

        return ApiResponse::success([
            'menunggu' => $menunggu,
            'diterima' => $diterima,
            'ditolak' => $ditolak,
        ], 'Statistik PPDB');
    }

    public function show($id)
    {
        $pendaftaran = $this->ppdb->adminFind((int) $id);

        return ApiResponse::success(
            PpdbResource::admin($pendaftaran)->resolve(),
            'Detail pendaftar'
        );
    }

    public function verifikasi($id)
    {
        try {
            $pendaftaran = $this->ppdb->adminVerifikasi((int) $id);

            return ApiResponse::success(
                PpdbResource::admin($pendaftaran)->resolve(),
                'Biodata dan berkas ditandai terverifikasi'
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function revisi(AdminRevisiRequest $request, $id)
    {
        try {
            $pendaftaran = $this->ppdb->adminRevisi((int) $id, $request->validated('catatan'));

            return ApiResponse::success(
                PpdbResource::admin($pendaftaran)->resolve(),
                'Status revisi diberikan'
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function terima($id)
    {
        try {
            $pendaftaran = $this->ppdb->adminTerima((int) $id);

            return ApiResponse::success(
                PpdbResource::admin($pendaftaran)->resolve(),
                'Pendaftar diterima'
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function tolak(AdminRevisiRequest $request, $id)
    {
        try {
            $pendaftaran = $this->ppdb->adminTolak((int) $id, $request->validated('catatan'));

            return ApiResponse::success(
                PpdbResource::admin($pendaftaran)->resolve(),
                'Pendaftar ditolak'
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function jadikanMurid(JadikanMuridRequest $request, $id)
    {
        try {
            $result = $this->ppdb->adminJadikanMurid(
                (int) $id,
                $request->validated('id_kelas')
            );

            return ApiResponse::success([
                'user' => $result['user'] ?? null,
                'siswa' => $result['siswa'] ?? null,
                'pendaftaran' => isset($result['pendaftaran'])
                    ? PpdbResource::admin($result['pendaftaran'])->resolve()
                    : null,
            ], 'Calon murid berhasil menjadi murid aktif');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }
}
