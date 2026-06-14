<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMapelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_mapel' => 'required|string|max:100',
            'id_guru' => 'required|exists:users,id_user',
            'tingkat' => 'required|in:X,XI,XII',
            'kelompok_mapel' => 'nullable|string|max:100',
        ];
    }
}
