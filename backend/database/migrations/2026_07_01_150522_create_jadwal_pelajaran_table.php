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
            $table->string('tahun_ajaran');
            $table->enum('semester', ['Ganjil', 'Genap']);
            $table->timestamps();

            $table->index(['id_mapel', 'tahun_ajaran', 'semester'], 'jadwal_mapel_periode_index');
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
