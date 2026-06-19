import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  computeMaxReachableStep,
  computeWizardPercent,
  EDITABLE_STATUSES,
  FINAL_STATUSES,
  PPDB_STEPS,
} from '../config/ppdbWizardConfig';
import {
  fetchMyRegistration,
  saveStepKepribadian,
  saveStepKesehatan,
  saveStepKeteranganPribadi,
  saveStepOrangTuaWali,
  saveStepPendidikanAsal,
  submitPendaftaran,
} from '@app/shared/services/ppdb.service';
import { startOrResumePpdb } from '../utils/startOrResumePpdb';
import {
  getStepPayload,
  parseRequiredFieldMessage,
  validateAllFormSteps,
  validateStep,
} from '../utils/ppdbWizardValidation';

const SAVE_FN = {
  'keterangan-pribadi': saveStepKeteranganPribadi,
  kesehatan: saveStepKesehatan,
  'pendidikan-asal': saveStepPendidikanAsal,
  'orang-tua-wali': saveStepOrangTuaWali,
  kepribadian: saveStepKepribadian,
};

const EMPTY_FORMS = {
  keteranganPribadi: {},
  kesehatan: {},
  pendidikanAsal: {},
  orangTuaWali: {},
  kepribadian: {},
  meta: {},
};

export function extractApiError(err) {
  const res = err?.response;
  const errors = res?.data?.errors;
  if (errors && typeof errors === 'object') {
    const fieldErrors = {};
    Object.entries(errors).forEach(([key, messages]) => {
      const msg = Array.isArray(messages) ? messages[0] : messages;
      fieldErrors[key] = msg;
    });
    if (Object.keys(fieldErrors).length) {
      return { message: res?.data?.message || 'Validasi gagal', fieldErrors };
    }
    const lines = Object.values(errors).flat().filter(Boolean);
    if (lines.length) return { message: lines.join('\n'), fieldErrors: {} };
  }
  return {
    message: res?.data?.message || err?.message || 'Terjadi kesalahan pada proses PPDB.',
    fieldErrors: {},
  };
}

function parseMissingBerkasMessage(message) {
  const match = String(message || '').match(/Berkas\s+(.+?)\s+wajib diunggah/i);
  if (!match) return null;
  return match[1];
}

function mapRegistrationToForms(p) {
  if (!p) return { ...EMPTY_FORMS };
  return {
    keteranganPribadi: {
      nama_lengkap: p.nama_lengkap ?? '',
      tempat_lahir: p.tempat_lahir ?? '',
      tgl_lahir: p.tgl_lahir ?? '',
      jenis_kelamin: p.jenis_kelamin ?? '',
      agama: p.agama ?? '',
      kewarganegaraan: p.kewarganegaraan ?? '',
      anak_ke: p.anak_ke ?? '',
      jml_saudara_kandung: p.jml_saudara_kandung ?? '',
      jml_saudara_tiri: p.jml_saudara_tiri ?? '',
      alamat: p.alamat ?? '',
      no_telp: p.no_telp ?? '',
      status_yatim: p.status_yatim ?? '',
    },
    kesehatan: {
      berat_badan: p.berat_badan ?? '',
      tinggi_badan: p.tinggi_badan ?? '',
      gol_darah: p.gol_darah ?? '',
      penyakit_diderita: p.penyakit_diderita ?? '',
      cacat_badan: p.cacat_badan ?? '',
    },
    pendidikanAsal: {
      sekolah_asal: p.sekolah_asal ?? '',
      tahun_lulus: p.tahun_lulus ?? '',
      no_sttb: p.no_sttb ?? '',
      pindahan_dari: p.pindahan_dari ?? '',
      no_surat_pindah: p.no_surat_pindah ?? '',
    },
    orangTuaWali: {
      nama_ayah: p.nama_ayah ?? '',
      nama_ibu: p.nama_ibu ?? '',
      pendidikan_ayah: p.pendidikan_ayah ?? '',
      pendidikan_ibu: p.pendidikan_ibu ?? '',
      pekerjaan_ayah: p.pekerjaan_ayah ?? '',
      pekerjaan_ibu: p.pekerjaan_ibu ?? '',
      agama_ortu: p.agama_ortu ?? '',
      alamat_ortu: p.alamat_ortu ?? '',
      no_hp_ortu: p.no_hp_ortu ?? '',
      nama_wali: p.nama_wali ?? '',
      pendidikan_wali: p.pendidikan_wali ?? '',
      pekerjaan_wali: p.pekerjaan_wali ?? '',
      agama_wali: p.agama_wali ?? '',
      alamat_wali: p.alamat_wali ?? '',
    },
    kepribadian: {
      hobi: p.hobi ?? '',
      cita_cita: p.cita_cita ?? '',
    },
    meta: {
      status: p.ppdb_status ?? p.status_pendaftaran ?? 'draft',
      currentStep: p.current_step,
      currentStepIndex: p.current_step_index,
      nomor: p.no_registrasi ?? p.nomor_pendaftaran,
      tahun: p.tahun_pelajaran ?? '2026/2027',
    },
  };
}

function recalculateCompletedSteps(formsData) {
  const completed = [];
  PPDB_STEPS.forEach((step, index) => {
    if (step.key === 'review') return;
    const { valid } = validateStep(step.key, formsData);
    if (valid) {
      completed.push(index);
    }
  });
  return completed;
}

export function usePpdbWizard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [forms, setForms] = useState(EMPTY_FORMS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [serverStepIndex, setServerStepIndex] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle');
  const [isLocked, setIsLocked] = useState(false);

  const formsRef = useRef(forms);
  const activeStepRef = useRef(activeStep);
  const skipAutoSave = useRef(false);

  formsRef.current = forms;
  activeStepRef.current = activeStep;

  const applyRegistration = useCallback((p) => {
    const formsData = mapRegistrationToForms(p);
    setForms(formsData);
    const status = p?.status_pendaftaran || 'draft';
    const locked = FINAL_STATUSES.includes(status);
    setIsLocked(locked);

    const computedCompleted = recalculateCompletedSteps(formsData);
    setCompletedSteps(computedCompleted);
    
    // Set active step to the first uncompleted step or 0
    let firstIncomplete = 0;
    while (computedCompleted.includes(firstIncomplete) && firstIncomplete < PPDB_STEPS.length - 1) {
      firstIncomplete++;
    }
    
    setActiveStep(firstIncomplete);
    setServerStepIndex(firstIncomplete);
    setFieldErrors({});
    setReady(true);
  }, []);

  const syncFromServer = useCallback((p, { keepActiveStep = false } = {}) => {
    const formsData = mapRegistrationToForms(p);
    setForms(formsData);
    const status = p?.status_pendaftaran || 'draft';
    setIsLocked(FINAL_STATUSES.includes(status));

    const computedCompleted = recalculateCompletedSteps(formsData);
    setCompletedSteps(computedCompleted);
    
    let firstIncomplete = 0;
    while (computedCompleted.includes(firstIncomplete) && firstIncomplete < PPDB_STEPS.length - 1) {
      firstIncomplete++;
    }
    setServerStepIndex(firstIncomplete);

    if (!keepActiveStep) {
      setActiveStep(firstIncomplete);
    }
  }, []);

  const persistStep = useCallback(
    async (stepKey, { advance = false, silent = false } = {}) => {
      const saveFn = SAVE_FN[stepKey];
      if (!saveFn) return { ok: true };

      const payload = getStepPayload(stepKey, formsRef.current);
      if (!silent) setSaving(true);

      try {
        const updated = await saveFn(payload);
        const stepIndex = PPDB_STEPS.findIndex((s) => s.key === stepKey);

        // completedSteps is updated inside syncFromServer because we passed the updated payload
        syncFromServer(updated, { keepActiveStep: !advance });

        if (advance && stepIndex >= 0 && stepIndex < PPDB_STEPS.length - 1) {
          setActiveStep(stepIndex + 1);
          setFieldErrors({});
        }

        return { ok: true, data: updated };
      } catch (err) {
        const parsed = extractApiError(err);
        if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length) {
          setFieldErrors(parsed.fieldErrors);
        }
        if (!silent) {
          Swal.fire({ icon: 'error', title: 'Gagal menyimpan', text: parsed.message });
        }
        return { ok: false, error: parsed.message };
      } finally {
        if (!silent) setSaving(false);
      }
    },
    [syncFromServer],
  );

  const initialize = useCallback(async () => {
    setLoading(true);
    setInitError(null);
    setReady(false);

    try {
      let data = await fetchMyRegistration();
      let pendaftaran = data?.pendaftaran;

      if (pendaftaran && FINAL_STATUSES.includes(pendaftaran.status_pendaftaran)) {
        navigate('/calon-murid/status', { replace: true });
        return;
      }

      if (!data?.has_registration || !pendaftaran) {
        const started = await startOrResumePpdb();
        if (!started.ok) throw new Error(started.error);
        pendaftaran = started.data;
      }

      const status = pendaftaran?.status_pendaftaran || 'draft';
      if (!EDITABLE_STATUSES.includes(status) && !FINAL_STATUSES.includes(status)) {
        navigate('/calon-murid/status', { replace: true });
        return;
      }

      applyRegistration(pendaftaran);
    } catch (err) {
      const msg = typeof err === 'string' ? err : extractApiError(err).message;
      setInitError(msg);
    } finally {
      setLoading(false);
    }
  }, [applyRegistration, navigate]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const updateForm = (section, field, value) => {
    setForms((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setAutoSaveStatus('idle');
  };

  const saveDraft = useCallback(
    async (silent = true) => {
      const step = PPDB_STEPS[activeStepRef.current];
      if (!step || step.key === 'review' || isLocked) return { ok: true };

      setAutoSaveStatus('saving');
      const result = await persistStep(step.key, { advance: false, silent: true });
      setAutoSaveStatus(result.ok ? 'saved' : 'error');

      if (!silent && result.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Draft Tersimpan',
          timer: 1200,
          showConfirmButton: false,
        });
      }

      return result;
    },
    [isLocked, persistStep],
  );

  // Auto-save dinonaktifkan atas permintaan. Data hanya disimpan saat menekan Simpan & Lanjut atau Simpan Draft.

  const saveAndNext = async () => {
    const step = PPDB_STEPS[activeStep];
    if (!step || step.key === 'review') return true;

    const { valid, fieldErrors: errors } = validateStep(step.key, forms);
    if (!valid) {
      setFieldErrors(errors);
      return false;
    }

    skipAutoSave.current = true;
    const result = await persistStep(step.key, { advance: true, silent: false });
    if (result.ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data berhasil disimpan',
        timer: 1500,
        showConfirmButton: false,
      });
    }
    skipAutoSave.current = false;
    return result.ok;
  };

  const goBack = () => {
    if (activeStep > 0) {
      setFieldErrors({});
      setActiveStep((i) => i - 1);
    }
  };

  const goToStep = (index) => {
    const maxReachable = computeMaxReachableStep(completedSteps, serverStepIndex);
    if (index <= maxReachable && index >= 0 && index < PPDB_STEPS.length) {
      setFieldErrors({});
      setActiveStep(index);
    }
  };

  const submit = async () => {
    const { valid, stepErrors, firstInvalidIndex } = validateAllFormSteps(forms);
    if (!valid) {
      const firstKey = PPDB_STEPS[firstInvalidIndex]?.key;
      setFieldErrors(stepErrors[firstKey] || {});
      setActiveStep(firstInvalidIndex);
      Swal.fire({
        icon: 'warning',
        title: 'Formulir belum lengkap',
        text: 'Periksa langkah yang ditandai dan lengkapi field wajib.',
      });
      return false;
    }

    const confirm = await Swal.fire({
      icon: 'question',
      title: 'Ajukan Pendaftaran?',
      text: 'Setelah submit, formulir tidak dapat diubah hingga admin meminta revisi.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Ajukan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#0f7a5c',
    });

    if (!confirm.isConfirmed) return false;

    setSaving(true);
    try {
      await submitPendaftaran();
      setIsLocked(true);
      await Swal.fire({
        icon: 'success',
        title: 'Pendaftaran berhasil dikirim',
        text: 'Formulir terkunci. Menunggu verifikasi admin.',
      });
      navigate('/calon-murid/status', { replace: true });
      return true;
    } catch (err) {
      const parsed = extractApiError(err);
      const missingField = parseRequiredFieldMessage(parsed.message);
      const missingBerkas = parseMissingBerkasMessage(parsed.message);

      if (missingField && missingField.stepIndex >= 0) {
        setActiveStep(missingField.stepIndex);
        setFieldErrors({
          [missingField.field]: `${missingField.label} wajib diisi`,
        });
      }

      Swal.fire({
        icon: 'error',
        title: 'Gagal submit',
        text: missingField
          ? `${missingField.label} wajib diisi sebelum submit.`
          : missingBerkas
            ? `Berkas ${missingBerkas} belum diunggah. Lengkapi dulu di menu Upload Berkas.`
            : parsed.message,
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const percent = computeWizardPercent(activeStep, completedSteps);
  const maxReachableStep = computeMaxReachableStep(completedSteps, serverStepIndex);

  return {
    STEPS: PPDB_STEPS,
    loading,
    saving,
    ready,
    initError,
    activeStep,
    setActiveStep: goToStep,
    forms,
    updateForm,
    fieldErrors,
    completedSteps,
    maxReachableStep,
    percent,
    autoSaveStatus,
    isLocked,
    saveAndNext,
    saveDraft: () => saveDraft(false),
    goBack,
    goToStep,
    submit,
    retryInit: initialize,
  };
}

