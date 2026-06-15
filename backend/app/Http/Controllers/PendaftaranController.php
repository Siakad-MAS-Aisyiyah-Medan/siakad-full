<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\BerkasPendaftaran;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Pendaftaran;

use App\Http\Controllers\Controller;
use App\Http\Resources\PendaftaranResource;
use App\Http\Resources\PpdbResource;
use App\Http\Resources\UserResource;
use App\Utils\ApiResponse;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

class PendaftaranController extends Controller
{
    public function __construct(
        private \App\Services\PendaftaranStateService $state,
        private \App\Services\PpdbBerkasService $berkasService,
        private \App\Services\Account\AccountRegistrationService $auth,
        private \App\Services\EnrollmentService $enrollment
    ) {}

/**
     * GET /api/ppdb/my-registration
     * Mengambil data pendaftaran milik user yang login.
     */
    public function myRegistration()
    {
        $user = Auth::user();
        $pendaftaran = $this->getByUser($user);

        return ApiResponse::success([
            'user' => (new UserResource($user))->resolve(),
            'pendaftaran' => $pendaftaran
                ? PpdbResource::applicant($pendaftaran)->resolve()
                : null,
            'has_registration' => (bool) $pendaftaran,
        ]);
    }

    /**
     * POST /api/ppdb/start
     * Membuat draft pendaftaran jika belum ada.
     */
    public function start()
    {
        $user = Auth::user();

        if ($user->role !== 'calon_siswa') {
            return ApiResponse::error('Hanya calon siswa yang dapat memulai pendaftaran', 403);
        }

        $existing = $this->getByUser($user);
        if ($existing) {
            return ApiResponse::success(
                PpdbResource::applicant($existing)->resolve(),
                'Pendaftaran sudah ada'
            );
        }

        // Buat draft baru
        $pendaftaran = Pendaftaran::create([
            'id_user' => $user->id_user,
            'nisn' => $user->username,
            'nama_lengkap' => $user->name ?? '',
            'tempat_lahir' => '',
            'tgl_lahir' => now()->toDateString(),
            'jenis_kelamin' => 'L',
            'agama' => '',
            'kewarganegaraan' => 'Indonesia',
            'anak_ke' => 1,
            'jml_saudara_kandung' => 0,
            'jml_saudara_tiri' => 0,
            'alamat' => '',
            'no_telp' => '',
            'status_yatim' => 'Tidak',
            'berat_badan' => 0,
            'tinggi_badan' => 0,
            'gol_darah' => '-',
            'sekolah_asal' => '',
            'no_sttb' => '',
            'nama_ayah' => '',
            'nama_ibu' => '',
            'pendidikan_ayah' => '',
            'pendidikan_ibu' => '',
            'pekerjaan_ayah' => '',
            'pekerjaan_ibu' => '',
            'agama_ortu' => '',
            'alamat_ortu' => '',
            'no_hp_ortu' => '',
            'hobi' => '',
            'cita_cita' => '',
            'ppdb_status' => 'draft',
            'status_kelulusan' => 'Pending',
        ]);

        return ApiResponse::success(
            PpdbResource::applicant($pendaftaran->fresh(['berkas']))->resolve(),
            'Draft pendaftaran dibuat',
            201
        );
    }

    /**
     * PUT /api/ppdb/step/keterangan-pribadi
     */
    public function saveKeteranganPribadi(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'nisn' => 'sometimes|string|max:20',
            'nama_lengkap' => 'sometimes|string|max:255',
            'jenis_kelamin' => 'sometimes|in:L,P',
            'tempat_lahir' => 'sometimes|string|max:100',
            'tgl_lahir' => 'sometimes|date',
            'agama' => 'sometimes|string|max:50',
            'kewarganegaraan' => 'sometimes|string|max:50',
            'anak_ke' => 'sometimes|integer|min:1',
            'jml_saudara_kandung' => 'sometimes|integer|min:0',
            'jml_saudara_tiri' => 'sometimes|integer|min:0',
            'alamat' => 'sometimes|string',
            'no_telp' => 'sometimes|string|max:20',
            'status_yatim' => 'sometimes|in:Yatim,Piatu,Yatim Piatu,Tidak',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Keterangan pribadi disimpan');
    }

    /**
     * PUT /api/ppdb/step/kesehatan
     */
    public function saveKesehatan(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'berat_badan' => 'sometimes|integer|min:1',
            'tinggi_badan' => 'sometimes|integer|min:1',
            'gol_darah' => 'sometimes|string|max:5',
            'penyakit_diderita' => 'nullable|string|max:255',
            'cacat_badan' => 'nullable|string|max:255',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data kesehatan disimpan');
    }

    /**
     * PUT /api/ppdb/step/pendidikan-asal
     */
    public function savePendidikanAsal(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'sekolah_asal' => 'sometimes|string|max:255',
            'tahun_lulus' => 'sometimes|string|max:4',
            'no_sttb' => 'sometimes|string|max:100',
            'pindahan_dari' => 'nullable|string|max:255',
            'no_surat_pindah' => 'nullable|string|max:100',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data pendidikan asal disimpan');
    }

    /**
     * PUT /api/ppdb/step/orang-tua-wali
     */
    public function saveOrangTuaWali(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'nama_ayah' => 'sometimes|string|max:255',
            'nama_ibu' => 'sometimes|string|max:255',
            'pendidikan_ayah' => 'sometimes|string|max:100',
            'pendidikan_ibu' => 'sometimes|string|max:100',
            'pekerjaan_ayah' => 'sometimes|string|max:100',
            'pekerjaan_ibu' => 'sometimes|string|max:100',
            'agama_ortu' => 'sometimes|string|max:50',
            'alamat_ortu' => 'sometimes|string',
            'no_hp_ortu' => 'sometimes|string|max:20',
            'nama_wali' => 'nullable|string|max:255',
            'pendidikan_wali' => 'nullable|string|max:100',
            'pekerjaan_wali' => 'nullable|string|max:100',
            'agama_wali' => 'nullable|string|max:50',
            'alamat_wali' => 'nullable|string',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data orang tua/wali disimpan');
    }

    /**
     * PUT /api/ppdb/step/kepribadian
     */
    public function saveKepribadian(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'hobi' => 'sometimes|string|max:255',
            'cita_cita' => 'sometimes|string|max:255',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data kepribadian disimpan');
    }

    /**
     * PUT /api/ppdb/step/dokumen
     */
    public function saveDokumen(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'catatan_dokumen' => 'nullable|string|max:500',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data dokumen disimpan');
    }

    /**
     * POST /api/ppdb/submit
     */
    public function submit(\Illuminate\Http\Request $request = null)
    {
        $user = Auth::user();
        if ($user->role !== 'calon_siswa') {
            return ApiResponse::error('Hanya calon siswa yang dapat submit', 403);
        }

        $pendaftaran = $this->getByUser($user);
        if (!$pendaftaran) {
            return ApiResponse::error('Data pendaftaran tidak ditemukan. Mulai pendaftaran terlebih dahulu.', 404);
        }

        if (!in_array($pendaftaran->ppdb_status, ['draft', 'revisi'], true)) {
            return ApiResponse::error('Pendaftaran sudah dikirim atau sedang diproses.', 422);
        }

        // Validasi kelengkapan minimal
        $required = ['nama_lengkap', 'tempat_lahir', 'tgl_lahir', 'jenis_kelamin', 'agama', 'alamat', 'sekolah_asal', 'nama_ayah', 'nama_ibu', 'pekerjaan_ayah', 'pekerjaan_ibu'];
        foreach ($required as $field) {
            if (empty(trim((string) $pendaftaran->$field))) {
                return ApiResponse::error("Field {$field} wajib diisi sebelum submit.", 422);
            }
        }

        $pendaftaran->ppdb_status = 'diajukan';
        $pendaftaran->status_kelulusan = 'Pending';
        $pendaftaran->submitted_at = now();
        if (!$pendaftaran->no_registrasi) {
            $year = date('Y');
            $prefix = "PPDB-{$year}-";
            $last = Pendaftaran::where('no_registrasi', 'like', $prefix.'%')->orderByDesc('no_registrasi')->value('no_registrasi');
            $seq = 1;
            if ($last && preg_match('/(\d+)$/', $last, $m)) {
                $seq = (int) $m[1] + 1;
            }
            $pendaftaran->no_registrasi = $prefix . str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
        }
        $pendaftaran->save();

        return ApiResponse::success(
            PpdbResource::applicant($pendaftaran->fresh(['berkas']))->resolve(),
            'Pendaftaran berhasil diajukan'
        );
    }

    /**
     * GET /api/ppdb/status
     */
    public function status()
    {
        $pendaftaran = $this->getByUser(Auth::user());

        if (!$pendaftaran) {
            return ApiResponse::success(null, 'Belum ada data pendaftaran');
        }

        return ApiResponse::success([
            'status' => $pendaftaran->ppdb_status,
            'no_registrasi' => $pendaftaran->no_registrasi,
            'catatan_admin' => $pendaftaran->catatan_admin,
            'submitted_at' => $pendaftaran->submitted_at,
            'verified_at' => $pendaftaran->verified_at,
            'accepted_at' => $pendaftaran->accepted_at,
        ]);
    }

    /**
     * Helper: simpan step data pendaftaran
     */
    private function savePendaftaranStep(User $user, array $data, string $msg): \Illuminate\Http\JsonResponse
    {
        $pendaftaran = $this->getByUser($user);
        if (!$pendaftaran) {
            return ApiResponse::error('Data pendaftaran tidak ditemukan. Mulai pendaftaran terlebih dahulu.', 404);
        }

        $locked = ['diajukan', 'terverifikasi', 'diterima', 'ditolak', 'daftar_ulang', 'menjadi_murid'];
        if (in_array($pendaftaran->ppdb_status, $locked, true)) {
            return ApiResponse::error('Pendaftaran tidak dapat diubah pada status: ' . $pendaftaran->ppdb_status . '.', 422);
        }

        $pendaftaran->fill($data);
        $pendaftaran->save();

        return ApiResponse::success(
            PpdbResource::applicant($pendaftaran->fresh(['berkas']))->resolve(),
            $msg
        );
    }

    public function calonShow()
    {
        $user = Auth::user();
        $data = $this->getByUser($user);

        return ApiResponse::success(
            $data ? PendaftaranResource::applicant($data)->resolve() : null
        );
    }

    public function calonUpdate(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'sometimes|string|max:255',
            'tempat_lahir' => 'sometimes|string|max:100',
            'tgl_lahir' => 'sometimes|date',
            'agama' => 'sometimes|string|max:50',
            'kewarganegaraan' => 'sometimes|string|max:50',
            'anak_ke' => 'sometimes|integer|min:1',
            'jml_saudara_kandung' => 'sometimes|integer|min:0',
            'jml_saudara_tiri' => 'sometimes|integer|min:0',
            'alamat' => 'sometimes|string',
            'no_telp' => 'sometimes|string|max:20',
            'status_yatim' => 'sometimes|in:Yatim,Piatu,Yatim Piatu,Tidak',
            'berat_badan' => 'sometimes|integer|min:1',
            'tinggi_badan' => 'sometimes|integer|min:1',
            'gol_darah' => 'sometimes|string|max:5',
            'penyakit_diderita' => 'nullable|string|max:255',
            'cacat_badan' => 'nullable|string|max:255',
            'sekolah_asal' => 'sometimes|string|max:255',
            'no_sttb' => 'sometimes|string|max:100',
            'pindahan_dari' => 'nullable|string|max:255',
            'no_surat_pindah' => 'nullable|string|max:100',
            'nama_ayah' => 'sometimes|string|max:255',
            'nama_ibu' => 'sometimes|string|max:255',
            'pendidikan_ayah' => 'sometimes|string|max:100',
            'pendidikan_ibu' => 'sometimes|string|max:100',
            'pekerjaan_ayah' => 'sometimes|string|max:100',
            'pekerjaan_ibu' => 'sometimes|string|max:100',
            'agama_ortu' => 'sometimes|string|max:50',
            'alamat_ortu' => 'sometimes|string',
            'nama_wali' => 'nullable|string|max:255',
            'pendidikan_wali' => 'nullable|string|max:100',
            'pekerjaan_wali' => 'nullable|string|max:100',
            'agama_wali' => 'nullable|string|max:50',
            'alamat_wali' => 'nullable|string',
            'hobi' => 'sometimes|string|max:255',
            'cita_cita' => 'sometimes|string|max:255',
            'file_ijazah' => 'nullable|file|mimes:pdf|max:5120',
            'file_stk' => 'nullable|file|mimes:pdf|max:5120',
            'file_pas_photo' => 'nullable|file|mimes:pdf|max:5120',
            'file_nisn' => 'nullable|file|mimes:pdf|max:5120',
            'file_kk' => 'nullable|file|mimes:pdf|max:5120',
            'file_ktp_ortua' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        $user = Auth::user();

        try {
            $pendaftaran = $this->saveDraftForUser(
                $user,
                $request->safeFields(),
                $request
            );

            return ApiResponse::success(
                PendaftaranResource::applicant($pendaftaran)->resolve(),
                'Draft pendaftaran disimpan'
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function calonSubmit()
    {
        $user = Auth::user();
        if ($user->role !== 'calon_siswa') {
            return ApiResponse::error('Hanya calon siswa yang dapat submit', 403);
        }

        try {
            $pendaftaran = $this->submitForUser($user);

            return ApiResponse::success(
                PendaftaranResource::applicant($pendaftaran)->resolve(),
                'Pendaftaran berhasil dikirim'
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    /**
     * @deprecated Gunakan POST /api/auth/register-calon-siswa
     */
    public function calonPpdbRegister(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required_without:nama|string|max:255',
            'nama' => 'required_without:nama_lengkap|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'nisn' => 'required|string|max:20|unique:users,username',
            'no_hp' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        return ApiResponse::error(
            'Endpoint ini tidak lagi digunakan. Daftar akun melalui POST /api/auth/register-calon-siswa, lalu isi formulir PPDB setelah login.',
            410
        );
    }

    public function calonPpdbMe()
    {
        $user = Auth::user();
        $data = $this->getByUser($user);

        return ApiResponse::success([
            'user' => (new UserResource($user))->resolve(),
            'pendaftaran' => $data ? PpdbResource::applicant($data)->resolve() : null,
        ]);
    }

    public function calonPpdbSaveFormulir(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'nisn' => 'sometimes|string|max:20',
            'nama_lengkap' => 'sometimes|string|max:255',
            'jenis_kelamin' => 'sometimes|in:L,P',
            'tempat_lahir' => 'sometimes|string|max:100',
            'tanggal_lahir' => 'sometimes|date',
            'tgl_lahir' => 'sometimes|date',
            'agama' => 'sometimes|string|max:50',
            'alamat' => 'sometimes|string',
            'asal_sekolah' => 'sometimes|string|max:255',
            'sekolah_asal' => 'sometimes|string|max:255',
            'tahun_lulus' => 'sometimes|string|max:4',
            'nama_ayah' => 'sometimes|string|max:255',
            'pekerjaan_ayah' => 'sometimes|string|max:100',
            'nama_ibu' => 'sometimes|string|max:255',
            'pekerjaan_ibu' => 'sometimes|string|max:100',
            'no_hp_ortu' => 'sometimes|string|max:20',
            'no_telp' => 'sometimes|string|max:20',
        ]);

        try {
            $pendaftaran = $this->saveFormulir(Auth::user(), $validated);

            return ApiResponse::success(
                PpdbResource::applicant($pendaftaran)->resolve(),
                'Formulir disimpan sebagai draft'
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function calonPpdbUploadBerkas(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'jenis_berkas' => 'required|string|in:'.$jenis,
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:'.$maxKb,
        ]);

        try {
            $berkas = $this->uploadBerkas(
                Auth::user(),
                $request->validated('jenis_berkas'),
                $request->file('file')
            );

            return ApiResponse::success($berkas, 'Berkas berhasil diunggah');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function calonPpdbSubmit()
    {
        $user = Auth::user();
        if ($user->role !== 'calon_siswa') {
            return ApiResponse::error('Hanya calon murid yang dapat submit', 403);
        }

        try {
            $pendaftaran = $this->submit($user);

            return ApiResponse::success(
                PpdbResource::applicant($pendaftaran)->resolve(),
                'Pendaftaran berhasil diajukan'
            );
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function calonPpdbStatus()
    {
        $data = $this->getByUser(Auth::user());

        if (!$data) {
            return ApiResponse::success(null, 'Belum ada data pendaftaran');
        }

        return ApiResponse::success([
            'status' => $data->ppdb_status,
            'no_registrasi' => $data->no_registrasi,
            'catatan_admin' => $data->catatan_admin,
            'submitted_at' => $data->submitted_at,
            'verified_at' => $data->verified_at,
            'accepted_at' => $data->accepted_at,
        ]);
    }

    public function calonPpdbBukti()
    {
        $data = $this->getByUser(Auth::user());
        if (!$data) {
            return ApiResponse::error('Data pendaftaran tidak ditemukan', 404);
        }

        if (!in_array($data->ppdb_status, ['diterima', 'daftar_ulang', 'menjadi_murid'], true)) {
            return ApiResponse::error('Bukti hanya tersedia untuk pendaftar yang diterima', 403);
        }

        return ApiResponse::success($this->getBuktiData($data), 'Bukti pendaftaran');
    }

    public function publicInfo()
    {
        return ApiResponse::success($this->getPublicInfo(), 'Informasi PPDB');
    }

    // --- Inlined from PendaftaranService ---

    


    private function saveDraftForUser(User $user, array $data, Request $request): Pendaftaran
    {
        if ($request->hasFile('file') || $this->hasLegacyUploads($request)) {
            foreach (PpdbService::BERKAS_JENIS as $jenis) {
                if ($request->hasFile($jenis)) {
                    $this->uploadBerkas($user, $jenis, $request->file($jenis));
                }
            }
        }

        return $this->saveFormulir($user, $data);
    }

    private function submitForUser(User $user): Pendaftaran
    {
        return $this->processSubmit($user);
    }

    private function hasLegacyUploads(Request $request): bool
    {
        foreach (['file_ijazah', 'file_stk', 'file_pas_photo', 'file_nisn', 'file_kk', 'file_ktp_ortua'] as $key) {
            if ($request->hasFile($key)) {
                return true;
            }
        }

        return false;
    }


    // --- Inlined from PpdbService ---

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

    

    private function getPublicInfo(): array
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
                'Fotokopi akta kelahiran',
                'Fotokopi kartu keluarga',
                'Fotokopi KTP orang tua',
                'Pas foto 3×4 sebanyak 4 lembar',
                'Fotokopi ijazah/SKL legalisir',
                'Fotokopi KIP (jika ada)',
                'NISN',
            ],
            'fasilitas' => [
                ['nama' => 'Ruang Kelas Luas', 'ikon' => 'building'],
                ['nama' => 'Ruang Perpustakaan', 'ikon' => 'library'],
                ['nama' => 'Mushola', 'ikon' => 'church'],
                ['nama' => 'Lapangan Olahraga', 'ikon' => 'volleyball'],
                ['nama' => 'Ruang Komputer', 'ikon' => 'monitor'],
                ['nama' => 'Ruang Keterampilan', 'ikon' => 'utensils'],
            ],
            'ekstrakurikuler' => [
                ['nama' => 'Pramuka', 'ikon' => 'shield'],
                ['nama' => 'Futsal', 'ikon' => 'dumbbell'],
                ['nama' => 'Tapak Suci', 'ikon' => 'users'],
                ['nama' => 'Tahfidz', 'ikon' => 'book'],
                ['nama' => 'Tata Boga', 'ikon' => 'utensils'],
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
    private function registerCalon(array $data): User
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

    private function getByUser(User $user): ?Pendaftaran
    {
        return Pendaftaran::with('berkas', 'user')
            ->where('id_user', $user->id_user)
            ->first();
    }

    private function saveFormulir(User $user, array $data): Pendaftaran
    {
        $mapped = $this->mapFormulirInput($data);
        $pendaftaran = $this->state->saveDraft($user, $mapped);

        if (!empty($data['nisn'])) {
            $pendaftaran->nisn = $data['nisn'];
            $pendaftaran->save();
        }

        return $pendaftaran->fresh(['berkas']);
    }

    private function uploadBerkas(User $user, string $jenis, UploadedFile $file): BerkasPendaftaran
    {
        $this->berkasService->upload($user, $jenis, $file);
        $pendaftaran = $this->state->getOwnedOrFail($user);

        return BerkasPendaftaran::where('pendaftaran_id', $pendaftaran->id_pendaftaran)
            ->where('jenis_berkas', PpdbBerkasService::normalizeJenis($jenis))
            ->firstOrFail();
    }

    private function processSubmit(User $user): Pendaftaran
    {
        $pendaftaran = $this->state->submit($user);
        if (!$pendaftaran->no_registrasi) {
            $pendaftaran->no_registrasi = $this->generateNoRegistrasi();
            $pendaftaran->submitted_at = now();
            $pendaftaran->save();
        }

        return $pendaftaran->fresh(['berkas']);
    }

    public function adminPpdbStats()
    {
        $total = Pendaftaran::count();
        $verified = Pendaftaran::where('ppdb_status', 'terverifikasi')->count();
        $accepted = Pendaftaran::where('ppdb_status', 'diterima')->count();
        
        return ApiResponse::success([
            'total' => $total,
            'verified' => $verified,
            'accepted' => $accepted,
        ]);
    }

    public function adminPpdbIndex(\Illuminate\Http\Request $request)
    {
        return ApiResponse::success(
            $this->adminList($request->query('search'), $request->query('status'), (int) $request->query('per_page', 10))
        );
    }

    private function adminList(?string $search, ?string $status, int $perPage): LengthAwarePaginator
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

    public function adminPpdbShow($id)
    {
        return ApiResponse::success($this->adminFind((int) $id));
    }

    private function adminFind(int $id): Pendaftaran
    {
        return Pendaftaran::with(['user', 'berkas'])->findOrFail($id);
    }

    public function adminPpdbVerifikasi($id)
    {
        return ApiResponse::success($this->adminVerifikasi((int) $id), 'Berhasil verifikasi');
    }

    private function adminVerifikasi(int $id): Pendaftaran
    {
        return $this->state->transitionByAdmin(
            Pendaftaran::findOrFail($id),
            'terverifikasi'
        );
    }

    public function adminPpdbRevisi(\Illuminate\Http\Request $request, $id)
    {
        return ApiResponse::success($this->adminRevisi((int) $id, $request->input('catatan', '')), 'Berhasil revisi');
    }

    private function adminRevisi(int $id, string $catatan): Pendaftaran
    {
        return $this->state->transitionByAdmin(
            Pendaftaran::findOrFail($id),
            'revisi',
            $catatan
        );
    }

    public function adminPpdbTerima(\Illuminate\Http\Request $request, $id)
    {
        return ApiResponse::success($this->adminTerima((int) $id, $request->input('catatan', '')), 'Berhasil diterima');
    }

    private function adminTerima(int $id, ?string $catatan = null): Pendaftaran
    {
        return $this->state->transitionByAdmin(
            Pendaftaran::findOrFail($id),
            'diterima',
            $catatan
        );
    }

    public function adminPpdbTolak(\Illuminate\Http\Request $request, $id)
    {
        return ApiResponse::success($this->adminTolak((int) $id, $request->input('catatan', '')), 'Berhasil ditolak');
    }

    private function adminTolak(int $id, string $catatan): Pendaftaran
    {
        return $this->state->transitionByAdmin(
            Pendaftaran::findOrFail($id),
            'ditolak',
            $catatan
        );
    }

    public function adminPpdbJadikanMurid(\Illuminate\Http\Request $request, $id)
    {
        return ApiResponse::success($this->adminJadikanMurid((int) $id, $request->input('id_kelas')), 'Berhasil jadikan murid');
    }

    private function adminJadikanMurid(int $id, ?int $idKelas = null): array
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        return $this->enrollment->enrollCalonSiswa($pendaftaran->id_user, $idKelas);
    }

    private function getBuktiData(Pendaftaran $pendaftaran): array
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

    private function generateNoRegistrasi(): string
    {
        $year = date('Y');
        $prefix = "PPDB-{$year}-";

        return DB::transaction(function () use ($prefix, $year) {
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

    private function mapFormulirInput(array $data): array
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

    private function assertAllowedFile(UploadedFile $file, string $jenis): void
    {
        $ext = strtolower($file->getClientOriginalExtension());
        $allowedExt = ['pdf', 'jpg', 'jpeg', 'png'];
        if (!in_array($ext, $allowedExt, true)) {
            throw new InvalidArgumentException("Format file {$jenis} harus PDF, JPG, JPEG, atau PNG.");
        }

        if (!in_array($file->getMimeType(), self::ALLOWED_MIMES, true)) {
            throw new InvalidArgumentException("Tipe file {$jenis} tidak valid.");
        }

        if ($file->getSize() > self::MAX_FILE_BYTES) {
            throw new InvalidArgumentException("Ukuran file {$jenis} maksimal 5MB.");
        }
    }

    private function syncLegacyFileColumn(Pendaftaran $pendaftaran, string $jenis, string $path): void
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