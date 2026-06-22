import { UPLOAD_BERKAS_ITEMS, normalizeBerkasJenis } from '../config/calonMuridNav';

/**
 * Algoritma dashboard calon siswa — cabang berdasarkan keberadaan & status pendaftaran PPDB.
 */

const STATUS_ALIASES = {
  belum: 'none',
  revisi: 'revision',
  diajukan: 'submitted',
  terverifikasi: 'verified',
  diterima: 'accepted',
  daftar_ulang: 'accepted',
  ditolak: 'rejected',
  menjadi_murid: 'accepted',
};

/** @typedef {'none'|'draft'|'revision'|'documents'|'submitted'|'verified'|'accepted'|'rejected'} PpdbPhase */

const PHASE_CONFIG = {
  none: {
    primaryLabel: 'Mulai Pendaftaran',
    primaryDescription: 'Anda belum memiliki data pendaftaran PPDB. Mulai untuk membuat draft formulir.',
    statusLabel: 'Belum Mendaftar',
    statusMessage: 'Buat data pendaftaran PPDB untuk melanjutkan ke formulir.',
    primaryHandler: 'start',
    primaryPath: null,
    tone: 'info',
    timelineIndex: 1,
  },
  draft: {
    primaryLabel: 'Lanjutkan Formulir',
    primaryDescription: 'Lengkapi biodata, orang tua, dan dokumen pada formulir PPDB.',
    statusLabel: 'Draft',
    statusMessage: 'Formulir masih dalam tahap pengisian.',
    primaryHandler: 'navigate',
    primaryPath: '/ppdb/registrasi',
    tone: 'primary',
    timelineIndex: 2,
  },
  revision: {
    primaryLabel: 'Perbaiki Data',
    primaryDescription: 'Admin meminta perbaikan. Perbarui data sesuai catatan lalu ajukan kembali.',
    statusLabel: 'Perlu Revisi',
    statusMessage: 'Perbaiki data formulir sesuai catatan dari panitia PPDB.',
    primaryHandler: 'navigate',
    primaryPath: '/ppdb/registrasi',
    tone: 'warning',
    timelineIndex: 3,
  },
  documents: {
    primaryLabel: 'Lengkapi Berkas',
    primaryDescription: 'Formulir sudah diajukan. Unggah seluruh berkas wajib sebelum proses verifikasi admin.',
    statusLabel: 'Upload Berkas',
    statusMessage: 'Lengkapi berkas PPDB terlebih dahulu agar panitia dapat memverifikasi pendaftaran Anda.',
    primaryHandler: 'navigate',
    primaryPath: '/calon-murid/upload-berkas',
    tone: 'warning',
    timelineIndex: 4,
  },
  submitted: {
    primaryLabel: 'Menunggu Verifikasi',
    primaryDescription: 'Pendaftaran telah dikirim. Pantau status verifikasi di halaman status.',
    statusLabel: 'Menunggu Verifikasi',
    statusMessage: 'Data Anda sedang ditinjau oleh panitia PPDB.',
    primaryHandler: 'navigate',
    primaryPath: '/calon-murid/status',
    tone: 'pending',
    timelineIndex: 5,
  },
  verified: {
    primaryLabel: 'Menunggu Verifikasi',
    primaryDescription: 'Data telah diverifikasi. Menunggu keputusan akhir penerimaan.',
    statusLabel: 'Terverifikasi',
    statusMessage: 'Berkas Anda telah diverifikasi. Tunggu pengumuman hasil.',
    primaryHandler: 'navigate',
    primaryPath: '/calon-murid/status',
    tone: 'pending',
    timelineIndex: 6,
  },
  accepted: {
    primaryLabel: 'Selamat Anda Diterima',
    primaryDescription: 'Selamat! Anda dinyatakan diterima. Lihat detail kelulusan dan instruksi berikutnya di halaman status.',
    statusLabel: 'Diterima',
    statusMessage: 'Pendaftaran Anda disetujui. Lihat detail di halaman status.',
    primaryHandler: 'navigate',
    primaryPath: '/calon-murid/status',
    tone: 'success',
    timelineIndex: 6,
  },
  rejected: {
    primaryLabel: 'Pendaftaran Ditolak',
    primaryDescription: 'Mohon maaf, pendaftaran tidak dapat dilanjutkan. Hubungi panitia jika ada pertanyaan.',
    statusLabel: 'Ditolak',
    statusMessage: 'Pendaftaran tidak diterima. Baca catatan admin untuk informasi lebih lanjut.',
    primaryHandler: 'navigate',
    primaryPath: '/calon-murid/status',
    tone: 'danger',
    timelineIndex: 6,
  },
};

export const PPDB_TIMELINE_STEPS = [
  { key: 'akun', label: 'Buat Akun', description: 'Registrasi akun calon siswa' },
  { key: 'mulai', label: 'Mulai Pendaftaran', description: 'Membuat data pendaftaran PPDB' },
  { key: 'formulir', label: 'Lengkapi Formulir', description: 'Isi biodata & dokumen' },
  { key: 'submit', label: 'Ajukan Pendaftaran', description: 'Kirim formulir ke panitia' },
  { key: 'berkas', label: 'Upload Berkas', description: 'Lengkapi dokumen persyaratan' },
  { key: 'verifikasi', label: 'Verifikasi Admin', description: 'Peninjauan oleh panitia' },
  { key: 'hasil', label: 'Pengumuman Hasil', description: 'Keputusan penerimaan' },
];

function hasUploadedAllRequiredBerkas(pendaftaran) {
  const items = Array.isArray(pendaftaran?.berkas) ? pendaftaran.berkas : [];
  if (!items.length) return false;

  const uploadedJenis = new Set(
    items
      .filter((item) => item?.url || item?.file_path)
      .map((item) => normalizeBerkasJenis(item.jenis_berkas))
  );

  return UPLOAD_BERKAS_ITEMS.every((item) => uploadedJenis.has(item.key));
}

/**
 * Normalisasi status dari API (status_pendaftaran atau legacy ppdb_status).
 * @returns {PpdbPhase}
 */
export function normalizePpdbStatus(pendaftaran) {
  if (!pendaftaran) return 'none';
  const raw = pendaftaran.status_pendaftaran || pendaftaran.ppdb_status || 'draft';
  if (STATUS_ALIASES[raw]) return STATUS_ALIASES[raw];
  if (raw in PHASE_CONFIG) return raw;
  return 'draft';
}

/**
 * @param {{ has_registration?: boolean, pendaftaran?: object|null }} reg
 */
export function resolveDashboardState(reg) {
  const hasRegistration = Boolean(reg?.has_registration && reg?.pendaftaran);
  const rawPhase = hasRegistration ? normalizePpdbStatus(reg.pendaftaran) : 'none';
  const berkasComplete = hasUploadedAllRequiredBerkas(reg?.pendaftaran);
  const phase = rawPhase === 'submitted' && !berkasComplete ? 'documents' : rawPhase;
  const config = PHASE_CONFIG[phase] ?? PHASE_CONFIG.draft;

  const canEditForm = ['none', 'draft', 'revision'].includes(phase);
  const canUpload = hasRegistration && !['none', 'accepted', 'rejected'].includes(phase);
  const showProgress = hasRegistration && !['accepted', 'rejected'].includes(phase);
  const primaryDisabled = ['submitted', 'verified', 'accepted', 'rejected'].includes(phase);

  return {
    phase,
    rawPhase,
    hasRegistration,
    berkasComplete,
    pendaftaran: reg?.pendaftaran ?? null,
    ...config,
    canEditForm,
    canUpload,
    showProgress,
    primaryDisabled,
    catatanAdmin: reg?.pendaftaran?.catatan_admin ?? null,
  };
}

export { PHASE_CONFIG };
