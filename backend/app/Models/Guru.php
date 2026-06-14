<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    protected $table = 'guru';
    protected $primaryKey = 'id_guru';
    protected $fillable = ['id_user', 'nip_nuptk', 'nama_guru', 'jenis_kelamin', 'agama', 'alamat', 'no_hp', 'status', 'foto'];

    public function user() { return $this->belongsTo(User::class, 'id_user', 'id_user'); }
}
