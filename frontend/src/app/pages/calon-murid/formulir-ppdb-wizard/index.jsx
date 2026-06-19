import { useNavigate } from 'react-router-dom';
import {
  AlertCircle, Loader2, CheckCircle2, ArrowLeft,
  FileEdit, User, Heart, School, Users, Star, FileText, ClipboardCheck,
} from 'lucide-react';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import PageHeader from '@app/shared/components/PageHeader';
import FormActions from '@app/shared/ppdb/components/form/FormActions';
import {
  StepKepribadian,
  StepKeteranganPribadi,
  StepKesehatan,
  StepOrtu,
  StepPendidikan,
  StepReview,
} from '@app/shared/ppdb/components/wizard/WizardStepFields';
import { PPDB_STEPS, STEP_DESCRIPTIONS } from '@app/shared/ppdb/config/ppdbWizardConfig';
import { usePpdbWizard } from '@app/shared/ppdb/hooks/usePpdbWizard';

/* Ikon per step */
const STEP_ICONS = {
  'keterangan-pribadi': User,
  kesehatan: Heart,
  'pendidikan-asal': School,
  'orang-tua-wali': Users,
  kepribadian: Star,
  review: ClipboardCheck,
};

/* Warna accent per step */
const STEP_ACCENTS = {
  'keterangan-pribadi': 'wizard-accent--blue',
  kesehatan: 'wizard-accent--rose',
  'pendidikan-asal': 'wizard-accent--amber',
  'orang-tua-wali': 'wizard-accent--purple',
  kepribadian: 'wizard-accent--pink',
  review: 'wizard-accent--green',
};

function AutoSaveHint({ status }) {
  if (status === 'idle') return null;
  const isSaving = status === 'saving';
  const isSaved = status === 'saved';
  const isError = status === 'error';
  const text = isSaving ? 'Menyimpan...' : isSaved ? 'Draft tersimpan' : 'Gagal simpan';
  const Icon = isSaving ? Loader2 : isSaved ? CheckCircle2 : AlertCircle;
  const cls = isError
    ? 'text-red-600 bg-red-50 border-red-100'
    : 'text-emerald-700 bg-emerald-50 border-emerald-100';
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${cls}`}>
      <Icon size={13} className={isSaving ? 'animate-spin' : ''} />
      {text}
    </div>
  );
}

function FieldErrorsBanner({ errors }) {
  const messages = Object.values(errors || {}).filter(Boolean);
  if (!messages.length) return null;
  return (
    <div className="wizard-error-banner" role="alert">
      <AlertCircle size={18} className="shrink-0 mt-0.5" />
      <ul className="list-disc pl-4 space-y-1">
        {messages.map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default function FormulirPpdbWizard() {
  const navigate = useNavigate();
  const w = usePpdbWizard();
  const step = w.STEPS[w.activeStep];
  const stepKey = step?.key;
  const disabled = w.saving || w.isLocked;
  const totalSteps = w.STEPS.length;
  const err = w.fieldErrors;
  const completedSet = new Set(w.completedSteps);

  const StepIcon = STEP_ICONS[stepKey] || FileEdit;
  const accentClass = STEP_ACCENTS[stepKey] || 'wizard-accent--green';

  const renderStep = () => {
    const common = { onChange: w.updateForm, disabled, errors: err };
    switch (stepKey) {
      case 'keterangan-pribadi': return <StepKeteranganPribadi data={w.forms.keteranganPribadi} {...common} />;
      case 'kesehatan':          return <StepKesehatan data={w.forms.kesehatan} {...common} />;
      case 'pendidikan-asal':    return <StepPendidikan data={w.forms.pendidikanAsal} {...common} />;
      case 'orang-tua-wali':     return <StepOrtu data={w.forms.orangTuaWali} {...common} />;
      case 'kepribadian':        return <StepKepribadian data={w.forms.kepribadian} {...common} />;
      case 'review':             return <StepReview forms={w.forms} />;
      default:                   return null;
    }
  };

  /* ── Loading ── */
  if (w.loading) {
    return (
      <CalonMuridLayout>
        <PageHeader 
          title="Formulir Pendaftaran PPDB"
          subtitle="Lengkapi semua tahap dengan data yang akurat sesuai dokumen resmi."
        />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
          <div className="wizard-loading-ring" />
          <p className="text-sm font-medium">Memuat formulir pendaftaran...</p>
        </div>
      </CalonMuridLayout>
    );
  }

  /* ── Init Error ── */
  if (w.initError) {
    return (
      <CalonMuridLayout>
        <PageHeader 
          title="Formulir Pendaftaran PPDB"
          subtitle="Lengkapi semua tahap dengan data yang akurat sesuai dokumen resmi."
        />
        <div className="mx-auto max-w-lg mt-16 text-center">
          <div className="wizard-error-card">
            <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Gagal Memuat Formulir</h2>
            <p className="text-sm text-red-600 whitespace-pre-wrap mb-6">{w.initError}</p>
            <button className="wizard-btn-primary" onClick={w.retryInit}>Coba Lagi</button>
          </div>
        </div>
      </CalonMuridLayout>
    );
  }

  if (!w.ready) return null;

  return (
    <CalonMuridLayout>
      <div className="wizard-root animate-stagger-1">
        {/* ── Wizard Page Header ── */}
        {/* ── Wizard Page Header ── */}
        <PageHeader 
          title="Formulir Pendaftaran PPDB"
          subtitle="Lengkapi semua tahap dengan data yang akurat sesuai dokumen resmi."
        >
          <button
            type="button"
            className="wizard-btn-outline"
            style={{ padding: '0.45rem 1rem' }}
            onClick={() => navigate('/calon-murid/status')}
          >
            Lihat Status
          </button>
        </PageHeader>

        {/* ── Step Progress Bar ── */}
        <div className="wizard-progress-wrap animate-stagger-2">
          {/* Mini progress pill */}
          <div className="wizard-progress-topbar">
            <span className="wizard-progress-label">
              Langkah {w.activeStep + 1} dari {totalSteps}
            </span>
            <div className="wizard-mini-progress-track">
              <div
                className="wizard-mini-progress-fill"
                style={{ width: `${w.percent}%` }}
              />
            </div>
            <span className="wizard-progress-pct">
              {w.percent}%
            </span>
          </div>

          {/* Step tabs */}
          <div className="wizard-steps-scroll">
            <div className="wizard-steps-row">
              {PPDB_STEPS.map((s, idx) => {
                const done = completedSet.has(idx);
                const active = idx === w.activeStep;
                const reachable = idx <= w.maxReachableStep;
                const state = active ? 'active' : done ? 'done' : reachable ? 'reachable' : 'pending';
                return (
                  <button
                    key={s.key}
                    type="button"
                    disabled={!reachable}
                    onClick={() => reachable && w.goToStep(idx)}
                    aria-current={active ? 'step' : undefined}
                    className={`wizard-step-btn wizard-step-btn--${state}`}
                  >
                    {/* connector line */}
                    {idx > 0 && (
                      <div className="wizard-step-line">
                        <div className={`wizard-step-line__fill${completedSet.has(idx - 1) ? ' wizard-step-line__fill--done' : ''}`} />
                      </div>
                    )}
                    <span className="wizard-step-circle">
                      {done
                        ? <CheckCircle2 size={16} strokeWidth={2.5} />
                        : <span>{idx + 1}</span>
                      }
                    </span>
                    <span className="wizard-step-label">{s.shortLabel || s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="wizard-form-card animate-stagger-3">
          {/* Step header */}
          <div className={`wizard-step-header ${accentClass}`}>
            <div className="wizard-step-header__icon">
              <StepIcon size={22} strokeWidth={1.5} />
            </div>
            <div className="wizard-step-header__body">
              <div className="wizard-step-header__breadcrumb">
                Langkah {w.activeStep + 1} dari {totalSteps}
              </div>
              <h2 className="wizard-step-header__title">{step?.label}</h2>
              <p className="wizard-step-header__desc">{STEP_DESCRIPTIONS[stepKey] || ''}</p>
            </div>
            <div className="wizard-step-header__meta">
              <AutoSaveHint status={w.autoSaveStatus || 'idle'} />
              <span className="wizard-meta-pill">
                TP {w.forms.meta?.tahun || '2026/2027'}
                {w.forms.meta?.nomor ? ` · #${w.forms.meta.nomor}` : ''}
              </span>
            </div>
          </div>

          {/* Locked banner */}
          {w.isLocked && (
            <div className="wizard-locked-banner">
              <AlertCircle size={16} className="shrink-0" />
              <span>Formulir terkunci — pendaftaran sudah diajukan dan menunggu verifikasi admin.</span>
            </div>
          )}

          {/* Field errors */}
          <FieldErrorsBanner errors={err} />

          {/* Step content */}
          <div className="wizard-step-body">
            {renderStep()}
          </div>

          {/* Form actions */}
          {!w.isLocked && (
            <FormActions
              showBack={w.activeStep > 0}
              onBack={w.goBack}
              onSaveDraft={stepKey === 'review' ? undefined : w.saveDraft}
              draftLoading={w.saving}
              onPrimary={stepKey === 'review' ? () => navigate('/calon-murid/upload-berkas') : w.saveAndNext}
              primaryLabel={stepKey === 'review' ? 'Selesai & Lanjut ke Berkas' : 'Simpan Data'}
              primaryLoading={w.saving}
              primaryLoadingLabel={stepKey === 'review' ? 'Menyimpan...' : 'Menyimpan...'}
              disabled={disabled}
              isReview={stepKey === 'review'}
              showSaveDraft={stepKey !== 'review'}
            />
          )}
        </div>
      </div>
    </CalonMuridLayout>
  );
}
