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
        Schema::table('nilai', function (Blueprint $table) {
            $table->foreign(['id_guru_input'])->references(['id_user'])->on('users')->onUpdate('restrict')->onDelete('set null');
            $table->foreign(['id_mapel'])->references(['id_mapel'])->on('mata_pelajaran')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['id_user_siswa'])->references(['id_user'])->on('users')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['id_wali_validator'])->references(['id_user'])->on('users')->onUpdate('restrict')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nilai', function (Blueprint $table) {
            $table->dropForeign('nilai_id_guru_input_foreign');
            $table->dropForeign('nilai_id_mapel_foreign');
            $table->dropForeign('nilai_id_user_siswa_foreign');
            $table->dropForeign('nilai_id_wali_validator_foreign');
        });
    }
};
