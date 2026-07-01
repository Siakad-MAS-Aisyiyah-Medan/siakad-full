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
        Schema::create('pendaftaran', function (Blueprint $table) {
            $table->bigIncrements('id_pendaftaran');
            $table->unsignedBigInteger('id_user')->unique();
            $table->string('nomor_pendaftaran', 30)->nullable()->unique();
            $table->string('tahun_pelajaran', 20)->default('2026/2027');
            $table->enum('status_pendaftaran', ['draft', 'revision', 'submitted', 'verified', 'accepted', 'rejected'])->default('draft');
            $table->string('current_step', 50)->nullable();
            $table->string('no_registrasi', 30)->nullable()->unique();
            $table->string('nisn', 20)->nullable();
            $table->string('ppdb_status', 30)->default('draft');
            $table->text('catatan_admin')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->string('nama_lengkap')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('agama')->nullable();
            $table->string('kewarganegaraan')->nullable();
            $table->integer('anak_ke')->nullable();
            $table->integer('jml_saudara_kandung')->nullable();
            $table->integer('jml_saudara_tiri')->nullable();
            $table->text('alamat')->nullable();
            $table->string('no_telp')->nullable();
            $table->enum('status_yatim', ['Yatim', 'Piatu', 'Yatim Piatu', 'Tidak'])->nullable();
            $table->integer('berat_badan')->nullable();
            $table->integer('tinggi_badan')->nullable();
            $table->string('gol_darah')->nullable();
            $table->string('penyakit_diderita')->nullable();
            $table->string('cacat_badan')->nullable();
            $table->string('sekolah_asal')->nullable();
            $table->string('tahun_lulus', 4)->nullable();
            $table->string('no_sttb')->nullable();
            $table->string('pindahan_dari')->nullable();
            $table->string('no_surat_pindah')->nullable();
            $table->string('nama_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->string('pendidikan_ayah')->nullable();
            $table->string('pendidikan_ibu')->nullable();
            $table->string('pekerjaan_ayah')->nullable();
            $table->string('pekerjaan_ibu')->nullable();
            $table->string('agama_ortu')->nullable();
            $table->text('alamat_ortu')->nullable();
            $table->string('no_hp_ortu', 20)->nullable();
            $table->string('no_hp_ayah', 20)->nullable();
            $table->string('no_hp_ibu', 20)->nullable();
            $table->string('nama_wali')->nullable();
            $table->string('pendidikan_wali')->nullable();
            $table->string('pekerjaan_wali')->nullable();
            $table->string('agama_wali')->nullable();
            $table->text('alamat_wali')->nullable();
            $table->string('hobi')->nullable();
            $table->string('cita_cita')->nullable();
            $table->string('file_ijazah')->nullable();
            $table->string('file_stk')->nullable();
            $table->string('file_pas_photo')->nullable();
            $table->string('file_nisn')->nullable();
            $table->string('file_kk')->nullable();
            $table->string('file_ktp_ortua')->nullable();
            $table->enum('status_kelulusan', ['Pending', 'Lulus', 'Tidak Lulus'])->default('Pending');
            $table->timestamps();

            $table->index(['status_pendaftaran', 'tahun_pelajaran'], 'pendaftaran_canonical_status_tahun_index');
            $table->index(['ppdb_status', 'tahun_pelajaran'], 'pendaftaran_status_tahun_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran');
    }
};
