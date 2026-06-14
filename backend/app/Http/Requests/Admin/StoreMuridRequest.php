<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMuridRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|unique:users,username',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|string|min:6',
            'nama_siswa' => 'required|string',
            'nisn' => 'nullable|string|unique:siswa,nisn',
            'nis' => 'nullable|string',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'tahun_masuk' => 'required|integer',
            'tahun_lulus' => 'nullable|integer',
            'id_kelas' => 'nullable|exists:kelas,id_kelas',
            'status_aktif' => 'nullable|boolean',
        ];
    }
}
