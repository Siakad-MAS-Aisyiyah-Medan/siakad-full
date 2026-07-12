<?php

namespace App\Services;

use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class PpdbService
{
    /** @deprecated Gunakan PpdbBerkasService::allJenisKeys() */
    public const BERKAS_JENIS = [
        'ijazah_atau_skl',
        'stk',
        'pas_foto',
        'nisn',
        'kartu_keluarga',
        'ktp_orang_tua',
    ];

    private const MAX_FILE_BYTES = 2097152;

    private const ALLOWED_MIMES = [
        'application/pdf',
        'application/x-pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
    ];

    public function __construct(
        private PendaftaranStateService $state,
        private AuthService $auth,
        private EnrollmentService $enrollment,
        private PpdbBerkasService $berkasService,
    ) {}

    public function getPublicInfo(): array
    {
        return [
            'nama_sekolah' => 'MAS Aisyiyah Medan',
            'judul' => 'Penerimaan Peserta Didik Baru',
            'tahun_ajaran' => '2026/2027',
            'deskripsi' => 'MAS Aisyiyah Medan membuka pendaftaran peserta didik baru Tahun Pelajaran 2026/2027. Buat akun calon murid, lengkapi formulir dan berkas, lalu pantau status pendaftaran secara online.',
            'hero_highlights' => [
                ['teks' => 'Gratis uang pembangunan', 'ikon' => 'gift'],
                ['teks' => 'Gratis pendaftaran 20 pendaftar pertama', 'ikon' => 'award'],
                ['teks' => 'Diskon alumni Muhammadiyah/Aisyiyah', 'ikon' => 'percent'],
                ['teks' => 'Gratis SPP bagi anak yatim (syarat berlaku)', 'ikon' => 'heart'],
            ],
            'gelombang' => [
                [
                    'id' => 'gelombang-1',
                    'judul' => 'Gelombang 1',
                    'periode' => 'Januari – Maret 2026',
                    'badge' => 'Dibuka',
                    'keuntungan' => [
                        'Gratis uang pembangunan',
                        'Gratis uang ekskul 6 bulan untuk juara 1, 2, 3',
                    ],
                ],
                [
                    'id' => 'gelombang-2',
                    'judul' => 'Gelombang 2',
                    'periode' => 'April – Juni 2026',
                    'badge' => 'Segera',
                    'keuntungan' => [
                        'Gratis uang pembangunan',
                        'Gratis uang ekskul 3 bulan untuk juara 1, 2, 3',
                    ],
                ],
            ],
            'promo' => [
                [
                    'judul' => 'Gratis Biaya Pendaftaran',
                    'deskripsi' => 'Untuk 20 pendaftar pertama pada periode yang ditentukan.',
                    'ikon' => 'gift',
                ],
                [
                    'judul' => 'Diskon Alumni 50%',
                    'deskripsi' => 'Alumni SMP/MTs Muhammadiyah/Aisyiyah mendapat diskon khusus.',
                    'ikon' => 'percent',
                ],
                [
                    'judul' => 'Gratis SPP Anak Yatim',
                    'deskripsi' => 'Program bantuan SPP bagi anak yatim sesuai ketentuan sekolah.',
                    'ikon' => 'heart',
                ],
                [
                    'judul' => 'Lingkungan Islami',
                    'deskripsi' => 'Pembinaan karakter dan keagamaan terintegrasi setiap hari.',
                    'ikon' => 'church',
                ],
                [
                    'judul' => 'Guru Berpengalaman',
                    'deskripsi' => 'Tenaga pendidik profesional dan berkompeten di bidangnya.',
                    'ikon' => 'graduation',
                ],
                [
                    'judul' => 'Pembelajaran Modern',
                    'deskripsi' => 'Kurikulum nasional dengan penguatan IPTEK dan literasi digital.',
                    'ikon' => 'monitor',
                ],
            ],
            'persyaratan' => [
                'Mengisi formulir pendaftaran online',
                'Foto Copy Ijazah/SKHUN: 2 lembar',
                'STK asli dan foto copy (dilegalisir): 2 lembar',
                'Pas photo 3x4 cm (pakai jilbab): 4 lembar',
                'NISN',
                'FC Kartu Keluarga: 1 lembar',
                'FC KTP Orang Tua: 1 lembar',
            ],
            'fasilitas' => [
                ['nama' => 'Ruang Kelas Luas', 'ikon' => 'building'],
                ['nama' => 'Ruang Perpustakaan', 'ikon' => 'library'],
                ['nama' => 'Mushola', 'ikon' => 'church'],
                ['nama' => 'Lapangan Olahraga', 'ikon' => 'volleyball'],
                ['nama' => 'Ruang Komputer', 'ikon' => 'monitor'],
                ['nama' => 'Ruang Keterampilan', 'ikon' => 'utensils'],
            ],

            'alur' => [
                'Lihat informasi PPDB',
                'Buat akun calon murid',
                'Login calon murid',
                'Isi formulir online',
                'Upload berkas',
                'Submit pendaftaran',
                'Verifikasi admin',
                'Pengumuman hasil',
            ],
            'kontak' => [
                [
                    'nama' => 'Muharleny Br Damanik, S.Ag',
                    'telepon' => ['+62 813 9686 5480'],
                ],
                [
                    'nama' => 'Sri Wahyuni, S.Pd',
                    'telepon' => ['+62 813 7444 5100'],
                ],
                [
                    'nama' => 'Anggi Mira, S.Pd',
                    'telepon' => ['+62 813 9686 5480', '+62 813 7444 5100'],
                ],
            ],
            'alamat' => 'Jl. Demak No. 3, Medan',
            'diperbarui_pada' => now()->toIso8601String(),
        ];
    }

    /**
     * @deprecated Gunakan AccountRegistrationService via POST /auth/register-calon-siswa (hanya akun, tanpa PPDB).
     */
    public function registerCalon(array $data): User
    {
        if (User::where('username', $data['nisn'] ?? $data['username'])->exists()) {
            throw new InvalidArgumentException('NISN sudah terdaftar.');
        }
        if (User::where('email', $data['email'])->exists()) {
            throw new InvalidArgumentException('Email sudah terdaftar.');
        }

        return $this->auth->registerCalonSiswa([
            'name' => $data['nama_lengkap'] ?? $data['nama'] ?? $data['name'] ?? '',
            'email' => $data['email'],
            'username' => $data['nisn'] ?? $data['username'],
            'password' => $data['password'],
        ]);
    }

    public function getByUser(User $user): ?Pendaftaran
    {
        return Pendaftaran::with('berkas', 'user')
            ->where('id_user', $user->id_user)
            ->first();
    }

    public function saveFormulir(User $user, array $data): Pendaftaran
    {
        $mapped = $this->mapFormulirInput($data);
        $pendaftaran = $this->state->saveDraft($user, $mapped);

        if (! empty($data['nisn'])) {
            $pendaftaran->nisn = $data['nisn'];
            $pendaftaran->save();
        }

        return $pendaftaran->fresh(['berkas']);
    }

    public function uploadBerkas(User $user, string $jenis, UploadedFile $file): array
    {
        return $this->berkasService->upload($user, $jenis, $file);
    }

    public function submit(User $user): Pendaftaran
    {
        $pendaftaran = $this->state->submit($user);
        if (! $pendaftaran->no_registrasi) {
            $pendaftaran->no_registrasi = $this->generateNoRegistrasi();
            $pendaftaran->submitted_at = now();
            $pendaftaran->save();
        }

        return $pendaftaran->fresh(['berkas']);
    }

    public function adminList(?string $search, ?string $status, int $perPage): LengthAwarePaginator
    {
        $query = Pendaftaran::with(['user', 'berkas'])->orderByDesc('updated_at');

        if ($status) {
            $query->where('ppdb_status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('no_registrasi', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%"));
            });
        }

        return $query->paginate($perPage);
    }

    public function adminFind(int $id): Pendaftaran
    {
        return Pendaftaran::with(['user', 'berkas'])->findOrFail($id);
    }

    public function adminVerifikasi(int $id): Pendaftaran
    {
        return $this->state->transitionByAdmin(
            Pendaftaran::findOrFail($id),
            'terverifikasi'
        );
    }

    public function adminRevisi(int $id, string $catatan): Pendaftaran
    {
        return $this->state->transitionByAdmin(
            Pendaftaran::findOrFail($id),
            'revisi',
            $catatan
        );
    }

    public function adminTerima(int $id, ?string $catatan = null): Pendaftaran
    {
        return $this->state->transitionByAdmin(
            Pendaftaran::findOrFail($id),
            'diterima',
            $catatan
        );
    }

    public function adminTolak(int $id, string $catatan): Pendaftaran
    {
        return $this->state->transitionByAdmin(
            Pendaftaran::findOrFail($id),
            'ditolak',
            $catatan
        );
    }

    public function adminJadikanMurid(int $id, ?int $idKelas = null): array
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        return $this->enrollment->enrollCalonSiswa($pendaftaran->id_user, $idKelas);
    }

    public function getBuktiData(Pendaftaran $pendaftaran): array
    {
        return [
            'no_registrasi' => $pendaftaran->no_registrasi,
            'nama_lengkap' => $pendaftaran->nama_lengkap,
            'nisn' => $pendaftaran->nisn ?? $pendaftaran->user?->username,
            'status' => $pendaftaran->ppdb_status,
            'submitted_at' => $pendaftaran->submitted_at,
            'accepted_at' => $pendaftaran->accepted_at,
            'sekolah' => 'MAS Aisyiyah Medan',
            'tahun_ajaran' => '2026/2027',
        ];
    }

    protected function generateNoRegistrasi(): string
    {
        $year = date('Y');
        $prefix = "PPDB-{$year}-";

        return DB::transaction(function () use ($prefix) {
            $last = Pendaftaran::where('no_registrasi', 'like', $prefix.'%')
                ->lockForUpdate()
                ->orderByDesc('no_registrasi')
                ->value('no_registrasi');

            $seq = 1;
            if ($last && preg_match('/-(\d+)$/', $last, $m)) {
                $seq = (int) $m[1] + 1;
            }

            return $prefix.str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
        });
    }

    protected function mapFormulirInput(array $data): array
    {
        $map = [
            'tanggal_lahir' => 'tgl_lahir',
            'asal_sekolah' => 'sekolah_asal',
        ];

        $out = [];
        foreach ($data as $key => $value) {
            $out[$map[$key] ?? $key] = $value;
        }

        return $out;
    }

    protected function assertAllowedFile(UploadedFile $file, string $jenis): void
    {
        $ext = strtolower($file->getClientOriginalExtension());
        $allowedExt = ['pdf', 'jpg', 'jpeg', 'png'];
        if (! in_array($ext, $allowedExt, true)) {
            throw new InvalidArgumentException("Format file {$jenis} harus PDF, JPG, JPEG, atau PNG.");
        }

        if (! in_array($file->getMimeType(), self::ALLOWED_MIMES, true)) {
            throw new InvalidArgumentException("Tipe file {$jenis} tidak valid.");
        }

        if ($file->getSize() > self::MAX_FILE_BYTES) {
            throw new InvalidArgumentException("Ukuran file {$jenis} maksimal 5MB.");
        }
    }

    protected function syncLegacyFileColumn(Pendaftaran $pendaftaran, string $jenis, string $path): void
    {
        $legacyMap = [
            'kartu_keluarga' => 'file_kk',
            'ijazah_atau_skl' => 'file_ijazah',
            'foto' => 'file_pas_photo',
            'rapor' => 'file_stk',
        ];

        if (isset($legacyMap[$jenis])) {
            $pendaftaran->{$legacyMap[$jenis]} = $path;
            $pendaftaran->save();
        }
    }
}
