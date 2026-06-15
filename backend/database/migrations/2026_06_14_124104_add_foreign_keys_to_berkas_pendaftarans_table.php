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
        Schema::table('berkas_pendaftarans', function (Blueprint $table) {
            $table->foreign(['pendaftaran_id'])->references(['id_pendaftaran'])->on('pendaftaran')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berkas_pendaftarans', function (Blueprint $table) {
            $table->dropForeign('berkas_pendaftarans_pendaftaran_id_foreign');
        });
    }
};
