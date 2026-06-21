<?php

namespace App\Services;

use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * Layer formulir PPDB — terpisah dari registrasi akun (AccountRegistrationService).
 * Data pendaftaran pertama kali dibuat melalui start(), bukan saat register user.
 */
class PpdbRegistrationService
{
    public function __construct(private PpdbBerkasService $berkasService) {}

    /** Indeks langkah formulir (1-based) — step 1 = keterangan pribadi */
    public const FIRST_STEP = 1;

    public const STEPS = [
        'keterangan-pribadi',
        'kesehatan',
        'pendidikan-asal',
        'orang-tua-wali',
        'kepribadian',
        'dokumen',
    ];

    public const WIZARD_STEP_KEYS = [
        'keterangan-pribadi',
        'kesehatan',
        'pendidikan-asal',
        'orang-tua-wali',
        'kepribadian',
        'dokumen',
        'review',
    ];

    private const PPDB_STATUS_MAP = [
        'draft' => 'draft',
        'revision' => 'revisi',
        'submitted' => 'diajukan',
        'verified' => 'terverifikasi',
        'accepted' => 'diterima',
        'rejected' => 'ditolak',
    ];

    private const STATUS_NORMALIZE = [
        'revisi' => 'revision',
        'diajukan' => 'submitted',
        'terverifikasi' => 'verified',
        'diterima' => 'accepted',
        'daftar_ulang' => 'accepted',
        'ditolak' => 'rejected',
    ];

    public function getByUser(User $user): ?Pendaftaran
    {
        return Pendaftaran::with([
            'keteranganPribadi',
            'kesehatan',
            'pendidikanAsal',
            'orangTuaWali',
            'kepribadian',
            'dokumen',
        ])->where('id_user', $user->id_user)->first();
    }

    /**
     * Mulai / lanjutkan draft PPDB.
     *
     * Algoritma:
     * - Belum ada baris pendaftaran → buat draft (status draft, current_step 1)
     * - Sudah ada & status draft/revision → kembalikan draft (lanjutkan)
     * - Sudah ada & status lain → tolak (gunakan halaman status)
     *
     * @return array{pendaftaran: Pendaftaran, created: bool, resumed: bool}
     */
    public function start(User $user): array
    {
        $this->assertCalonSiswa($user);

        $existing = $this->getByUser($user);

        if ($existing) {
            $status = $this->normalizeStatus($existing);

            if (! in_array($status, ['draft', 'revision'], true)) {
                throw new InvalidArgumentException(
                    'Pendaftaran sudah dikirim atau diproses. Pantau status di dashboard.'
                );
            }

            if (empty($existing->current_step) || $existing->current_step === '0') {
                $existing->current_step = (string) self::FIRST_STEP;
                $existing->save();
            }

            return [
                'pendaftaran' => $existing->load($this->relations()),
                'created' => false,
                'resumed' => true,
            ];
        }

        $pendaftaran = DB::transaction(function () use ($user) {
            $pendaftaran = Pendaftaran::create([
                'id_user' => $user->id_user,
                'tahun_pelajaran' => '2026/2027',
                'status_pendaftaran' => 'draft',
                'ppdb_status' => 'draft',
                'status_kelulusan' => 'Pending',
                'current_step' => (string) self::FIRST_STEP,
            ]);

            $pendaftaran->keteranganPribadi()->create([
                'nama_lengkap' => $user->name ?? $user->username,
                'nisn' => $user->username,
            ]);

            return $pendaftaran->load($this->relations());
        });

        return [
            'pendaftaran' => $pendaftaran,
            'created' => true,
            'resumed' => false,
        ];
    }

    /**
     * Payload API untuk POST /ppdb/start (kompatibel dengan wizard frontend).
     *
     * @param  array{pendaftaran: Pendaftaran, created: bool, resumed: bool}  $result
     */
    public function formatStartResponse(array $result): array
    {
        $pendaftaran = $result['pendaftaran'];
        $stepIndex = $this->resolveStepIndex($pendaftaran->current_step);

        return array_merge($this->toArray($pendaftaran) ?? [], [
            'user_id' => $pendaftaran->id_user,
            'id_user' => $pendaftaran->id_user,
            'created' => $result['created'],
            'resumed' => $result['resumed'],
            'current_step_index' => $stepIndex,
            'current_step_key' => $this->stepKeyFromIndex($stepIndex),
            'redirect_path' => '/ppdb/registrasi',
        ]);
    }

    public function resolveStepIndex(?string $stored): int
    {
        if ($stored === null || $stored === '') {
            return self::FIRST_STEP;
        }

        if ($stored === 'submitted' || $stored === 'review') {
            return count(self::WIZARD_STEP_KEYS);
        }

        if (ctype_digit((string) $stored)) {
            $n = (int) $stored;

            return max(self::FIRST_STEP, min(count(self::WIZARD_STEP_KEYS), $n));
        }

        $idx = array_search($stored, self::STEPS, true);
        if ($idx !== false) {
            return $idx + 1;
        }

        $wizardIdx = array_search($stored, self::WIZARD_STEP_KEYS, true);
        if ($wizardIdx !== false) {
            return $wizardIdx + 1;
        }

        return self::FIRST_STEP;
    }

    public function stepKeyFromIndex(int $index): string
    {
        return self::WIZARD_STEP_KEYS[max(0, min(count(self::WIZARD_STEP_KEYS) - 1, $index - 1))]
            ?? self::WIZARD_STEP_KEYS[0];
    }

    public function saveKeteranganPribadi(User $user, array $data): Pendaftaran
    {
        $pendaftaran = $this->getDraftOrFail($user);
        $pendaftaran->keteranganPribadi()->updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id_pendaftaran],
            $data
        );
        $this->updateStep($pendaftaran, 'kesehatan');

        return $pendaftaran->fresh($this->relations());
    }

    public function saveKesehatan(User $user, array $data): Pendaftaran
    {
        $pendaftaran = $this->getDraftOrFail($user);
        $pendaftaran->kesehatan()->updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id_pendaftaran],
            $data
        );
        $this->updateStep($pendaftaran, 'pendidikan-asal');

        return $pendaftaran->fresh($this->relations());
    }

    public function savePendidikanAsal(User $user, array $data): Pendaftaran
    {
        $pendaftaran = $this->getDraftOrFail($user);
        $pendaftaran->pendidikanAsal()->updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id_pendaftaran],
            $data
        );
        $this->updateStep($pendaftaran, 'orang-tua-wali');

        return $pendaftaran->fresh($this->relations());
    }

    public function saveOrangTuaWali(User $user, array $data): Pendaftaran
    {
        $pendaftaran = $this->getDraftOrFail($user);
        $pendaftaran->orangTuaWali()->updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id_pendaftaran],
            $data
        );
        $this->updateStep($pendaftaran, 'kepribadian');

        return $pendaftaran->fresh($this->relations());
    }

    public function saveKepribadian(User $user, array $data): Pendaftaran
    {
        $pendaftaran = $this->getDraftOrFail($user);
        $pendaftaran->kepribadian()->updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id_pendaftaran],
            $data
        );
        $this->updateStep($pendaftaran, 'dokumen');

        return $pendaftaran->fresh($this->relations());
    }

    public function saveDokumen(User $user, array $data): Pendaftaran
    {
        $pendaftaran = $this->getDraftOrFail($user);
        $pendaftaran->dokumen()->updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id_pendaftaran],
            $data
        );
        $this->updateStep($pendaftaran, 'review');

        return $pendaftaran->fresh($this->relations());
    }

    public function submit(User $user): Pendaftaran
    {
        $pendaftaran = $this->getDraftOrFail($user);
        $pendaftaran->load('berkas');
        $this->assertCompleteForSubmit($pendaftaran);
        $this->berkasService->assertAllRequiredUploaded($pendaftaran);

        return DB::transaction(function () use ($pendaftaran) {
            $nomor = $this->generateNomorPendaftaran();
            $pendaftaran->nomor_pendaftaran = $nomor;
            $pendaftaran->no_registrasi = $nomor;
            $pendaftaran->status_pendaftaran = 'submitted';
            $pendaftaran->ppdb_status = self::PPDB_STATUS_MAP['submitted'];
            $pendaftaran->status_kelulusan = 'Pending';
            $pendaftaran->submitted_at = now();
            $pendaftaran->current_step = 'submitted';
            $pendaftaran->save();

            return $pendaftaran->fresh($this->relations());
        });
    }

    public function toArray(?Pendaftaran $pendaftaran): ?array
    {
        if (! $pendaftaran) {
            return null;
        }

        $stepIndex = $this->resolveStepIndex($pendaftaran->current_step);

        return [
            'id' => $pendaftaran->id_pendaftaran,
            'user_id' => $pendaftaran->id_user,
            'nomor_pendaftaran' => $pendaftaran->nomor_pendaftaran ?? $pendaftaran->no_registrasi,
            'tahun_pelajaran' => $pendaftaran->tahun_pelajaran,
            'tahun_ajaran' => $pendaftaran->tahun_pelajaran,
            'status_pendaftaran' => $this->normalizeStatus($pendaftaran),
            'status' => $this->normalizeStatus($pendaftaran),
            'ppdb_status' => $pendaftaran->ppdb_status,
            'current_step' => $pendaftaran->current_step,
            'current_step_index' => $stepIndex,
            'current_step_key' => $this->stepKeyFromIndex($stepIndex),
            'submitted_at' => $pendaftaran->submitted_at,
            'verified_at' => $pendaftaran->verified_at,
            'catatan_admin' => $pendaftaran->catatan_admin,
            'keterangan_pribadi' => $pendaftaran->keteranganPribadi,
            'kesehatan' => $pendaftaran->kesehatan,
            'pendidikan_asal' => $pendaftaran->pendidikanAsal,
            'orang_tua_wali' => $pendaftaran->orangTuaWali,
            'kepribadian' => $pendaftaran->kepribadian,
            'dokumen' => $pendaftaran->dokumen,
        ];
    }

    protected function assertCalonSiswa(User $user): void
    {
        if ($user->role !== 'calon_siswa') {
            throw new InvalidArgumentException('Hanya calon siswa yang dapat mengakses PPDB.');
        }
    }

    protected function getDraftOrFail(User $user): Pendaftaran
    {
        $this->assertCalonSiswa($user);
        $pendaftaran = $this->getByUser($user);

        if (! $pendaftaran) {
            throw new InvalidArgumentException('Pendaftaran belum dimulai. Gunakan endpoint start terlebih dahulu.');
        }

        if (! $this->isEditable($pendaftaran)) {
            throw new InvalidArgumentException('Pendaftaran tidak dapat diubah pada status: '.$this->normalizeStatus($pendaftaran));
        }

        return $pendaftaran;
    }

    public function normalizeStatus(Pendaftaran $pendaftaran): string
    {
        $raw = $pendaftaran->status_pendaftaran ?? $pendaftaran->ppdb_status ?? 'draft';

        return self::STATUS_NORMALIZE[$raw] ?? $raw;
    }

    protected function isEditable(Pendaftaran $pendaftaran): bool
    {
        return in_array($this->normalizeStatus($pendaftaran), ['draft', 'revision'], true);
    }

    protected function updateStep(Pendaftaran $pendaftaran, string $stepKey): void
    {
        $idx = array_search($stepKey, self::STEPS, true);
        $pendaftaran->current_step = (string) ($idx !== false ? $idx + 1 : self::FIRST_STEP);
        $pendaftaran->save();
    }

    protected function assertCompleteForSubmit(Pendaftaran $pendaftaran): void
    {
        $pribadi = $pendaftaran->keteranganPribadi;
        if (! $pribadi || empty(trim((string) $pribadi->nama_lengkap))) {
            throw new InvalidArgumentException('Keterangan pribadi belum lengkap (nama lengkap wajib).');
        }

        $pendidikan = $pendaftaran->pendidikanAsal;
        if (! $pendidikan || empty(trim((string) $pendidikan->sekolah_asal))) {
            throw new InvalidArgumentException('Pendidikan asal belum lengkap (sekolah asal wajib).');
        }

        $ortu = $pendaftaran->orangTuaWali;
        if (! $ortu || empty(trim((string) $ortu->nama_ayah)) || empty(trim((string) $ortu->nama_ibu))) {
            throw new InvalidArgumentException('Data orang tua belum lengkap.');
        }
    }

    protected function generateNomorPendaftaran(): string
    {
        $year = date('Y');
        $prefix = "PPDB-{$year}-";

        return DB::transaction(function () use ($prefix) {
            $last = Pendaftaran::where('nomor_pendaftaran', 'like', $prefix.'%')
                ->orWhere('no_registrasi', 'like', $prefix.'%')
                ->lockForUpdate()
                ->orderByDesc('nomor_pendaftaran')
                ->value('nomor_pendaftaran')
                ?? Pendaftaran::where('no_registrasi', 'like', $prefix.'%')
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

    protected function relations(): array
    {
        return [
            'keteranganPribadi',
            'kesehatan',
            'pendidikanAsal',
            'orangTuaWali',
            'kepribadian',
            'dokumen',
            'berkas',
        ];
    }
}
