import axios from 'axios';
import { apiConfig } from '@/config/api.config';
import { clearSession } from './auth.service';
import { getAuthItem } from '@/shared/utils/sessionAuthStorage';

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

const GET_CACHE = new Map();

const originalGet = apiClient.get;
apiClient.get = async (url, config = {}) => {
  if (config.cache === false || config.responseType === 'blob') {
    return originalGet(url, config);
  }

  const cacheKey = url + JSON.stringify(config.params || {});
  
  if (GET_CACHE.has(cacheKey)) {
    // SWR: Fetch fresh data in background silently
    originalGet(url, config)
      .then(res => GET_CACHE.set(cacheKey, res.data))
      .catch((err) => {
        console.error(`[API SWR ERROR] Background fetch failed for ${url}`, err?.response?.data || err.message);
      });
      
    // Return cached data immediately
    return {
      data: GET_CACHE.get(cacheKey),
      status: 200,
      statusText: 'OK (Cached)',
      headers: {},
      config
    };
  }

  const response = await originalGet(url, config);
  GET_CACHE.set(cacheKey, response.data);
  return response;
};

const AUTH_PUBLIC_PATHS = ['/login', '/register', '/auth/register-calon-siswa'];

function isPublicAuthRequest(url = '') {
  return AUTH_PUBLIC_PATHS.some((segment) => url.includes(segment));
}

export function resolveLoginUrl(pathname = window.location.pathname) {
  const calonPrefixes = ['/calon-murid', '/ppdb/registrasi', '/ppdb/formulir', '/login-calon-murid'];
  if (calonPrefixes.some((p) => pathname.startsWith(p))) {
    return '/login-calon-murid';
  }
  return '/login';
}

apiClient.interceptors.request.use((config) => {
  const token = getAuthItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // Clear cache on any data mutation
    const method = response.config?.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      GET_CACHE.clear();
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const requestData = error.config?.data;
    const errorData = error.response?.data || error.message;

    console.groupCollapsed(
      `%c[API ERROR] ${status || 'NETWORK'} | ${method} ${requestUrl}`,
      'color: white; background: #ef4444; font-weight: bold; padding: 2px 6px; border-radius: 4px;'
    );
    console.error('Response Data:', errorData);
    if (requestData) {
      try {
        console.error('Request Payload:', JSON.parse(requestData));
      } catch (e) {
        console.error('Request Payload:', requestData);
      }
    }
    console.error('Full Error Object:', error);
    console.groupEnd();

    if (status === 401 && !isPublicAuthRequest(requestUrl)) {
      clearSession();
      GET_CACHE.clear(); // Bersihkan cache saat unauthorized
      const msg =
        error.response?.data?.message || 'Sesi Anda telah berakhir. Silakan login kembali.';
      const loginBase = resolveLoginUrl();
      const onLoginPage =
        window.location.pathname.startsWith('/login') ||
        window.location.pathname.startsWith('/login-calon-murid');
      if (!onLoginPage) {
        window.location.href = `${loginBase}?expired=1&message=${encodeURIComponent(msg)}`;
      }
      return Promise.reject(error);
    }

    if (status === 403 && !isPublicAuthRequest(requestUrl)) {
      const msg = error.response?.data?.message || 'Akses ditolak.';
      if (!window.location.pathname.startsWith('/forbidden')) {
        window.location.href = `/forbidden?message=${encodeURIComponent(msg)}`;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
