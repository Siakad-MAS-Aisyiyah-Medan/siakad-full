<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\NilaiController;
use App\Http\Controllers\LaporanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:view_jadwal_siswa'])->group(function () {
    Route::get('/siswa/jadwal', [JadwalController::class, 'adminIndex']);
});

Route::middleware(['auth:sanctum', 'permission:view_absensi_pribadi'])->group(function () {
    Route::get('/siswa/absensi', [AbsensiController::class, 'siswaIndex']);
});

Route::middleware(['auth:sanctum', 'permission:view_nilai_pribadi'])->group(function () {
    Route::get('/siswa/nilai', [NilaiController::class, 'siswaIndex']);
    Route::get('/siswa/nilai/raport', [NilaiController::class, 'siswaRaport']);
});

Route::middleware(['auth:sanctum', 'permission:view_absensi_pribadi,view_nilai_pribadi'])->group(function () {
    Route::get('/siswa/laporan', [LaporanController::class, 'index']);
});
