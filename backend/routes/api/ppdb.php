<?php

use App\Http\Controllers\PPDB\AdminPPDBController;
use App\Http\Controllers\PPDB\CalonMuridPendaftaranController;
use App\Http\Controllers\PPDB\PpdbBerkasController;
use App\Http\Controllers\PPDB\PpdbController;
use App\Http\Controllers\PPDB\PublicPendaftaranController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PPDB API Routes
|--------------------------------------------------------------------------
| Public:
|   GET  /api/ppdb/info
| Auth (calon_siswa):
|   GET  /api/ppdb/my-registration
|   POST /api/ppdb/start
|   PUT  /api/ppdb/step/*
|   POST /api/ppdb/submit
|   GET  /api/ppdb/status
*/

Route::get('/ppdb/info', [PublicPendaftaranController::class, 'info']);

Route::middleware([
    'auth:sanctum',
    'permission:manage_pendaftaran_pribadi,view_status_pendaftaran',
])->prefix('ppdb')->group(function () {
    Route::get('/my-registration', [PpdbController::class, 'myRegistration']);
    Route::post('/start', [PpdbController::class, 'start']);
    Route::put('/step/keterangan-pribadi', [PpdbController::class, 'saveKeteranganPribadi']);
    Route::put('/step/kesehatan', [PpdbController::class, 'saveKesehatan']);
    Route::put('/step/pendidikan-asal', [PpdbController::class, 'savePendidikanAsal']);
    Route::put('/step/orang-tua-wali', [PpdbController::class, 'saveOrangTuaWali']);
    Route::put('/step/kepribadian', [PpdbController::class, 'saveKepribadian']);
    Route::put('/step/dokumen', [PpdbController::class, 'saveDokumen']);
    Route::post('/submit', [PpdbController::class, 'submit']);
    Route::get('/status', [PpdbController::class, 'status']);

    Route::get('/berkas', [PpdbBerkasController::class, 'index']);
    Route::post('/berkas', [PpdbBerkasController::class, 'store']);
    Route::delete('/berkas/{jenis}', [PpdbBerkasController::class, 'destroy']);

    /** Legacy endpoints — tetap tersedia sementara */
    Route::get('/me', [CalonMuridPendaftaranController::class, 'me']);
    Route::post('/formulir', [CalonMuridPendaftaranController::class, 'saveFormulir']);
    Route::get('/bukti', [CalonMuridPendaftaranController::class, 'bukti']);
});

Route::middleware(['auth:sanctum', 'permission:manage_ppdb'])->prefix('admin/ppdb')->group(function () {
    Route::get('/stats', [AdminPPDBController::class, 'stats']);
    Route::get('/', [AdminPPDBController::class, 'index']);
    Route::get('/{id}', [AdminPPDBController::class, 'show']);
    Route::post('/{id}/verifikasi', [AdminPPDBController::class, 'verifikasi']);
    Route::post('/{id}/revisi', [AdminPPDBController::class, 'revisi']);
    Route::post('/{id}/terima', [AdminPPDBController::class, 'terima']);
    Route::post('/{id}/tolak', [AdminPPDBController::class, 'tolak']);
    Route::post('/{id}/jadikan-murid', [AdminPPDBController::class, 'jadikanMurid']);
});
