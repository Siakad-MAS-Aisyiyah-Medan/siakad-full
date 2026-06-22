<?php

namespace App\Imports;

use App\Models\Siswa;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Exception;

class SiswaImport implements ToCollection, WithHeadingRow
{
    protected $idKelas;

    public function __construct($idKelas)
    {
        $this->idKelas = $idKelas;
    }

    public function collection(Collection $rows)
    {
        DB::beginTransaction();

        try {
            foreach ($rows as $index => $row) {
                // Lewati baris kosong
                if (!isset($row['nis']) || !isset($row['nama'])) {
                    continue;
                }

                $nis = $row['nis'];
                $nisn = $row['nisn'] ?? '-';
                
                // Cek apakah NIS atau NISN sudah ada
                if (Siswa::where('nis', $nis)->orWhere('nisn', $nisn)->exists()) {
                    throw new Exception("Baris " . ($index + 2) . ": NIS ($nis) atau NISN ($nisn) sudah terdaftar di sistem.");
                }

                if (User::where('username', $nis)->exists()) {
                    throw new Exception("Baris " . ($index + 2) . ": Username/NIS ($nis) sudah terdaftar di tabel pengguna.");
                }

                // Buat User
                $user = User::create([
                    'name' => $row['nama'],
                    'username' => $nis,
                    'email' => $nis . '@siswa.siakad.sch.id',
                    'password' => Hash::make('admin123'),
                    'role' => 'siswa',
                    'status_aktif' => true,
                    'status_akun' => 'aktif',
                ]);

                // Buat Siswa
                Siswa::create([
                    'id_user' => $user->id_user,
                    'id_kelas' => $this->idKelas,
                    'nisn' => $nisn,
                    'nis' => $nis,
                    'nama_siswa' => $row['nama'],
                    'tempat_lahir' => $row['tempat_lahir'] ?? '-',
                    'tgl_lahir' => isset($row['tgl_lahir']) ? \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['tgl_lahir'])->format('Y-m-d') : '2000-01-01',
                    'jenis_kelamin' => isset($row['lp']) && strtoupper($row['lp']) == 'P' ? 'P' : 'L',
                    'agama' => $row['agama'] ?? 'Islam',
                    'alamat' => $row['alamat'] ?? '-',
                    'nama_wali' => $row['nama_wali'] ?? '-',
                    'no_hp_wali' => $row['no_hp_wali'] ?? '-',
                ]);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
