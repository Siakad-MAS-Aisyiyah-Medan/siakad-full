<?php

namespace App\Http\Requests\Admin;

use App\Rules\WaliKelasUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreKelasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('id_wali_kelas') && $this->input('id_wali_kelas') === '') {
            $this->merge(['id_wali_kelas' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'nama_kelas' => 'required|string|max:50',
            'tingkat' => 'required|in:X,XI,XII',
            'jurusan' => 'required|in:IPA,IPS',
            'id_wali_kelas' => ['nullable', 'integer', 'exists:users,id_user', new WaliKelasUser()],
        ];
    }
}
