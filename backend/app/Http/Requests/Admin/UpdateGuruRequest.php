<?php

namespace App\Http\Requests\Admin;

use App\Models\Guru;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGuruRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');
        $guruId = Guru::where('id_user', $userId)->value('id_guru');

        $nipRule = ['required', 'string', 'max:50'];
        if ($guruId) {
            $nipRule[] = Rule::unique('guru', 'nip_nuptk')->ignore($guruId, 'id_guru');
        } else {
            $nipRule[] = Rule::unique('guru', 'nip_nuptk');
        }

        return [
            'username' => 'required|unique:users,username,'.$userId.',id_user',
            'email' => 'required|email|unique:users,email,'.$userId.',id_user',
            'password' => 'nullable|min:8',
            'nama_guru' => 'required|string|max:255',
            'nip_nuptk' => $nipRule,
            'jenis_kelamin' => 'required|in:L,P',
            'agama' => 'required|string|max:50',
            'alamat' => 'required|string',
            'no_hp' => 'required|string|max:20',
            'role' => 'required|in:guru,wali_kelas',
            'status_aktif' => 'sometimes|boolean',
            'status' => 'required|in:aktif,nonaktif',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }
}
