<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PengumumanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'judul' => $this->judul,
            'kategori' => $this->kategori,
            'thumbnail' => $this->thumbnail,
            'isi' => $this->isi,
            'tanggal_publikasi' => $this->tanggal_publikasi,
            'akses' => $this->akses,
            'penulis_id' => $this->penulis_id,
            'penulis' => $this->whenLoaded('penulis', fn () => [
                'id' => $this->penulis->id,
                'name' => $this->penulis->name,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
