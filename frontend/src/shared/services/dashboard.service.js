import apiClient from './apiClient';
import { unwrapData } from './apiHelpers';

export async function fetchAdminDashboardStats() {
  const response = await apiClient.get('/dashboard');
  return unwrapData(response);
}
