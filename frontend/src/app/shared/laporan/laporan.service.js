import apiClient from '@app/shared/services/apiClient';
import { unwrapData } from '@app/shared/services/apiHelpers';

export async function fetchLaporan(apiPath, params) {
  const response = await apiClient.get(apiPath, { params });
  return unwrapData(response);
}
