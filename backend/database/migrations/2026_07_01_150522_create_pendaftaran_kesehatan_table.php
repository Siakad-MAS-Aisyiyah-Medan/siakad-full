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
        Schema::create('pendaftaran_kesehatan', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->unsignedSmallInteger('berat_badan')->nullable();
            $table->unsignedSmallInteger('tinggi_badan')->nullable();
            $table->string('gol_darah', 5)->nullable();
            $table->string('penyakit_diderita')->nullable();
            $table->string('cacat_badan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_kesehatan');
    }
};
