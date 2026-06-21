<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KepalaSekolah extends Model
{
    protected $table = 'kepala_sekolah';
    protected $primaryKey = 'id_kepsek';
    protected $fillable = [
        'id_user', 'nip', 'nama_kepsek', 'jenis_kelamin', 'tgl_lahir',
        'alamat', 'no_hp', 'foto',
    ];

    protected $casts = ['tgl_lahir' => 'date'];

    public function user() { return $this->belongsTo(User::class, 'id_user', 'id_user'); }
}
