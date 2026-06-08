import { fetchMyRegistration } from '@app/shared/services/ppdb.service';

/** Tentukan halaman PPDB setelah login calon siswa */
export async function resolvePpdbPathAfterLogin() {
  try {
    const data = await fetchMyRegistration();
    if (!data?.has_registration) {
      return '/ppdb/registrasi';
    }
    const status = data.pendaftaran?.status_pendaftaran;
    if (status === 'draft') {
      return '/ppdb/registrasi';
    }
    return '/calon-murid/status';
  } catch {
    return '/calon-murid/dashboard';
  }
}


