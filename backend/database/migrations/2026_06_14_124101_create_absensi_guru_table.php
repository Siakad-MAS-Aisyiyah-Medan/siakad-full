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
        Schema::create('absensi_guru', function (Blueprint $table) {
            $table->bigIncrements('id_absensi_guru');
            $table->unsignedBigInteger('id_user_guru');
            $table->date('tanggal');
            $table->time('jam_masuk')->nullable();
            $table->time('jam_pulang')->nullable();
            $table->enum('status', ['H', 'A', 'I', 'S', 'T'])->default('H');
            $table->text('keterangan')->nullable();
            $table->string('tahun_ajaran', 20)->nullable();
            $table->enum('semester', ['Ganjil', 'Genap'])->nullable();
            $table->timestamps();

            $table->unique(['id_user_guru', 'tanggal'], 'absensi_guru_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensi_guru');
    }
};
