import apiClient from '@app/shared/services/apiClient';
import { unwrapList, unwrapPaginated } from '@app/shared/services/apiHelpers';

export async function fetchMuridList(params = {}) {
  const response = await apiClient.get('/murid', { params });
  const { items } = unwrapPaginated(response);
  return items;
}

export async function updateMurid(id, payload) {
  const response = await apiClient.put(`/murid/${id}`, payload);
  return response.data;
}

export async function enrollMurid(id, id_kelas = null) {
  const response = await apiClient.post(`/murid/${id}/enroll`, { id_kelas });
  return response.data;
}

export async function deleteMurid(id) {
  const response = await apiClient.delete(`/murid/${id}`);
  return response.data;
}
