<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendaftaranKesehatan extends Model
{
    protected $table = 'pendaftaran_kesehatan';

    protected $fillable = [
        'pendaftaran_id',
        'berat_badan',
        'tinggi_badan',
        'gol_darah',
        'penyakit_diderita',
        'cacat_badan',
    ];

    protected function casts(): array
    {
        return [
            'berat_badan' => 'integer',
            'tinggi_badan' => 'integer',
        ];
    }

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class, 'pendaftaran_id', 'id_pendaftaran');
    }
}
