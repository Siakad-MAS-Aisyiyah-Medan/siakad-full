<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaktuPelajaran extends Model
{
    protected $table = 'waktu_pelajaran';

    protected $primaryKey = 'id_waktu';

    protected $fillable = [
        'jam_ke',
        'jam_mulai',
        'jam_selesai',
        'tipe',
    ];
}
