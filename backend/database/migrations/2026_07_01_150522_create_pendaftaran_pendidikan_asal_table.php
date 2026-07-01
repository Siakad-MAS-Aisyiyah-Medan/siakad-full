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
        Schema::create('pendaftaran_pendidikan_asal', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->string('sekolah_asal')->nullable();
            $table->string('tahun_lulus', 4)->nullable();
            $table->string('no_sttb', 100)->nullable();
            $table->string('pindahan_dari')->nullable();
            $table->string('no_surat_pindah', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_pendidikan_asal');
    }
};
