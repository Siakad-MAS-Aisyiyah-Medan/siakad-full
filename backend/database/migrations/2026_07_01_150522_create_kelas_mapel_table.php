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
        Schema::create('kelas_mapel', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_kelas');
            $table->unsignedBigInteger('id_mapel')->index('kelas_mapel_id_mapel_foreign');
            $table->timestamps();

            $table->unique(['id_kelas', 'id_mapel'], 'kelas_mapel_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas_mapel');
    }
};
