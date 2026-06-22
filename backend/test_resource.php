<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$log = \App\Models\AuditLog::orderBy('id', 'desc')->first();
$res = new \App\Http\Resources\AuditLogResource($log);
echo 'JSON: ' . json_encode($res->resolve()) . PHP_EOL;
