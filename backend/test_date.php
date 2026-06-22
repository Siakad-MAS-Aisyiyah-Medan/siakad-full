<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$log = \App\Models\AuditLog::orderBy('id', 'desc')->first();
echo 'Raw DB value: ' . $log->getRawOriginal('created_at') . PHP_EOL;
echo 'Carbon (w/ timezone): ' . $log->created_at->format('Y-m-d H:i:s P') . PHP_EOL;
echo 'JSON Serialization: ' . $log->toJson() . PHP_EOL;
