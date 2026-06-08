const PREFIX = 'siakad_';

const KEYS = ['token', 'user', 'profile', 'permissions', 'menus', 'redirect_path'];

/** Auth disimpan di localStorage agar tetap ada setelah refresh halaman. */
function storage() {
  return localStorage;
}

function migrateLegacyKeys() {
  KEYS.forEach((key) => {
    const legacy = localStorage.getItem(key);
    const prefixed = storage().getItem(PREFIX + key);
    if (legacy && !prefixed) {
      storage().setItem(PREFIX + key, legacy);
      localStorage.removeItem(key);
    }
    const sessionLegacy = sessionStorage.getItem(PREFIX + key);
    if (sessionLegacy && !prefixed) {
      storage().setItem(PREFIX + key, sessionLegacy);
      sessionStorage.removeItem(PREFIX + key);
    }
  });
}

migrateLegacyKeys();

export function setAuthItem(key, value) {
  if (value === null || value === undefined) {
    storage().removeItem(PREFIX + key);
    return;
  }
  storage().setItem(PREFIX + key, value);
}

export function getAuthItem(key) {
  return storage().getItem(PREFIX + key);
}

export function removeAuthItem(key) {
  storage().removeItem(PREFIX + key);
}

export function clearAuthStorage() {
  KEYS.forEach((key) => removeAuthItem(key));
}
