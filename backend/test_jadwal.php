<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = \App\Models\User::where('role', 'guru')->first();
if (!$user) {
    die("No guru\n");
}
$kelas = \App\Models\Kelas::firstOrCreate(['nama_kelas' => 'X-A'], ['tingkat' => 'X', 'id_wali_kelas' => $user->id_user, 'tahun_ajaran' => '2025/2026', 'status' => 'aktif', 'jurusan' => 'IPA']);
$mapel = \App\Models\Mapel::firstOrCreate(['nama_mapel' => 'Matematika'], ['id_guru' => $user->id_user, 'tingkat' => 'X']);
$mapel->kelas()->syncWithoutDetaching([$kelas->id_kelas]);

$tahunAjaran = '2025/2026';
$semester = 'Ganjil';

try {
    $items = \App\Models\Mapel::with(['kelas'])
        ->where('id_guru', $user->id_user)
        ->get()
        ->map(function ($mapel) use ($tahunAjaran, $semester) {
            return $mapel->kelas->map(function ($kelas) use ($mapel, $tahunAjaran, $semester) {
                return [
                    'id_mapel' => $mapel->id_mapel,
                    'id_kelas' => $kelas->id_kelas,
                    'tahun_ajaran' => $tahunAjaran,
                    'semester' => $semester,
                    'mapel' => [
                        'id_mapel' => $mapel->id_mapel,
                        'nama_mapel' => $mapel->nama_mapel,
                        'tingkat' => $mapel->tingkat,
                    ],
                    'kelas' => [
                        'id_kelas' => $kelas->id_kelas,
                        'nama_kelas' => $kelas->nama_kelas,
                        'tingkat' => $kelas->tingkat,
                    ],
                ];
            });
        })
        ->flatten(1)
        ->values()
        ->all();

    print_r($items);
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
die();

$tahunAjaran = \App\Models\TahunAjaran::where('status', 'aktif')->first()?->tahun_ajaran ?? '2025/2026';
$semester = (int) date('n') >= 7 || (int) date('n') <= 12 ? 'Ganjil' : 'Genap';

try {
    $items = \App\Models\Mapel::with(['kelas'])
        ->where('id_guru', $user->id_user)
        ->get()
        ->map(function ($mapel) use ($tahunAjaran, $semester) {
            return $mapel->kelas->map(function ($kelas) use ($mapel, $tahunAjaran, $semester) {
                return [
                    'id_mapel' => $mapel->id_mapel,
                    'id_kelas' => $kelas->id_kelas,
                    'tahun_ajaran' => $tahunAjaran,
                    'semester' => $semester,
                    'mapel' => [
                        'id_mapel' => $mapel->id_mapel,
                        'nama_mapel' => $mapel->nama_mapel,
                        'tingkat' => $mapel->tingkat,
                    ],
                    'kelas' => [
                        'id_kelas' => $kelas->id_kelas,
                        'nama_kelas' => $kelas->nama_kelas,
                        'tingkat' => $kelas->tingkat,
                    ],
                ];
            });
        })
        ->flatten(1)
        ->values()
        ->all();

    print_r($items);
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
