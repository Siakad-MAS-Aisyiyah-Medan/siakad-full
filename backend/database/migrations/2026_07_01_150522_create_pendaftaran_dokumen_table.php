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
        Schema::create('pendaftaran_dokumen', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->string('file_ijazah')->nullable();
            $table->string('file_stk')->nullable();
            $table->string('file_pas_photo')->nullable();
            $table->string('file_nisn')->nullable();
            $table->string('file_kk')->nullable();
            $table->string('file_ktp_ortua')->nullable();
            $table->text('catatan_dokumen')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_dokumen');
    }
};
