<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalPelajaran extends Model
{
    protected $table = 'jadwal_pelajaran';

    protected $primaryKey = 'id_jadwal';

    protected $fillable = [
        'id_kelas',
        'id_mapel',
        'id_guru',
        'tahun_ajaran',
        'semester',
    ];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class, 'id_mapel', 'id_mapel');
    }

    public function guru()
    {
        return $this->belongsTo(User::class, 'id_guru', 'id_user');
    }
}
