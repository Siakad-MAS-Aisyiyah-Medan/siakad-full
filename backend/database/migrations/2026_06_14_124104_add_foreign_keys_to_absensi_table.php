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
        Schema::table('absensi', function (Blueprint $table) {
            $table->foreign(['id_guru_pencatat'])->references(['id_user'])->on('users')->onUpdate('restrict')->onDelete('set null');
            $table->foreign(['id_jadwal'])->references(['id_jadwal'])->on('jadwal_pelajaran')->onUpdate('restrict')->onDelete('set null');
            $table->foreign(['id_kelas'])->references(['id_kelas'])->on('kelas')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['id_mapel'])->references(['id_mapel'])->on('mata_pelajaran')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['id_user_siswa'])->references(['id_user'])->on('users')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('absensi', function (Blueprint $table) {
            $table->dropForeign('absensi_id_guru_pencatat_foreign');
            $table->dropForeign('absensi_id_jadwal_foreign');
            $table->dropForeign('absensi_id_kelas_foreign');
            $table->dropForeign('absensi_id_mapel_foreign');
            $table->dropForeign('absensi_id_user_siswa_foreign');
        });
    }
};
