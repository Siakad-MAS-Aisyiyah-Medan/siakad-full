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
        Schema::table('kelas', function (Blueprint $table) {
            $table->enum('tingkat', ['X', 'XI', 'XII'])->nullable()->after('nama_kelas');
            $table->enum('jurusan', ['IPA', 'IPS'])->nullable()->after('tingkat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            $table->dropColumn(['tingkat', 'jurusan']);
        });
    }
};
