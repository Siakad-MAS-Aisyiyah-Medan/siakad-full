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
        Schema::create('kepala_sekolah', function (Blueprint $table) {
            $table->bigIncrements('id_kepsek');
            $table->unsignedBigInteger('id_user')->index('kepala_sekolah_id_user_foreign');
            $table->string('nip')->unique();
            $table->string('nama_kepsek');
            $table->string('no_hp');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kepala_sekolah');
    }
};
