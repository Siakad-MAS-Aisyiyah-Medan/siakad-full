import apiClient from '@app/shared/services/apiClient';

/**
 * Mengambil daftar berita/pengumuman dari public API.
 * 
 * @param {Object} params - Parameter query string (contoh: { page: 1, search: 'lomba' })
 * @returns {Promise} Resolves dengan data response
 */
export async function getPublicNews(params = {}) {
  const response = await apiClient.get('/public/berita', { params });
  return response.data;
}

/**
 * Mengambil detail satu berita/pengumuman berdasarkan ID.
 * 
 * @param {number|string} id - ID pengumuman
 * @returns {Promise} Resolves dengan data response
 */
export async function getPublicNewsDetail(id) {
  const response = await apiClient.get(`/public/berita/${id}`);
  return response.data;
}
