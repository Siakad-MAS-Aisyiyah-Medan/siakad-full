<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendaftaranOrangTuaWali extends Model
{
    protected $table = 'pendaftaran_orang_tua_wali';

    protected $fillable = [
        'pendaftaran_id',
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
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class, 'pendaftaran_id', 'id_pendaftaran');
    }
}
