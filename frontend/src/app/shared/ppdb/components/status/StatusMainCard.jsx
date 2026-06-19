import { createElement } from 'react';
import StatusBadge from '../StatusBadge';
import Card from '../portal/Card';
import { PPDB_STEPS } from '../../config/ppdbWizardConfig';
import { Hash, Calendar, Layers, Clock, FileText } from 'lucide-react';

function formatStepLabel(step) {
  if (!step) return '—';
  const found = PPDB_STEPS.find((s) => s.key === step);
  return found?.label || step.replace(/-/g, ' ');
}

function InfoCell({ icon, label, children }) {
  return (
    <div className="cm-info-cell">
      <div className="cm-info-cell__icon">
        {createElement(icon, { size: 16 })}
      </div>
      <div className="cm-info-cell__body">
        <dt className="cm-info-cell__label">{label}</dt>
        <dd className="cm-info-cell__value">{children}</dd>
      </div>
    </div>
  );
}

export default function StatusMainCard({ data }) {
  const status = data?.status_pendaftaran || 'draft';

  return (
    <Card padding="p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Ringkasan Pendaftaran</h2>
          <p className="mt-0.5 text-sm text-slate-500">Detail informasi pendaftaran PPDB Anda.</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoCell icon={Hash} label="Nomor Pendaftaran">
          <span className="font-bold text-slate-900">{data?.nomor_pendaftaran || '—'}</span>
        </InfoCell>
        <InfoCell icon={Calendar} label="Tahun Pelajaran">
          <span className="font-bold text-slate-900">{data?.tahun_pelajaran || '2026/2027'}</span>
        </InfoCell>
        <InfoCell icon={Layers} label="Status Pendaftaran">
          <StatusBadge status={status} />
        </InfoCell>
        <InfoCell icon={FileText} label="Tahap Terakhir">
          <span className="font-semibold capitalize text-slate-900">
            {formatStepLabel(data?.current_step)}
          </span>
        </InfoCell>
        {data?.submitted_at && (
          <InfoCell icon={Clock} label="Tanggal Submit">
            <span className="font-semibold text-slate-900">
              {new Date(data.submitted_at).toLocaleString('id-ID')}
            </span>
          </InfoCell>
        )}
      </dl>

      {data?.catatan_admin && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
          <div className="mt-0.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <FileText size={16} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Catatan Admin</p>
            <p className="mt-1 text-sm text-red-900">{data.catatan_admin}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
