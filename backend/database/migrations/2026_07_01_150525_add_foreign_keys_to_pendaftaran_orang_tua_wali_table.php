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
        Schema::table('pendaftaran_orang_tua_wali', function (Blueprint $table) {
            $table->foreign(['pendaftaran_id'])->references(['id_pendaftaran'])->on('pendaftaran')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran_orang_tua_wali', function (Blueprint $table) {
            $table->dropForeign('pendaftaran_orang_tua_wali_pendaftaran_id_foreign');
        });
    }
};
