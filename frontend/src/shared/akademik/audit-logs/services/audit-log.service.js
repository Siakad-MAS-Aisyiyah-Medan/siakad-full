import apiClient from '@/shared/services/apiClient';

export async function fetchAuditLogs(params = {}) {
  return apiClient.get('/audit-logs', { params });
}
