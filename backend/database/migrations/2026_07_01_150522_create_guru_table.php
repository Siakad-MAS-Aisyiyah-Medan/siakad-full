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
        Schema::create('guru', function (Blueprint $table) {
            $table->bigIncrements('id_guru');
            $table->unsignedBigInteger('id_user')->index('guru_id_user_foreign');
            $table->string('nip')->unique();
            $table->string('nama_guru');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('agama');
            $table->text('alamat');
            $table->string('no_hp');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->string('foto')->nullable();
            $table->timestamps();
            $table->date('tgl_lahir')->nullable();

            $table->unique(['id_user']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guru');
    }
};
