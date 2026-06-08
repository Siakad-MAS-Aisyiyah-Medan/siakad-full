import apiClient from '@app/shared/services/apiClient';
import { unwrapData } from '@app/shared/services/apiHelpers';

export async function fetchNilaiForm(params) {
  const response = await apiClient.get('/guru/nilai/form', { params });
  return unwrapData(response);
}

export async function saveNilaiBulk(payload) {
  const response = await apiClient.post('/guru/nilai/bulk', payload);
  return unwrapData(response);
}
