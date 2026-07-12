<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NilaiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_nilai' => $this->id_nilai,
            'id_user_siswa' => $this->id_user_siswa,
            'id_mapel' => $this->id_mapel,
            'semester' => $this->semester,
            'tahun_ajaran' => $this->tahun_ajaran,
            'nilai_tugas' => $this->nilai_tugas,
            'nilai_uts' => $this->nilai_uts,
            'nilai_uas' => $this->nilai_uas,
            'nilai_praktik' => $this->nilai_praktik,
            'nilai_sikap' => $this->nilai_sikap,
            'nilai_akhir' => $this->nilai_akhir,
            'predikat' => $this->predikat,
            'validated_by_wali' => (bool) $this->validated_by_wali,
            'validated_at' => $this->validated_at?->toIso8601String(),
            'siswa' => $this->whenLoaded('siswa', fn () => [
                'id_user' => $this->siswa?->id_user,
                'nama_siswa' => $this->siswa?->siswa?->nama_siswa,
                'nisn' => $this->siswa?->siswa?->nisn ?: $this->siswa?->username,
            ]),
            'mapel' => $this->whenLoaded('mapel', fn () => [
                'id_mapel' => $this->mapel?->id_mapel,
                'nama_mapel' => $this->mapel?->nama_mapel,
            ]),
            'guru_input' => $this->whenLoaded('guruInput', fn () => [
                'id_user' => $this->guruInput?->id_user,
                'nama_guru' => $this->guruInput?->guru?->nama_guru,
            ]),
        ];
    }
}
