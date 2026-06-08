import apiClient from '@app/shared/services/apiClient';
import { unwrapPaginated } from '@app/shared/services/apiHelpers';

export async function fetchMapelList() {
  const response = await apiClient.get('/mapel');
  const { items } = unwrapPaginated(response);
  return items;
}

export async function fetchGuruList() {
  const response = await apiClient.get('/guru');
  const { items } = unwrapPaginated(response);
  return items;
}

export async function createMapel(payload) {
  const response = await apiClient.post('/mapel', payload);
  return response.data;
}

export async function updateMapel(id, payload) {
  const response = await apiClient.put(`/mapel/${id}`, payload);
  return response.data;
}

export async function deleteMapel(id) {
  const response = await apiClient.delete(`/mapel/${id}`);
  return response.data;
}
