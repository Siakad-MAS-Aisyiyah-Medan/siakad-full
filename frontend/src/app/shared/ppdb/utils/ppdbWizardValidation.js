import { PPDB_STEPS, STEP_REQUIRED, STEP_SECTION } from '../config/ppdbWizardConfig';

export const FIELD_LABELS = {
  nama_lengkap: 'Nama Lengkap',
  tempat_lahir: 'Tempat Lahir',
  tgl_lahir: 'Tanggal Lahir',
  jenis_kelamin: 'Jenis Kelamin',
  agama: 'Agama',
  kewarganegaraan: 'Kewarganegaraan',
  anak_ke: 'Anak Ke',
  jml_saudara_kandung: 'Jumlah Saudara Kandung',
  jml_saudara_tiri: 'Jumlah Saudara Tiri',
  alamat: 'Alamat',
  no_telp: 'No. Telp',
  status_yatim: 'Status Yatim',
  berat_badan: 'Berat Badan',
  tinggi_badan: 'Tinggi Badan',
  gol_darah: 'Golongan Darah',
  sekolah_asal: 'Sekolah Asal',
  no_sttb: 'No. STTB',
  nama_ayah: 'Nama Ayah',
  nama_ibu: 'Nama Ibu',
  pekerjaan_ayah: 'Pekerjaan Ayah',
  pekerjaan_ibu: 'Pekerjaan Ibu',
  no_hp_ortu: 'No. HP Orang Tua',
  hobi: 'Hobi',
  cita_cita: 'Cita-cita',
};

export function findStepIndexByField(fieldName) {
  return PPDB_STEPS.findIndex((step) => (STEP_REQUIRED[step.key] || []).includes(fieldName));
}

export function parseRequiredFieldMessage(message) {
  const match = String(message || '').match(/Field\s+([a-zA-Z0-9_]+)\s+wajib diisi/i);
  if (!match) return null;

  const field = match[1];
  return {
    field,
    label: FIELD_LABELS[field] || field,
    stepIndex: findStepIndexByField(field),
  };
}

const NUMERIC_FIELDS = new Set([
  'anak_ke',
  'jml_saudara_kandung',
  'jml_saudara_tiri',
  'berat_badan',
  'tinggi_badan',
]);

function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

/**
 * Validasi satu langkah wizard — mengembalikan error per field.
 * @returns {{ valid: boolean, fieldErrors: Record<string, string> }}
 */
export function validateStep(stepKey, forms) {
  if (stepKey === 'review') {
    return { valid: true, fieldErrors: {} };
  }

  const section = STEP_SECTION[stepKey];
  const data = forms[section] || {};
  const fieldErrors = {};

  (STEP_REQUIRED[stepKey] || []).forEach((field) => {
    if (isEmpty(data[field])) {
      fieldErrors[field] = `${FIELD_LABELS[field] || field} wajib diisi`;
    }
  });

  if (stepKey === 'keterangan-pribadi' && data.no_telp && !/^[\d\s+()-]{8,20}$/.test(String(data.no_telp).trim())) {
    fieldErrors.no_telp = 'Format nomor telepon tidak valid';
  }

  if (stepKey === 'orang-tua-wali' && data.no_hp_ortu && !/^[\d\s+()-]{8,20}$/.test(String(data.no_hp_ortu).trim())) {
    fieldErrors.no_hp_ortu = 'Format nomor HP tidak valid';
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

/** Validasi semua langkah isian (1–6) sebelum submit */
export function validateAllFormSteps(forms) {
  const allErrors = {};
  let firstInvalidIndex = -1;

  PPDB_STEPS.forEach((step, index) => {
    if (step.key === 'review') return;
    const { valid, fieldErrors } = validateStep(step.key, forms);
    if (!valid) {
      allErrors[step.key] = fieldErrors;
      if (firstInvalidIndex < 0) firstInvalidIndex = index;
    }
  });

  return {
    valid: Object.keys(allErrors).length === 0,
    stepErrors: allErrors,
    firstInvalidIndex,
  };
}

export function getStepPayload(stepKey, forms) {
  const section = STEP_SECTION[stepKey];
  const source = forms[section] || {};
  const payload = {};

  Object.entries(source).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') {
        return;
      }

      if (NUMERIC_FIELDS.has(key)) {
        const asNumber = Number(trimmed);
        if (!Number.isNaN(asNumber)) {
          payload[key] = asNumber;
        }
        return;
      }

      payload[key] = key === 'tgl_lahir' && trimmed.length > 10
        ? trimmed.slice(0, 10)
        : trimmed;
      return;
    }

    if (NUMERIC_FIELDS.has(key)) {
      const asNumber = Number(value);
      if (!Number.isNaN(asNumber)) {
        payload[key] = asNumber;
      }
      return;
    }

    payload[key] = value;
  });

  if (payload.tgl_lahir && typeof payload.tgl_lahir === 'string' && payload.tgl_lahir.length > 10) {
    payload.tgl_lahir = payload.tgl_lahir.slice(0, 10);
  }

  return payload;
}
