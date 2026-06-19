// absensi.service.js
// Memastikan semua method yang dipanggil useGuruAbsensi.js tersedia di sini.

import apiClient from '@app/shared/services/apiClient';

export const absensiService = {

  // ── Data Pendukung ────────────────────────────────────────────

  /** GET /api/guru/jadwal — daftar jadwal mengajar guru */
  getJadwalGuru: (id_tahun_ajaran) =>
    apiClient.get('/guru/jadwal', { params: { id_tahun_ajaran } })
      .then((res) => res.data),

  /** GET /api/tahun-ajaran — opsional jika endpoint tersedia */
  getTahunAjaran: () =>
    apiClient.get('/tahun-ajaran').then((res) => res.data),

  // ── Absensi Guru → Siswa ──────────────────────────────────────

  /**
   * GET /api/guru/absensi/siswa/form
   * Mengambil daftar siswa + absensi existing untuk tanggal tertentu.
   * Memanggil AbsensiSiswaService::getFormData() di backend.
   *
   * @param {{ id_jadwal, id_tahun_ajaran, tanggal }} params
   */
  getFormData: (params) =>
    apiClient.get('/guru/absensi/siswa/form', { params })
      .then((res) => res.data),

  /**
   * POST /api/guru/absensi/siswa/bulk
   * Menyimpan absensi satu kelas sekaligus.
   * Memanggil AbsensiSiswaService::bulkSave() di backend.
   *
   * @param {{ id_jadwal, id_tahun_ajaran, tanggal, absensi: Array }} payload
   */
  bulkStore: (payload) =>
    apiClient.post('/guru/absensi/siswa/bulk', payload)
      .then((res) => res.data),

  /**
   * GET /api/guru/absensi/siswa/rekap
   * Mengambil riwayat pertemuan absensi (sebelumnya pakai localStorage).
   * Memanggil AbsensiSiswaService::getRekap() di backend.
   *
   * @param {{ id_jadwal, id_tahun_ajaran }} params
   */
  getRekap: (params) =>
    apiClient.get('/guru/absensi/siswa/rekap', { params })
      .then((res) => res.data),

  // ── Absensi Siswa (untuk halaman siswa) ──────────────────────

  /**
   * GET /api/siswa/absensi/rekap
   * Rekap absensi pribadi siswa yang sedang login.
   *
   * @param {{ id_tahun_ajaran?: string }} params
   */
  getRekapSiswa: (params = {}) =>
    apiClient.get('/siswa/absensi/rekap', { params })
      .then((res) => res.data),
};
