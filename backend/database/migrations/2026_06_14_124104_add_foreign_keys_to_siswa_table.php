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
        Schema::table('siswa', function (Blueprint $table) {
            $table->foreign(['id_kelas'])->references(['id_kelas'])->on('kelas')->onUpdate('restrict')->onDelete('set null');
            $table->foreign(['id_user'])->references(['id_user'])->on('users')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswa', function (Blueprint $table) {
            $table->dropForeign('siswa_id_kelas_foreign');
            $table->dropForeign('siswa_id_user_foreign');
        });
    }
};
