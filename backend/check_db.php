<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
print_r(\App\Models\Nilai::latest('updated_at')->limit(5)->get(['id_nilai', 'nilai_tugas', 'nilai_akhir', 'predikat'])->toArray());
