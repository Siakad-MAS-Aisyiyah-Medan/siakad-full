import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  buildInitialCompletedSteps,
  computeMaxReachableStep,
  computeWizardPercent,
  EDITABLE_STATUSES,
  FINAL_STATUSES,
  PPDB_STEPS,
  stepIndexFromCurrentStep,
} from '../config/ppdbWizardConfig';
import {
  fetchMyRegistration,
  saveStepDokumen,
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
  validateAllFormSteps,
  validateStep,
} from '../utils/ppdbWizardValidation';

const SAVE_FN = {
  'keterangan-pribadi': saveStepKeteranganPribadi,
  kesehatan: saveStepKesehatan,
  'pendidikan-asal': saveStepPendidikanAsal,
  'orang-tua-wali': saveStepOrangTuaWali,
  kepribadian: saveStepKepribadian,
  dokumen: saveStepDokumen,
};

const EMPTY_FORMS = {
  keteranganPribadi: {},
  kesehatan: {},
  pendidikanAsal: {},
  orangTuaWali: {},
  kepribadian: {},
  dokumen: {},
  meta: {},
};

const AUTO_SAVE_MS = 2500;

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

function mapRegistrationToForms(p) {
  if (!p) return { ...EMPTY_FORMS };
  return {
    keteranganPribadi: p.keterangan_pribadi || {},
    kesehatan: p.kesehatan || {},
    pendidikanAsal: p.pendidikan_asal || {},
    orangTuaWali: p.orang_tua_wali || {},
    kepribadian: p.kepribadian || {},
    dokumen: p.dokumen || {},
    meta: {
      status: p.status_pendaftaran,
      currentStep: p.current_step,
      currentStepIndex: p.current_step_index,
      nomor: p.nomor_pendaftaran,
      tahun: p.tahun_pelajaran,
    },
  };
}

function mergeCompletedSteps(prev, stepIndex) {
  if (stepIndex < 0 || stepIndex >= PPDB_STEPS.length - 1) return prev;
  const set = new Set(prev);
  set.add(stepIndex);
  return [...set].sort((a, b) => a - b);
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
  const autoSaveTimer = useRef(null);
  const skipAutoSave = useRef(false);

  formsRef.current = forms;
  activeStepRef.current = activeStep;

  const applyRegistration = useCallback((p) => {
    setForms(mapRegistrationToForms(p));
    const status = p?.status_pendaftaran || 'draft';
    const locked = FINAL_STATUSES.includes(status);
    setIsLocked(locked);

    const stepIdx =
      typeof p?.current_step_index === 'number'
        ? p.current_step_index - 1
        : stepIndexFromCurrentStep(p?.current_step_key || p?.current_step);

    const safeStep = Math.min(Math.max(0, stepIdx), PPDB_STEPS.length - 1);
    setActiveStep(safeStep);
    setServerStepIndex(safeStep);
    setCompletedSteps(buildInitialCompletedSteps(p?.current_step_index ?? safeStep + 1));
    setFieldErrors({});
    setReady(true);
  }, []);

  const syncFromServer = useCallback((p, { keepActiveStep = false } = {}) => {
    setForms(mapRegistrationToForms(p));
    const status = p?.status_pendaftaran || 'draft';
    setIsLocked(FINAL_STATUSES.includes(status));

    const serverIdx =
      typeof p?.current_step_index === 'number'
        ? Math.min(PPDB_STEPS.length - 1, Math.max(0, p.current_step_index - 1))
        : stepIndexFromCurrentStep(p?.current_step_key || p?.current_step);

    setServerStepIndex(serverIdx);
    setCompletedSteps(buildInitialCompletedSteps(p?.current_step_index ?? serverIdx + 1));

    if (!keepActiveStep) {
      setActiveStep(serverIdx);
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

        syncFromServer(updated, { keepActiveStep: !advance });

        if (stepIndex >= 0) {
          setCompletedSteps((prev) => mergeCompletedSteps(prev, stepIndex));
        }

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
    [applyRegistration],
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

  useEffect(() => {
    if (!ready || isLocked || saving) return undefined;

    const step = PPDB_STEPS[activeStep];
    if (!step || step.key === 'review') return undefined;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

    autoSaveTimer.current = setTimeout(() => {
      if (skipAutoSave.current) return;
      saveDraft(true);
    }, AUTO_SAVE_MS);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [forms, activeStep, ready, isLocked, saving, saveDraft]);

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
        title: 'Pendaftaran Diajukan',
        text: 'Formulir terkunci. Menunggu verifikasi admin.',
      });
      navigate('/calon-murid/status', { replace: true });
      return true;
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal submit', text: extractApiError(err).message });
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

