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
        Schema::create('ekstrakurikuler', function (Blueprint $table) {
            $table->bigIncrements('id_ekskul');
            $table->string('nama_ekskul');
            $table->text('deskripsi')->nullable();
            $table->unsignedBigInteger('id_pembina')->nullable()->index('ekstrakurikuler_id_pembina_foreign');
            $table->string('hari')->nullable();
            $table->string('jam')->nullable();
            $table->string('lokasi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ekstrakurikuler');
    }
};
