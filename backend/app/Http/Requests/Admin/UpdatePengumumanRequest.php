<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePengumumanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judul' => 'sometimes|string|max:255',
            'isi' => 'sometimes|string',
            'tanggal_publikasi' => 'nullable|date',
            'akses' => 'sometimes|in:umum,internal',
        ];
    }
}
