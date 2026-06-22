<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    protected $table = 'mata_pelajaran';

    protected $primaryKey = 'id_mapel';

    protected $fillable = ['nama_mapel', 'id_guru', 'tingkat', 'kelompok_mapel'];

    public function guru()
    {
        return $this->belongsTo(User::class, 'id_guru', 'id_user');
    }

    public function kelas()
    {
        return $this->belongsToMany(Kelas::class, 'kelas_mapel', 'id_mapel', 'id_kelas');
    }
}
