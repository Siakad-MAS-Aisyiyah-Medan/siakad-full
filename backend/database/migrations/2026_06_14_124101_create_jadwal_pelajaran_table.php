<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jadwal_pelajaran', function (Blueprint $table) {
            $table->bigIncrements('id_jadwal');
            $table->unsignedBigInteger('id_kelas')->index('jadwal_pelajaran_id_kelas_foreign');
            $table->unsignedBigInteger('id_mapel')->index('jadwal_pelajaran_id_mapel_foreign');
            $table->unsignedBigInteger('id_guru')->index('jadwal_pelajaran_id_guru_foreign');
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'])->index('jadwal_pelajaran_hari_jam_mulai_jam_selesai_index');
            $table->unsignedBigInteger('id_waktu')->index('jadwal_pelajaran_id_waktu_foreign');
            $table->string('ruangan')->nullable();
            $table->string('tahun_ajaran');
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_pelajaran');
    }
};
