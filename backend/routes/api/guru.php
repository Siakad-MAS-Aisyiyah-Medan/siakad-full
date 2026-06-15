<?php

use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\NilaiController;
use App\Http\Controllers\LaporanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'permission:view_jadwal_mengajar'])->group(function () {
    Route::get('/guru/jadwal', [JadwalController::class, 'adminIndex']);
});

Route::middleware(['auth:sanctum', 'permission:manage_absensi_siswa'])->group(function () {
    Route::get('/guru/absensi/siswa/form', [AbsensiController::class, 'guruFormData']);
    Route::post('/guru/absensi/siswa/bulk', [AbsensiController::class, 'guruBulkStore']);
    Route::get('/guru/absensi/siswa/rekap', [AbsensiController::class, 'guruRekapSiswa']);
});

Route::middleware(['auth:sanctum', 'permission:manage_nilai_siswa'])->group(function () {
    Route::get('/guru/nilai/form', [NilaiController::class, 'guruFormData']);
    Route::post('/guru/nilai/bulk', [NilaiController::class, 'guruBulkStore']);
});

Route::middleware(['auth:sanctum', 'permission:manage_absensi_siswa,manage_nilai_siswa'])->group(function () {
    Route::get('/guru/laporan', [LaporanController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'permission:view_dashboard_guru'])->group(function () {
    Route::post('/guru/absensi/self/check-in', [AbsensiController::class, 'guruCheckIn']);
    Route::post('/guru/absensi/self/check-out', [AbsensiController::class, 'guruCheckOut']);
    Route::get('/guru/absensi/self/riwayat', [AbsensiController::class, 'guruRiwayatGuru']);
});
