import { fetchLaporan } from '@app/shared/laporan/laporan.service';

export async function fetchAdminLaporan(params) {
  return fetchLaporan('/laporan', params);
}
