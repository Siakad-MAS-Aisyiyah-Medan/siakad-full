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
        Schema::create('waktu_pelajaran', function (Blueprint $table) {
            $table->bigIncrements('id_waktu');
            $table->integer('jam_ke')->nullable()->comment('1, 2, 3... null jika tipe=istirahat');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->enum('tipe', ['belajar', 'istirahat'])->default('belajar');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waktu_pelajaran');
    }
};
