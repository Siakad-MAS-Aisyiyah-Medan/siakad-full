import apiClient from '@app/shared/services/apiClient';
import { unwrapPaginated } from '@app/shared/services/apiHelpers';

export async function fetchBeritaList(params = {}) {
  const response = await apiClient.get('/berita', { params });
  const { items } = unwrapPaginated(response);
  return items;
}

export async function createBerita(payload) {
  const response = await apiClient.post('/berita', payload);
  return response.data;
}

export async function updateBerita(id, payload) {
  const response = await apiClient.put(`/berita/${id}`, payload);
  return response.data;
}

export async function deleteBerita(id) {
  const response = await apiClient.delete(`/berita/${id}`);
  return response.data;
}

