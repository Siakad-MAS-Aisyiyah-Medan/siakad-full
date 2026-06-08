import apiClient from './apiClient';
import { unwrapData } from './apiHelpers';
import { getMenuForRole } from '@/config/menu.config';
import {
  clearAuthStorage,
  getAuthItem,
  setAuthItem,
} from '@app/shared/utils/sessionAuthStorage';

export async function login(credentials) {
  const response = await apiClient.post('/login', {
    login: credentials.login ?? credentials.username ?? credentials.email ?? '',
    password: credentials.password,
  });
  return unwrapData(response);
}

export async function fetchMe() {
  const response = await apiClient.get('/auth/me');
  return unwrapData(response);
}

export async function register(payload) {
  const response = await apiClient.post('/register', payload);
  return unwrapData(response);
}

/** Daftar akun calon siswa — tanpa data formulir PPDB */
export async function registerCalonSiswa(payload) {
  const response = await apiClient.post('/auth/register-calon-siswa', payload);
  return unwrapData(response);
}

export async function logout() {
  try {
    await apiClient.post('/logout');
  } catch {
    // Tetap bersihkan session lokal meski API gagal
  }
  clearSession();
}

export function saveSession({ user, profile, token, permissions, menus, redirect_path }) {
  setAuthItem('token', token);
  setAuthItem('user', JSON.stringify(user));
  setAuthItem('profile', JSON.stringify(profile ?? null));
  setAuthItem('permissions', JSON.stringify(permissions ?? []));
  setAuthItem('menus', JSON.stringify(menus ?? []));
  if (redirect_path) {
    setAuthItem('redirect_path', redirect_path);
  }
}

export function clearSession() {
  clearAuthStorage();
}

export function getStoredUser() {
  const raw = getAuthItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function getStoredProfile() {
  const raw = getAuthItem('profile');
  return raw ? JSON.parse(raw) : null;
}

export function getStoredPermissions() {
  const raw = getAuthItem('permissions');
  return raw ? JSON.parse(raw) : [];
}

export function getStoredMenus() {
  const raw = getAuthItem('menus');
  return raw ? JSON.parse(raw) : [];
}

export function getToken() {
  return getAuthItem('token');
}

export function isAuthenticated() {
  return Boolean(getToken() && getStoredUser());
}

export function hasPermission(permission) {
  if (!permission) return true;
  const perms = getStoredPermissions();
  return perms.includes('manage_all') || perms.includes(permission);
}

export function hasAnyPermission(permissions = []) {
  if (!permissions.length) return true;
  return permissions.some((p) => hasPermission(p));
}

export function getRedirectPathForRole(role) {
  const stored = getAuthItem('redirect_path');
  if (stored) return stored;
  const map = {
    admin: '/admin/dashboard',
    kepsek: '/kepala-sekolah/dashboard',
    guru: '/guru/dashboard',
    wali_kelas: '/wali-kelas/dashboard',
    siswa: '/siswa/dashboard',
    calon_siswa: '/calon-murid/dashboard',
  };
  return map[role] || '/login';
}

export function getMenuItems() {
  const menus = getStoredMenus();
  const items = menus?.length > 0 ? menus : getMenuForRole(getStoredUser()?.role);
  return items.filter((item) => {
    if (item.permission) return hasPermission(item.permission);
    return true;
  });
}
