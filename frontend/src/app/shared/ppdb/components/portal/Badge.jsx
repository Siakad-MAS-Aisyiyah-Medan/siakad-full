const styles = {
  draft: 'bg-slate-100 text-slate-700 ring-slate-200',
  belum: 'bg-slate-100 text-slate-600 ring-slate-200',
  submitted: 'bg-blue-50 text-blue-800 ring-blue-200',
  diajukan: 'bg-blue-50 text-blue-800 ring-blue-200',
  verified: 'bg-violet-50 text-violet-800 ring-violet-200',
  terverifikasi: 'bg-violet-50 text-violet-800 ring-violet-200',
  accepted: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  diterima: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  rejected: 'bg-red-50 text-red-800 ring-red-200',
  ditolak: 'bg-red-50 text-red-800 ring-red-200',
  revisi: 'bg-amber-50 text-amber-900 ring-amber-200',
  revision: 'bg-amber-50 text-amber-900 ring-amber-200',
  default: 'bg-slate-100 text-slate-700 ring-slate-200',
  info: 'bg-sky-50 text-sky-800 ring-sky-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-900 ring-amber-200',
};

export default function Badge({ children, tone = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles[tone] || styles.default} ${className}`}
    >
      {children}
    </span>
  );
}
