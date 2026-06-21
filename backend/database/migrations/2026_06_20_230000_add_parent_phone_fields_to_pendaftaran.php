<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pendaftaran', function (Blueprint $table) {
            $table->string('no_hp_ayah', 20)->nullable()->after('no_hp_ortu');
            $table->string('no_hp_ibu', 20)->nullable()->after('no_hp_ayah');
        });
    }

    public function down(): void
    {
        Schema::table('pendaftaran', function (Blueprint $table) {
            $table->dropColumn(['no_hp_ayah', 'no_hp_ibu']);
        });
    }
};
