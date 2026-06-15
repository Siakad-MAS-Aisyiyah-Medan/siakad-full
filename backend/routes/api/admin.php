<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\EkskulController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\MapelController;
use App\Http\Controllers\MuridController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\PendaftaranController;
use App\Http\Controllers\ProfilSekolahController;
use App\Http\Controllers\LaporanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index']);

    Route::get('/murid/stats', [MuridController::class, 'stats'])->middleware('permission:manage_murid,view_data_siswa');
    Route::get('/murid', [MuridController::class, 'index'])->middleware('permission:manage_murid,view_data_siswa');
    Route::middleware('permission:manage_murid')->group(function () {
        Route::post('/murid', [MuridController::class, 'store']);
        Route::put('/murid/{id}', [MuridController::class, 'update']);
        Route::post('/murid/{id}/enroll', [MuridController::class, 'enroll']);
        Route::delete('/murid/{id}', [MuridController::class, 'destroy']);
    });

    // Legacy PPDB routes (redirect ke modul baru — tetap untuk kompatibilitas)
    Route::middleware('permission:manage_ppdb')->group(function () {
        Route::get('/ppdb-legacy', [\App\Http\Controllers\PendaftaranController::class, 'adminPpdbIndex']);
        Route::patch('/ppdb/{id}/status', [\App\Http\Controllers\PendaftaranController::class, 'updateStatus']);
    });

    Route::get('/guru', [GuruController::class, 'index'])->middleware('permission:manage_guru,view_data_guru');
    Route::middleware('permission:manage_guru')->group(function () {
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
        Route::get('/waktu-pelajaran', [\App\Http\Controllers\WaktuPelajaranController::class, 'index']);
        Route::post('/waktu-pelajaran/generate', [\App\Http\Controllers\WaktuPelajaranController::class, 'generate']);

        Route::get('/jadwal/matrix/{id_kelas}', [JadwalController::class, 'adminMatrix']);
        Route::post('/jadwal/matrix/{id_kelas}', [JadwalController::class, 'adminStoreMatrix']);

        Route::get('/jadwal', [JadwalController::class, 'adminIndex']);
        Route::post('/jadwal', [JadwalController::class, 'adminStore']);
        Route::put('/jadwal/{id}', [JadwalController::class, 'adminUpdate']);
        Route::delete('/jadwal/{id}', [JadwalController::class, 'adminDestroy']);
    });

    Route::get('/pengumuman', [PengumumanController::class, 'adminIndex'])->middleware('permission:manage_pengumuman,view_dashboard_kepsek');
    Route::get('/pengumuman/{id}', [PengumumanController::class, 'adminShow'])->middleware('permission:manage_pengumuman,view_dashboard_kepsek');
    Route::middleware('permission:manage_pengumuman')->group(function () {
        Route::post('/pengumuman', [PengumumanController::class, 'adminStore']);
        Route::put('/pengumuman/{id}', [PengumumanController::class, 'adminUpdate']);
        Route::delete('/pengumuman/{id}', [PengumumanController::class, 'adminDestroy']);
    });

    Route::get('/berita', [BeritaController::class, 'adminIndex'])->middleware('permission:manage_prestasi,view_dashboard_kepsek');
    Route::get('/berita/{id}', [BeritaController::class, 'adminShow'])->middleware('permission:manage_prestasi,view_dashboard_kepsek');
    Route::middleware('permission:manage_prestasi')->group(function () {
        Route::post('/berita', [BeritaController::class, 'adminStore']);
        Route::put('/berita/{id}', [BeritaController::class, 'adminUpdate']);
        Route::delete('/berita/{id}', [BeritaController::class, 'adminDestroy']);
    });

    Route::middleware('permission:manage_absensi_guru')->group(function () {
        Route::get('/absensi-guru', [AbsensiController::class, 'adminGuruIndex']);
        Route::get('/absensi-guru/rekap', [AbsensiController::class, 'adminGuruRekap']);
    });

    Route::middleware('permission:view_laporan')->group(function () {
        Route::get('/laporan', [LaporanController::class, 'index']);
    });

    Route::middleware('permission:manage_all')->group(function () {
        Route::get('/akun', [\App\Http\Controllers\AkunController::class, 'index']);
        Route::post('/akun', [\App\Http\Controllers\AkunController::class, 'store']);
        Route::put('/akun/{id}', [\App\Http\Controllers\AkunController::class, 'update']);
        Route::delete('/akun/{id}', [\App\Http\Controllers\AkunController::class, 'destroy']);

        Route::apiResource('/tahun-ajaran', \App\Http\Controllers\TahunAjaranController::class);
        Route::put('/tahun-ajaran/{id}/activate', [\App\Http\Controllers\TahunAjaranController::class, 'activate']);
        
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
    });

    Route::get('/profil-sekolah', [ProfilSekolahController::class, 'show'])->middleware('permission:manage_all,view_dashboard_kepsek');

    Route::middleware('permission:manage_all')->group(function () {
        Route::put('/profil-sekolah', [ProfilSekolahController::class, 'update']);

        // Settings API
        Route::get('/settings', [\App\Http\Controllers\SettingsController::class, 'index']);
        Route::put('/settings/{key}', [\App\Http\Controllers\SettingsController::class, 'update']);
        Route::post('/settings/bulk', [\App\Http\Controllers\SettingsController::class, 'bulkUpdate']);
    });

    Route::get('/ekskul', [EkskulController::class, 'adminIndex'])->middleware('permission:manage_ekskul,view_dashboard_kepsek');
    Route::get('/ekskul/{id}', [EkskulController::class, 'adminShow'])->middleware('permission:manage_ekskul,view_dashboard_kepsek');
    Route::middleware('permission:manage_ekskul')->group(function () {
        Route::post('/ekskul', [EkskulController::class, 'adminStore']);
        Route::put('/ekskul/{id}', [EkskulController::class, 'adminUpdate']);
        Route::delete('/ekskul/{id}', [EkskulController::class, 'adminDestroy']);
    });
});
