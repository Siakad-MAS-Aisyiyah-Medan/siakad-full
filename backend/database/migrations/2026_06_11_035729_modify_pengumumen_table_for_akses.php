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
        Schema::table('pengumumen', function (Blueprint $table) {
            if (Schema::hasColumn('pengumumen', 'is_published')) {
                $table->dropColumn('is_published');
            }
            if (!Schema::hasColumn('pengumumen', 'akses')) {
                $table->enum('akses', ['umum', 'internal'])->default('umum')->after('isi');
            }
            if (!Schema::hasColumn('pengumumen', 'penulis_id')) {
                $table->foreignId('penulis_id')->nullable()->after('id')->constrained('users', 'id_user')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengumumen', function (Blueprint $table) {
            $table->boolean('is_published')->default(true);
            $table->dropForeign(['penulis_id']);
            $table->dropColumn(['akses', 'penulis_id']);
        });
    }
};
