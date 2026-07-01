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
        Schema::create('profil_sekolahs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nama_sekolah');
            $table->string('npsn', 20)->nullable();
            $table->string('akreditasi', 10)->nullable();
            $table->string('hero_subtitle')->nullable();
            $table->string('hero_image')->nullable();
            $table->text('tentang_kami')->nullable();
            $table->string('alamat')->nullable();
            $table->string('no_hp')->nullable();
            $table->string('email')->nullable();
            $table->text('kata_sambutan')->nullable();
            $table->string('nama_kepsek')->nullable();
            $table->string('foto_kepsek')->nullable();
            $table->text('visi')->nullable();
            $table->text('misi')->nullable();
            $table->timestamps();
            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('youtube')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_sekolahs');
    }
};
