const PREFIX = 'siakad_';

export function getJsonItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key) ?? localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export { getDisplayName, getAdminDisplayName } from './profile';
