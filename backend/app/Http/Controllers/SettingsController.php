<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use App\Utils\ApiResponse;
use App\Utils\AuditsAdminActions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    use AuditsAdminActions;
    /**
     * Get all settings grouped.
     */
    public function index()
    {
        $settings = SystemSetting::all();

        $grouped = $settings->groupBy('group')->map(function ($items, $group) {
            return [
                'group' => $group,
                'label' => $this->getGroupLabel($group),
                'icon' => $this->getGroupIcon($group),
                'items' => $items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'key' => $item->key,
                        'value' => $item->value,
                        'label' => $item->label,
                        'type' => $item->type,
                    ];
                }),
            ];
        })->values();

        return ApiResponse::success($grouped, 'Settings berhasil diambil');
    }

    /**
     * Update a specific setting by key.
     */
    public function update(Request $request, $key)
    {
        $setting = SystemSetting::where('key', $key)->first();

        if (! $setting) {
            return ApiResponse::error('Setting tidak ditemukan', 404);
        }

        $validator = Validator::make($request->all(), [
            'value' => 'required|string',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi Gagal', 422, $validator->errors());
        }

        $setting->update(['value' => $request->value]);

        $this->auditAdmin('admin.settings.update', null, ['key' => $setting->key, 'value' => $request->value]);

        return ApiResponse::success([
            'key' => $setting->key,
            'value' => $setting->value,
        ], 'Setting berhasil diperbarui');
    }

    /**
     * Bulk update settings.
     */
    public function bulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required|string',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi Gagal', 422, $validator->errors());
        }

        $updated = [];
        foreach ($request->settings as $item) {
            $setting = SystemSetting::where('key', $item['key'])->first();
            if ($setting) {
                $setting->update(['value' => $item['value']]);
                $updated[] = [
                    'key' => $setting->key,
                    'value' => $setting->value,
                ];
            }
        }

        $this->auditAdmin('admin.settings.bulk_update', null, ['keys' => array_column($updated, 'key')]);

        return ApiResponse::success($updated, 'Settings berhasil diperbarui');
    }

    private function getGroupLabel($group)
    {
        $labels = [
            'academic' => 'Akademik',
            'ppdb' => 'PPDB',
            'general' => 'Umum',
        ];

        return $labels[$group] ?? ucfirst($group);
    }

    private function getGroupIcon($group)
    {
        $icons = [
            'academic' => 'BookOpen',
            'ppdb' => 'FileText',
            'general' => 'Settings',
        ];

        return $icons[$group] ?? 'Settings';
    }
}
