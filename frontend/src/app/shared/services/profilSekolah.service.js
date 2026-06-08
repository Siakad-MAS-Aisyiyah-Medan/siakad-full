import apiClient from './apiClient';

export async function getProfilSekolah() {
  const response = await apiClient.get('/profil-sekolah');
  return response.data;
}

export async function updateProfilSekolah(data) {
  const response = await apiClient.put('/profil-sekolah', data);
  return response.data;
}
