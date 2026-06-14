<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->string('label')->nullable();
            $table->string('type')->default('text');
            $table->timestamps();
        });

        // Insert default settings
        $now = now();
        $defaults = [
            // Academic
            ['key' => 'tahun_ajaran_aktif', 'value' => '2026/2027', 'group' => 'academic', 'label' => 'Tahun Ajaran Aktif', 'type' => 'text'],
            ['key' => 'semester_aktif', 'value' => 'Ganjil', 'group' => 'academic', 'label' => 'Semester Aktif', 'type' => 'text'],
            ['key' => 'max_siswa_per_kelas', 'value' => '36', 'group' => 'academic', 'label' => 'Maksimal Siswa per Kelas', 'type' => 'number'],
            ['key' => 'jurusan_ipa_aktif', 'value' => '1', 'group' => 'academic', 'label' => 'Jurusan IPA Aktif', 'type' => 'boolean'],
            ['key' => 'jurusan_ips_aktif', 'value' => '1', 'group' => 'academic', 'label' => 'Jurusan IPS Aktif', 'type' => 'boolean'],
            ['key' => 'jurusan_bahasa_aktif', 'value' => '0', 'group' => 'academic', 'label' => 'Jurusan Bahasa Aktif', 'type' => 'boolean'],
            // PPDB
            ['key' => 'ppdb_status', 'value' => 'Dibuka', 'group' => 'ppdb', 'label' => 'Status PPDB', 'type' => 'text'],
            ['key' => 'ppdb_tanggal_mulai', 'value' => '2026-01-01', 'group' => 'ppdb', 'label' => 'Tanggal Mulai PPDB', 'type' => 'date'],
            ['key' => 'ppdb_tanggal_selesai', 'value' => '2026-06-30', 'group' => 'ppdb', 'label' => 'Tanggal Selesai PPDB', 'type' => 'date'],
        ];

        foreach ($defaults as $default) {
            $default['created_at'] = $now;
            $default['updated_at'] = $now;
            DB::table('system_settings')->insert($default);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
