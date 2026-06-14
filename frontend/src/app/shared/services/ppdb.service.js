import apiClient from '@app/shared/services/apiClient';
import { unwrapData, unwrapPaginated } from '@app/shared/services/apiHelpers';

/** Public */
export async function fetchPpdbInfo() {
  const res = await apiClient.get('/ppdb/info');
  return unwrapData(res);
}

/** Registrasi PPDB (setelah login) */
export async function fetchMyRegistration() {
  const res = await apiClient.get('/ppdb/my-registration');
  return unwrapData(res);
}

/** Buat draft baru atau lanjutkan draft — lihat startOrResumePpdb() */
export async function startPendaftaran() {
  const res = await apiClient.post('/ppdb/start');
  return unwrapData(res);
}

export async function saveStepKeteranganPribadi(payload) {
  const res = await apiClient.put('/ppdb/step/keterangan-pribadi', payload);
  return unwrapData(res);
}

export async function saveStepKesehatan(payload) {
  const res = await apiClient.put('/ppdb/step/kesehatan', payload);
  return unwrapData(res);
}

export async function saveStepPendidikanAsal(payload) {
  const res = await apiClient.put('/ppdb/step/pendidikan-asal', payload);
  return unwrapData(res);
}

export async function saveStepOrangTuaWali(payload) {
  const res = await apiClient.put('/ppdb/step/orang-tua-wali', payload);
  return unwrapData(res);
}

export async function saveStepKepribadian(payload) {
  const res = await apiClient.put('/ppdb/step/kepribadian', payload);
  return unwrapData(res);
}

export async function saveStepDokumen(payload) {
  const res = await apiClient.put('/ppdb/step/dokumen', payload);
  return unwrapData(res);
}

export async function submitPendaftaran() {
  const res = await apiClient.post('/ppdb/submit');
  return unwrapData(res);
}

export async function fetchPpdbStatus() {
  const res = await apiClient.get('/ppdb/status');
  return unwrapData(res);
}

/** Legacy */
export async function fetchPpdbMe() {
  const res = await apiClient.get('/ppdb/me');
  return unwrapData(res);
}

export async function saveFormulir(payload) {
  const res = await apiClient.post('/ppdb/formulir', payload);
  return unwrapData(res);
}

export async function fetchBerkasList() {
  const res = await apiClient.get('/ppdb/berkas');
  return unwrapData(res);
}

export async function uploadBerkas(jenisBerkas, file) {
  const form = new FormData();
  form.append('jenis_berkas', jenisBerkas);
  form.append('file', file);
  const res = await apiClient.post('/ppdb/berkas', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapData(res);
}

export async function deleteBerkas(jenisBerkas) {
  const res = await apiClient.delete(`/ppdb/berkas/${encodeURIComponent(jenisBerkas)}`);
  return unwrapData(res);
}

export async function fetchBuktiPendaftaran() {
  const res = await apiClient.get('/ppdb/bukti');
  return unwrapData(res);
}

/** Admin */
export async function fetchAdminPendaftar(params = {}) {
  const res = await apiClient.get('/admin/ppdb', { params });
  const { items } = unwrapPaginated(res);
  return items;
}

export async function fetchAdminPpdbStats() {
  const res = await apiClient.get('/admin/ppdb/stats');
  return unwrapData(res);
}

export async function fetchAdminPendaftarDetail(id) {
  const res = await apiClient.get(`/admin/ppdb/${id}`);
  return unwrapData(res);
}

export async function adminVerifikasi(id) {
  const res = await apiClient.post(`/admin/ppdb/${id}/verifikasi`);
  return unwrapData(res);
}

export async function adminRevisi(id, catatan) {
  const res = await apiClient.post(`/admin/ppdb/${id}/revisi`, { catatan });
  return unwrapData(res);
}

export async function adminTerima(id) {
  const res = await apiClient.post(`/admin/ppdb/${id}/terima`);
  return unwrapData(res);
}

export async function adminTolak(id, catatan) {
  const res = await apiClient.post(`/admin/ppdb/${id}/tolak`, { catatan });
  return unwrapData(res);
}

export async function adminJadikanMurid(id, idKelas = null) {
  const res = await apiClient.post(`/admin/ppdb/${id}/jadikan-murid`, { id_kelas: idKelas });
  return unwrapData(res);
}

export const PPDB_STATUS_LABELS = {
  belum: 'Belum Mendaftar',
  draft: 'Draft',
  revision: 'Perlu Revisi',
  submitted: 'Diajukan',
  verified: 'Terverifikasi',
  accepted: 'Diterima',
  rejected: 'Ditolak',
  diajukan: 'Diajukan',
  revisi: 'Revisi',
  terverifikasi: 'Terverifikasi',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
};

export const BERKAS_LABELS = {
  ijazah_atau_skl: 'Ijazah / SKHUN',
  stk: 'STK',
  pas_foto: 'Pas Foto',
  nisn: 'NISN',
  kartu_keluarga: 'Kartu Keluarga (KK)',
  ktp_orang_tua: 'KTP Orang Tua',
  foto: 'Pas Foto',
  rapor: 'STK',
  akta_kelahiran: 'NISN',
};
