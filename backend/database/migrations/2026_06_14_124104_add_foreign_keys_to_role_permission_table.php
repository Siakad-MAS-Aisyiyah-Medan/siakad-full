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
        Schema::table('role_permission', function (Blueprint $table) {
            $table->foreign(['id_permission'])->references(['id_permission'])->on('permissions')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['id_role'])->references(['id_role'])->on('roles')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('role_permission', function (Blueprint $table) {
            $table->dropForeign('role_permission_id_permission_foreign');
            $table->dropForeign('role_permission_id_role_foreign');
        });
    }
};
