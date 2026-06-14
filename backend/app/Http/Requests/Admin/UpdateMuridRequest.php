<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMuridRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_siswa' => 'nullable|string',
            'nisn' => 'nullable|string|unique:siswa,nisn,' . $this->route('id') . ',id_user',
            'nis' => 'nullable|string',
            'jenis_kelamin' => 'nullable|in:L,P',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'tahun_masuk' => 'nullable|integer',
            'tahun_lulus' => 'nullable|integer',
            'id_kelas' => 'nullable|exists:kelas,id_kelas',
            'status_aktif' => 'nullable|boolean',
        ];
    }
}
