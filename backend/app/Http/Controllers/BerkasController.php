<?php

namespace App\Http\Controllers;

use App\Models\BerkasPendaftaran;
use App\Models\Pendaftaran;
use App\Models\User;
use App\Utils\ApiResponse;
use App\Utils\AuditsAdminActions;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;

class BerkasController extends Controller
{
    use AuditsAdminActions;

    public function index()
    {
        try {
            return ApiResponse::success($this->listForUser(Auth::user()));
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function store(Request $request)
    {
        $jenis = implode(',', self::allJenisKeys());
        $maxKb = 2048;

        $validated = $request->validate([
            'jenis_berkas' => 'required|string|in:'.$jenis,
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:'.$maxKb,
        ]);

        try {
            $item = $this->upload(
                Auth::user(),
                $validated['jenis_berkas'],
                $request->file('file')
            );

            $this->auditAdmin('calon_siswa.berkas.upload', null, ['jenis_berkas' => $validated['jenis_berkas']]);

            return ApiResponse::success($item, 'Berkas berhasil diunggah');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    public function destroy(string $jenis)
    {
        try {
            $this->delete(Auth::user(), $jenis);

            $this->auditAdmin('calon_siswa.berkas.delete', null, ['jenis_berkas' => $jenis]);

            return ApiResponse::success(null, 'Berkas berhasil dihapus');
        } catch (InvalidArgumentException $e) {
            return ApiResponse::error($e->getMessage(), 422);
        }
    }

    // --- Inlined from PpdbBerkasService ---

    /** @var array<string, string> key => label */
    public const JENIS = [
        'ijazah_atau_skl' => 'Ijazah / SKHUN',
        'stk' => 'STK',
        'pas_foto' => 'Pas Foto',
        'nisn' => 'NISN',
        'kartu_keluarga' => 'Kartu Keluarga (KK)',
        'ktp_orang_tua' => 'KTP Orang Tua',
    ];

    /** Alias jenis lama → baru (kompatibilitas data) */
    private const LEGACY_JENIS_MAP = [
        'foto' => 'pas_foto',
        'rapor' => 'stk',
        'akta_kelahiran' => 'nisn',
    ];

    private const LEGACY_FILE_COLUMNS = [
        'ijazah_atau_skl' => 'file_ijazah',
        'kartu_keluarga' => 'file_kk',
        'pas_foto' => 'file_pas_photo',
        'stk' => 'file_stk',
        'nisn' => 'file_nisn',
        'ktp_orang_tua' => 'file_ktp_ortu',
    ];

    public static function normalizeJenis(string $jenis): string
    {
        return self::LEGACY_JENIS_MAP[$jenis] ?? $jenis;
    }

    public static function allJenisKeys(): array
    {
        return array_keys(self::JENIS);
    }

    /**
     * @return array{items: array<int, array>, can_edit: bool, max_size_kb: int, allowed_extensions: array}
     */
    private function listForUser(User $user): array
    {
        $pendaftaran = $this->getPendaftaranByUser($user);
        if (! $pendaftaran) {
            return [
                'items' => $this->buildPlaceholderItems(),
                'can_edit' => true,
                'max_size_kb' => config('ppdb.berkas.max_size_kb', 2048),
                'allowed_extensions' => config('ppdb.berkas.allowed_extensions', ['pdf', 'jpg', 'jpeg', 'png']),
            ];
        }

        $pendaftaran->load('berkas');
        $byJenis = $pendaftaran->berkas->keyBy(fn ($b) => self::normalizeJenis($b->jenis_berkas));

        $items = [];
        foreach (self::JENIS as $key => $label) {
            $row = $byJenis->get($key);
            $items[] = $this->formatBerkasItem($key, $label, $row);
        }

        return [
            'items' => $items,
            'can_edit' => $this->canEditPendaftaran($pendaftaran),
            'max_size_kb' => config('ppdb.berkas.max_size_kb', 2048),
            'allowed_extensions' => config('ppdb.berkas.allowed_extensions', ['pdf', 'jpg', 'jpeg', 'png']),
        ];
    }

    private function upload(User $user, string $jenis, UploadedFile $file): array
    {
        $jenis = self::normalizeJenis($jenis);
        if (! array_key_exists($jenis, self::JENIS)) {
            throw new InvalidArgumentException('Jenis berkas tidak valid.');
        }

        $pendaftaran = $this->resolveEditablePendaftaran($user);
        $this->assertAllowedFile($file, $jenis);

        $disk = config('ppdb.berkas.storage_disk', 'public');
        $existing = BerkasPendaftaran::where('pendaftaran_id', $pendaftaran->id_pendaftaran)
            ->whereIn('jenis_berkas', [$jenis, ...array_keys(array_filter(self::LEGACY_JENIS_MAP, fn ($v) => $v === $jenis))])
            ->first();

        if ($existing?->file_path && Storage::disk($disk)->exists($existing->file_path)) {
            Storage::disk($disk)->delete($existing->file_path);
        }

        $ext = strtolower($file->getClientOriginalExtension());
        $safeName = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'berkas';
        $storedPath = $file->storeAs(
            config('ppdb.berkas.storage_path_prefix', 'ppdb').'/'.$user->username,
            $jenis.'-'.$safeName.'-'.time().'.'.$ext,
            $disk
        );

        $berkas = BerkasPendaftaran::updateOrCreate(
            [
                'pendaftaran_id' => $pendaftaran->id_pendaftaran,
                'jenis_berkas' => $jenis,
            ],
            [
                'file_path' => $storedPath,
                'status_verifikasi' => 'pending',
                'catatan' => null,
            ]
        );

        $this->syncLegacyColumn($pendaftaran, $jenis, $storedPath);
        $this->removeLegacyDuplicateRows($pendaftaran->id_pendaftaran, $jenis);

        return $this->formatBerkasItem($jenis, self::JENIS[$jenis], $berkas->fresh());
    }

    private function delete(User $user, string $jenis): void
    {
        $jenis = self::normalizeJenis($jenis);
        $pendaftaran = $this->resolveEditablePendaftaran($user);

        $berkas = BerkasPendaftaran::where('pendaftaran_id', $pendaftaran->id_pendaftaran)
            ->where('jenis_berkas', $jenis)
            ->first();

        if (! $berkas) {
            throw new InvalidArgumentException('Berkas tidak ditemukan.');
        }

        $disk = config('ppdb.berkas.storage_disk', 'public');
        if ($berkas->file_path && Storage::disk($disk)->exists($berkas->file_path)) {
            Storage::disk($disk)->delete($berkas->file_path);
        }

        $berkas->delete();
        $this->clearLegacyColumn($pendaftaran, $jenis);
    }

    private function assertAllRequiredUploaded(Pendaftaran $pendaftaran): void
    {
        $uploaded = $pendaftaran->berkas()
            ->pluck('jenis_berkas')
            ->map(fn ($j) => self::normalizeJenis($j))
            ->unique()
            ->toArray();

        foreach (array_keys(self::JENIS) as $jenis) {
            if (! in_array($jenis, $uploaded, true)) {
                throw new InvalidArgumentException('Berkas '.self::JENIS[$jenis].' wajib diunggah sebelum submit.');
            }
        }
    }

    private function resolveEditablePendaftaran(User $user): Pendaftaran
    {
        $pendaftaran = $this->getPendaftaranByUser($user);
        if (! $pendaftaran) {
            throw new InvalidArgumentException('Mulai pendaftaran PPDB terlebih dahulu.');
        }

        if (! $this->canEditPendaftaran($pendaftaran)) {
            throw new InvalidArgumentException('Berkas tidak dapat diubah pada status pendaftaran saat ini.');
        }

        return $pendaftaran;
    }

    private function canEditPendaftaran(Pendaftaran $pendaftaran): bool
    {
        return $pendaftaran->isEditable();
    }

    private function assertAllowedFile(UploadedFile $file, string $jenis): void
    {
        $ext = strtolower($file->getClientOriginalExtension() ?: '');
        $allowedExt = config('ppdb.berkas.allowed_extensions', ['pdf', 'jpg', 'jpeg', 'png']);

        if (! in_array($ext, $allowedExt, true)) {
            throw new InvalidArgumentException(
                'Format '.self::JENIS[$jenis].' harus: '.implode(', ', $allowedExt).'.'
            );
        }

        $mime = $file->getMimeType();
        $allowedMimes = config('ppdb.berkas.allowed_mimes', []);
        // Default MIME types for common document/image formats
        if (empty($allowedMimes)) {
            $allowedMimes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/jpg',
            ];
        }
        if ($mime && ! in_array($mime, $allowedMimes, true)) {
            throw new InvalidArgumentException('Tipe file tidak valid atau tidak aman.');
        }

        $maxBytes = (int) config('ppdb.berkas.max_size_kb', 2048) * 1024;
        if ($file->getSize() > $maxBytes) {
            $maxMb = round($maxBytes / 1024 / 1024, 1);
            throw new InvalidArgumentException('Ukuran file maksimal '.$maxMb.' MB.');
        }
    }

    private function formatBerkasItem(string $jenis, string $label, ?BerkasPendaftaran $row): array
    {
        if (! $row || ! $row->file_path) {
            return [
                'jenis_berkas' => $jenis,
                'label' => $label,
                'status' => 'belum_upload',
                'status_verifikasi' => null,
                'url' => null,
                'preview_url' => null,
                'file_name' => null,
                'file_size' => null,
                'mime_type' => null,
                'catatan' => null,
                'uploaded_at' => null,
            ];
        }

        $disk = config('ppdb.berkas.storage_disk', 'public');
        $url = Storage::disk($disk)->url($row->file_path);
        $ext = strtolower(pathinfo($row->file_path, PATHINFO_EXTENSION));

        return [
            'id' => $row->id,
            'jenis_berkas' => $jenis,
            'label' => $label,
            'status' => $this->normalizeStatus($row->status_verifikasi),
            'status_verifikasi' => $row->status_verifikasi,
            'url' => $url,
            'preview_url' => $url,
            'file_name' => basename($row->file_path),
            'file_size' => Storage::disk($disk)->exists($row->file_path)
                ? Storage::disk($disk)->size($row->file_path)
                : null,
            'mime_type' => $this->mimeFromExtension($ext),
            'catatan' => $row->catatan,
            'uploaded_at' => $row->updated_at?->toIso8601String(),
        ];
    }

    private function normalizeStatus(?string $dbStatus): string
    {
        return match ($dbStatus) {
            'diterima', 'valid', 'terverifikasi' => 'valid',
            'ditolak', 'rejected' => 'ditolak',
            'pending', 'menunggu_verifikasi' => 'menunggu_verifikasi',
            default => 'menunggu_verifikasi',
        };
    }

    private function buildPlaceholderItems(): array
    {
        $items = [];
        foreach (self::JENIS as $key => $label) {
            $items[] = $this->formatBerkasItem($key, $label, null);
        }

        return $items;
    }

    private function mimeFromExtension(string $ext): string
    {
        return match ($ext) {
            'pdf' => 'application/pdf',
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            default => 'application/octet-stream',
        };
    }

    private function syncLegacyColumn(Pendaftaran $pendaftaran, string $jenis, string $path): void
    {
        if (! isset(self::LEGACY_FILE_COLUMNS[$jenis])) {
            return;
        }
        $col = self::LEGACY_FILE_COLUMNS[$jenis];
        if (Schema::hasColumn('pendaftaran', $col)) {
            $pendaftaran->{$col} = $path;
            $pendaftaran->save();
        }
    }

    private function clearLegacyColumn(Pendaftaran $pendaftaran, string $jenis): void
    {
        if (! isset(self::LEGACY_FILE_COLUMNS[$jenis])) {
            return;
        }
        $col = self::LEGACY_FILE_COLUMNS[$jenis];
        if (Schema::hasColumn('pendaftaran', $col)) {
            $pendaftaran->{$col} = null;
            $pendaftaran->save();
        }
    }

    private function getPendaftaranByUser(User $user): ?Pendaftaran
    {
        return Pendaftaran::where('id_user', $user->id_user)->first();
    }

    private function removeLegacyDuplicateRows(int $pendaftaranId, string $canonicalJenis): void
    {
        $legacyKeys = array_keys(array_filter(self::LEGACY_JENIS_MAP, fn ($v) => $v === $canonicalJenis));
        if (! $legacyKeys) {
            return;
        }

        BerkasPendaftaran::where('pendaftaran_id', $pendaftaranId)
            ->whereIn('jenis_berkas', $legacyKeys)
            ->delete();
    }
}
