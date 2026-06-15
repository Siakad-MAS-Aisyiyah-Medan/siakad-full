<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\NilaiController;
use App\Http\Controllers\LaporanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:view_absensi_kelas'])->group(function () {
    Route::get('/wali/absensi/rekap', [AbsensiController::class, 'waliRekapKelas']);
});

Route::middleware(['auth:sanctum', 'permission:validate_nilai'])->group(function () {
    Route::get('/wali/nilai/leger', [NilaiController::class, 'waliLeger']);
    Route::patch('/wali/nilai/validate', [NilaiController::class, 'waliValidateNilai']);
});

Route::middleware(['auth:sanctum', 'permission:view_absensi_kelas'])->group(function () {
    Route::get('/wali/laporan', [LaporanController::class, 'index']);
});
