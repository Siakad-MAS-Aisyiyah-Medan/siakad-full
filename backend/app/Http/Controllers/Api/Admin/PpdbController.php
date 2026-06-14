<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IndexPpdbRequest;
use App\Http\Requests\Admin\UpdatePpdbStatusRequest;
use App\Http\Resources\PendaftaranResource;
use App\Services\PpdbAdminService;
use InvalidArgumentException;

class PpdbController extends Controller
{
    public function __construct(private PpdbAdminService $ppdbService)
    {
    }

    public function index(IndexPpdbRequest $request)
    {
        $paginator = $this->ppdbService->list(
            $request->validated('search'),
            $request->validated('status'),
            (int) $request->validated('per_page', 15)
        );

        $paginator->getCollection()->transform(
            fn ($row) => PendaftaranResource::admin($row)->resolve()
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data PPDB');
    }

    public function stats()
    {
        $stats = $this->ppdbService->getStats();
        return ApiResponse::success($stats, 'Berhasil mengambil statistik PPDB');
    }

    public function show($id)
    {
        $pendaftaran = $this->ppdbService->find((int) $id);

        return ApiResponse::success(
            PendaftaranResource::admin($pendaftaran)->resolve(),
            'Detail PPDB'
        );
    }

    public function updateStatus(UpdatePpdbStatusRequest $request, $id)
    {
        try {
            $pendaftaran = $this->ppdbService->updateStatus(
                (int) $id,
                $request->validated('status'),
                $request->validated('catatan_admin')
            );

            return ApiResponse::success(
                PendaftaranResource::admin($pendaftaran)->resolve(),
                'Status PPDB diperbarui'
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }
}
