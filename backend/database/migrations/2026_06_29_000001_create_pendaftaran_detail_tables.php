<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pendaftaran_keterangan_pribadi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->string('nisn', 20)->nullable()->index();
            $table->string('nama_lengkap');
            $table->string('tempat_lahir', 100)->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('agama', 50)->nullable();
            $table->string('kewarganegaraan', 50)->nullable();
            $table->unsignedTinyInteger('anak_ke')->nullable();
            $table->unsignedTinyInteger('jml_saudara_kandung')->nullable();
            $table->unsignedTinyInteger('jml_saudara_tiri')->nullable();
            $table->text('alamat')->nullable();
            $table->string('no_telp', 20)->nullable();
            $table->enum('status_yatim', ['Yatim', 'Piatu', 'Yatim Piatu', 'Tidak'])->nullable();
            $table->timestamps();

            $table->foreign('pendaftaran_id')
                ->references('id_pendaftaran')
                ->on('pendaftaran')
                ->cascadeOnDelete();
        });

        Schema::create('pendaftaran_kesehatan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->unsignedSmallInteger('berat_badan')->nullable();
            $table->unsignedSmallInteger('tinggi_badan')->nullable();
            $table->string('gol_darah', 5)->nullable();
            $table->string('penyakit_diderita')->nullable();
            $table->string('cacat_badan')->nullable();
            $table->timestamps();

            $table->foreign('pendaftaran_id')
                ->references('id_pendaftaran')
                ->on('pendaftaran')
                ->cascadeOnDelete();
        });

        Schema::create('pendaftaran_pendidikan_asal', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->string('sekolah_asal')->nullable();
            $table->string('tahun_lulus', 4)->nullable();
            $table->string('no_sttb', 100)->nullable();
            $table->string('pindahan_dari')->nullable();
            $table->string('no_surat_pindah', 100)->nullable();
            $table->timestamps();

            $table->foreign('pendaftaran_id')
                ->references('id_pendaftaran')
                ->on('pendaftaran')
                ->cascadeOnDelete();
        });

        Schema::create('pendaftaran_orang_tua_wali', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->string('nama_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->string('pendidikan_ayah', 100)->nullable();
            $table->string('pendidikan_ibu', 100)->nullable();
            $table->string('pekerjaan_ayah', 100)->nullable();
            $table->string('pekerjaan_ibu', 100)->nullable();
            $table->string('agama_ortu', 50)->nullable();
            $table->text('alamat_ortu')->nullable();
            $table->string('no_hp_ortu', 20)->nullable();
            $table->string('no_hp_ayah', 20)->nullable();
            $table->string('no_hp_ibu', 20)->nullable();
            $table->string('nama_wali')->nullable();
            $table->string('pendidikan_wali', 100)->nullable();
            $table->string('pekerjaan_wali', 100)->nullable();
            $table->string('agama_wali', 50)->nullable();
            $table->text('alamat_wali')->nullable();
            $table->timestamps();

            $table->foreign('pendaftaran_id')
                ->references('id_pendaftaran')
                ->on('pendaftaran')
                ->cascadeOnDelete();
        });

        Schema::create('pendaftaran_kepribadian', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->string('hobi')->nullable();
            $table->string('cita_cita')->nullable();
            $table->timestamps();

            $table->foreign('pendaftaran_id')
                ->references('id_pendaftaran')
                ->on('pendaftaran')
                ->cascadeOnDelete();
        });

        Schema::create('pendaftaran_dokumen', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pendaftaran_id')->unique();
            $table->string('file_ijazah')->nullable();
            $table->string('file_stk')->nullable();
            $table->string('file_pas_photo')->nullable();
            $table->string('file_nisn')->nullable();
            $table->string('file_kk')->nullable();
            $table->string('file_ktp_ortua')->nullable();
            $table->text('catatan_dokumen')->nullable();
            $table->timestamps();

            $table->foreign('pendaftaran_id')
                ->references('id_pendaftaran')
                ->on('pendaftaran')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_dokumen');
        Schema::dropIfExists('pendaftaran_kepribadian');
        Schema::dropIfExists('pendaftaran_orang_tua_wali');
        Schema::dropIfExists('pendaftaran_pendidikan_asal');
        Schema::dropIfExists('pendaftaran_kesehatan');
        Schema::dropIfExists('pendaftaran_keterangan_pribadi');
    }
};
