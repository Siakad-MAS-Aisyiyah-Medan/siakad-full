<?php

namespace App\Services;

use App\Exceptions\JadwalConflictException;
use App\Models\JadwalPelajaran;

class JadwalConflictService
{
    public function assertNoConflict(array $data, ?int $exceptId = null): void
    {
        $base = JadwalPelajaran::query()
            ->where('hari', $data['hari'])
            ->where('id_waktu', $data['id_waktu'])
            ->where('tahun_ajaran', $data['tahun_ajaran'])
            ->where('semester', $data['semester'])
            ->when($exceptId, fn ($q) => $q->where('id_jadwal', '!=', $exceptId));

        if ((clone $base)->where('id_guru', $data['id_guru'])->exists()) {
            throw new JadwalConflictException(
                JadwalConflictException::GURU,
                'Guru sudah mengajar di kelas lain pada jam (les) yang sama.'
            );
        }

        if ((clone $base)->where('id_kelas', $data['id_kelas'])->exists()) {
            throw new JadwalConflictException(
                JadwalConflictException::KELAS,
                'Kelas ini sudah memiliki jadwal pada jam (les) yang sama.'
            );
        }

        if (! empty($data['ruangan'])) {
            $ruangan = mb_strtolower(trim($data['ruangan']));
            if ((clone $base)->whereRaw('LOWER(TRIM(ruangan)) = ?', [$ruangan])->exists()) {
                throw new JadwalConflictException(
                    JadwalConflictException::RUANGAN,
                    'Ruangan sudah digunakan oleh kelas lain pada jam (les) yang sama.'
                );
            }
        }
    }
}
