<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Account\AccountRegistrationService;
use App\Services\PermissionService;
use App\Utils\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /** @deprecated Gunakan registerCalonSiswa — alias kompatibilitas */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nisn' => 'required|string|max:20|unique:users,username',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $data = $validated;
        $user = $this->registerCalonSiswaData([
            'name' => $data['nama'],
            'email' => $data['email'],
            'username' => $data['nisn'],
            'password' => $data['password'],
        ]);

        return ApiResponse::success(
            (new UserResource($user))->resolve(),
            'Akun berhasil dibuat. Login lalu mulai formulir PPDB dari dashboard jika ingin mendaftar.',
            201
        );
    }

    /**
     * Registrasi akun saja (tabel users). Tidak membuat draft pendaftaran PPDB.
     */
    public function registerCalonSiswa(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:20',
                Rule::unique('users', 'username'),
            ],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', Password::min(8), 'confirmed'],
        ]);

        $user = $this->registerCalonSiswaData($validated);

        return ApiResponse::success(
            [
                'user' => (new UserResource($user))->resolve(),
                'next_steps' => [
                    'login' => '/login-calon-murid',
                    'dashboard' => '/calon-murid/dashboard',
                    'start_ppdb' => 'POST /api/ppdb/start (setelah login, opsional)',
                ],
            ],
            'Akun berhasil dibuat. Login untuk mengakses dashboard. Data PPDB dibuat saat Anda memulai formulir pendaftaran.',
            201
        );
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'login' => 'required|string|max:255',
            'password' => 'required|string',
            'username' => 'sometimes|string|max:255',
        ]);

        $result = $this->processLogin(
            $validated['login'],
            $validated['password']
        );

        if (isset($result['error'])) {
            return ApiResponse::error($result['error'], $result['code']);
        }

        return ApiResponse::success($result['data'], 'Login Berhasil');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return ApiResponse::success(null, 'Logout berhasil');
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $user->loadProfileRelations();

        return ApiResponse::success([
            'user' => (new UserResource($user))->resolve(),
            'profile' => $user->resolveProfile(),
            'permissions' => app(PermissionService::class)->permissionsForUser($user),
            'menus' => app(PermissionService::class)->menusForUser($user),
        ]);
    }

    // --- Inlined from AuthService ---

    /**
     * Registrasi akun calon siswa — delegasi ke layer Account (tanpa pendaftaran PPDB).
     */
    private function registerCalonSiswaData(array $data): User
    {
        return app(AccountRegistrationService::class)->registerCalonSiswa($data);
    }

    /**
     * @deprecated Gunakan registerCalonSiswa — tidak lagi membuat pendaftaran otomatis.
     */
    private function registerCalonSiswaLegacy(array $data): User
    {
        return $this->registerCalonSiswa([
            'name' => $data['nama'] ?? $data['nama_lengkap'] ?? $data['name'] ?? '',
            'username' => $data['nisn'] ?? $data['username'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);
    }

    /**
     * Login dengan username/NISN atau email + password.
     *
     * @return array{data: array}|array{error: string, code: int}
     */
    private function processLogin(string $login, string $password): array
    {
        $login = trim($login);

        $user = User::query()
            ->where(function ($query) use ($login) {
                $query->where('username', $login)
                    ->orWhere('email', $login);
            })
            ->first();

        if (! $user) {
            return ['error' => 'Akun tidak ditemukan', 'code' => 401];
        }

        if (! Hash::check($password, $user->password)) {
            return ['error' => 'Password salah', 'code' => 401];
        }

        $statusError = $this->accountStatusError($user);
        if ($statusError !== null) {
            return $statusError;
        }

        $user->forceFill(['last_login_at' => now()])->save();

        $user->loadProfileRelations();
        $profile = $user->resolveProfile();
        $token = $user->createToken('auth_token')->plainTextToken;
        $permissionService = app(PermissionService::class);
        $permissions = $permissionService->permissionsForUser($user);
        $menus = $permissionService->menusForUser($user);

        $redirectPath = $permissionService->redirectPathForRole($user->role);
        if ($user->role === 'calon_siswa') {
            $redirectPath = '/calon-murid/dashboard';
        }

        return [
            'data' => [
                'user' => (new UserResource($user))->resolve(),
                'profile' => $profile,
                'has_ppdb_registration' => $user->role === 'calon_siswa'
                    ? $user->pendaftaran()->exists()
                    : null,
                'token' => $token,
                'token_type' => 'Bearer',
                'permissions' => $permissions,
                'menus' => $menus,
                'redirect_path' => $redirectPath,
            ],
        ];
    }

    /**
     * @return array{error: string, code: int}|null
     */
    private function accountStatusError(User $user): ?array
    {
        $status = $user->status_akun ?? (($user->status_aktif ?? true) ? 'aktif' : 'nonaktif');

        return match ($status) {
            'aktif' => null,
            'pending' => ['error' => 'Akun dinonaktifkan', 'code' => 403],
            'nonaktif' => ['error' => 'Akun dinonaktifkan', 'code' => 403],
            'diblokir' => ['error' => 'Akun dinonaktifkan', 'code' => 403],
            default => $user->isAkunAktif()
                ? null
                : ['error' => 'Akun dinonaktifkan', 'code' => 403],
        };
    }
}
