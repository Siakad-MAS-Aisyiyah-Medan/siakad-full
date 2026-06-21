<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            if (! Schema::hasColumn('kelas', 'tahun_ajaran')) {
                $table->string('tahun_ajaran', 20)->nullable()->after('id_wali_kelas');
            }

            if (! Schema::hasColumn('kelas', 'status')) {
                $table->string('status', 20)->default('aktif')->after('tahun_ajaran');
            }
        });
    }

    public function down(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            if (Schema::hasColumn('kelas', 'status')) {
                $table->dropColumn('status');
            }

            if (Schema::hasColumn('kelas', 'tahun_ajaran')) {
                $table->dropColumn('tahun_ajaran');
            }
        });
    }
};
