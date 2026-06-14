<?php

use App\Http\Controllers\Api\Admin\AbsensiGuruController;
use App\Http\Controllers\Api\Admin\AuditLogController;
use App\Http\Controllers\Api\Admin\BeritaController;
use App\Http\Controllers\Api\Admin\EkskulController;
use App\Http\Controllers\Api\Admin\GuruController;
use App\Http\Controllers\Api\Admin\JadwalController;
use App\Http\Controllers\Api\Admin\KelasController;
use App\Http\Controllers\Api\Admin\MapelController;
use App\Http\Controllers\Api\Admin\MuridController;
use App\Http\Controllers\Api\Admin\PengumumanController;
use App\Http\Controllers\Api\Admin\PpdbController;
use App\Http\Controllers\Api\Admin\ProfilSekolahController;
use App\Http\Controllers\Api\LaporanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);

    Route::middleware('permission:manage_murid')->group(function () {
        Route::get('/murid/stats', [MuridController::class, 'stats']);
        Route::get('/murid', [MuridController::class, 'index']);
        Route::post('/murid', [MuridController::class, 'store']);
        Route::put('/murid/{id}', [MuridController::class, 'update']);
        Route::post('/murid/{id}/enroll', [MuridController::class, 'enroll']);
        Route::delete('/murid/{id}', [MuridController::class, 'destroy']);
    });

    // Legacy PPDB routes (redirect ke modul baru — tetap untuk kompatibilitas)
    Route::middleware('permission:manage_ppdb')->group(function () {
        Route::get('/ppdb-legacy', [PpdbController::class, 'index']);
        Route::patch('/ppdb/{id}/status', [PpdbController::class, 'updateStatus']);
    });

    Route::middleware('permission:manage_guru')->group(function () {
        Route::get('/guru', [GuruController::class, 'index']);
        Route::post('/guru', [GuruController::class, 'store']);
        Route::put('/guru/{id}', [GuruController::class, 'update']);
        Route::delete('/guru/{id}', [GuruController::class, 'destroy']);
    });

    Route::get('/kelas', [KelasController::class, 'index']);
    Route::get('/kelas/stats', [KelasController::class, 'stats']);
    Route::middleware('permission:manage_kelas')->group(function () {
        Route::post('/kelas', [KelasController::class, 'store']);
        Route::put('/kelas/{id}', [KelasController::class, 'update']);
        Route::delete('/kelas/{id}', [KelasController::class, 'destroy']);
    });

    Route::get('/mapel', [MapelController::class, 'index']);
    Route::middleware('permission:manage_mapel')->group(function () {
        Route::post('/mapel', [MapelController::class, 'store']);
        Route::put('/mapel/{id}', [MapelController::class, 'update']);
        Route::delete('/mapel/{id}', [MapelController::class, 'destroy']);
    });

    Route::middleware('permission:manage_jadwal')->group(function () {
        Route::get('/waktu-pelajaran', [\App\Http\Controllers\Api\Admin\WaktuPelajaranController::class, 'index']);
        Route::post('/waktu-pelajaran/generate', [\App\Http\Controllers\Api\Admin\WaktuPelajaranController::class, 'generate']);

        Route::get('/jadwal/matrix/{id_kelas}', [JadwalController::class, 'matrix']);
        Route::post('/jadwal/matrix/{id_kelas}', [JadwalController::class, 'storeMatrix']);

        Route::get('/jadwal', [JadwalController::class, 'index']);
        Route::post('/jadwal', [JadwalController::class, 'store']);
        Route::put('/jadwal/{id}', [JadwalController::class, 'update']);
        Route::delete('/jadwal/{id}', [JadwalController::class, 'destroy']);
    });

    Route::middleware('permission:manage_pengumuman')->group(function () {
        Route::get('/pengumuman', [PengumumanController::class, 'index']);
        Route::get('/pengumuman/{id}', [PengumumanController::class, 'show']);
        Route::post('/pengumuman', [PengumumanController::class, 'store']);
        Route::put('/pengumuman/{id}', [PengumumanController::class, 'update']);
        Route::delete('/pengumuman/{id}', [PengumumanController::class, 'destroy']);
    });

    Route::middleware('permission:manage_prestasi')->group(function () {
        Route::get('/berita', [BeritaController::class, 'index']);
        Route::get('/berita/{id}', [BeritaController::class, 'show']);
        Route::post('/berita', [BeritaController::class, 'store']);
        Route::put('/berita/{id}', [BeritaController::class, 'update']);
        Route::delete('/berita/{id}', [BeritaController::class, 'destroy']);
    });

    Route::middleware('permission:manage_absensi_guru')->group(function () {
        Route::get('/absensi-guru', [AbsensiGuruController::class, 'index']);
        Route::get('/absensi-guru/rekap', [AbsensiGuruController::class, 'rekap']);
    });

    Route::middleware('permission:view_laporan')->group(function () {
        Route::get('/laporan', [LaporanController::class, 'index']);
    });

    Route::middleware('permission:manage_all')->group(function () {
        Route::put('/akun/profile', [\App\Http\Controllers\Api\Admin\AkunController::class, 'updateProfile']);
        Route::get('/akun', [\App\Http\Controllers\Api\Admin\AkunController::class, 'index']);
        Route::post('/akun', [\App\Http\Controllers\Api\Admin\AkunController::class, 'store']);
        Route::delete('/akun/{id}', [\App\Http\Controllers\Api\Admin\AkunController::class, 'destroy']);

        Route::apiResource('/tahun-ajaran', \App\Http\Controllers\Api\Admin\TahunAjaranController::class);
        Route::put('/tahun-ajaran/{id}/activate', [\App\Http\Controllers\Api\Admin\TahunAjaranController::class, 'activate']);
        
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
        
        Route::get('/profil-sekolah', [ProfilSekolahController::class, 'show']);
        Route::put('/profil-sekolah', [ProfilSekolahController::class, 'update']);

        // Settings API
        Route::get('/settings', [\App\Http\Controllers\Api\Admin\SettingsController::class, 'index']);
        Route::put('/settings/{key}', [\App\Http\Controllers\Api\Admin\SettingsController::class, 'update']);
        Route::post('/settings/bulk', [\App\Http\Controllers\Api\Admin\SettingsController::class, 'bulkUpdate']);
    });

    Route::middleware('permission:manage_ekskul')->group(function () {
        Route::get('/ekskul', [EkskulController::class, 'index']);
        Route::get('/ekskul/{id}', [EkskulController::class, 'show']);
        Route::post('/ekskul', [EkskulController::class, 'store']);
        Route::put('/ekskul/{id}', [EkskulController::class, 'update']);
        Route::delete('/ekskul/{id}', [EkskulController::class, 'destroy']);
    });
});
