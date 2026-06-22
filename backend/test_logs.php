<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$logs = \App\Models\AuditLog::orderBy('id', 'desc')->limit(6)->get();
foreach ($logs as $log) {
    echo 'ID: ' . $log->id . ' | Action: ' . $log->action . PHP_EOL;
    echo 'Raw DB: ' . $log->getRawOriginal('created_at') . PHP_EOL;
    echo 'JSON: ' . json_encode($log->created_at) . PHP_EOL;
    echo '------------------' . PHP_EOL;
}
