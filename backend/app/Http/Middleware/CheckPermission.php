<?php

namespace App\Http\Middleware;

use App\Utils\ApiResponse;
use App\Services\PermissionService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function __construct(private PermissionService $permissions)
    {
    }

    /**
     * @param  string  ...$permissions
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return ApiResponse::error('Unauthenticated', 401);
        }

        if ($this->permissions->userCan($user, 'manage_all')) {
            return $next($request);
        }

        if ($this->permissions->userCanAny($user, $permissions)) {
            return $next($request);
        }

        return ApiResponse::error('Akses ditolak. Permission tidak mencukupi.', 403);
    }
}
