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
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->text('alamat')->nullable();
            $table->string('foto')->nullable();

            $table->unique(['id_user']);
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
