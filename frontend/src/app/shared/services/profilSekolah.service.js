import apiClient from './apiClient';

export async function getProfilSekolah() {
  const response = await apiClient.get('/profil-sekolah');
  return response.data;
}

export async function updateProfilSekolah(data) {
  const formData = new FormData();
  formData.append('_method', 'PUT');
  
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      // If it's a file and we are not clearing it
      if (key === 'foto_kepsek' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (key !== 'foto_kepsek' || typeof data[key] === 'string') {
        formData.append(key, data[key]);
      }
    }
  }

  const response = await apiClient.post('/profil-sekolah', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
