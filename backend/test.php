<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = \App\Models\User::where('role', 'admin')->first();
$perms = app(\App\Services\PermissionService::class)->permissionsForUser($user);
echo "PERMS:\n";
echo json_encode($perms, JSON_PRETTY_PRINT);
echo "\n\nMENUS:\n";
$menus = app(\App\Services\PermissionService::class)->menusForUser($user);
echo json_encode($menus, JSON_PRETTY_PRINT);
