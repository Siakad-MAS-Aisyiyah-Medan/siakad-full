<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKelasRequest;
use App\Http\Requests\Admin\UpdateKelasRequest;
use App\Services\KelasService;
use Illuminate\Http\Request;

class KelasController extends Controller
{
    public function __construct(private KelasService $kelasService)
    {
    }

    public function index(Request $request)
    {
        $paginator = $this->kelasService->list(
            $request->only(['search', 'tingkat', 'jurusan']),
            (int) $request->query('per_page', 15)
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil data kelas');
    }

    public function stats()
    {
        $stats = $this->kelasService->getStats();
        return ApiResponse::success($stats, 'Berhasil mengambil statistik kelas');
    }

    public function store(StoreKelasRequest $request)
    {
        $kelas = $this->kelasService->create($request->validated());

        return ApiResponse::success($kelas, 'Kelas berhasil ditambahkan', 201);
    }

    public function update(UpdateKelasRequest $request, $id)
    {
        $kelas = $this->kelasService->update((int) $id, $request->validated());

        return ApiResponse::success($kelas, 'Kelas berhasil diperbarui');
    }

    public function destroy($id)
    {
        $this->kelasService->delete((int) $id);

        return ApiResponse::success(null, 'Kelas berhasil dihapus');
    }
}
