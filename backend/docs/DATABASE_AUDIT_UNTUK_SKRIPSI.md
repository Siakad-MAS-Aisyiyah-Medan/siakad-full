# Audit Database SIAKAD Untuk Revisi Skripsi

Tanggal audit: 29 Juni 2026  
Objek audit:

- Database aktual project Laravel SIAKAD.
- File rancangan: `D:\Tugas Akhir\Perancangan Basis Data Skripsi.pdf`.

## Kesimpulan Utama

Database aplikasi **sudah terstruktur cukup baik dan aman untuk dijelaskan saat sidang**, terutama karena sudah memiliki:

- pemisahan akun login (`users`) dan profil role (`admin`, `guru`, `kepala_sekolah`, `siswa`, `pendaftaran`);
- foreign key untuk relasi utama;
- unique constraint untuk data yang tidak boleh dobel;
- normalisasi PPDB ke tabel detail;
- tabel akademik inti untuk kelas, mapel, jadwal, nilai, dan absensi.

Namun, isi rancangan di PDF skripsi **belum sepenuhnya sama dengan database aktual**. Yang paling perlu diperbaiki bukan programnya, tetapi bagian **Bab 3.3.2 Perancangan Basis Data** agar sesuai dengan implementasi.

## Audit Dari Paling Besar Ke Paling Kecil

## 1. Level Modul / Area Data

### A. Akun dan Hak Akses

Status: **rapi**

Tabel aktual:

- `users`
- `roles`
- `permissions`
- `role_permission`
- `menu_items`

Catatan:

- Di PDF, `users` sudah ada, tetapi belum menjelaskan RBAC secara lengkap.
- Aplikasi aktual memakai role dan permission yang lebih rapi daripada sekadar field `role`.

Perubahan skripsi:

- Tambahkan penjelasan bahwa sistem memakai tabel `roles`, `permissions`, `role_permission`, dan `menu_items` untuk pengaturan hak akses dan menu.
- Jangan hanya menjelaskan role dari `users`.

### B. Profil Pengguna

Status: **rapi**

Tabel aktual:

- `admin`
- `kepala_sekolah`
- `guru`
- `siswa`
- `pendaftaran` untuk calon siswa/PPDB

Catatan:

- PDF menulis `Calon_Murid` sebagai entitas tersendiri.
- Database aktual **tidak memakai tabel `calon_murid`**.
- Calon murid direpresentasikan sebagai `users.role = calon_siswa`, lalu detail pendaftaran disimpan di `pendaftaran`.

Perubahan skripsi:

- Hapus atau ganti entitas `Calon_Murid`.
- Jelaskan bahwa calon murid adalah akun di tabel `users` dengan role `calon_siswa`.
- Data calon murid saat PPDB disimpan di `pendaftaran` dan tabel detail PPDB.

### C. Akademik

Status: **cukup rapi**

Tabel aktual:

- `kelas`
- `mata_pelajaran`
- `kelas_mapel`
- `waktu_pelajaran`
- `jadwal_pelajaran`
- `nilai`
- `absensi`
- `absensi_guru`
- `tahun_ajarans`

Catatan:

- Struktur sudah mendukung kelas, mapel, jadwal, nilai, dan absensi.
- Relasi guru/siswa operasional memakai `users.id_user`, bukan langsung `guru.id_guru` atau `siswa.id_siswa`.
- Ini masih valid karena aplikasi memakai `users` sebagai identitas akun aktif.

Perubahan skripsi:

- Jangan tulis `id_murid` jika implementasi memakai `id_user_siswa`.
- Jangan tulis `id_guru` mengarah ke tabel `guru` jika implementasi mengarah ke `users`.
- Tambahkan penjelasan bahwa relasi operasional memakai akun user agar sinkron dengan login dan permission.

### D. PPDB

Status: **lebih rapi setelah normalisasi**

Tabel aktual:

- `pendaftaran`
- `berkas_pendaftarans`
- `pendaftaran_keterangan_pribadi`
- `pendaftaran_kesehatan`
- `pendaftaran_pendidikan_asal`
- `pendaftaran_orang_tua_wali`
- `pendaftaran_kepribadian`
- `pendaftaran_dokumen`

Catatan:

- Tabel `pendaftaran` masih besar karena mempertahankan kompatibilitas program lama.
- Tetapi rancangan yang lebih rapi sudah tersedia melalui tabel detail PPDB.

Perubahan skripsi:

- Ganti konsep `Formulir_Pendaftaran` menjadi `pendaftaran`.
- Tambahkan tabel detail PPDB di struktur tabel.
- Jelaskan bahwa tabel `pendaftaran` menyimpan status utama pendaftaran, sedangkan detail formulir dipisahkan per kelompok data.

### E. Konten Publik dan Pengaturan Sistem

Status: **rapi, tetapi belum lengkap di PDF**

Tabel aktual:

- `profil_sekolahs`
- `pengumumen`
- `beritas`
- `system_settings`

Catatan:

- PDF hanya menyebut `Profil_Sekolah` dan `Pengumuman`.
- Aplikasi aktual punya `beritas` dan `system_settings`.
- Nama tabel `pengumumen` terlihat tidak baku, tetapi aplikasi sudah konsisten memakai nama tersebut.

Perubahan skripsi:

- Tambahkan `beritas` jika fitur berita/prestasi dijelaskan di Bab 4.
- Tambahkan `system_settings` jika pengaturan PPDB/profil dinamis dijelaskan.
- Untuk tabel `pengumumen`, di skripsi boleh ditulis sebagai **Pengumuman** secara konseptual, tetapi struktur implementasi perlu disesuaikan dengan nama tabel aktual jika diminta detail fisik database.

## 2. Audit Per Tabel

### `users`

Status: **rapi**

Yang sudah benar:

- punya primary key `id_user`;
- `username` unique;
- `email` unique;
- role jelas: `admin`, `kepsek`, `guru`, `siswa`, `calon_siswa`;
- punya status akun dan waktu login terakhir.

Yang perlu diubah di skripsi:

- Role di PDF masih menulis `administrator`, `kepala_sekolah`, `murid`, `calon_murid`.
- Sesuaikan menjadi role aktual: `admin`, `kepsek`, `guru`, `siswa`, `calon_siswa`.
- Field `last_login` di PDF sesuaikan menjadi `last_login_at`.
- Tambahkan `name`, `status_aktif`, dan `status_akun`.

### `admin`

Status: **rapi**

Yang sudah benar:

- 1 akun hanya boleh punya 1 profil admin melalui `id_user unique`.
- punya `nip`, `nama_admin`, `no_hp`, `foto`.

Yang perlu diubah di skripsi:

- PDF mencantumkan `jenis_kelamin`, `alamat`, `status`, `foto_admin`.
- Database aktual tidak memakai `jenis_kelamin`, `alamat`, dan `status` untuk admin.
- Field foto aktual bernama `foto`, bukan `foto_admin`.

### `kepala_sekolah`

Status: **rapi**

Yang sudah benar:

- 1 akun hanya boleh punya 1 profil kepala sekolah.
- punya `nip`, `nama_kepsek`, `jenis_kelamin`, `tgl_lahir`, `alamat`, `foto`.

Yang perlu diubah di skripsi:

- Sesuaikan nama field `foto_kepsek` menjadi `foto`.
- Tambahkan `tgl_lahir`.
- Status kepala sekolah tidak ada di tabel aktual.

### `guru`

Status: **rapi**

Yang sudah benar:

- `id_user` unique;
- `nip_nuptk` unique;
- punya data profil guru dan status aktif/nonaktif.

Yang perlu diubah di skripsi:

- PDF memakai `nip`, database memakai `nip_nuptk`.
- PDF memakai `foto_guru`, database memakai `foto`.
- Tambahkan `tgl_lahir`.
- Enum gender aktual `L/P`, bukan `laki_laki/perempuan`.

### `siswa`

Status: **rapi**

Yang sudah benar:

- `id_user` unique;
- `nisn` unique;
- `nis` unique;
- terhubung ke `kelas`;
- menyimpan wali dan nomor HP wali.

Yang perlu diubah di skripsi:

- PDF memakai nama tabel/entitas `Murid`, database memakai `siswa`.
- PDF memakai `id_murid`, database memakai `id_siswa`.
- PDF memakai `nama_murid`, database memakai `nama_siswa`.
- PDF memakai `tanggal_lahir`, database memakai `tgl_lahir`.
- PDF mencantumkan `status`, database aktual belum punya status siswa.
- Tambahkan `agama`, `nama_wali`, `no_hp_wali`, `foto`.

### `pendaftaran`

Status: **cukup rapi, tetapi masih lebar**

Yang sudah benar:

- 1 akun calon siswa hanya punya 1 pendaftaran;
- nomor pendaftaran/no registrasi unique;
- punya status proses PPDB;
- punya timestamp submit/verifikasi/diterima;
- kompatibel dengan frontend saat ini.

Yang perlu diubah di skripsi:

- Jangan tulis `Formulir_Pendaftaran` dengan field `id_ta`, `tahun`, `status`; itu terlihat seperti tabel tahun ajaran dan tidak cocok dengan implementasi.
- Ganti menjadi tabel `pendaftaran` dengan field utama:
  - `id_pendaftaran`
  - `id_user`
  - `nomor_pendaftaran`
  - `tahun_pelajaran`
  - `status_pendaftaran`
  - `current_step`
  - `no_registrasi`
  - `ppdb_status`
  - `catatan_admin`
  - `submitted_at`
  - `verified_at`
  - `accepted_at`
  - `status_kelulusan`

### Tabel Detail PPDB

Status: **rapi**

Tabel:

- `pendaftaran_keterangan_pribadi`
- `pendaftaran_kesehatan`
- `pendaftaran_pendidikan_asal`
- `pendaftaran_orang_tua_wali`
- `pendaftaran_kepribadian`
- `pendaftaran_dokumen`

Yang perlu diubah di skripsi:

- Tambahkan tabel-tabel ini sebagai hasil normalisasi formulir pendaftaran.
- Relasinya: `pendaftaran.id_pendaftaran` 1:1 ke masing-masing tabel detail.

### `berkas_pendaftarans`

Status: **rapi**

Yang sudah benar:

- 1 pendaftaran dapat memiliki banyak berkas.
- Kombinasi `pendaftaran_id + jenis_berkas` unique, sehingga satu jenis dokumen tidak dobel.

Yang perlu diubah di skripsi:

- Nama tabel aktual `berkas_pendaftarans`, bukan `Berkas_Pendaftaran`.
- Field utama:
  - `id`
  - `pendaftaran_id`
  - `jenis_berkas`
  - `file_path`
  - `status_verifikasi`
  - `catatan`

### `kelas`

Status: **cukup rapi**

Yang sudah benar:

- punya `nama_kelas`, `tingkat`, `jurusan`, `kapasitas_maksimal`, `ruangan`;
- punya wali kelas;
- kombinasi `nama_kelas + tahun_ajaran` unique.

Yang perlu diubah di skripsi:

- PDF memakai `id_jurusan` dan `id_tahun_ajaran`, database aktual memakai `jurusan` enum dan `tahun_ajaran` string.
- Jika tidak ingin menambah tabel baru, ubah skripsi agar menjelaskan `jurusan` sebagai enum `IPA/IPS`.
- Wali kelas di database memakai `id_wali_kelas` yang mengarah ke `users.id_user` dengan role guru.

### `mata_pelajaran`

Status: **cukup rapi**

Yang sudah benar:

- punya `nama_mapel`, `tingkat`, `kelompok_mapel`, `id_guru`;
- kombinasi `nama_mapel + tingkat` unique.

Yang perlu diubah di skripsi:

- PDF mencantumkan `kkm` dan `status`, database aktual belum punya dua field itu.
- PDF menyebut relasi guru-mapel M:N. Database aktual masih memakai `mata_pelajaran.id_guru` dan `kelas_mapel`.
- Jika skripsi ingin sesuai program, tulis bahwa satu mapel pada satu tingkat memiliki satu guru pengampu utama, dan mapel dapat dipetakan ke banyak kelas melalui `kelas_mapel`.

### `kelas_mapel`

Status: **rapi**

Yang sudah benar:

- tabel penghubung kelas dan mapel;
- unique `id_kelas + id_mapel`.

Yang perlu diubah di skripsi:

- Tambahkan tabel ini karena di PDF belum dirinci sebagai tabel struktur.

### `waktu_pelajaran`

Status: **rapi**

Yang sudah benar:

- memisahkan slot jam dari jadwal;
- unique slot `jam_mulai + jam_selesai + tipe`.

Yang perlu diubah di skripsi:

- Tambahkan tabel ini jika menjelaskan jadwal pelajaran.

### `jadwal_pelajaran`

Status: **rapi**

Yang sudah benar:

- menghubungkan kelas, mapel, guru, hari, waktu, ruangan, tahun ajaran, semester;
- punya unique constraint agar jadwal kelas/guru tidak bentrok.

Yang perlu diubah di skripsi:

- PDF belum menampilkan tabel jadwal pelajaran secara detail.
- Tambahkan tabel ini karena sangat penting untuk menjelaskan fitur guru melihat kelas/mapel yang diajar.

### `nilai`

Status: **rapi**

Yang sudah benar:

- menyimpan komponen nilai tugas, UTS, UAS, praktik, sikap, akhir;
- unique per siswa, mapel, semester, tahun ajaran;
- punya validasi wali melalui `validated_by_wali`, `id_wali_validator`, `validated_at`.

Yang perlu diubah di skripsi:

- PDF memakai `id_murid`, `id_guru`, `id_kelas`, `id_tahun_ajaran`.
- Database aktual memakai:
  - `id_user_siswa`
  - `id_mapel`
  - `id_guru_input`
  - `semester`
  - `tahun_ajaran`
- Tambahkan field `nilai_praktik`, `nilai_sikap`, `validated_by_wali`, `id_wali_validator`, `validated_at`.
- Hapus atau sesuaikan `status_kunci` karena tidak ada di database aktual.

### `absensi`

Status: **rapi**

Yang sudah benar:

- menyimpan absensi siswa per tanggal/mapel/jadwal;
- status ringkas `H`, `A`, `I`, `S`, `T`;
- punya unique constraint untuk mencegah absensi siswa dobel di waktu yang sama.

Yang perlu diubah di skripsi:

- PDF memakai `id_murid` dan `id_guru`, database aktual memakai `id_user_siswa` dan `id_guru_pencatat`.
- PDF belum mencantumkan `id_jadwal`, `jam_mulai`, `jam_selesai`.
- Status di PDF `hadir, izin, sakit, alfa`; database memakai kode:
  - `H` = Hadir
  - `A` = Alpa
  - `I` = Izin
  - `S` = Sakit
  - `T` = Terlambat

### `absensi_guru`

Status: **rapi**

Yang sudah benar:

- menyimpan absensi guru per tanggal;
- unique `id_user_guru + tanggal`.

Yang perlu diubah di skripsi:

- Tambahkan tabel ini jika fitur absensi guru masuk pembahasan.

### `tahun_ajarans`

Status: **rapi**

Yang sudah benar:

- punya tahun ajaran, semester, tanggal mulai/selesai, status;
- unique `tahun_ajaran + semester`.

Yang perlu diubah di skripsi:

- Nama primary key aktual `id`, bukan `id_tahun_ajaran`.
- Enum semester aktual `Ganjil/Genap`, bukan `ganjil/genap`.
- Enum status aktual `Aktif`, `Tidak Aktif`, `Selesai`.

### `profil_sekolahs`

Status: **rapi**

Yang sudah benar:

- menyimpan profil sekolah, NPSN, akreditasi, hero image, tentang kami, kontak, visi/misi, sosial media.

Yang perlu diubah di skripsi:

- PDF mencantumkan `id_admin`, tetapi database aktual tidak menyimpan `id_admin`.
- Sesuaikan field dengan implementasi aktual:
  - `nama_sekolah`
  - `npsn`
  - `akreditasi`
  - `hero_subtitle`
  - `hero_image`
  - `tentang_kami`
  - `alamat`
  - `no_hp`
  - `email`
  - `kata_sambutan`
  - `nama_kepsek`
  - `foto_kepsek`
  - `visi`
  - `misi`
  - `instagram`
  - `facebook`
  - `youtube`

### `pengumumen`

Status: **jalan, tetapi nama tabel kurang ideal**

Yang sudah benar:

- menyimpan judul, kategori, isi, thumbnail, akses, tanggal publikasi;
- relasi penulis mengarah ke `users`.

Yang perlu diubah di skripsi:

- Secara konseptual tulis sebagai `Pengumuman`.
- Jika menulis physical database, nama tabel aktual adalah `pengumumen`.
- PDF memakai `id_admin`, `judul_pengumuman`, `isi_pengumuman`, `gambar`, `file_lampiran`, `status_publish`.
- Database aktual memakai `penulis_id`, `judul`, `isi`, `thumbnail`, `akses`, `tanggal_publikasi`.

Catatan:

- Mengganti nama tabel dari `pengumumen` ke `pengumuman` akan lebih rapi, tetapi perlu migrasi dan update model/service/controller. Tidak wajib jika waktu sidang dekat.

### `beritas`

Status: **rapi**

Yang perlu diubah di skripsi:

- Tambahkan jika fitur berita/prestasi tampil di sistem.
- Field utama: `judul`, `isi`, `kategori`, `gambar`, `tanggal_publikasi`, `is_published`.

### `system_settings`

Status: **rapi**

Yang perlu diubah di skripsi:

- Tambahkan sebagai tabel pengaturan sistem/PPDB jika fitur pengaturan konten PPDB dibahas.

### `audit_logs`

Status: **rapi**

Yang perlu diubah di skripsi:

- Tambahkan jika ingin menjelaskan pencatatan aktivitas admin.
- Tabel ini membantu menjawab pertanyaan sidang tentang keamanan dan jejak perubahan data.

### `ekstrakurikuler`

Status: **rapi**

Yang perlu diubah di skripsi:

- Tambahkan jika fitur ekskul dipakai dalam aplikasi.
- Pembina mengarah ke `users.id_user`.

## 3. Hal Yang Sebaiknya Diubah Di PDF Skripsi

Prioritas tinggi:

1. Ganti entitas `Calon_Murid` menjadi konsep akun `users` role `calon_siswa` + tabel `pendaftaran`.
2. Perbaiki `Formulir_Pendaftaran`; struktur di PDF saat ini tidak cocok. Gunakan `pendaftaran` + tabel detail PPDB.
3. Hapus atau revisi entitas `Jurusan`; database aktual memakai enum `kelas.jurusan` dengan nilai `IPA/IPS`.
4. Tambahkan tabel yang belum ada di PDF tetapi ada di aplikasi:
   - `roles`
   - `permissions`
   - `role_permission`
   - `menu_items`
   - `kelas_mapel`
   - `waktu_pelajaran`
   - `jadwal_pelajaran`
   - `absensi_guru`
   - `beritas`
   - `system_settings`
   - `audit_logs`
5. Sesuaikan semua nama role:
   - `administrator` menjadi `admin`
   - `kepala_sekolah` menjadi `kepsek`
   - `murid` menjadi `siswa`
   - `calon_murid` menjadi `calon_siswa`
6. Sesuaikan tabel `nilai` dan `absensi` agar memakai field aktual `id_user_siswa`, `id_guru_input`, dan `id_guru_pencatat`.

Prioritas sedang:

1. Sesuaikan `Profil_Sekolah` dengan field aktual.
2. Sesuaikan `Pengumuman` dengan field aktual.
3. Tambahkan penjelasan bahwa beberapa relasi akademik memakai `users.id_user` karena sistem login dan permission berpusat di tabel `users`.
4. Tambahkan unique constraint penting di narasi struktur tabel.

Prioritas rendah:

1. Jika ada waktu, rename tabel `pengumumen` ke `pengumuman` agar lebih baku.
2. Jika ingin desain akademik yang lebih murni, migrasikan relasi `id_user_siswa` ke `id_siswa` dan `id_guru` ke `id_guru`, tetapi ini berdampak besar ke kode.

## 4. Apakah Database Perlu Diubah Lagi?

Untuk sidang dan aplikasi saat ini: **tidak wajib ada perubahan besar lagi**.

Yang paling aman dilakukan sekarang adalah:

1. Revisi skripsi agar mengikuti database aktual.
2. Tambahkan seed data demo untuk `tahun_ajarans`, `kelas`, `mata_pelajaran`, `waktu_pelajaran`, `jadwal_pelajaran`, `nilai`, dan `absensi` jika database sering di-reset sebelum demo.
3. Pertahankan relasi berbasis `users.id_user` dan jelaskan alasannya dengan tegas.

## 5. Kalimat Penjelasan Untuk Sidang

Gunakan kalimat ini jika dosen bertanya mengapa beberapa tabel memakai `id_user`:

> Pada sistem ini, tabel `users` berfungsi sebagai pusat identitas akun dan hak akses. Data profil seperti guru dan siswa disimpan di tabel terpisah, tetapi transaksi akademik tetap mengacu ke `users.id_user` agar relasi langsung terhubung dengan akun login, permission, dan aktivitas pengguna. Detail profil guru atau siswa tetap dapat diambil melalui relasi `users -> guru` atau `users -> siswa`.

Gunakan kalimat ini untuk PPDB:

> Data PPDB dipisahkan menjadi tabel utama `pendaftaran` dan beberapa tabel detail seperti keterangan pribadi, kesehatan, pendidikan asal, orang tua/wali, kepribadian, dan dokumen. Pemisahan ini membuat struktur data lebih terorganisir, mengurangi tabel utama yang terlalu melebar, dan memudahkan pengembangan proses pendaftaran secara bertahap.

## 6. Verdict Akhir

Database aktual: **layak, cukup rapi, dan bisa dipertahankan**.  
Yang paling perlu dibenahi: **isi rancangan basis data di skripsi agar sama dengan implementasi**.

