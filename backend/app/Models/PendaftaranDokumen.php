<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendaftaranDokumen extends Model
{
    protected $table = 'pendaftaran_dokumen';

    protected $fillable = [
        'pendaftaran_id',
        'file_ijazah',
        'file_stk',
        'file_pas_photo',
        'file_nisn',
        'file_kk',
        'file_ktp_ortua',
        'catatan_dokumen',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class, 'pendaftaran_id', 'id_pendaftaran');
    }
}
