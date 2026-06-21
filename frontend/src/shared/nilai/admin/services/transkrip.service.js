import apiClient from '@/shared/services/apiClient';
import { unwrapData } from '@/shared/services/apiHelpers';

export async function fetchAdminStudentRaport(idUserSiswa, params) {
  const response = await apiClient.get(`/admin/transkrip-akademik/${idUserSiswa}/raport`, { params });
  return unwrapData(response);
}
