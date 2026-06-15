<?php

namespace App\Utils;

use App\Services\AuditLogService;
use Illuminate\Database\Eloquent\Model;

trait AuditsAdminActions
{
    protected function auditAdmin(string $action, ?Model $subject = null, array $meta = []): void
    {
        app(AuditLogService::class)->logAdminAction($action, $subject, $meta);
    }
}
