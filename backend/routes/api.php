<?php

require __DIR__.'/api/auth.php';
require __DIR__.'/api/ppdb.php';
require __DIR__.'/api/admin.php';
require __DIR__.'/api/guru.php';
require __DIR__.'/api/siswa.php';
require __DIR__.'/api/kepsek.php';
require __DIR__.'/api/calon-siswa.php';

// Route Publik (Tidak butuh login)
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\EkskulController;

Route::prefix('public')->group(function () {
    Route::get('/pengumuman', [PengumumanController::class, 'publicIndex']);
    Route::get('/pengumuman/{id}', [PengumumanController::class, 'publicShow']);
    Route::get('/berita', [BeritaController::class, 'publicIndex']);
    Route::get('/berita/{id}', [BeritaController::class, 'publicShow']);
    Route::get('/ekskul', [EkskulController::class, 'publicIndex']);
});
