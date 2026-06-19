import apiClient from '@app/shared/services/apiClient';

/**
 * Mengambil daftar pengumuman publik dari public API.
 * 
 * @param {Object} params - Parameter query string
 * @returns {Promise} Resolves dengan data response
 */
export async function getPublicNews(params = {}) {
  const response = await apiClient.get('/public/pengumuman', { params });
  return response.data;
}

/**
 * Mengambil detail satu pengumuman publik berdasarkan ID.
 * 
 * @param {number|string} id - ID pengumuman
 * @returns {Promise} Resolves dengan data response
 */
export async function getPublicNewsDetail(id) {
  const response = await apiClient.get(`/public/pengumuman/${id}`);
  return response.data;
}
