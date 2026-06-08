import apiClient from '@app/shared/services/apiClient';

export async function fetchAuditLogs(params = {}) {
  return apiClient.get('/audit-logs', { params });
}
