<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admin', function (Blueprint $table) {
            $table->string('foto')->nullable();
        });

        Schema::table('kepala_sekolah', function (Blueprint $table) {
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->text('alamat')->nullable();
            $table->string('foto')->nullable();
        });

        Schema::table('guru', function (Blueprint $table) {
            $table->date('tgl_lahir')->nullable();
        });

        Schema::table('siswa', function (Blueprint $table) {
            $table->string('foto')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('siswa', fn (Blueprint $table) => $table->dropColumn('foto'));
        Schema::table('guru', fn (Blueprint $table) => $table->dropColumn('tgl_lahir'));
        Schema::table('kepala_sekolah', function (Blueprint $table) {
            $table->dropColumn(['jenis_kelamin', 'tgl_lahir', 'alamat', 'foto']);
        });
        Schema::table('admin', fn (Blueprint $table) => $table->dropColumn('foto'));
    }
};
