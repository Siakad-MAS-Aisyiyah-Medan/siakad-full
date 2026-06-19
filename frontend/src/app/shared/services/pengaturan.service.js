import apiClient from './apiClient';
import { unwrapData } from './apiHelpers';

export async function fetchAllSettings() {
  const response = await apiClient.get('/settings');
  return unwrapData(response);
}

export async function updateSetting(key, value) {
  const response = await apiClient.put(`/settings/${key}`, { value });
  return unwrapData(response);
}

export async function bulkUpdateSettings(settings) {
  const response = await apiClient.post('/settings/bulk', { settings });
  return unwrapData(response);
}

export async function fetchProfilSekolah() {
  const response = await apiClient.get('/profil-sekolah');
  return unwrapData(response);
}

export async function updateProfilSekolah(data) {
  const response = await apiClient.put('/profil-sekolah', data);
  return unwrapData(response);
}
