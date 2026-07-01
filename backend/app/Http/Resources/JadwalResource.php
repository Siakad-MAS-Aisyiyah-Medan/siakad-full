<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JadwalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_jadwal' => $this->id_jadwal,
            'id_kelas' => $this->id_kelas,
            'id_mapel' => $this->id_mapel,
            'id_guru' => $this->id_guru,
            'tahun_ajaran' => $this->tahun_ajaran,
            'semester' => $this->semester,
            'kelas' => $this->whenLoaded('kelas', fn () => [
                'id_kelas' => $this->kelas?->id_kelas,
                'nama_kelas' => $this->kelas?->nama_kelas,
            ]),
            'mapel' => $this->whenLoaded('mapel', fn () => [
                'id_mapel' => $this->mapel?->id_mapel,
                'nama_mapel' => $this->mapel?->nama_mapel,
            ]),
            'guru' => $this->whenLoaded('guru', fn () => [
                'id_user' => $this->guru?->id_user,
                'nama_guru' => $this->guru?->guru?->nama_guru,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
