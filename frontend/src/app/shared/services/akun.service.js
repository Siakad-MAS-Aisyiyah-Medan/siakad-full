import apiClient from './apiClient';
import { unwrapData } from './apiHelpers';

export async function fetchAdminAkunList(params = {}) {
  const response = await apiClient.get('/akun', { params });
  return unwrapData(response);
}

export async function createAdminAkun(data) {
  const response = await apiClient.post('/akun', data);
  return unwrapData(response);
}

export async function deleteAdminAkun(id) {
  const response = await apiClient.delete(`/akun/${id}`);
  return unwrapData(response);
}

export async function updateAdminProfile(data) {
  const response = await apiClient.put('/akun/profile', data);
  return unwrapData(response);
}

export async function updateAdminAkun(id, data) {
  const response = await apiClient.put(`/akun/${id}`, data);
  return unwrapData(response);
}

export async function updateBiodataProfile(data) {
  const response = await apiClient.put('/biodata/profile', data);
  return unwrapData(response);
}

export async function uploadFotoProfil(file) {
  const formData = new FormData();
  formData.append('foto', file);
  const response = await apiClient.post('/biodata/foto', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrapData(response);
}

export async function deleteFotoProfil() {
  const response = await apiClient.delete('/biodata/foto');
  return unwrapData(response);
}
