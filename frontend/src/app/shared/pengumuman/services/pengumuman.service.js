import apiClient from '@app/shared/services/apiClient';
import { unwrapPaginated, unwrapData } from '@app/shared/services/apiHelpers';

export async function fetchPengumumanList(params = {}) {
  const response = await apiClient.get('/pengumuman', { params });
  const { items } = unwrapPaginated(response);
  return items;
}

export async function createPengumuman(payload) {
  const formData = new FormData();
  for (const key in payload) {
    if (payload[key] !== null && payload[key] !== undefined) {
      formData.append(key, payload[key]);
    }
  }
  const response = await apiClient.post('/pengumuman', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapData(response);
}

export async function updatePengumuman(id, payload) {
  const formData = new FormData();
  formData.append('_method', 'PUT'); // For Laravel PUT spoofing with FormData
  for (const key in payload) {
    if (payload[key] !== null && payload[key] !== undefined) {
      formData.append(key, payload[key]);
    }
  }
  const response = await apiClient.post(`/pengumuman/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapData(response);
}

export async function deletePengumuman(id) {
  const response = await apiClient.delete(`/pengumuman/${id}`);
  return response.data;
}
