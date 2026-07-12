<?php

use App\Models\Admin;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('siakad:restore-admin {login=admin} {--password=} {--force-password}', function () {
    $login = trim((string) $this->argument('login'));

    $user = User::query()
        ->where('username', $login)
        ->orWhere('email', $login)
        ->first();

    if (! $user) {
        $this->error("User '{$login}' tidak ditemukan.");

        return self::FAILURE;
    }

    $user->forceFill([
        'role' => 'admin',
        'status_akun' => 'aktif',
        'status_aktif' => true,
    ]);

    $password = $this->option('password');
    if ($password !== null && $password !== '') {
        if (! $this->option('force-password') && strlen((string) $password) < 8) {
            $this->error('Password minimal 8 karakter. Gunakan --force-password hanya untuk kondisi darurat.');

            return self::FAILURE;
        }

        $user->password = Hash::make((string) $password);
    }

    $user->save();

    Admin::updateOrCreate(
        ['id_user' => $user->id_user],
        [
            'id_user' => $user->id_user,
            'nip' => $user->admin?->nip ?: 'ADMIN-'.$user->id_user,
            'nama_admin' => $user->admin?->nama_admin ?: ($user->name ?: $user->username),
            'no_hp' => $user->admin?->no_hp ?: '-',
        ]
    );

    $message = "Akun '{$user->username}' berhasil dipulihkan sebagai administrator aktif.";
    if ($password !== null && $password !== '') {
        $message .= ' Password juga sudah direset.';
    }

    $this->info($message);

    return self::SUCCESS;
})->purpose('Pulihkan akun administrator produksi yang role/status-nya berubah');
