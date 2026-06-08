import apiClient from '@app/shared/services/apiClient';
import { unwrapPaginated } from '@app/shared/services/apiHelpers';

export async function fetchEkskulList(params = {}) {
  const response = await apiClient.get('/ekskul', { params });
  const { items } = unwrapPaginated(response);
  return items;
}

export async function createEkskul(payload) {
  const response = await apiClient.post('/ekskul', payload);
  return response.data;
}

export async function updateEkskul(id, payload) {
  const response = await apiClient.put(`/ekskul/${id}`, payload);
  return response.data;
}

export async function deleteEkskul(id) {
  const response = await apiClient.delete(`/ekskul/${id}`);
  return response.data;
}

