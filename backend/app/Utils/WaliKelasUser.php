<?php

namespace App\Utils;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class WaliKelasUser implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        $user = User::query()->find($value);

        if (!$user) {
            $fail('User wali kelas tidak ditemukan.');

            return;
        }

        if ($user->role !== 'wali_kelas') {
            $fail('Wali kelas harus memiliki role wali_kelas.');
        }
    }
}
