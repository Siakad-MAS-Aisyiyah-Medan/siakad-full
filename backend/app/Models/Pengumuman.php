<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengumuman extends Model
{
    protected $table = 'pengumumen';

    protected $fillable = [
        'penulis_id',
        'judul',
        'isi',
        'akses',
        'tanggal_publikasi',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_publikasi' => 'date',
        ];
    }

    public function penulis()
    {
        return $this->belongsTo(User::class, 'penulis_id');
    }
}
