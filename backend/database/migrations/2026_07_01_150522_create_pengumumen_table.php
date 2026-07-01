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
        Schema::create('pengumumen', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('penulis_id')->nullable()->index();
            $table->string('judul');
            $table->string('kategori')->nullable();
            $table->text('isi');
            $table->string('thumbnail')->nullable();
            $table->enum('akses', ['umum', 'internal'])->default('umum');
            $table->date('tanggal_publikasi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengumumen');
    }
};
