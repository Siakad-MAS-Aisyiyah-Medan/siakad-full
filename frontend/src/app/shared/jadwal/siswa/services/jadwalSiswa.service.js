import apiClient from '@app/shared/services/apiClient';
import { unwrapData } from '@app/shared/services/apiHelpers';

export async function fetchJadwalSiswa(params = {}) {
  const response = await apiClient.get('/siswa/jadwal', { params });
  return unwrapData(response) ?? [];
}
