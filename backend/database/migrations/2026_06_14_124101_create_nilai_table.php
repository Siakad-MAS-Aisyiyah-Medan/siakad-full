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
        Schema::create('nilai', function (Blueprint $table) {
            $table->bigIncrements('id_nilai');
            $table->unsignedBigInteger('id_user_siswa');
            $table->unsignedBigInteger('id_mapel')->index('nilai_id_mapel_foreign');
            $table->unsignedBigInteger('id_guru_input')->nullable()->index('nilai_id_guru_input_foreign');
            $table->unsignedTinyInteger('nilai_tugas')->nullable();
            $table->unsignedTinyInteger('nilai_uts')->nullable();
            $table->unsignedTinyInteger('nilai_uas')->nullable();
            $table->unsignedTinyInteger('nilai_praktik')->nullable();
            $table->unsignedTinyInteger('nilai_sikap')->nullable();
            $table->unsignedTinyInteger('nilai_akhir')->nullable();
            $table->string('predikat', 2)->nullable();
            $table->boolean('validated_by_wali')->default(false);
            $table->unsignedBigInteger('id_wali_validator')->nullable()->index('nilai_id_wali_validator_foreign');
            $table->timestamp('validated_at')->nullable();
            $table->integer('nilai_angka')->nullable();
            $table->string('semester');
            $table->string('tahun_ajaran');
            $table->timestamps();

            $table->unique(['id_user_siswa', 'id_mapel', 'semester', 'tahun_ajaran'], 'nilai_siswa_mapel_semester_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai');
    }
};
