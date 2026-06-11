<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KelasResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_kelas' => $this->id_kelas,
            'nama_kelas' => $this->nama_kelas,
            'tingkat' => $this->tingkat,
            'jurusan' => $this->jurusan,
            'id_wali_kelas' => $this->id_wali_kelas,
            'wali_kelas' => $this->whenLoaded('waliKelas', fn () => [
                'id_user' => $this->waliKelas?->id_user,
                'username' => $this->waliKelas?->username,
                'nama_guru' => $this->waliKelas?->guru?->nama_guru,
            ]),
            'jadwal_count' => $this->whenCounted('jadwal'),
            'jumlah_siswa' => $this->whenCounted('siswa'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
