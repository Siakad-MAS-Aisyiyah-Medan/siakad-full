<?php

namespace App\Http\Middleware;

use App\Utils\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return ApiResponse::error('Unauthenticated', 401);
        }

        $allowed = $roles;
        if (in_array('admin', $roles, true)) {
            $allowed = array_unique(array_merge($allowed, ['admin']));
        }

        if ($user->role === 'admin' || in_array($user->role, $allowed, true)) {
            return $next($request);
        }

        return ApiResponse::error('Akses ditolak untuk role ini', 403);
    }
}
