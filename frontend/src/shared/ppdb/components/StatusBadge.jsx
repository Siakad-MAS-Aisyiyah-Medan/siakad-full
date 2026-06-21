import { PPDB_STATUS_LABELS } from '@/shared/services/ppdb.service';

const STATUS_CLASS = {
  belum: 'status-belum',
  draft: 'status-draft',
  submitted: 'status-submitted',
  verified: 'status-verified',
  accepted: 'status-accepted',
  rejected: 'status-rejected',
  diajukan: 'status-submitted',
  revisi: 'status-warning',
  revision: 'status-warning',
  terverifikasi: 'status-verified',
  diterima: 'status-accepted',
  ditolak: 'status-rejected',
  daftar_ulang: 'status-info',
  menjadi_murid: 'status-success',
};

export default function StatusBadge({ status }) {
  const label = PPDB_STATUS_LABELS[status] || status;
  const cls = STATUS_CLASS[status] || 'status-default';

  return <span className={`ppdb-status-badge ${cls}`}>{label}</span>;
}

