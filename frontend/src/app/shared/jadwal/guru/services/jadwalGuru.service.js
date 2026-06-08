import apiClient from '@app/shared/services/apiClient';
import { unwrapData } from '@app/shared/services/apiHelpers';

export async function fetchJadwalMengajar(params = {}) {
  const response = await apiClient.get('/guru/jadwal', { params });
  return unwrapData(response) ?? [];
}
