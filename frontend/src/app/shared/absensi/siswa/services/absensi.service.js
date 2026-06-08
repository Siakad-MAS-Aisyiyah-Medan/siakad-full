import apiClient from '@app/shared/services/apiClient';
import { unwrapData } from '@app/shared/services/apiHelpers';

export async function fetchAbsensiSiswa(params = {}) {
  const response = await apiClient.get('/siswa/absensi', { params });
  return unwrapData(response) ?? [];
}
