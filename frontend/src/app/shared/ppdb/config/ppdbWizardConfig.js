export const PPDB_STEPS = [
  { key: 'keterangan-pribadi', label: 'Keterangan Pribadi', shortLabel: 'Biodata' },
  { key: 'kesehatan', label: 'Kesehatan', shortLabel: 'Kesehatan' },
  { key: 'pendidikan-asal', label: 'Pendidikan Asal', shortLabel: 'Pendidikan' },
  { key: 'orang-tua-wali', label: 'Orang Tua / Wali', shortLabel: 'Orang Tua' },
  { key: 'kepribadian', label: 'Kepribadian', shortLabel: 'Kepribadian' },
  { key: 'review', label: 'Review & Submit', shortLabel: 'Review' },
];

export const STEP_DESCRIPTIONS = {
  'keterangan-pribadi': 'Lengkapi data diri calon siswa sesuai dokumen resmi (KK/akta).',
  kesehatan: 'Isi informasi kesehatan dan riwayat penyakit jika ada.',
  'pendidikan-asal': 'Masukkan data sekolah asal dan nomor STTB.',
  'orang-tua-wali': 'Lengkapi data orang tua atau wali calon siswa.',
  kepribadian: 'Ceritakan hobi dan cita-cita calon siswa.',
  review: 'Periksa kembali seluruh data sebelum mengajukan pendaftaran.',
};

/** Progress berdasarkan langkah yang sudah selesai (disimpan) */
export function computeWizardPercent(activeStepIndex, completedSteps = [], totalSteps = PPDB_STEPS.length) {
  const formSteps = totalSteps - 1;
  if (formSteps <= 0) return 0;
  const doneCount = completedSteps.filter((i) => i < formSteps).length;
  const base = doneCount;
  return Math.min(100, Math.round((base / formSteps) * 100));
}

export function computeMaxReachableStep(completedSteps, serverStepIndex = 0) {
  return Math.min(PPDB_STEPS.length - 1, serverStepIndex);
}

export function buildInitialCompletedSteps(serverStepIndex) {
  if (!serverStepIndex || serverStepIndex <= 1) return [];
  const completed = [];
  for (let i = 0; i < serverStepIndex - 1 && i < PPDB_STEPS.length - 1; i++) {
    completed.push(i);
  }
  return completed;
}

const WIZARD_STEP_INDEX = Object.fromEntries(PPDB_STEPS.map((s, i) => [s.key, i]));

export function stepIndexFromCurrentStep(currentStep) {
  if (currentStep === 'submitted') return PPDB_STEPS.length;
  if (!currentStep) return 0;

  const asNum = parseInt(String(currentStep), 10);
  if (!Number.isNaN(asNum) && asNum >= 1) {
    return Math.min(PPDB_STEPS.length - 1, asNum - 1);
  }

  return WIZARD_STEP_INDEX[currentStep] ?? 0;
}

export const FINAL_STATUSES = ['submitted', 'verified', 'accepted', 'rejected'];

export const STATUS_YATIM_OPTIONS = ['Yatim', 'Piatu', 'Yatim Piatu', 'Tidak'];

export const AGAMA_OPTIONS = ['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'];
export const JENIS_KELAMIN_OPTIONS = [
  { value: 'L', label: 'Laki-Laki' },
  { value: 'P', label: 'Perempuan' },
];

export const GOL_DARAH_OPTIONS = ['A', 'B', 'AB', 'O', 'Tidak Tahu', '-'];

export const STEP_SECTION = {
  'keterangan-pribadi': 'keteranganPribadi',
  kesehatan: 'kesehatan',
  'pendidikan-asal': 'pendidikanAsal',
  'orang-tua-wali': 'orangTuaWali',
  kepribadian: 'kepribadian',
};

export const STEP_REQUIRED = {
  'keterangan-pribadi': [
    'nama_lengkap',
    'tempat_lahir',
    'tgl_lahir',
    'jenis_kelamin',
    'agama',
    'kewarganegaraan',
    'anak_ke',
    'jml_saudara_kandung',
    'jml_saudara_tiri',
    'alamat',
    'no_telp',
    'status_yatim',
  ],
  kesehatan: ['berat_badan', 'tinggi_badan', 'gol_darah'],
  'pendidikan-asal': ['sekolah_asal', 'no_sttb'],
  'orang-tua-wali': ['nama_ayah', 'nama_ibu', 'pekerjaan_ayah', 'pekerjaan_ibu', 'no_hp_ortu'],
  kepribadian: ['hobi', 'cita_cita'],
};

export const EDITABLE_STATUSES = ['draft', 'revision', 'revisi'];

export const REVIEW_SECTIONS = [
  { title: 'Keterangan Pribadi', section: 'keteranganPribadi', fields: [
    ['nama_lengkap', 'Nama Lengkap'],
    ['tempat_lahir', 'Tempat Lahir'],
    ['tgl_lahir', 'Tanggal Lahir'],
    ['jenis_kelamin', 'Jenis Kelamin'],
    ['agama', 'Agama'],
    ['kewarganegaraan', 'Kewarganegaraan'],
    ['anak_ke', 'Anak Ke'],
    ['jml_saudara_kandung', 'Jumlah Saudara Kandung'],
    ['jml_saudara_tiri', 'Jumlah Saudara Tiri'],
    ['alamat', 'Alamat'],
    ['no_telp', 'No. Telp'],
    ['status_yatim', 'Status Yatim'],
  ]},
  { title: 'Kesehatan', section: 'kesehatan', fields: [
    ['berat_badan', 'Berat Badan (kg)'],
    ['tinggi_badan', 'Tinggi Badan (cm)'],
    ['gol_darah', 'Gol. Darah'],
    ['penyakit_diderita', 'Penyakit Diderita'],
    ['cacat_badan', 'Cacat Badan'],
  ]},
  { title: 'Pendidikan Asal', section: 'pendidikanAsal', fields: [
    ['sekolah_asal', 'Sekolah Asal'],
    ['no_sttb', 'No. STTB'],
    ['pindahan_dari', 'Pindahan Dari'],
    ['no_surat_pindah', 'No. Surat Pindah'],
  ]},
  { title: 'Orang Tua / Wali', section: 'orangTuaWali', fields: [
    ['nama_ayah', 'Nama Ayah'],
    ['nama_ibu', 'Nama Ibu'],
    ['pendidikan_ayah', 'Pendidikan Ayah'],
    ['pendidikan_ibu', 'Pendidikan Ibu'],
    ['pekerjaan_ayah', 'Pekerjaan Ayah'],
    ['pekerjaan_ibu', 'Pekerjaan Ibu'],
    ['agama_ortu', 'Agama Ortu'],
    ['alamat_ortu', 'Alamat Ortu'],
    ['nama_wali', 'Nama Wali'],
    ['pendidikan_wali', 'Pendidikan Wali'],
    ['pekerjaan_wali', 'Pekerjaan Wali'],
    ['agama_wali', 'Agama Wali'],
    ['alamat_wali', 'Alamat Wali'],
    ['no_hp_ortu', 'No. HP Ortu'],
  ]},
  { title: 'Kepribadian', section: 'kepribadian', fields: [
    ['hobi', 'Hobi'],
    ['cita_cita', 'Cita-cita'],
  ]},
];
