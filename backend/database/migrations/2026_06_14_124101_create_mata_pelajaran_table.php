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
        Schema::create('mata_pelajaran', function (Blueprint $table) {
            $table->bigIncrements('id_mapel');
            $table->string('nama_mapel');
            $table->enum('tingkat', ['X', 'XI', 'XII'])->default('X');
            $table->string('kelompok_mapel')->nullable();
            $table->unsignedBigInteger('id_guru')->nullable()->index('mata_pelajaran_id_guru_foreign');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mata_pelajaran');
    }
};
