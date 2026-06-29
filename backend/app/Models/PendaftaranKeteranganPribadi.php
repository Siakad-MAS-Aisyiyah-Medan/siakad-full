<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendaftaranKeteranganPribadi extends Model
{
    protected $table = 'pendaftaran_keterangan_pribadi';

    protected $fillable = [
        'pendaftaran_id',
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
    ];

    protected function casts(): array
    {
        return [
            'tgl_lahir' => 'date',
            'anak_ke' => 'integer',
            'jml_saudara_kandung' => 'integer',
            'jml_saudara_tiri' => 'integer',
        ];
    }

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class, 'pendaftaran_id', 'id_pendaftaran');
    }
}
