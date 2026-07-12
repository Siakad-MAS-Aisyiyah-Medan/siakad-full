<?php

namespace App\Http\Resources;

use App\Models\Absensi;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AbsensiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_absensi' => $this->id_absensi,
            'id_user_siswa' => $this->id_user_siswa,
            'id_kelas' => $this->id_kelas,
            'id_mapel' => $this->id_mapel,
            'id_jadwal' => $this->id_jadwal,
            'tanggal' => $this->tanggal?->format('Y-m-d'),
            'jam_mulai' => $this->jam_mulai,
            'jam_selesai' => $this->jam_selesai,
            'status' => $this->status,
            'status_label' => Absensi::statusLabels()[$this->status] ?? $this->status,
            'keterangan' => $this->keterangan,
            'tahun_ajaran' => $this->tahun_ajaran,
            'semester' => $this->semester,
            'siswa' => $this->whenLoaded('siswa', fn () => [
                'id_user' => $this->siswa?->id_user,
                'nama' => $this->siswa?->siswa?->nama_siswa,
                'nisn' => $this->siswa?->siswa?->nisn ?: $this->siswa?->username,
            ]),
            'kelas' => $this->whenLoaded('kelas', fn () => [
                'id_kelas' => $this->kelas?->id_kelas,
                'nama_kelas' => $this->kelas?->nama_kelas,
            ]),
            'mapel' => $this->whenLoaded('mapel', fn () => [
                'id_mapel' => $this->mapel?->id_mapel,
                'nama_mapel' => $this->mapel?->nama_mapel,
            ]),
            'guru_pencatat' => $this->whenLoaded('guruPencatat', fn () => [
                'id_user' => $this->guruPencatat?->id_user,
                'nama_guru' => $this->guruPencatat?->guru?->nama_guru,
            ]),
        ];
    }
}
