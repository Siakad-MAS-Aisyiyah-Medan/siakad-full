import axios from 'axios';
import { apiConfig } from '@/config/api.config';
import { clearSession } from './auth.service';
import { getAuthItem } from '@app/shared/utils/sessionAuthStorage';

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

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
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';

    if (status === 401 && !isPublicAuthRequest(requestUrl)) {
      clearSession();
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
