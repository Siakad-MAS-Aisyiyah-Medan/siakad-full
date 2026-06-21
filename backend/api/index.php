<?php

use Illuminate\Http\Request;

error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

// Configure Laravel to use /tmp for caching and storage on Vercel's read-only filesystem
$_ENV['APP_CONFIG_CACHE'] = '/tmp/config.php';
$_ENV['APP_EVENTS_CACHE'] = '/tmp/events.php';
$_ENV['APP_PACKAGES_CACHE'] = '/tmp/packages.php';
$_ENV['APP_ROUTES_CACHE'] = '/tmp/routes.php';
$_ENV['APP_SERVICES_CACHE'] = '/tmp/services.php';
$_ENV['VIEW_COMPILED_PATH'] = '/tmp';

// Fix path routing in Vercel. Vercel sets SCRIPT_NAME to /api/index.php, which makes Symfony strip /api from the URL path!
$_SERVER['SCRIPT_NAME'] = '/index.php';

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

// Set storage path to /tmp
$app->useStoragePath('/tmp');

// Ensure the compiled views directory exists
if (! is_dir('/tmp/framework/views')) {
    mkdir('/tmp/framework/views', 0755, true);
}

// Handle the request
$request = Request::capture();
$response = $app->handle($request);
$response->send();
$app->terminate($request, $response);
