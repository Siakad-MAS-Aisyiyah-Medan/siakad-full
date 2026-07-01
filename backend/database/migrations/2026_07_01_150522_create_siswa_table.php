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
        Schema::create('siswa', function (Blueprint $table) {
            $table->bigIncrements('id_siswa');
            $table->unsignedBigInteger('id_kelas')->nullable()->index('siswa_id_kelas_foreign');
            $table->unsignedBigInteger('id_user')->unique();
            $table->string('nisn')->unique();
            $table->string('nis')->unique();
            $table->string('nama_siswa');
            $table->string('tempat_lahir');
            $table->date('tgl_lahir');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('agama');
            $table->text('alamat');
            $table->string('nama_wali');
            $table->string('no_hp_wali');
            $table->string('no_hp', 20)->nullable();
            $table->unsignedSmallInteger('tahun_masuk')->nullable();
            $table->unsignedSmallInteger('tahun_lulus')->nullable();
            $table->timestamps();
            $table->string('foto')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
