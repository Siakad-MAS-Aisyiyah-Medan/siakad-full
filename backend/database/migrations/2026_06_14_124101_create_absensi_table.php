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
        Schema::create('absensi', function (Blueprint $table) {
            $table->bigIncrements('id_absensi');
            $table->unsignedBigInteger('id_user_siswa');
            $table->unsignedBigInteger('id_kelas')->index('absensi_id_kelas_foreign');
            $table->unsignedBigInteger('id_mapel')->nullable()->index('absensi_id_mapel_foreign');
            $table->unsignedBigInteger('id_jadwal')->nullable()->index('absensi_id_jadwal_foreign');
            $table->date('tanggal');
            $table->time('jam_mulai')->nullable();
            $table->time('jam_selesai')->nullable();
            $table->enum('status', ['H', 'A', 'I', 'S', 'T']);
            $table->unsignedBigInteger('id_guru_pencatat')->nullable()->index('absensi_id_guru_pencatat_foreign');
            $table->string('tahun_ajaran', 20)->nullable();
            $table->enum('semester', ['Ganjil', 'Genap'])->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->unique(['id_user_siswa', 'id_mapel', 'tanggal', 'jam_mulai'], 'absensi_siswa_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensi');
    }
};
