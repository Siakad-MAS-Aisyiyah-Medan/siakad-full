import apiClient from '@app/shared/services/apiClient';
import { unwrapPaginated } from '@app/shared/services/apiHelpers';

export async function fetchGuruList(params = {}) {
  const response = await apiClient.get('/guru', { params });
  const { items } = unwrapPaginated(response);
  return items;
}

export async function createGuru(payload) {
  let isFormData = payload instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await apiClient.post('/guru', payload, config);
  return response.data;
}

export async function updateGuru(id, payload) {
  let isFormData = payload instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await apiClient.post(`/guru/${id}?_method=PUT`, payload, config);
  return response.data;
}

export async function deleteGuru(id) {
  const response = await apiClient.delete(`/guru/${id}`);
  return response.data;
}
