<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Services\PermissionService;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UseCaseIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_all_seeded_roles_can_login_with_expected_redirect_and_use_case_menus(): void
    {
        $expectations = [
            'admin' => [
                'redirect' => '/admin/dashboard',
                'menus' => ['/admin/dashboard', '/admin/profil-sekolah', '/admin/tahun-ajaran', '/admin/pengumuman', '/admin/guru', '/admin/murid', '/admin/kelas', '/admin/mapel', '/admin/transkrip-akademik', '/admin/ppdb', '/admin/hak-akses', '/admin/pengaturan'],
            ],
            'kepsek' => [
                'redirect' => '/kepala-sekolah/dashboard',
                'menus' => ['/kepala-sekolah/dashboard', '/kepala-sekolah/profil-saya', '/kepala-sekolah/pengumuman', '/kepala-sekolah/data-guru', '/kepala-sekolah/data-murid', '/kepala-sekolah/data-kelas', '/kepala-sekolah/data-mapel', '/kepala-sekolah/transkrip-akademik', '/kepala-sekolah/data-ppdb', '/kepala-sekolah/pengaturan'],
            ],
            'guru' => [
                'redirect' => '/guru/dashboard',
                'menus' => ['/guru/dashboard', '/guru/profil-saya', '/guru/pengumuman', '/guru/murid', '/guru/kelas', '/guru/mapel', '/guru/nilai', '/guru/absensi', '/guru/pengaturan'],
            ],
            'siswa' => [
                'redirect' => '/siswa/dashboard',
                'menus' => ['/siswa/dashboard', '/siswa/profil-saya', '/siswa/pengumuman', '/siswa/kelas', '/siswa/mapel', '/siswa/nilai', '/siswa/absensi', '/siswa/pengaturan'],
            ],
        ];

        foreach ($expectations as $username => $expected) {
            $response = $this->postJson('/api/login', [
                'login' => $username,
                'password' => 'password',
            ])->assertOk()
                ->assertJsonPath('success', true)
                ->assertJsonPath('data.redirect_path', $expected['redirect']);

            $paths = collect($response->json('data.menus'))->pluck('path')->all();
            $this->assertSame($expected['menus'], $paths, "Daftar menu {$username} tidak sesuai");
        }
    }

    public function test_kepsek_has_read_only_access_to_academic_master_data(): void
    {
        Sanctum::actingAs(User::where('username', 'kepsek')->firstOrFail());

        foreach (['/api/guru', '/api/murid', '/api/kelas', '/api/mapel', '/api/admin/ppdb'] as $uri) {
            $this->getJson($uri)->assertOk();
        }

        $this->postJson('/api/kelas', [])->assertForbidden();
        $this->deleteJson('/api/pengumuman/1')->assertForbidden();
    }

    public function test_admin_cannot_change_own_role_or_status_from_user_management(): void
    {
        $admin = User::where('username', 'admin')->firstOrFail();
        Sanctum::actingAs($admin);

        $this->putJson("/api/akun/{$admin->id_user}", [
            'name' => $admin->name ?: 'Administrator',
            'email' => $admin->email,
            'role' => 'kepsek',
            'status' => 'aktif',
        ])->assertForbidden();

        $this->putJson("/api/akun/{$admin->id_user}", [
            'name' => $admin->name ?: 'Administrator',
            'email' => $admin->email,
            'role' => 'admin',
            'status' => 'nonaktif',
        ])->assertForbidden();

        $this->assertDatabaseHas('users', [
            'id_user' => $admin->id_user,
            'role' => 'admin',
            'status_akun' => 'aktif',
        ]);
    }

    public function test_last_active_admin_cannot_be_removed_by_delegated_user_manager(): void
    {
        $manageUsers = Permission::where('key', 'manage_users')->firstOrFail();
        Role::where('key', 'kepsek')->firstOrFail()->permissions()->syncWithoutDetaching([$manageUsers->id_permission]);
        app(PermissionService::class)->clearCache();

        $admin = User::where('username', 'admin')->firstOrFail();
        Sanctum::actingAs(User::where('username', 'kepsek')->firstOrFail());

        $this->putJson("/api/akun/{$admin->id_user}", [
            'name' => $admin->name ?: 'Administrator',
            'email' => $admin->email,
            'role' => 'kepsek',
            'status' => 'aktif',
        ])->assertUnprocessable()
            ->assertJsonPath('message', 'Minimal harus ada satu akun administrator aktif.');

        $this->putJson("/api/akun/{$admin->id_user}", [
            'name' => $admin->name ?: 'Administrator',
            'email' => $admin->email,
            'role' => 'admin',
            'status' => 'nonaktif',
        ])->assertUnprocessable()
            ->assertJsonPath('message', 'Minimal harus ada satu akun administrator aktif.');

        $this->deleteJson("/api/akun/{$admin->id_user}")
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Minimal harus ada satu akun administrator aktif.');

        $this->assertDatabaseHas('users', [
            'id_user' => $admin->id_user,
            'role' => 'admin',
            'status_akun' => 'aktif',
        ]);
    }

    public function test_restore_admin_command_recovers_demoted_admin_account(): void
    {
        $admin = User::where('username', 'admin')->firstOrFail();
        $admin->forceFill([
            'role' => 'kepsek',
            'status_akun' => 'nonaktif',
            'status_aktif' => false,
        ])->save();

        $this->artisan('siakad:restore-admin', ['login' => 'admin'])
            ->assertSuccessful();

        $this->assertDatabaseHas('users', [
            'id_user' => $admin->id_user,
            'role' => 'admin',
            'status_akun' => 'aktif',
            'status_aktif' => true,
        ]);
    }

    public function test_admin_with_short_locked_username_can_update_profile_password(): void
    {
        $admin = User::where('username', 'admin')->firstOrFail();
        Sanctum::actingAs($admin);

        $this->putJson('/api/akun/profile', [
            'name' => 'Administrator',
            'email' => $admin->email,
            'username' => 'admin',
            'current_password' => 'password',
            'new_password' => 'Admin123',
            'new_password_confirmation' => 'Admin123',
        ])->assertOk();

        $admin->refresh();
        $this->assertSame('admin', $admin->username);
        $this->assertTrue(Hash::check('Admin123', $admin->password));
    }

    public function test_personal_profile_update_maps_role_specific_fields(): void
    {
        $kepsek = User::where('username', 'kepsek')->firstOrFail();
        Sanctum::actingAs($kepsek);

        $this->putJson('/api/biodata/profile', [
            'nama_lengkap' => 'Kepala Sekolah Baru',
            'nip' => '987654321',
            'jenis_kelamin' => 'L',
            'tgl_lahir' => '1975-01-10',
            'alamat' => 'Medan',
            'no_hp' => '081200000001',
        ])->assertOk()->assertJsonPath('data.nama_kepsek', 'Kepala Sekolah Baru');

        $this->assertDatabaseHas('kepala_sekolah', [
            'id_user' => $kepsek->id_user,
            'nama_kepsek' => 'Kepala Sekolah Baru',
            'alamat' => 'Medan',
        ]);
    }

    public function test_profile_photo_can_be_uploaded_and_deleted_for_student(): void
    {
        Storage::fake('public');
        $student = User::where('username', 'siswa')->firstOrFail();
        Sanctum::actingAs($student);

        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
        );

        $this->postJson('/api/biodata/foto', [
            'foto' => UploadedFile::fake()->createWithContent('profil.png', $png),
        ])->assertOk()->assertJsonStructure(['data' => ['foto_url']]);

        $student->siswa->refresh();
        $this->assertNotNull($student->siswa->foto);

        $this->deleteJson('/api/biodata/foto')->assertOk();
        $this->assertNull($student->siswa->fresh()->foto);
    }

    public function test_candidate_can_complete_and_submit_ppdb_then_data_is_locked(): void
    {
        Storage::fake('public');

        $this->postJson('/api/auth/register-calon-siswa', [
            'name' => 'Calon Murid Uji',
            'username' => '0099887766',
            'email' => 'calon-uji@example.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertCreated();

        $candidate = User::where('username', '0099887766')->firstOrFail();
        Sanctum::actingAs($candidate);

        $this->postJson('/api/ppdb/start')->assertCreated()->assertJsonPath('data.ppdb_status', 'draft');
        $this->putJson('/api/ppdb/step/keterangan-pribadi', [
            'nama_lengkap' => 'Calon Murid Uji',
            'tempat_lahir' => 'Medan',
            'tgl_lahir' => '2010-01-01',
            'jenis_kelamin' => 'L',
            'agama' => 'Islam',
            'kewarganegaraan' => 'Indonesia',
            'anak_ke' => 1,
            'jml_saudara_kandung' => 1,
            'jml_saudara_tiri' => 0,
            'alamat' => 'Medan',
            'no_telp' => '081200000002',
            'status_yatim' => 'Tidak',
        ])->assertOk();
        $this->putJson('/api/ppdb/step/kesehatan', [
            'berat_badan' => 45,
            'tinggi_badan' => 155,
            'gol_darah' => 'O',
        ])->assertOk();
        $this->putJson('/api/ppdb/step/pendidikan-asal', [
            'sekolah_asal' => 'MTs Uji',
            'tahun_lulus' => '2026',
            'no_sttb' => 'STTB-001',
        ])->assertOk();
        $this->putJson('/api/ppdb/step/orang-tua-wali', [
            'nama_ayah' => 'Ayah Uji',
            'nama_ibu' => 'Ibu Uji',
            'pendidikan_ayah' => 'SMA',
            'pendidikan_ibu' => 'SMA',
            'pekerjaan_ayah' => 'Wiraswasta',
            'pekerjaan_ibu' => 'Wiraswasta',
            'agama_ortu' => 'Islam',
            'alamat_ortu' => 'Medan',
            'no_hp_ortu' => '081200000003',
        ])->assertOk();
        $this->assertDatabaseHas('pendaftaran_orang_tua_wali', [
            'nama_ayah' => 'Ayah Uji',
            'nama_ibu' => 'Ibu Uji',
            'no_hp_ortu' => '081200000003',
        ]);
        $this->putJson('/api/ppdb/step/kepribadian', [
            'hobi' => 'Membaca',
            'cita_cita' => 'Guru',
        ])->assertOk();
        $this->assertDatabaseHas('pendaftaran_kepribadian', [
            'hobi' => 'Membaca',
            'cita_cita' => 'Guru',
        ]);

        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
        );
        foreach (['ijazah_atau_skl', 'stk', 'pas_foto', 'nisn', 'kartu_keluarga', 'ktp_orang_tua'] as $jenis) {
            $this->postJson('/api/ppdb/berkas', [
                'jenis_berkas' => $jenis,
                'file' => UploadedFile::fake()->createWithContent("{$jenis}.png", $png),
            ])->assertOk();
        }

        $this->postJson('/api/ppdb/submit')
            ->assertOk()
            ->assertJsonPath('data.ppdb_status', 'diajukan');
        $this->getJson('/api/ppdb/status')
            ->assertOk()
            ->assertJsonPath('data.status', 'diajukan')
            ->assertJsonPath('data.no_registrasi', 'PPDB-'.date('Y').'-0001');
        $this->getJson('/api/ppdb/berkas')->assertOk()->assertJsonPath('data.can_edit', false);

        $this->postJson('/api/ppdb/berkas', [
            'jenis_berkas' => 'pas_foto',
            'file' => UploadedFile::fake()->createWithContent('pengganti.png', $png),
        ])->assertUnprocessable();

        Sanctum::actingAs(User::where('username', 'admin')->firstOrFail());
        $this->getJson('/api/admin/ppdb')
            ->assertOk()
            ->assertJsonPath('data.0.nama_lengkap', 'Calon Murid Uji');
        $this->getJson('/api/admin/ppdb/stats')
            ->assertOk()
            ->assertJsonPath('data.total', 1);
    }
}
