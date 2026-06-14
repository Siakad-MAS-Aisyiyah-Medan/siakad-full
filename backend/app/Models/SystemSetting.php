<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $table = 'system_settings';

    protected $fillable = [
        'key',
        'value',
        'group',
        'label',
        'type',
    ];

    public $timestamps = true;

    /**
     * Get a setting value by key.
     */
    public static function getValue(string $key, $default = null): ?string
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting value by key.
     */
    public static function setValue(string $key, $value): bool
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        ) ? true : false;
    }

    /**
     * Get all settings grouped.
     */
    public static function getAllGrouped(): array
    {
        $settings = self::all()->groupBy('group');
        return $settings->toArray();
    }
}
