<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Account\AccountRegistrationService;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(
        private PermissionService $permissions,
        private AccountRegistrationService $accountRegistration,
    ) {}

    /**
     * Registrasi akun calon siswa — delegasi ke layer Account (tanpa pendaftaran PPDB).
     */
    public function registerCalonSiswa(array $data): User
    {
        return $this->accountRegistration->registerCalonSiswa($data);
    }

    /**
     * @deprecated Gunakan registerCalonSiswa — tidak lagi membuat pendaftaran otomatis.
     */
    public function registerCalonSiswaLegacy(array $data): User
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
    public function login(string $login, string $password): array
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
        $permissions = $this->permissions->permissionsForUser($user);
        $menus = $this->permissions->menusForUser($user);

        $redirectPath = $this->permissions->redirectPathForRole($user->role);
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
