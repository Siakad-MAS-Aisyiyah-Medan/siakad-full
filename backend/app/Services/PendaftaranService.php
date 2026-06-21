<?php

namespace App\Services;

use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Http\Request;

class PendaftaranService
{
    public function __construct(private PpdbService $ppdb) {}

    public function getByUser(User $user): ?Pendaftaran
    {
        return $this->ppdb->getByUser($user);
    }

    public function saveDraftForUser(User $user, array $data, Request $request): Pendaftaran
    {
        if ($request->hasFile('file') || $this->hasLegacyUploads($request)) {
            foreach (PpdbService::BERKAS_JENIS as $jenis) {
                if ($request->hasFile($jenis)) {
                    $this->ppdb->uploadBerkas($user, $jenis, $request->file($jenis));
                }
            }
        }

        return $this->ppdb->saveFormulir($user, $data);
    }

    public function submitForUser(User $user): Pendaftaran
    {
        return $this->ppdb->submit($user);
    }

    protected function hasLegacyUploads(Request $request): bool
    {
        foreach (['file_ijazah', 'file_stk', 'file_pas_photo', 'file_nisn', 'file_kk', 'file_ktp_ortua'] as $key) {
            if ($request->hasFile($key)) {
                return true;
            }
        }

        return false;
    }
}
