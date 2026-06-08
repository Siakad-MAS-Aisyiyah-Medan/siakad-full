import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, ClipboardList, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import PortalPageShell from '@app/shared/ppdb/components/portal/PortalPageShell';
import Card from '@app/shared/ppdb/components/portal/Card';
import Button from '@app/shared/ppdb/components/portal/Button';
import ProgressStepper from '@app/shared/ppdb/components/portal/ProgressStepper';
import StatusInfoTips from '@app/shared/ppdb/components/status/StatusInfoTips';
import StatusMainCard from '@app/shared/ppdb/components/status/StatusMainCard';
import StatusNextActions from '@app/shared/ppdb/components/status/StatusNextActions';
import { PPDB_STEPS, stepIndexFromCurrentStep } from '@app/shared/ppdb/config/ppdbWizardConfig';
import { fetchPpdbStatus } from '@app/shared/services/ppdb.service';

const STATUS_META = {
  draft: { icon: Clock, tone: 'amber', label: 'Draft — Formulir belum selesai diisi' },
  revision: { icon: AlertTriangle, tone: 'amber', label: 'Perlu Revisi' },
  revisi: { icon: AlertTriangle, tone: 'amber', label: 'Perlu Revisi' },
  submitted: { icon: Clock, tone: 'blue', label: 'Menunggu verifikasi admin' },
  diajukan: { icon: Clock, tone: 'blue', label: 'Menunggu verifikasi admin' },
  verified: { icon: CheckCircle2, tone: 'purple', label: 'Sudah diverifikasi' },
  terverifikasi: { icon: CheckCircle2, tone: 'purple', label: 'Sudah diverifikasi' },
  accepted: { icon: CheckCircle2, tone: 'green', label: 'Selamat! Anda diterima' },
  diterima: { icon: CheckCircle2, tone: 'green', label: 'Selamat! Anda diterima' },
  rejected: { icon: AlertTriangle, tone: 'red', label: 'Pendaftaran tidak diterima' },
  ditolak: { icon: AlertTriangle, tone: 'red', label: 'Pendaftaran tidak diterima' },
};

export default function StatusPendaftaran() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPpdbStatus()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const status = data?.status_pendaftaran || 'draft';
  const activeStep = data?.has_registration
    ? stepIndexFromCurrentStep(data.current_step)
    : 0;

  const meta = STATUS_META[status] || STATUS_META.draft;
  const StatusIcon = meta.icon;

  return (
    <CalonMuridLayout>
      <PortalPageShell>
        {/* Page Header */}
        <div className="cm-page-header cm-page-header--status">
          <div className="cm-page-header__icon">
            <ClipboardList size={28} strokeWidth={1.5} />
          </div>
          <div className="cm-page-header__content">
            <h1 className="cm-page-header__title">Status Pendaftaran</h1>
            <p className="cm-page-header__subtitle">
              Pantau perkembangan proses pendaftaran PPDB Anda secara real-time.
            </p>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/calon-murid/dashboard')}
            className="group shrink-0"
          >
            <ArrowLeft size={16} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Button>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            <p>Memuat status pendaftaran...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Banner */}
            {data?.has_registration && (
              <div className={`cm-status-banner cm-status-banner--${meta.tone}`}>
                <div className={`cm-status-banner__icon cm-status-banner__icon--${meta.tone}`}>
                  <StatusIcon size={22} />
                </div>
                <span>{meta.label}</span>
              </div>
            )}

            {/* Progress Stepper */}
            <Card padding="p-6 sm:p-8">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900">Progres Pendaftaran</h2>
                <p className="mt-1 text-sm text-slate-500">Lacak kelengkapan setiap tahap formulir PPDB.</p>
              </div>
              <ProgressStepper steps={PPDB_STEPS} activeIndex={activeStep} />
            </Card>

            {/* Main content grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <StatusMainCard data={data} />
                <StatusNextActions status={status} hasRegistration={data?.has_registration} />
              </div>
              <div className="lg:col-span-1">
                <StatusInfoTips />
              </div>
            </div>
          </div>
        )}
      </PortalPageShell>
    </CalonMuridLayout>
  );
}
