<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Siswa;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalGuru = Guru::count();
        $totalMurid = Siswa::count();
        $totalMapel = Mapel::count();
        $totalKelas = Kelas::count();

        $auditLogs = AuditLog::with('user:id_user,name,role')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'user' => optional($log->user)->name ?? 'System',
                    'target' => $log->description,
                    'time' => $log->created_at->diffForHumans(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_guru' => $totalGuru,
                    'total_murid' => $totalMurid,
                    'total_mapel' => $totalMapel,
                    'total_kelas' => $totalKelas,
                ],
                'audit_logs' => $auditLogs,
            ],
        ]);
    }
}
