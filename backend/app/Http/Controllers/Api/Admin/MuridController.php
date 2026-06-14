<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EnrollMuridRequest;
use App\Http\Requests\Admin\IndexMuridRequest;
use App\Http\Requests\Admin\StoreMuridRequest;
use App\Http\Requests\Admin\UpdateMuridRequest;
use App\Services\MuridService;
use InvalidArgumentException;

class MuridController extends Controller
{
    public function __construct(private MuridService $muridService)
    {
    }

    public function index(IndexMuridRequest $request)
    {
        $paginator = $this->muridService->listMurid(
            $request->validated('search'),
            (int) $request->validated('per_page', 15)
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data murid');
    }

    public function stats()
    {
        $stats = $this->muridService->getStats();
        return ApiResponse::success($stats, 'Berhasil mengambil statistik murid');
    }

    public function store(StoreMuridRequest $request)
    {
        try {
            $user = $this->muridService->createMurid($request->validated());
            return ApiResponse::success($user, 'Murid berhasil ditambahkan', 201);
        } catch (\Exception $e) {
            return ApiResponse::error('Gagal menambahkan murid: ' . $e->getMessage(), 500);
        }
    }

    public function update(UpdateMuridRequest $request, $id)
    {
        try {
            $user = $this->muridService->updateMurid((int) $id, $request->validated());

            return ApiResponse::success($user, 'Status Murid diperbarui');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function enroll(EnrollMuridRequest $request, $id)
    {
        try {
            $result = $this->muridService->enrollMurid((int) $id, $request->validated('id_kelas'));

            return ApiResponse::success($result, 'Calon siswa berhasil dipromosikan menjadi siswa');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function destroy($id)
    {
        try {
            $this->muridService->deleteMurid((int) $id);

            return ApiResponse::success(null, 'Data murid berhasil dihapus permanen');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }
}
