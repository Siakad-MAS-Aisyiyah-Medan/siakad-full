import { apiConfig } from '@/config/api.config';

const DOWNLOAD_ENDPOINT = `${apiConfig.baseURL}/ppdb/brosur/download`;
const FALLBACK_FILENAME = 'brosur-ppdb-mas-aisyiyah-medan';

function getFilenameFromDisposition(disposition) {
  if (!disposition) return '';

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
  return asciiMatch?.[1] || '';
}

function getExtensionFromType(contentType) {
  if (!contentType) return '';
  if (contentType.includes('pdf')) return '.pdf';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  if (contentType.includes('webp')) return '.webp';
  return '';
}

export async function downloadBrosurPpdb() {
  const response = await fetch(DOWNLOAD_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Download failed with status ${response.status}`);
  }

  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition');
  const contentType = response.headers.get('content-type');
  const filename =
    getFilenameFromDisposition(disposition) ||
    `${FALLBACK_FILENAME}${getExtensionFromType(contentType)}`;

  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  window.setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl);
  }, 1000);
}
