<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $subjectName = null;
        $subjectRole = null;

        if ($this->subject_type) {
            if ($this->subject_type === 'User' || $this->subject_type === 'App\\Models\\User') {
                $subjectUser = null;
                if ($this->subject_id == $this->id_user && $this->user) {
                    $subjectUser = $this->user;
                } else {
                    $subjectUser = User::with(['siswa', 'guru', 'kepalaSekolah', 'admin', 'pendaftaran'])->find($this->subject_id);
                }

                if ($subjectUser) {
                    $role = $subjectUser->role;
                    $subjectRole = $role;
                    if ($role === 'siswa' && $subjectUser->siswa) {
                        $subjectName = $subjectUser->siswa->nama_siswa;
                    } elseif ($role === 'guru' && $subjectUser->guru) {
                        $subjectName = $subjectUser->guru->nama_guru;
                    } elseif ($role === 'kepsek' && $subjectUser->kepalaSekolah) {
                        $subjectName = $subjectUser->kepalaSekolah->nama_kepsek;
                    } elseif ($role === 'admin' && $subjectUser->admin) {
                        $subjectName = $subjectUser->admin->nama_admin;
                    } elseif ($role === 'calon_siswa' && $subjectUser->pendaftaran) {
                        $subjectName = $subjectUser->pendaftaran->nama_lengkap;
                    }
                    if (! $subjectName) {
                        $subjectName = $subjectUser->name ?? $subjectUser->username;
                    }
                }
            } else {
                $class = '\\App\\Models\\'.class_basename($this->subject_type);
                if (class_exists($class)) {
                    $subject = $class::find($this->subject_id);
                    if ($subject) {
                        $subjectName = $subject->nama_kelas ?? $subject->nama_mapel ?? $subject->judul ?? $subject->nama_sekolah ?? $subject->tahun_ajaran ?? null;
                    }
                }
            }
        }

        // Jika subjek sudah dihapus atau gagal diload, fallback ke meta
        if (! $subjectName && is_array($this->meta)) {
            $subjectName = $this->meta['username'] ?? $this->meta['nama_sekolah'] ?? $this->meta['nama_kelas'] ?? $this->meta['nama_mapel'] ?? $this->meta['judul'] ?? $this->meta['tahun_ajaran'] ?? null;
        }

        return [
            'id' => $this->id,
            'action' => $this->action,
            'subject_type' => $this->subject_type,
            'subject_id' => $this->subject_id,
            'subject_name' => $subjectName,
            'subject_role' => $subjectRole,
            'ip_address' => $this->ip_address,
            'meta' => $this->meta,
            'created_at' => $this->created_at,
            'actor' => $this->whenLoaded('user', fn () => $this->user ? [
                'id_user' => $this->user->id_user,
                'username' => $this->user->username,
                'role' => $this->user->role,
            ] : null),
        ];
    }
}
