<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pendaftaran extends Model
{
    protected $table = 'pendaftaran';

    protected $primaryKey = 'id_pendaftaran';

    protected $fillable = [
        'id_user',
        'nomor_pendaftaran',
        'no_registrasi',
        'tahun_pelajaran',
        'status_pendaftaran',
        'current_step',
        'submitted_at',
        'verified_at',
        'accepted_at',
        'catatan_admin',
        'ppdb_status',
        'status_kelulusan',
        'nisn',
        'nama_lengkap',
        'tempat_lahir',
        'tgl_lahir',
        'jenis_kelamin',
        'agama',
        'kewarganegaraan',
        'anak_ke',
        'jml_saudara_kandung',
        'jml_saudara_tiri',
        'alamat',
        'no_telp',
        'status_yatim',
        'berat_badan',
        'tinggi_badan',
        'gol_darah',
        'penyakit_diderita',
        'cacat_badan',
        'sekolah_asal',
        'tahun_lulus',
        'no_sttb',
        'pindahan_dari',
        'no_surat_pindah',
        'nama_ayah',
        'nama_ibu',
        'pendidikan_ayah',
        'pendidikan_ibu',
        'pekerjaan_ayah',
        'pekerjaan_ibu',
        'agama_ortu',
        'alamat_ortu',
        'no_hp_ortu',
        'no_hp_ayah',
        'no_hp_ibu',
        'nama_wali',
        'pendidikan_wali',
        'pekerjaan_wali',
        'agama_wali',
        'alamat_wali',
        'hobi',
        'cita_cita',
        'file_ijazah',
        'file_stk',
        'file_pas_photo',
        'file_nisn',
        'file_kk',
        'file_ktp_ortua',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'verified_at' => 'datetime',
            'accepted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function berkas()
    {
        return $this->hasMany(BerkasPendaftaran::class, 'pendaftaran_id', 'id_pendaftaran');
    }

    public function keteranganPribadi(): HasOne
    {
        return $this->hasOne(PendaftaranKeteranganPribadi::class, 'pendaftaran_id', 'id_pendaftaran');
    }

    public function kesehatan(): HasOne
    {
        return $this->hasOne(PendaftaranKesehatan::class, 'pendaftaran_id', 'id_pendaftaran');
    }

    public function pendidikanAsal(): HasOne
    {
        return $this->hasOne(PendaftaranPendidikanAsal::class, 'pendaftaran_id', 'id_pendaftaran');
    }

    public function orangTuaWali(): HasOne
    {
        return $this->hasOne(PendaftaranOrangTuaWali::class, 'pendaftaran_id', 'id_pendaftaran');
    }

    public function kepribadian(): HasOne
    {
        return $this->hasOne(PendaftaranKepribadian::class, 'pendaftaran_id', 'id_pendaftaran');
    }

    public function dokumen(): HasOne
    {
        return $this->hasOne(PendaftaranDokumen::class, 'pendaftaran_id', 'id_pendaftaran');
    }

    public function getStatusAttribute(): string
    {
        return $this->status_pendaftaran ?? $this->ppdb_status ?? 'draft';
    }

    public function isEditable(): bool
    {
        $canonicalEditable = in_array($this->status_pendaftaran ?? 'draft', ['draft', 'revision'], true);
        $legacyEditable = in_array($this->ppdb_status ?? 'draft', ['draft', 'revision', 'revisi'], true);

        return $canonicalEditable && $legacyEditable;
    }
}
