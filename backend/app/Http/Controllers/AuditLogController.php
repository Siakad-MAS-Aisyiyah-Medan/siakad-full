<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Request;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\AuditLog;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Utils\ApiResponse;

class AuditLogController extends Controller
{
    

    public function index(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer',
        ]);

        $paginator = $this->list(
            null,
            $validated['search'] ?? null,
            (int) ($validated['per_page'] ?? 20)
        );

        $paginator->getCollection()->transform(
            fn ($row) => (new AuditLogResource($row))->resolve()
        );

        return ApiResponse::paginated($paginator, 'Berhasil mengambil audit log');
    }

    // --- Inlined from AuditLogService ---

    

    private function logAdminAction(string $action, ?Model $subject = null, array $meta = []): void
    {
        $user = auth()->user();
        if (!$user instanceof User || !$this->shouldAudit($user)) {
            return;
        }

        AuditLog::create([
            'id_user' => $user->id_user,
            'action' => $action,
            'subject_type' => $subject ? class_basename($subject) : null,
            'subject_id' => $subject?->getKey(),
            'ip_address' => Request::ip(),
            'user_agent' => substr((string) Request::userAgent(), 0, 500),
            'meta' => $meta ?: null,
        ]);
    }

    private function list(?string $action = null, ?string $search = null, int $perPage = 20)
    {
        $query = AuditLog::with('user')->orderByDesc('id');

        if ($action) {
            $query->where('action', $action);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('subject_type', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('username', 'like', "%{$search}%"));
            });
        }

        return $query->paginate($perPage);
    }

    private function shouldAudit(User $user): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return in_array('manage_all', $this->permissions->permissionsForUser($user), true);
    }

}
