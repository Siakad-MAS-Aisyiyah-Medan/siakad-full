<?php

namespace App\Http\Controllers\Api\Admin;

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
            $nipNisn = '-';
            if ($user->role === 'admin' && $user->admin) $nipNisn = $user->admin->nip ?? '-';
            elseif ($user->role === 'guru' && $user->guru) $nipNisn = $user->guru->nip_nuptk ?? '-';
            elseif ($user->role === 'kepsek' && $user->kepalaSekolah) $nipNisn = $user->kepalaSekolah->nip ?? '-';
            elseif ($user->role === 'siswa' && $user->siswa) $nipNisn = $user->siswa->nisn ?? '-';

            return [
                'id' => $user->id_user,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status_akun ?? ($user->status_aktif ? 'aktif' : 'nonaktif'),
                'nip_nisn' => $nipNisn,
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
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => $validated['role'],
            'status_aktif' => true,
            'status_akun' => 'aktif',
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
}
