<?php

namespace App\Http\Controllers;

use App\Http\Resources\PendaftaranResource;
use App\Http\Resources\PpdbResource;
use App\Http\Resources\UserResource;
use App\Models\Pendaftaran;
use App\Models\ProfilSekolah;
use App\Models\SystemSetting;
use App\Models\User;
use App\Services\Account\AccountRegistrationService;
use App\Services\EnrollmentService;
use App\Services\PendaftaranStateService;
use App\Services\PpdbBerkasService;
use App\Utils\ApiResponse;
use App\Utils\AuditsAdminActions;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class PendaftaranController extends Controller
{
    use AuditsAdminActions;

    public function __construct(
        private PendaftaranStateService $state,
        private PpdbBerkasService $berkasService,
        private AccountRegistrationService $auth,
        private EnrollmentService $enrollment
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
            'status_pendaftaran' => 'draft',
            'status_kelulusan' => 'Pending',
        ]);

        $pendaftaran->keteranganPribadi()->updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id_pendaftaran],
            [
                'nisn' => $pendaftaran->nisn,
                'nama_lengkap' => $pendaftaran->nama_lengkap,
                'tempat_lahir' => $pendaftaran->tempat_lahir,
                'tgl_lahir' => $pendaftaran->tgl_lahir,
                'jenis_kelamin' => $pendaftaran->jenis_kelamin,
                'agama' => $pendaftaran->agama,
                'kewarganegaraan' => $pendaftaran->kewarganegaraan,
                'anak_ke' => $pendaftaran->anak_ke,
                'jml_saudara_kandung' => $pendaftaran->jml_saudara_kandung,
                'jml_saudara_tiri' => $pendaftaran->jml_saudara_tiri,
                'alamat' => $pendaftaran->alamat,
                'no_telp' => $pendaftaran->no_telp,
                'status_yatim' => $pendaftaran->status_yatim,
            ]
        );

        $this->auditAdmin('calon_siswa.ppdb.start', $pendaftaran, ['nisn' => $user->username]);

        return ApiResponse::success(
            PpdbResource::applicant($pendaftaran->fresh($this->pendaftaranRelations()))->resolve(),
            'Draft pendaftaran dibuat',
            201
        );
    }

    /**
     * PUT /api/ppdb/step/keterangan-pribadi
     */
    public function saveKeteranganPribadi(Request $request)
    {
        $request->merge($this->normalizeNumericInputs($request, [
            'anak_ke',
            'jml_saudara_kandung',
            'jml_saudara_tiri',
        ]));

        $validated = $request->validate([
            'nisn' => 'sometimes|string|min:10|max:20',
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
            'current_step' => 'sometimes|string|max:50',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Keterangan pribadi disimpan');
    }

    /**
     * PUT /api/ppdb/step/kesehatan
     */
    public function saveKesehatan(Request $request)
    {
        $request->merge($this->normalizeNumericInputs($request, [
            'berat_badan',
            'tinggi_badan',
        ]));

        $validated = $request->validate([
            'berat_badan' => 'sometimes|integer|min:1',
            'tinggi_badan' => 'sometimes|integer|min:1',
            'gol_darah' => 'sometimes|string|max:5',
            'penyakit_diderita' => 'nullable|string|max:255',
            'cacat_badan' => 'nullable|string|max:255',
            'current_step' => 'sometimes|string|max:50',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data kesehatan disimpan');
    }

    /**
     * PUT /api/ppdb/step/pendidikan-asal
     */
    public function savePendidikanAsal(Request $request)
    {
        $validated = $request->validate([
            'sekolah_asal' => 'sometimes|string|max:255',
            'tahun_lulus' => 'sometimes|string|max:4',
            'no_sttb' => 'sometimes|string|max:100',
            'pindahan_dari' => 'nullable|string|max:255',
            'no_surat_pindah' => 'nullable|string|max:100',
            'current_step' => 'sometimes|string|max:50',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data pendidikan asal disimpan');
    }

    /**
     * PUT /api/ppdb/step/orang-tua-wali
     */
    public function saveOrangTuaWali(Request $request)
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
            'no_hp_ayah' => 'nullable|string|max:20',
            'no_hp_ibu' => 'nullable|string|max:20',
            'nama_wali' => 'nullable|string|max:255',
            'pendidikan_wali' => 'nullable|string|max:100',
            'pekerjaan_wali' => 'nullable|string|max:100',
            'agama_wali' => 'nullable|string|max:50',
            'alamat_wali' => 'nullable|string',
            'current_step' => 'sometimes|string|max:50',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data orang tua/wali disimpan');
    }

    /**
     * PUT /api/ppdb/step/kepribadian
     */
    public function saveKepribadian(Request $request)
    {
        $validated = $request->validate([
            'hobi' => 'sometimes|string|max:255',
            'cita_cita' => 'sometimes|string|max:255',
            'current_step' => 'sometimes|string|max:50',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data kepribadian disimpan');
    }

    /**
     * PUT /api/ppdb/step/dokumen
     */
    public function saveDokumen(Request $request)
    {
        $validated = $request->validate([
            'catatan_dokumen' => 'nullable|string|max:500',
        ]);

        return $this->savePendaftaranStep(Auth::user(), $validated, 'Data dokumen disimpan');
    }

    /**
     * POST /api/ppdb/submit
     */
    public function submit(?Request $request = null)
    {
        $user = Auth::user();
        if ($user->role !== 'calon_siswa') {
            return ApiResponse::error('Hanya calon siswa yang dapat submit', 403);
        }

        $pendaftaran = $this->getByUser($user);
        if (! $pendaftaran) {
            return ApiResponse::error('Data pendaftaran tidak ditemukan. Mulai pendaftaran terlebih dahulu.', 404);
        }

        if (! in_array($pendaftaran->ppdb_status, ['draft', 'revisi'], true)) {
            return ApiResponse::error('Pendaftaran sudah dikirim atau sedang diproses.', 422);
        }

        $required = ['nama_lengkap', 'tempat_lahir', 'tgl_lahir', 'jenis_kelamin', 'agama', 'alamat', 'sekolah_asal', 'nama_ayah', 'nama_ibu', 'pekerjaan_ayah', 'pekerjaan_ibu'];
        foreach ($required as $field) {
            if (empty(trim((string) $pendaftaran->$field))) {
                return ApiResponse::error("Field {$field} wajib diisi sebelum submit.", 422);
            }
        }

        try {
            $this->berkasService->assertAllRequiredUploaded($pendaftaran->load('dokumen'));
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }

        $pendaftaran->ppdb_status = 'diajukan';
        $pendaftaran->status_pendaftaran = 'submitted';
        $pendaftaran->status_kelulusan = 'Pending';
        $pendaftaran->submitted_at = now();
        if (! $pendaftaran->no_registrasi) {
            $year = date('Y');
            $prefix = "PPDB-{$year}-";
            $last = Pendaftaran::where('no_registrasi', 'like', $prefix.'%')->orderByDesc('no_registrasi')->value('no_registrasi');
            $seq = 1;
            if ($last && preg_match('/(\d+)$/', $last, $m)) {
                $seq = (int) $m[1] + 1;
            }
            $pendaftaran->no_registrasi = $prefix.str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
        }
        $pendaftaran->save();

        $this->auditAdmin('calon_siswa.ppdb.submit', $pendaftaran, ['no_registrasi' => $pendaftaran->no_registrasi]);

        return ApiResponse::success(
            PpdbResource::applicant($pendaftaran->fresh(['dokumen']))->resolve(),
            'Pendaftaran berhasil diajukan'
        );
    }

    /**
     * GET /api/ppdb/status
     */
    public function status()
    {
        $pendaftaran = $this->getByUser(Auth::user());

        if (! $pendaftaran) {
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
    private function savePendaftaranStep(User $user, array $data, string $msg): JsonResponse
    {
        $pendaftaran = $this->getByUser($user);
        if (! $pendaftaran) {
            return ApiResponse::error('Data pendaftaran tidak ditemukan. Mulai pendaftaran terlebih dahulu.', 404);
        }

        $locked = ['diajukan', 'terverifikasi', 'diterima', 'ditolak', 'daftar_ulang', 'menjadi_murid'];
        if (in_array($pendaftaran->ppdb_status, $locked, true)) {
            return ApiResponse::error('Pendaftaran tidak dapat diubah pada status: '.$pendaftaran->ppdb_status.'.', 422);
        }

        $pendaftaran->fill($data);
        $pendaftaran->save();
        $this->syncPendaftaranDetail($pendaftaran, $data);

        $this->auditAdmin('calon_siswa.ppdb.update_step', $pendaftaran, ['step' => $data['current_step'] ?? 'unknown']);

        return ApiResponse::success(
            PpdbResource::applicant($pendaftaran->fresh($this->pendaftaranRelations()))->resolve(),
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

    public function calonUpdate(Request $request)
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
    public function calonPpdbRegister(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required_without:nama|string|max:255',
            'nama' => 'required_without:nama_lengkap|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'nisn' => 'required|string|min:10|max:20|unique:users,username',
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

    public function calonPpdbSaveFormulir(Request $request)
    {
        $validated = $request->validate([
            'nisn' => 'sometimes|string|min:10|max:20',
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

    public function calonPpdbUploadBerkas(Request $request)
    {
        $jenis = implode(',', PpdbBerkasService::allJenisKeys());
        $maxKb = (int) config('ppdb.berkas.max_size_kb', 2048);

        $validated = $request->validate([
            'jenis_berkas' => 'required|string|in:'.$jenis,
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:'.$maxKb,
        ]);

        try {
            $berkas = $this->uploadBerkas(
                Auth::user(),
                $validated['jenis_berkas'],
                $request->file('file')
            );

            $this->auditAdmin('calon_siswa.ppdb.upload_berkas', null, ['jenis_berkas' => $validated['jenis_berkas']]);

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

        if (! $data) {
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
        if (! $data) {
            return ApiResponse::error('Data pendaftaran tidak ditemukan', 404);
        }

        if (! in_array($data->ppdb_status, ['diterima', 'daftar_ulang', 'menjadi_murid'], true)) {
            return ApiResponse::error('Bukti hanya tersedia untuk pendaftar yang diterima', 403);
        }

        return ApiResponse::success($this->getBuktiData($data), 'Bukti pendaftaran');
    }

    public function publicInfo()
    {
        return ApiResponse::success($this->getPublicInfo(), 'Informasi PPDB');
    }

    public function downloadBrosur()
    {
        $path = $this->resolveBrosurStoragePath();
        if (! $path) {
            return response()->json(['message' => 'Brosur not found'], 404);
        }

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $downloadName = 'brosur-ppdb-mas-aisyiyah-medan'.($extension ? '.'.$extension : '');
        $mimeType = Storage::disk('public')->mimeType($path) ?: 'application/octet-stream';

        return Storage::disk('public')->download($path, $downloadName, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="'.$downloadName.'"',
        ]);
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
        $getJson = function ($key, $default) {
            $val = SystemSetting::getValue($key);
            if (! $val) {
                return $default;
            }
            $decoded = json_decode($val, true);

            return (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) ? $decoded : $default;
        };

        $profil = ProfilSekolah::first();

        return [
            'nama_sekolah' => $profil?->nama_sekolah ?: 'MAS Aisyiyah Medan',
            'judul' => SystemSetting::getValue('ppdb_judul') ?: 'Penerimaan Peserta Didik Baru',
            'tahun_ajaran' => SystemSetting::getValue('ppdb_tahun_ajaran') ?: '2026/2027',
            'deskripsi' => SystemSetting::getValue('ppdb_deskripsi') ?: 'MAS Aisyiyah Medan membuka pendaftaran peserta didik baru Tahun Pelajaran 2026/2027. Buat akun calon murid, lengkapi formulir dan berkas, lalu pantau status pendaftaran secara online.',
            'hero_highlights' => $getJson('ppdb_hero_highlights', [
                ['teks' => 'Gratis uang pembangunan', 'ikon' => 'gift'],
                ['teks' => 'Gratis pendaftaran 20 pendaftar pertama', 'ikon' => 'award'],
                ['teks' => 'Diskon alumni Muhammadiyah/Aisyiyah', 'ikon' => 'percent'],
                ['teks' => 'Gratis SPP bagi anak yatim (syarat berlaku)', 'ikon' => 'heart'],
            ]),
            'gelombang' => $getJson('ppdb_gelombang', [
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
            ]),
            'promo' => $getJson('ppdb_promo', [
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
            ]),
            'persyaratan' => $getJson('ppdb_persyaratan', [
                'Mengisi formulir pendaftaran online',
                'Fotokopi akta kelahiran',
                'Fotokopi kartu keluarga',
                'Fotokopi KTP orang tua',
                'Pas foto 3×4 sebanyak 4 lembar',
                'Fotokopi ijazah/SKL legalisir',
                'Fotokopi KIP (jika ada)',
                'NISN',
            ]),
            'fasilitas' => $getJson('ppdb_fasilitas', [
                ['nama' => 'Ruang Kelas Luas', 'ikon' => 'building'],
                ['nama' => 'Ruang Perpustakaan', 'ikon' => 'library'],
                ['nama' => 'Mushola', 'ikon' => 'church'],
                ['nama' => 'Lapangan Olahraga', 'ikon' => 'volleyball'],
                ['nama' => 'Ruang Komputer', 'ikon' => 'monitor'],
                ['nama' => 'Ruang Keterampilan', 'ikon' => 'utensils'],
            ]),

            'alur' => $getJson('ppdb_alur', [
                'Lihat informasi PPDB',
                'Buat akun calon murid',
                'Login calon murid',
                'Isi formulir online',
                'Upload berkas',
                'Submit pendaftaran',
                'Verifikasi admin',
                'Pengumuman hasil',
            ]),
            'kontak' => $getJson('ppdb_kontak', [
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
            ]),
            'alamat' => $profil?->alamat ?: 'Jl. Demak No. 3, Medan',
            'brosur' => $this->resolveBrosurPublicUrl(),
            'diperbarui_pada' => now()->toIso8601String(),
        ];
    }

    private function resolveBrosurStoragePath(): ?string
    {
        $brosurUrl = SystemSetting::getValue('ppdb_brosur');

        if ($brosurUrl) {
            $path = parse_url($brosurUrl, PHP_URL_PATH) ?: '';
            $path = preg_replace('/^\/storage\//', '', $path);

            if ($path && Storage::disk('public')->exists($path)) {
                return $path;
            }
        }

        $files = Storage::disk('public')->files('ppdb/brosur');
        if (empty($files)) {
            return null;
        }

        usort($files, function ($a, $b) {
            return Storage::disk('public')->lastModified($b) <=> Storage::disk('public')->lastModified($a);
        });

        return $files[0] ?? null;
    }

    private function resolveBrosurPublicUrl(): ?string
    {
        $path = $this->resolveBrosurStoragePath();

        return $path ? Storage::disk('public')->url($path) : null;
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
        return Pendaftaran::with($this->pendaftaranRelations())
            ->where('id_user', $user->id_user)
            ->first();
    }

    private function pendaftaranRelations(): array
    {
        return [
            'berkas',
            'user',
            'keteranganPribadi',
            'kesehatan',
            'pendidikanAsal',
            'orangTuaWali',
            'kepribadian',
            'dokumen',
        ];
    }

    private function syncPendaftaranDetail(Pendaftaran $pendaftaran, array $data): void
    {
        $groups = [
            'keteranganPribadi' => [
                'nisn',
                'nama_lengkap',
                'tempat_lahir',
                'tgl_lahir',
                'jenis_kelamin',
                'agama',
                'kewarganegaraan',
                'anak_ke',
                'jml_saudara_kandung',
                'jml_saudara_tiri',
                'alamat',
                'no_telp',
                'status_yatim',
            ],
            'kesehatan' => [
                'berat_badan',
                'tinggi_badan',
                'gol_darah',
                'penyakit_diderita',
                'cacat_badan',
            ],
            'pendidikanAsal' => [
                'sekolah_asal',
                'tahun_lulus',
                'no_sttb',
                'pindahan_dari',
                'no_surat_pindah',
            ],
            'orangTuaWali' => [
                'nama_ayah',
                'nama_ibu',
                'pendidikan_ayah',
                'pendidikan_ibu',
                'pekerjaan_ayah',
                'pekerjaan_ibu',
                'agama_ortu',
                'alamat_ortu',
                'no_hp_ortu',
                'no_hp_ayah',
                'no_hp_ibu',
                'nama_wali',
                'pendidikan_wali',
                'pekerjaan_wali',
                'agama_wali',
                'alamat_wali',
            ],
            'kepribadian' => [
                'hobi',
                'cita_cita',
            ],
            'dokumen' => [
                'file_ijazah',
                'file_stk',
                'file_pas_photo',
                'file_nisn',
                'file_kk',
                'file_ktp_ortua',
                'catatan_dokumen',
            ],
        ];

        foreach ($groups as $relation => $fields) {
            $payload = array_intersect_key($data, array_flip($fields));

            if ($payload === []) {
                continue;
            }

            $pendaftaran->{$relation}()->updateOrCreate(
                ['pendaftaran_id' => $pendaftaran->id_pendaftaran],
                $payload
            );
        }
    }

    private function saveFormulir(User $user, array $data): Pendaftaran
    {
        $mapped = $this->mapFormulirInput($data);
        $pendaftaran = $this->state->saveDraft($user, $mapped);
        $this->syncPendaftaranDetail($pendaftaran, $mapped);

        if (! empty($data['nisn'])) {
            $pendaftaran->nisn = $data['nisn'];
            $pendaftaran->save();
        }

        return $pendaftaran->fresh($this->pendaftaranRelations());
    }

    private function uploadBerkas(User $user, string $jenis, UploadedFile $file): array
    {
        return $this->berkasService->upload($user, $jenis, $file);
    }

    private function processSubmit(User $user): Pendaftaran
    {
        $pendaftaran = $this->state->submit($user);
        if (! $pendaftaran->no_registrasi) {
            $pendaftaran->no_registrasi = $this->generateNoRegistrasi();
            $pendaftaran->submitted_at = now();
            $pendaftaran->save();
        }

        return $pendaftaran->fresh(['berkas']);
    }

    public function adminPpdbStats()
    {
        $total = Pendaftaran::count();
        $accepted = Pendaftaran::whereIn('ppdb_status', ['diterima', 'accepted', 'menjadi_murid'])->count();
        $rejected = Pendaftaran::whereIn('ppdb_status', ['ditolak', 'rejected'])->count();

        $belum_mengirim = Pendaftaran::where('ppdb_status', 'draft')->count();
        $sudah_mengirim = Pendaftaran::whereIn('ppdb_status', ['submitted', 'diajukan', 'terverifikasi', 'verified'])->count();
        $revisi = Pendaftaran::whereIn('ppdb_status', ['revisi', 'dikembalikan'])->count();

        return ApiResponse::success([
            'total' => $total,
            'diterima' => $accepted,
            'ditolak' => $rejected,
            'belum_mengirim' => $belum_mengirim,
            'sudah_mengirim' => $sudah_mengirim,
            'revisi' => $revisi,
        ]);
    }

    public function adminPpdbIndex(Request $request)
    {
        return ApiResponse::paginated(
            $this->adminList($request->query('search'), $request->query('status'), (int) $request->query('per_page', 10)),
            'Berhasil mengambil data PPDB'
        );
    }

    private function adminList(?string $search, ?string $status, int $perPage): LengthAwarePaginator
    {
        $query = Pendaftaran::with(['user', 'berkas'])->orderByDesc('updated_at');

        if ($status === 'belum_mengirim') {
            $query->where('ppdb_status', 'draft');
        } elseif ($status === 'sudah_mengirim') {
            $query->whereIn('ppdb_status', ['submitted', 'diajukan', 'terverifikasi', 'verified']);
        } elseif ($status === 'revisi') {
            $query->whereIn('ppdb_status', ['revisi', 'dikembalikan']);
        } elseif ($status === 'diterima') {
            $query->whereIn('ppdb_status', ['diterima', 'accepted', 'menjadi_murid']);
        } elseif ($status === 'ditolak') {
            $query->whereIn('ppdb_status', ['ditolak', 'rejected']);
        } elseif ($status) {
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
        $pendaftaran = Pendaftaran::with(['user', 'berkas', 'dokumen'])->findOrFail($id);

        $dokumen = $pendaftaran->dokumen;
        if ($dokumen) {
            $pendaftaran->file_ijazah ??= $dokumen->file_ijazah;
            $pendaftaran->file_stk ??= $dokumen->file_stk;
            $pendaftaran->file_pas_photo ??= $dokumen->file_pas_photo;
            $pendaftaran->file_nisn ??= $dokumen->file_nisn;
            $pendaftaran->file_kk ??= $dokumen->file_kk;
            $pendaftaran->file_ktp_ortua ??= $dokumen->file_ktp_ortua;
        }

        return $pendaftaran;
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

    public function adminPpdbRevisi(Request $request, $id)
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

    public function adminPpdbTerima(Request $request, $id)
    {
        return ApiResponse::success($this->adminTerima((int) $id, $request->input('catatan', '')), 'Berhasil diterima');
    }

    private function adminTerima(int $id, ?string $catatan = null): Pendaftaran
    {
        $pendaftaran = $this->state->transitionByAdmin(
            Pendaftaran::findOrFail($id),
            'diterima',
            $catatan
        );

        // Auto enroll menjadi siswa
        $this->enrollment->enrollCalonSiswa($pendaftaran->id_user);

        return $pendaftaran->fresh(['user', 'berkas']);
    }

    public function adminPpdbTolak(Request $request, $id)
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

    /**
     * PATCH /admin/ppdb/{id}/status — legacy route compatibility.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:terverifikasi,diterima,ditolak,revisi',
            'catatan' => 'nullable|string|max:1000',
        ]);

        $status = $validated['status'];
        $catatan = $validated['catatan'] ?? '';

        return match ($status) {
            'terverifikasi' => $this->adminPpdbVerifikasi($id),
            'diterima' => $this->adminPpdbTerima($request, $id),
            'ditolak' => $this->adminPpdbTolak($request, $id),
            'revisi' => $this->adminPpdbRevisi($request, $id),
            default => ApiResponse::error('Status tidak valid', 422),
        };
    }

    public function adminPpdbJadikanMurid(Request $request, $id)
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

    private function normalizeNumericInputs(Request $request, array $fields): array
    {
        $normalized = [];

        foreach ($fields as $field) {
            if (! $request->exists($field)) {
                continue;
            }

            $value = $request->input($field);
            if ($value === null) {
                continue;
            }

            if (is_string($value)) {
                $value = trim($value);
                if ($value === '') {
                    $normalized[$field] = null;

                    continue;
                }
            }

            if (is_numeric($value)) {
                $normalized[$field] = (int) $value;
            }
        }

        return $normalized;
    }
}
