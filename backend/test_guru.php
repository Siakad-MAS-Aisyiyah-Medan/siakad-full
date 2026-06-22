<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $user = \App\Models\User::where('role', 'guru')->first();
    if (!$user) {
        echo "No guru user found\n";
        exit;
    }
    
    $profile = $user->guru;
    if (! $profile) {
        $profile = new \App\Models\Guru(['id_user' => $user->id_user]);
    }
    
    $validated = [
        'nama_guru' => 'Test Guru',
    ];
    
    $profile->fill($validated);
    if (!$profile->nip_nuptk) {
        $profile->nip_nuptk = $user->username ?: '-';
    }
    if (!$profile->jenis_kelamin) {
        $profile->jenis_kelamin = 'L';
    }
    if (!$profile->agama) {
        $profile->agama = '-';
    }
    if (!$profile->alamat) {
        $profile->alamat = '-';
    }
    if (!$profile->no_hp) {
        $profile->no_hp = '-';
    }
    $profile->save();
    echo "Success!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
