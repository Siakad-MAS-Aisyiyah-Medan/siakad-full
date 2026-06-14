import apiClient from './apiClient';
import { unwrapData } from './apiHelpers';

export async function fetchTahunAjaran() {
  const response = await apiClient.get('/tahun-ajaran');
  return unwrapData(response);
}

export async function createTahunAjaran(data) {
  const response = await apiClient.post('/tahun-ajaran', data);
  return unwrapData(response);
}

export async function updateTahunAjaran(id, data) {
  const response = await apiClient.put(`/tahun-ajaran/${id}`, data);
  return unwrapData(response);
}

export async function deleteTahunAjaran(id) {
  const response = await apiClient.delete(`/tahun-ajaran/${id}`);
  return unwrapData(response);
}

export async function activateTahunAjaran(id) {
  const response = await apiClient.put(`/tahun-ajaran/${id}/activate`);
  return unwrapData(response);
}
