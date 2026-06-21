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
  { key: 'nisn', label: 'Akta Kelahiran' },
  { key: 'kartu_keluarga', label: 'Kartu Keluarga' },
  { key: 'pas_foto', label: 'Pas Foto' },
  { key: 'ijazah_atau_skl', label: 'Ijazah / STTB SMP' },
  { key: 'stk', label: 'Rapor Semester 1-5' },
  { key: 'ktp_orang_tua', label: 'Surat Keterangan Lulus' },
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
