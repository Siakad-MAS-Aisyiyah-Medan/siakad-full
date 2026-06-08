import apiClient from '@app/shared/services/apiClient';
import { unwrapPaginated } from '@app/shared/services/apiHelpers';

export async function fetchGuruList(params = {}) {
  const response = await apiClient.get('/guru', { params });
  const { items } = unwrapPaginated(response);
  return items;
}

export async function createGuru(payload) {
  const response = await apiClient.post('/guru', payload);
  return response.data;
}

export async function updateGuru(id, payload) {
  const response = await apiClient.put(`/guru/${id}`, payload);
  return response.data;
}

export async function deleteGuru(id) {
  const response = await apiClient.delete(`/guru/${id}`);
  return response.data;
}
