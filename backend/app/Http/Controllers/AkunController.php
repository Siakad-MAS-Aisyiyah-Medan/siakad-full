<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AkunController extends Controller
{
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $query = User::with(['admin', 'guru', 'siswa', 'kepalaSekolah'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('status')) {
            if ($request->status === 'aktif') {
                $query->where('status_akun', 'aktif')->orWhere('status_aktif', true);
            } elseif ($request->status === 'nonaktif') {
                $query->where('status_akun', 'nonaktif')->orWhere('status_aktif', false);
            }
        }

        $paginator = $query->paginate($request->get('limit', 10));

        $users = collect($paginator->items())->map(function ($user) {
            $nipNisn = $user->username ?: '-';
            $noHp = '-';
            if ($user->role === 'admin' && $user->admin) $nipNisn = $user->admin->nip ?? '-';
            elseif ($user->role === 'guru' && $user->guru) $nipNisn = $user->guru->nip_nuptk ?? '-';
            elseif ($user->role === 'kepsek' && $user->kepalaSekolah) $nipNisn = $user->kepalaSekolah->nip ?? '-';
            elseif ($user->role === 'siswa' && $user->siswa) $nipNisn = $user->siswa->nisn ?? '-';

            if ($user->role === 'admin' && $user->admin) $noHp = $user->admin->no_hp ?? '-';
            elseif ($user->role === 'guru' && $user->guru) $noHp = $user->guru->no_hp ?? '-';
            elseif ($user->role === 'kepsek' && $user->kepalaSekolah) $noHp = $user->kepalaSekolah->no_hp ?? '-';
            elseif ($user->role === 'siswa' && $user->siswa) $noHp = $user->siswa->no_hp_wali ?? '-';

            return [
                'id' => $user->id_user,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status_akun ?? ($user->status_aktif ? 'aktif' : 'nonaktif'),
                'nip_nisn' => $nipNisn,
                'no_hp' => $noHp,
            ];
        })->values()->toArray();

        $activeRoles = User::select('role')->distinct()->count('role');
        $totalAkun = User::count();

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $users,
                'total_akun' => $totalAkun,
                'role_aktif' => $activeRoles,
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ]
            ],
        ]);
    }

    public function store(\Illuminate\Http\Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:' . implode(',', User::ROLES),
            'status' => 'nullable|string|in:aktif,nonaktif',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => $validated['role'],
            'status_aktif' => ($validated['status'] ?? 'aktif') === 'aktif',
            'status_akun' => $validated['status'] ?? 'aktif',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil ditambahkan',
            'data' => $user
        ], 201);
    }

    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);

        if (auth()->id() == $id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri.',
            ], 403);
        }

        // We can optionally delete related profile data here if needed, 
        // or rely on database cascading/soft deletes.
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil dihapus',
        ]);
    }

    public function update(\Illuminate\Http\Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id_user . ',id_user',
            'role' => 'required|string|in:' . implode(',', User::ROLES),
            'status' => 'nullable|string|in:aktif,nonaktif',
            'no_hp' => 'nullable|string|max:20',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        if ($request->filled('status')) {
            $user->status_akun = $validated['status'];
            $user->status_aktif = $validated['status'] === 'aktif';
        }

        if ($request->filled('password')) {
            $request->validate(['password' => 'string|min:6']);
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        $user->save();

        if ($request->has('no_hp')) {
            $phone = $validated['no_hp'] ?: null;

            if ($user->role === 'admin' && $user->admin) {
                $user->admin->update(['no_hp' => $phone]);
            } elseif ($user->role === 'guru' && $user->guru) {
                $user->guru->update(['no_hp' => $phone]);
            } elseif ($user->role === 'kepsek' && $user->kepalaSekolah) {
                $user->kepalaSekolah->update(['no_hp' => $phone]);
            } elseif ($user->role === 'siswa' && $user->siswa) {
                $user->siswa->update(['no_hp_wali' => $phone]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil diperbarui',
            'data' => $user
        ]);
    }

    public function updateProfile(\Illuminate\Http\Request $request): JsonResponse
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id_user . ',id_user',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id_user . ',id_user',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:6|confirmed',
            'password' => 'nullable|string|min:6',
        ]);

        if ($request->filled('password')) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        } elseif ($request->filled('new_password')) {
            if (!$request->filled('current_password') || !\Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password saat ini salah.'
                ], 422);
            }
            $user->password = \Illuminate\Support\Facades\Hash::make($request->new_password);
        }

        $user->name = $validated['name'];
        $user->username = $validated['username'];
        $user->email = $validated['email'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data' => $user
        ]);
    }
}
