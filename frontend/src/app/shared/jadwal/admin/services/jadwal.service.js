import apiClient from '@app/shared/services/apiClient';
import { unwrapPaginated } from '@app/shared/services/apiHelpers';

export async function fetchJadwalList(params = {}) {
  const response = await apiClient.get('/jadwal', { params });
  const { items } = unwrapPaginated(response);
  return items;
}

export async function createJadwal(payload) {
  const response = await apiClient.post('/jadwal', payload);
  return response.data;
}

export async function updateJadwal(id, payload) {
  const response = await apiClient.put(`/jadwal/${id}`, payload);
  return response.data;
}

export async function deleteJadwal(id) {
  const response = await apiClient.delete(`/jadwal/${id}`);
  return response.data;
}
