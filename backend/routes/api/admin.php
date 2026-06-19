<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\MapelController;
use App\Http\Controllers\MuridController;
use App\Http\Controllers\NilaiController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\ProfilSekolahController;
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

    // Legacy PPDB routes (redirect ke modul baru - tetap untuk kompatibilitas)
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

    Route::get('/kelas', [KelasController::class, 'index'])->middleware('permission:manage_kelas,view_data_kelas,view_kelas_diajar,view_kelas_pribadi');
    Route::get('/kelas/stats', [KelasController::class, 'stats'])->middleware('permission:manage_kelas,view_data_kelas,view_kelas_diajar,view_kelas_pribadi');
    Route::middleware('permission:manage_kelas')->group(function () {
        Route::post('/kelas', [KelasController::class, 'store']);
        Route::put('/kelas/{id}', [KelasController::class, 'update']);
        Route::delete('/kelas/{id}', [KelasController::class, 'destroy']);
    });

    Route::get('/mapel', [MapelController::class, 'index'])->middleware('permission:manage_mapel,view_mapel,view_mapel_diampu');
    Route::middleware('permission:manage_mapel')->group(function () {
        Route::post('/mapel', [MapelController::class, 'store']);
        Route::put('/mapel/{id}', [MapelController::class, 'update']);
        Route::delete('/mapel/{id}', [MapelController::class, 'destroy']);
    });

    Route::get('/pengumuman', [PengumumanController::class, 'adminIndex'])->middleware('permission:manage_pengumuman,view_pengumuman');
    Route::get('/pengumuman/{id}', [PengumumanController::class, 'adminShow'])->middleware('permission:manage_pengumuman,view_pengumuman');
    Route::middleware('permission:manage_pengumuman')->group(function () {
        Route::post('/pengumuman', [PengumumanController::class, 'adminStore']);
        Route::put('/pengumuman/{id}', [PengumumanController::class, 'adminUpdate']);
        Route::delete('/pengumuman/{id}', [PengumumanController::class, 'adminDestroy']);
    });

    Route::middleware('permission:manage_users')->group(function () {
        Route::get('/akun', [\App\Http\Controllers\AkunController::class, 'index']);
        Route::post('/akun', [\App\Http\Controllers\AkunController::class, 'store']);
        Route::put('/akun/{id}', [\App\Http\Controllers\AkunController::class, 'update']);
        Route::delete('/akun/{id}', [\App\Http\Controllers\AkunController::class, 'destroy']);
    });

    Route::middleware('permission:view_transkrip_murid')->group(function () {
        Route::get('/admin/transkrip-akademik/{idUserSiswa}/raport', [NilaiController::class, 'adminStudentRaport']);
    });

    Route::middleware('permission:manage_tahun_ajaran')->group(function () {
        Route::apiResource('/tahun-ajaran', \App\Http\Controllers\TahunAjaranController::class);
        Route::put('/tahun-ajaran/{id}/activate', [\App\Http\Controllers\TahunAjaranController::class, 'activate']);
    });

    Route::get('/profil-sekolah', [ProfilSekolahController::class, 'show'])->middleware('permission:manage_profil_sekolah,view_dashboard_kepsek');

    Route::middleware('permission:manage_profil_sekolah')->group(function () {
        Route::put('/profil-sekolah', [ProfilSekolahController::class, 'update']);
    });

    Route::middleware('permission:manage_pengaturan_akun')->group(function () {
        Route::get('/settings', [\App\Http\Controllers\SettingsController::class, 'index']);
        Route::put('/settings/{key}', [\App\Http\Controllers\SettingsController::class, 'update']);
        Route::post('/settings/bulk', [\App\Http\Controllers\SettingsController::class, 'bulkUpdate']);
    });
});
