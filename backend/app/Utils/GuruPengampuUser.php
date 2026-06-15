<?php

namespace App\Utils;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class GuruPengampuUser implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = User::query()->find($value);

        if (!$user) {
            $fail('Guru pengampu tidak ditemukan.');

            return;
        }

        if (!in_array($user->role, ['guru', 'wali_kelas'], true)) {
            $fail('Guru pengampu harus memiliki role guru atau wali_kelas.');
        }
    }
}
