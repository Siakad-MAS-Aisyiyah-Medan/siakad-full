<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePengumumanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'tanggal_publikasi' => 'nullable|date',
            'akses' => 'required|in:umum,internal',
        ];
    }
}
