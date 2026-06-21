<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $primaryKey = 'id_kelas';

    protected $fillable = [
        'nama_kelas',
        'id_wali_kelas',
        'tahun_ajaran',
        'status',
        'tingkat',
        'jurusan',
        'kapasitas_maksimal',
        'ruangan',
    ];

    public function waliKelas()
    {
        return $this->belongsTo(User::class, 'id_wali_kelas', 'id_user');
    }

    public function jadwal()
    {
        return $this->hasMany(JadwalPelajaran::class, 'id_kelas', 'id_kelas');
    }

    public function siswa()
    {
        return $this->hasMany(Siswa::class, 'id_kelas', 'id_kelas');
    }
}
