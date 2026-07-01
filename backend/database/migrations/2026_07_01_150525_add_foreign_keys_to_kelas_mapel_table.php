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
        Schema::table('kelas_mapel', function (Blueprint $table) {
            $table->foreign(['id_kelas'])->references(['id_kelas'])->on('kelas')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['id_mapel'])->references(['id_mapel'])->on('mata_pelajaran')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kelas_mapel', function (Blueprint $table) {
            $table->dropForeign('kelas_mapel_id_kelas_foreign');
            $table->dropForeign('kelas_mapel_id_mapel_foreign');
        });
    }
};
