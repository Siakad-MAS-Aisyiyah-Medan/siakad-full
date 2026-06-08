import apiClient from '@app/shared/services/apiClient';
import { unwrapPaginated } from '@app/shared/services/apiHelpers';

export async function fetchPengumumanList(params = {}) {
  const response = await apiClient.get('/pengumuman', { params });
  const { items } = unwrapPaginated(response);
  return items;
}

export async function createPengumuman(payload) {
  const response = await apiClient.post('/pengumuman', payload);
  return response.data;
}

export async function updatePengumuman(id, payload) {
  const response = await apiClient.put(`/pengumuman/${id}`, payload);
  return response.data;
}

export async function deletePengumuman(id) {
  const response = await apiClient.delete(`/pengumuman/${id}`);
  return response.data;
}

