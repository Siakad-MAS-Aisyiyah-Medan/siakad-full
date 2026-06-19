<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class PermissionService
{
    private const CACHE_TTL = 3600;

    public function permissionsForRole(string $roleKey): array
    {
        return Cache::remember("rbac.permissions.role.{$roleKey}", self::CACHE_TTL, function () use ($roleKey) {
            $role = Role::where('key', $roleKey)->with('permissions')->first();

            if (!$role) {
                return $this->permissionsFromConfig($roleKey);
            }

            $keys = $role->permissions->pluck('key')->all();

            if (in_array('manage_all', $keys, true)) {
                return Permission::orderBy('key')->pluck('key')->all();
            }

            return array_values(array_unique($keys));
        });
    }

    public function permissionsForUser(User $user): array
    {
        return $this->permissionsForRole($user->role);
    }

    public function userCan(User $user, string $permission): bool
    {
        $perms = $this->permissionsForUser($user);

        return in_array('manage_all', $perms, true) || in_array($permission, $perms, true);
    }

    public function userCanAny(User $user, array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->userCan($user, $permission)) {
                return true;
            }
        }

        return false;
    }

    public function menusForUser(User $user): array
    {
        // Bypass database menus and return empty.
        // This forces the frontend to use its local `menu.config.js`,
        // making it infinitely easier to add/remove menus without dealing with DB and Cache.
        return [];
    }

    public function redirectPathForRole(string $roleKey): string
    {
        $path = Role::where('key', $roleKey)->value('redirect_path');

        if ($path) {
            return $path;
        }

        return config("permissions.redirect_paths.{$roleKey}", '/');
    }

    public function clearCache(): void
    {
        Cache::forget('rbac.menu_items.active');
        foreach (['admin', 'kepsek', 'guru', 'siswa', 'calon_siswa'] as $role) {
            Cache::forget("rbac.permissions.role.{$role}");
        }
    }

    protected function menuPathPrefixesForRole(string $roleKey): array
    {
        return match ($roleKey) {
            'admin' => ['/admin/'],
            'kepsek' => ['/kepala-sekolah/', '/kepsek/'],
            'guru' => ['/guru/'],
            'siswa' => ['/siswa/'],
            'calon_siswa' => ['/calon-murid/', '/calon-siswa/', '/ppdb/'],
            default => [],
        };
    }

    protected function pathMatchesPrefixes(string $path, array $prefixes): bool
    {
        foreach ($prefixes as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return true;
            }
        }

        return false;
    }

    protected function permissionsFromConfig(string $roleKey): array
    {
        $map = config('permissions.role_permissions', []);
        $rolePerms = $map[$roleKey] ?? [];

        if (in_array('manage_all', $rolePerms, true) && config('permissions.admin_inherits_all')) {
            return config('permissions.all', []);
        }

        return array_values(array_unique($rolePerms));
    }

    protected function menusFromConfig(User $user): array
    {
        $menus = config('menus', []);
        $filtered = [];

        foreach ($menus as $item) {
            if ($this->userCan($user, $item['permission'])) {
                $filtered[] = [
                    'iconKey' => $item['iconKey'],
                    'label' => $item['label'],
                    'path' => $item['path'],
                    'permission' => $item['permission'],
                ];
            }
        }

        return $filtered;
    }
}
