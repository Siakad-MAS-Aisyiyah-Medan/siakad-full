<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\NilaiController;
use App\Http\Controllers\LaporanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:view_laporan'])->group(function () {
    Route::get('/kepsek/laporan', [LaporanController::class, 'index']);
    Route::get('/kepsek/laporan/absensi-siswa', [AbsensiController::class, 'kepsekSiswa']);
    Route::get('/kepsek/laporan/absensi-guru', [AbsensiController::class, 'kepsekGuru']);
    Route::get('/kepsek/laporan/nilai', [NilaiController::class, 'kepsekIndex']);
});
