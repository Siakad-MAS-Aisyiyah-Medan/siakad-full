<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$builder = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'permission' => \App\Http\Middleware\CheckPermission::class,
        ]);

        $middleware->api(append: [
            \App\Http\Middleware\SecurityHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return \App\Utils\ApiResponse::error(
                    'Validasi gagal',
                    422,
                    $e->errors()
                );
            }
        });

        $exceptions->render(function (\Throwable $e, $request) {
            if (! ($request->expectsJson() || $request->is('api/*'))) {
                return null;
            }

            if ($e instanceof \Illuminate\Validation\ValidationException) {
                return null;
            }

            if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                return \App\Utils\ApiResponse::error('Unauthenticated', 401);
            }

            if ($e instanceof \Symfony\Component\Routing\Exception\RouteNotFoundException && str_contains($e->getMessage(), '[login]')) {
                return \App\Utils\ApiResponse::error('Unauthenticated', 401);
            }

            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                $status = $e->getStatusCode();
                $message = config('app.debug') ? $e->getMessage() : match ($status) {
                    403 => 'Akses ditolak.',
                    404 => 'Resource tidak ditemukan.',
                    429 => 'Terlalu banyak permintaan. Coba lagi nanti.',
                    default => 'Permintaan tidak dapat diproses.',
                };

                return \App\Utils\ApiResponse::error($message, $status);
            }

            report($e);

            $message = config('app.debug')
                ? $e->getMessage()
                : 'Terjadi kesalahan pada server.';

            return \App\Utils\ApiResponse::error($message, 500);
        });
    });

$app = $builder->create();

// PENGATURAN EKSTREM: Memindahkan storage ke folder Temp bawaan Windows
$app->useStoragePath(sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'siakad_storage');

return $app;
