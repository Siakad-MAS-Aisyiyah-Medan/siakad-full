/** Menu sidebar calon murid */
export const CALON_MURID_NAV = [
  { iconKey: 'LayoutDashboard', label: 'Dashboard', path: '/calon-murid/dashboard', end: true },
  { iconKey: 'FileText', label: 'Formulir Pendaftaran', path: '/ppdb/registrasi' },
  { iconKey: 'Folder', label: 'Berkas Pendaftaran', path: '/calon-murid/upload-berkas' },
  { iconKey: 'Send', label: 'Kirim Pendaftaran', path: '/calon-murid/kirim-pendaftaran' },
  { iconKey: 'ClipboardList', label: 'Status Pendaftaran', path: '/calon-murid/status' },
];

/** Jenis berkas untuk halaman upload (key = jenis_berkas API) */
export const UPLOAD_BERKAS_ITEMS = [
  { key: 'ijazah_atau_skl', label: 'Foto Copy Ijazah/SKHUN (2 Lembar)' },
  { key: 'stk', label: 'STK Asli dan Foto Copy (Dilegalisir) (2 Lembar)' },
  { key: 'pas_foto', label: 'Pas Photo 3x4 cm (Pakai Jilbab) (4 Lembar)' },
  { key: 'nisn', label: 'NISN' },
  { key: 'kartu_keluarga', label: 'FC Kartu Keluarga (1 Lembar)' },
  { key: 'ktp_orang_tua', label: 'FC KTP Orang Tua (1 Lembar)' },
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
