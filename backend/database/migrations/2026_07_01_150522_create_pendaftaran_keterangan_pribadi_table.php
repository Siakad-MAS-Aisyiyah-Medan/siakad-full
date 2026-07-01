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
        Schema::create('pendaftaran_keterangan_pribadi', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->string('nisn', 20)->nullable()->index();
            $table->string('nama_lengkap');
            $table->string('tempat_lahir', 100)->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('agama', 50)->nullable();
            $table->string('kewarganegaraan', 50)->nullable();
            $table->unsignedTinyInteger('anak_ke')->nullable();
            $table->unsignedTinyInteger('jml_saudara_kandung')->nullable();
            $table->unsignedTinyInteger('jml_saudara_tiri')->nullable();
            $table->text('alamat')->nullable();
            $table->string('no_telp', 20)->nullable();
            $table->enum('status_yatim', ['Yatim', 'Piatu', 'Yatim Piatu', 'Tidak'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_keterangan_pribadi');
    }
};
