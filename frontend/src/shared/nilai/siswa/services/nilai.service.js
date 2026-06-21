import apiClient from '@/shared/services/apiClient';
import { unwrapData } from '@/shared/services/apiHelpers';

export async function fetchNilaiSiswa(params = {}) {
  const response = await apiClient.get('/siswa/nilai', { params });
  return unwrapData(response);
}

export async function fetchRaport(params) {
  const response = await apiClient.get('/siswa/nilai/raport', { params });
  return unwrapData(response);
}
