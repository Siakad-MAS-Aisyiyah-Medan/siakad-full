<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MapelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_mapel' => $this->id_mapel,
            'nama_mapel' => $this->nama_mapel,
            'tingkat' => $this->tingkat,
            'kelompok_mapel' => $this->kelompok_mapel,
            'id_guru' => $this->id_guru,
            'guru' => $this->whenLoaded('guru', fn () => [
                'id_user' => $this->guru?->id_user,
                'username' => $this->guru?->username,
                'nama_guru' => $this->guru?->guru?->nama_guru,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
