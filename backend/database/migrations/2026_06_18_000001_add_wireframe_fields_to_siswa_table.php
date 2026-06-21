<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('siswa', function (Blueprint $table) {
            if (! Schema::hasColumn('siswa', 'no_hp')) {
                $table->string('no_hp', 20)->nullable()->after('no_hp_wali');
            }
            if (! Schema::hasColumn('siswa', 'tahun_masuk')) {
                $table->unsignedSmallInteger('tahun_masuk')->nullable()->after('no_hp');
            }
            if (! Schema::hasColumn('siswa', 'tahun_lulus')) {
                $table->unsignedSmallInteger('tahun_lulus')->nullable()->after('tahun_masuk');
            }
        });
    }

    public function down(): void
    {
        Schema::table('siswa', function (Blueprint $table) {
            if (Schema::hasColumn('siswa', 'tahun_lulus')) {
                $table->dropColumn('tahun_lulus');
            }
            if (Schema::hasColumn('siswa', 'tahun_masuk')) {
                $table->dropColumn('tahun_masuk');
            }
            if (Schema::hasColumn('siswa', 'no_hp')) {
                $table->dropColumn('no_hp');
            }
        });
    }
};
