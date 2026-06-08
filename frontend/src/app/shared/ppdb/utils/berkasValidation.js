const DEFAULT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
const DEFAULT_MAX_KB = 2048;

export function validateBerkasFile(file, { maxSizeKb = DEFAULT_MAX_KB, allowedExtensions = DEFAULT_EXTENSIONS } = {}) {
  if (!file) {
    return 'File tidak dipilih.';
  }

  const name = file.name || '';
  const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
  const allowed = allowedExtensions.map((e) => e.toLowerCase());

  if (!ext || !allowed.includes(ext)) {
    return `Format harus: ${allowed.join(', ')}.`;
  }

  const maxBytes = maxSizeKb * 1024;
  if (file.size > maxBytes) {
    const mb = maxSizeKb >= 1024 ? `${(maxSizeKb / 1024).toFixed(1)} MB` : `${maxSizeKb} KB`;
    return `Ukuran file maksimal ${mb}.`;
  }

  return null;
}

export function formatFileSize(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function isImageMime(mime) {
  return mime?.startsWith('image/');
}

export function isPdfMime(mime, fileName = '') {
  if (mime === 'application/pdf') return true;
  return fileName.toLowerCase().endsWith('.pdf');
}
