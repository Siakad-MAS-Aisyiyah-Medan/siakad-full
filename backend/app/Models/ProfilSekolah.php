<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilSekolah extends Model
{
    protected $table = 'profil_sekolahs';

    protected $fillable = [
        'nama_sekolah',
        'npsn',
        'akreditasi',
        'hero_subtitle',
        'hero_image',
        'tentang_kami',
        'alamat',
        'kata_sambutan',
        'nama_kepsek',
        'foto_kepsek',
        'no_hp',
        'visi',
        'misi'
    ];
}
