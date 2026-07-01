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
        Schema::create('kelas', function (Blueprint $table) {
            $table->bigIncrements('id_kelas');
            $table->string('nama_kelas');
            $table->enum('tingkat', ['X', 'XI', 'XII'])->nullable();
            $table->enum('jurusan', ['IPA', 'IPS'])->nullable();
            $table->integer('kapasitas_maksimal')->default(36);
            $table->string('ruangan')->nullable();
            $table->unsignedBigInteger('id_wali_kelas')->nullable()->index('kelas_id_wali_kelas_foreign');
            $table->string('tahun_ajaran', 20)->nullable();
            $table->string('status', 20)->default('aktif');
            $table->timestamps();

            $table->unique(['nama_kelas', 'tahun_ajaran'], 'kelas_nama_tahun_unique');
            $table->index(['tingkat', 'jurusan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
