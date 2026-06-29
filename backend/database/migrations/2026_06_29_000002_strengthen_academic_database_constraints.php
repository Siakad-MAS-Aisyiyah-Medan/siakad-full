<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('admin', function (Blueprint $table) {
            $table->unique('id_user', 'admin_id_user_unique');
        });

        Schema::table('guru', function (Blueprint $table) {
            $table->unique('id_user', 'guru_id_user_unique');
        });

        Schema::table('kepala_sekolah', function (Blueprint $table) {
            $table->unique('id_user', 'kepala_sekolah_id_user_unique');
        });

        Schema::table('kelas', function (Blueprint $table) {
            $table->unique(['nama_kelas', 'tahun_ajaran'], 'kelas_nama_tahun_unique');
            $table->index(['tingkat', 'jurusan'], 'kelas_tingkat_jurusan_index');
        });

        Schema::table('mata_pelajaran', function (Blueprint $table) {
            $table->unique(['nama_mapel', 'tingkat'], 'mapel_nama_tingkat_unique');
            $table->index(['id_guru', 'tingkat'], 'mapel_guru_tingkat_index');
        });

        Schema::table('kelas_mapel', function (Blueprint $table) {
            $table->unique(['id_kelas', 'id_mapel'], 'kelas_mapel_unique');
        });

        Schema::table('waktu_pelajaran', function (Blueprint $table) {
            $table->unique(['jam_mulai', 'jam_selesai', 'tipe'], 'waktu_pelajaran_slot_unique');
        });

        Schema::table('jadwal_pelajaran', function (Blueprint $table) {
            $table->unique(['id_kelas', 'hari', 'id_waktu', 'tahun_ajaran', 'semester'], 'jadwal_kelas_slot_unique');
            $table->unique(['id_guru', 'hari', 'id_waktu', 'tahun_ajaran', 'semester'], 'jadwal_guru_slot_unique');
            $table->index(['id_mapel', 'tahun_ajaran', 'semester'], 'jadwal_mapel_periode_index');
        });

        Schema::table('tahun_ajarans', function (Blueprint $table) {
            $table->unique(['tahun_ajaran', 'semester'], 'tahun_ajaran_semester_unique');
            $table->index('status', 'tahun_ajarans_status_index');
        });

        Schema::table('pendaftaran', function (Blueprint $table) {
            $table->index(['ppdb_status', 'tahun_pelajaran'], 'pendaftaran_status_tahun_index');
            $table->index(['status_pendaftaran', 'tahun_pelajaran'], 'pendaftaran_canonical_status_tahun_index');
        });

        Schema::table('berkas_pendaftarans', function (Blueprint $table) {
            $table->index('status_verifikasi', 'berkas_pendaftaran_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('berkas_pendaftarans', function (Blueprint $table) {
            $table->dropIndex('berkas_pendaftaran_status_index');
        });

        Schema::table('pendaftaran', function (Blueprint $table) {
            $table->dropIndex('pendaftaran_status_tahun_index');
            $table->dropIndex('pendaftaran_canonical_status_tahun_index');
        });

        Schema::table('tahun_ajarans', function (Blueprint $table) {
            $table->dropUnique('tahun_ajaran_semester_unique');
            $table->dropIndex('tahun_ajarans_status_index');
        });

        Schema::table('jadwal_pelajaran', function (Blueprint $table) {
            $table->dropUnique('jadwal_kelas_slot_unique');
            $table->dropUnique('jadwal_guru_slot_unique');
            $table->dropIndex('jadwal_mapel_periode_index');
        });

        Schema::table('waktu_pelajaran', function (Blueprint $table) {
            $table->dropUnique('waktu_pelajaran_slot_unique');
        });

        Schema::table('kelas_mapel', function (Blueprint $table) {
            $table->dropUnique('kelas_mapel_unique');
        });

        Schema::table('mata_pelajaran', function (Blueprint $table) {
            $table->dropUnique('mapel_nama_tingkat_unique');
            $table->dropIndex('mapel_guru_tingkat_index');
        });

        Schema::table('kelas', function (Blueprint $table) {
            $table->dropUnique('kelas_nama_tahun_unique');
            $table->dropIndex('kelas_tingkat_jurusan_index');
        });

        Schema::table('kepala_sekolah', function (Blueprint $table) {
            $table->dropUnique('kepala_sekolah_id_user_unique');
        });

        Schema::table('guru', function (Blueprint $table) {
            $table->dropUnique('guru_id_user_unique');
        });

        Schema::table('admin', function (Blueprint $table) {
            $table->dropUnique('admin_id_user_unique');
        });
    }
};
