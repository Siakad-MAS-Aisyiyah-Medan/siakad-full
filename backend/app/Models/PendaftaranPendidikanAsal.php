<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendaftaranPendidikanAsal extends Model
{
    protected $table = 'pendaftaran_pendidikan_asal';

    protected $fillable = [
        'pendaftaran_id',
        'sekolah_asal',
        'tahun_lulus',
        'no_sttb',
        'pindahan_dari',
        'no_surat_pindah',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class, 'pendaftaran_id', 'id_pendaftaran');
    }
}
