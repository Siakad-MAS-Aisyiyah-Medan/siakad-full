import apiClient from '@app/shared/services/apiClient';
import { unwrapPaginated } from '@app/shared/services/apiHelpers';

export async function fetchKelasList(params = {}) {
  const response = await apiClient.get('/kelas', { params });
  const { items } = unwrapPaginated(response);
  return items;
}

export async function fetchKelasStats() {
  const response = await apiClient.get('/kelas/stats');
  return response.data?.data;
}

export async function createKelas(payload) {
  const response = await apiClient.post('/kelas', payload);
  return response.data;
}

export async function updateKelas(id, payload) {
  const response = await apiClient.put(`/kelas/${id}`, payload);
  return response.data;
}

export async function deleteKelas(id) {
  const response = await apiClient.delete(`/kelas/${id}`);
  return response.data;
}
