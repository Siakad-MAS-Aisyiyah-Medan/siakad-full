import apiClient from '@app/shared/services/apiClient';

export async function getPublicEkskul() {
  const response = await apiClient.get('/public/ekskul');
  return response.data;
}
