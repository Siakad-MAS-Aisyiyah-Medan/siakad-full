import {
  fetchMe,
  getStoredUser,
  isAuthenticated,
} from '@app/shared/services/auth.service';
import { fetchMyRegistration } from '@app/shared/services/ppdb.service';
import { startOrResumePpdb, PATH_FORMULIR_PPDB, PATH_STATUS_PPDB } from './startOrResumePpdb';
export const LOGIN_REDIRECT = '/login-calon-murid';
export const PATH_REGISTRASI = PATH_FORMULIR_PPDB;
export const PATH_STATUS = PATH_STATUS_PPDB;

const STATUS_TO_REGISTRASI = ['draft', 'revision', 'revisi'];
const STATUS_TO_STATUS_PAGE = [
  'submitted',
  'verified',
  'accepted',
  'rejected',
  'diajukan',
  'terverifikasi',
  'diterima',
  'ditolak',
];

/**
 * Alur tombol "Daftar Sekarang" (navbar & CTA PPDB).
 * @returns {Promise<{ ok: boolean, path?: string, error?: string }>}
 */
export async function handleDaftarSekarang() {
  if (!isAuthenticated()) {
    return { ok: true, path: LOGIN_REDIRECT };
  }

  let me;
  try {
    me = await fetchMe();
  } catch (err) {
    console.error('handleDaftarSekarang: fetchMe gagal', err?.response?.data ?? err);
    return { ok: true, path: LOGIN_REDIRECT };
  }

  const user = me?.user || getStoredUser();
  if (!user || user.role !== 'calon_siswa') {
    // Jika user login namun bukan calon_siswa (misal Admin yang sedang melihat landing page),
    // langsung arahkan ke halaman login calon murid daripada menampilkan pesan error.
    return { ok: true, path: LOGIN_REDIRECT };
  }

  let reg = { has_registration: false, pendaftaran: null };
  try {
    const data = await fetchMyRegistration();
    if (data && typeof data === 'object') {
      reg = data;
    }
  } catch (err) {
    console.warn(
      'handleDaftarSekarang: GET my-registration gagal, dianggap belum punya pendaftaran',
      err?.response?.data ?? err,
    );
    reg = { has_registration: false, pendaftaran: null };
  }

  if (!reg?.has_registration || !reg?.pendaftaran) {
    const started = await startOrResumePpdb();
    if (!started.ok) {
      return { ok: false, error: started.error };
    }
    return { ok: true, path: started.path };
  }

  const status =
    reg.pendaftaran?.status_pendaftaran || reg.pendaftaran?.ppdb_status || 'draft';

  if (STATUS_TO_REGISTRASI.includes(status)) {
    return { ok: true, path: PATH_REGISTRASI };
  }

  if (STATUS_TO_STATUS_PAGE.includes(status)) {
    return { ok: true, path: PATH_STATUS };
  }

  return { ok: true, path: PATH_REGISTRASI };
}

