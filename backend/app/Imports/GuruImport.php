<?php

namespace App\Imports;

use App\Models\Guru;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Exception;

class GuruImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        DB::beginTransaction();

        try {
            foreach ($rows as $index => $row) {
                // Lewati baris kosong
                if (!isset($row['nip_nuptk']) || !isset($row['nama'])) {
                    continue;
                }

                $nip = $row['nip_nuptk'];
                
                // Cek apakah NIP sudah ada
                if (Guru::where('nip_nuptk', $nip)->exists()) {
                    throw new Exception("Baris " . ($index + 2) . ": NIP/NUPTK ($nip) sudah terdaftar di sistem.");
                }

                if (User::where('username', $nip)->exists()) {
                    throw new Exception("Baris " . ($index + 2) . ": Username/NIP ($nip) sudah terdaftar di tabel pengguna.");
                }

                // Buat User
                $user = User::create([
                    'name' => $row['nama'],
                    'username' => $nip,
                    'email' => $nip . '@guru.siakad.sch.id',
                    'password' => Hash::make('admin123'),
                    'role' => 'guru',
                    'status_aktif' => true,
                    'status_akun' => 'aktif',
                ]);

                // Buat Guru
                Guru::create([
                    'id_user' => $user->id_user,
                    'nip_nuptk' => $nip,
                    'nama_guru' => $row['nama'],
                    'jenis_kelamin' => isset($row['lp']) && strtoupper($row['lp']) == 'P' ? 'P' : 'L',
                    'agama' => $row['agama'] ?? 'Islam',
                    'alamat' => $row['alamat'] ?? '-',
                    'no_hp' => $row['no_hp'] ?? '-',
                    'status' => 'aktif',
                ]);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
