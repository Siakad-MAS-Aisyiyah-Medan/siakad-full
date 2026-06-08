export const JENIS_LAPORAN = [
  { value: 'siswa', label: 'Data Siswa' },
  { value: 'guru', label: 'Data Guru' },
  { value: 'ppdb', label: 'PPDB' },
  { value: 'absensi_siswa', label: 'Absensi Siswa' },
  { value: 'absensi_guru', label: 'Absensi Guru' },
  { value: 'nilai', label: 'Nilai Siswa' },
  { value: 'jadwal', label: 'Jadwal Pelajaran' },
];

export const JENIS_BY_ROLE = {
  admin: JENIS_LAPORAN.map((j) => j.value),
  kepsek: JENIS_LAPORAN.map((j) => j.value),
  wali_kelas: ['siswa', 'absensi_siswa', 'nilai', 'jadwal'],
  guru: ['absensi_siswa', 'nilai', 'jadwal'],
  siswa: ['absensi_siswa', 'nilai', 'jadwal'],
};

export const PPDB_STATUS = [
  { value: '', label: 'Semua status' },
  { value: 'draft', label: 'Draft' },
  { value: 'diajukan', label: 'Diajukan' },
  { value: 'revisi', label: 'Revisi' },
  { value: 'terverifikasi', label: 'Terverifikasi' },
  { value: 'diterima', label: 'Diterima' },
  { value: 'ditolak', label: 'Ditolak' },
  { value: 'daftar_ulang', label: 'Daftar Ulang' },
  { value: 'menjadi_murid', label: 'Menjadi Murid' },
];

export const TABLE_COLUMNS = {
  siswa: [
    { key: 'nisn', label: 'NISN' },
    { key: 'nama_siswa', label: 'Nama' },
    { key: 'kelas', label: 'Kelas' },
    { key: 'status_aktif', label: 'Aktif', render: (v) => (v ? 'Ya' : 'Tidak') },
  ],
  guru: [
    { key: 'username', label: 'Username' },
    { key: 'nama_guru', label: 'Nama' },
    { key: 'role', label: 'Role' },
    { key: 'nip_nuptk', label: 'NIP/NUPTK' },
  ],
  ppdb: [
    { key: 'nama_lengkap', label: 'Nama' },
    { key: 'username', label: 'Username' },
    { key: 'ppdb_status', label: 'Status' },
    { key: 'created_at', label: 'Daftar' },
  ],
  absensi_siswa: [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'siswa', label: 'Siswa', render: (_, r) => r.siswa?.nama || '-' },
    { key: 'mapel', label: 'Mapel', render: (_, r) => r.mapel?.nama_mapel || '-' },
    { key: 'status_label', label: 'Status' },
  ],
  absensi_guru: [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'guru', label: 'Guru', render: (_, r) => r.guru?.nama_guru || '-' },
    { key: 'jam_masuk', label: 'Masuk', render: (v) => (v || '').slice(0, 5) },
    { key: 'status_label', label: 'Status' },
  ],
  nilai: [
    { key: 'siswa', label: 'Siswa', render: (_, r) => r.siswa?.nama_siswa || '-' },
    { key: 'mapel', label: 'Mapel', render: (_, r) => r.mapel?.nama_mapel || '-' },
    { key: 'nilai_akhir', label: 'Akhir' },
    { key: 'predikat', label: 'Predikat' },
    { key: 'validated_by_wali', label: 'Valid', render: (v) => (v ? 'Ya' : 'Belum') },
  ],
  jadwal: [
    { key: 'hari', label: 'Hari' },
    { key: 'jam_mulai', label: 'Mulai', render: (v) => (v || '').slice(0, 5) },
    { key: 'kelas', label: 'Kelas', render: (_, r) => r.kelas?.nama_kelas || '-' },
    { key: 'mapel', label: 'Mapel', render: (_, r) => r.mapel?.nama_mapel || '-' },
    { key: 'ruangan', label: 'Ruangan' },
  ],
};
