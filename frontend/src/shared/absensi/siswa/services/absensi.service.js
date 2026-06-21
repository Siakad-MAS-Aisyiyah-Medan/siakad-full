import apiClient from '@/shared/services/apiClient';
import { unwrapData } from '@/shared/services/apiHelpers';

export async function fetchAbsensiSiswa(params = {}) {
  const response = await apiClient.get('/siswa/absensi', { params });
  return unwrapData(response) ?? [];
}
