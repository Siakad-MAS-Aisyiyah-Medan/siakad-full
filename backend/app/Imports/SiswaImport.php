<?php

namespace App\Imports;

use App\Models\Siswa;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SiswaImport
{
    protected $idKelas;

    public function __construct($idKelas)
    {
        $this->idKelas = $idKelas;
    }

    public function import($rows)
    {
        DB::beginTransaction();

        try {
            $rowIndex = 2;
            foreach ($rows as $row) {
                // Pastikan key array lowercase agar sesuai dengan kode
                $row = array_change_key_case($row, CASE_LOWER);

                // Lewati baris kosong
                if (empty($row['nis']) || empty($row['nama'])) {
                    $rowIndex++;

                    continue;
                }

                $nis = $row['nis'];
                $nisn = $row['nisn'] ?? '-';

                // Cek apakah NIS atau NISN sudah ada
                if (Siswa::where('nis', $nis)->orWhere('nisn', $nisn)->exists()) {
                    throw new Exception('Baris '.$rowIndex.": NIS ($nis) atau NISN ($nisn) sudah terdaftar di sistem.");
                }

                if (User::where('username', $nis)->exists()) {
                    throw new Exception('Baris '.$rowIndex.": Username/NIS ($nis) sudah terdaftar di tabel pengguna.");
                }

                // Buat User
                $user = User::create([
                    'name' => $row['nama'],
                    'username' => $nis,
                    'email' => $nis.'@siswa.siakad.sch.id',
                    'password' => Hash::make('admin123'),
                    'role' => 'siswa',
                    'status_aktif' => true,
                    'status_akun' => 'aktif',
                ]);

                // Format Tanggal Lahir (FastExcel / OpenSpout biasanya me-return string Y-m-d atau DateTime)
                $tglLahir = '2000-01-01';
                if (! empty($row['tgl_lahir'])) {
                    if ($row['tgl_lahir'] instanceof \DateTimeInterface) {
                        $tglLahir = $row['tgl_lahir']->format('Y-m-d');
                    } else {
                        // Jika formatnya string, kita asumsikan sudah valid dan coba parse
                        $parsed = strtotime($row['tgl_lahir']);
                        if ($parsed !== false) {
                            $tglLahir = date('Y-m-d', $parsed);
                        }
                    }
                }

                // Buat Siswa
                Siswa::create([
                    'id_user' => $user->id_user,
                    'id_kelas' => $this->idKelas,
                    'nisn' => $nisn,
                    'nis' => $nis,
                    'nama_siswa' => $row['nama'],
                    'tempat_lahir' => $row['tempat_lahir'] ?? '-',
                    'tgl_lahir' => $tglLahir,
                    'jenis_kelamin' => isset($row['lp']) && strtoupper($row['lp']) == 'P' ? 'P' : 'L',
                    'agama' => $row['agama'] ?? 'Islam',
                    'alamat' => $row['alamat'] ?? '-',
                    'nama_wali' => $row['nama_wali'] ?? '-',
                    'no_hp_wali' => $row['no_hp_wali'] ?? '-',
                ]);
                $rowIndex++;
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
