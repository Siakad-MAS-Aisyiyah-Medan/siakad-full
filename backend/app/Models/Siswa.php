<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    protected $table = 'siswa';
    protected $primaryKey = 'id_siswa';
    protected $fillable = [
        'id_user', 'nisn', 'nis', 'nama_siswa', 'tempat_lahir',
        'tgl_lahir', 'jenis_kelamin', 'agama', 'alamat', 'nama_wali', 'no_hp_wali',
        'no_hp', 'tahun_masuk', 'tahun_lulus', 'id_kelas', 'foto',
    ];

    protected $casts = [
        'tgl_lahir' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }
}
