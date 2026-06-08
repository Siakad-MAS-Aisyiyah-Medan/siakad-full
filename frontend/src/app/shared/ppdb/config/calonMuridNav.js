/** Menu sidebar calon murid */
export const CALON_MURID_NAV = [
  { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/calon-murid/dashboard', end: true },
  { iconKey: 'FileText', label: 'Formulir Pendaftaran', path: '/ppdb/registrasi' },
  { iconKey: 'Upload', label: 'Upload Berkas', path: '/calon-murid/upload-berkas' },
  { iconKey: 'ClipboardList', label: 'Status Pendaftaran', path: '/calon-murid/status' },
  { iconKey: 'Bell', label: 'Pengumuman', path: '/calon-murid/pengumuman' },
];

/** Jenis berkas untuk halaman upload (key = jenis_berkas API) */
export const UPLOAD_BERKAS_ITEMS = [
  { key: 'ijazah_atau_skl', label: 'Ijazah / SKHUN' },
  { key: 'stk', label: 'STK' },
  { key: 'pas_foto', label: 'Pas Foto' },
  { key: 'nisn', label: 'NISN' },
  { key: 'kartu_keluarga', label: 'Kartu Keluarga (KK)' },
  { key: 'ktp_orang_tua', label: 'KTP Orang Tua' },
];

/** Alias jenis lama (kompatibilitas) */
export const BERKAS_LEGACY_JENIS_MAP = {
  foto: 'pas_foto',
  rapor: 'stk',
  akta_kelahiran: 'nisn',
};

export function normalizeBerkasJenis(jenis) {
  return BERKAS_LEGACY_JENIS_MAP[jenis] || jenis;
}
