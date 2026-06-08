/** Metadata header per halaman portal calon murid */
export const CALON_MURID_PAGES = [
  {
    path: '/calon-murid/dashboard',
    end: true,
    title: 'Dashboard',
    subtitle: 'Ringkasan pendaftaran dan akses cepat ke menu PPDB.',
    eyebrow: 'Portal PPDB',
  },
  {
    path: '/ppdb/registrasi',
    title: 'Formulir Pendaftaran',
    subtitle: 'Lengkapi data PPDB per tahap sebelum submit.',
    eyebrow: 'Formulir PPDB',
  },
  {
    path: '/ppdb/formulir',
    title: 'Formulir Pendaftaran',
    subtitle: 'Lengkapi data PPDB per tahap sebelum submit.',
    eyebrow: 'Formulir PPDB',
  },
  {
    path: '/calon-murid/formulir',
    title: 'Formulir Pendaftaran',
    subtitle: 'Lengkapi data PPDB per tahap sebelum submit.',
    eyebrow: 'Formulir PPDB',
  },
  {
    path: '/calon-murid/upload-berkas',
    title: 'Upload Berkas',
    subtitle: 'Unggah dokumen pendukung pendaftaran Anda.',
    eyebrow: 'Dokumen',
  },
  {
    path: '/calon-murid/berkas',
    title: 'Upload Berkas',
    subtitle: 'Unggah dokumen pendukung pendaftaran Anda.',
    eyebrow: 'Dokumen',
  },
  {
    path: '/calon-murid/status',
    title: 'Status Pendaftaran',
    subtitle: 'Pantau progres pendaftaran dan kelengkapan data Anda.',
    eyebrow: 'Status',
  },
  {
    path: '/ppdb/status',
    title: 'Status Pendaftaran',
    subtitle: 'Pantau progres pendaftaran dan kelengkapan data Anda.',
    eyebrow: 'Status',
  },
  {
    path: '/calon-murid/pengumuman',
    title: 'Pengumuman',
    subtitle: 'Informasi dan pengumuman resmi seputar PPDB.',
    eyebrow: 'Informasi',
  },
];

export function getCalonMuridPageMeta(pathname) {
  const exact = CALON_MURID_PAGES.find((p) => p.end && p.path === pathname);
  if (exact) return exact;
  return CALON_MURID_PAGES.find((p) => pathname.startsWith(p.path)) || CALON_MURID_PAGES[0];
}
