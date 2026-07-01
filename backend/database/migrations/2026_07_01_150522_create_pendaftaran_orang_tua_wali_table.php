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
        Schema::create('pendaftaran_orang_tua_wali', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->string('nama_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->string('pendidikan_ayah', 100)->nullable();
            $table->string('pendidikan_ibu', 100)->nullable();
            $table->string('pekerjaan_ayah', 100)->nullable();
            $table->string('pekerjaan_ibu', 100)->nullable();
            $table->string('agama_ortu', 50)->nullable();
            $table->text('alamat_ortu')->nullable();
            $table->string('no_hp_ortu', 20)->nullable();
            $table->string('no_hp_ayah', 20)->nullable();
            $table->string('no_hp_ibu', 20)->nullable();
            $table->string('nama_wali')->nullable();
            $table->string('pendidikan_wali', 100)->nullable();
            $table->string('pekerjaan_wali', 100)->nullable();
            $table->string('agama_wali', 50)->nullable();
            $table->text('alamat_wali')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_orang_tua_wali');
    }
};
