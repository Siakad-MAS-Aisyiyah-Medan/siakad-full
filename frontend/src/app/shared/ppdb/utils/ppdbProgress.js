/** Langkah progress di dashboard (7 langkah tampilan) */
export const DASHBOARD_PROGRESS_STEPS = [
  { key: 'biodata', label: 'Biodata' },
  { key: 'kesehatan', label: 'Kesehatan' },
  { key: 'pendidikan', label: 'Pendidikan' },
  { key: 'orang-tua', label: 'Orang Tua' },
  { key: 'dokumen', label: 'Dokumen' },
  { key: 'review', label: 'Review' },
  { key: 'submit', label: 'Submit' },
];

const WIZARD_TO_DASH_INDEX = {
  'keterangan-pribadi': 0,
  kesehatan: 1,
  'pendidikan-asal': 2,
  'orang-tua-wali': 3,
  kepribadian: 3,
  dokumen: 4,
  review: 5,
  submitted: 7,
};

const FINAL_STATUSES = ['submitted', 'verified', 'accepted', 'rejected'];

/**
 * @param {object|null} pendaftaran
 * @returns {{ activeIndex: number, percent: number, steps: typeof DASHBOARD_PROGRESS_STEPS }}
 */
export function computePpdbProgress(pendaftaran) {
  const steps = DASHBOARD_PROGRESS_STEPS;

  if (!pendaftaran) {
    return { activeIndex: 0, percent: 0, steps };
  }

  const status = pendaftaran.status_pendaftaran;

  if (FINAL_STATUSES.includes(status)) {
    return { activeIndex: steps.length, percent: 100, steps };
  }

  const stepRaw = pendaftaran.current_step_key || pendaftaran.current_step;
  const asNum = parseInt(String(stepRaw), 10);
  const activeIndex = !Number.isNaN(asNum) && asNum >= 1
    ? Math.min(steps.length - 1, asNum - 1)
    : WIZARD_TO_DASH_INDEX[stepRaw] ?? 0;
  const percent = Math.min(100, Math.round((activeIndex / steps.length) * 100));

  return { activeIndex, percent, steps };
}

export function formatLastUpdated(pendaftaran) {
  if (!pendaftaran) return '—';
  const raw =
    pendaftaran.submitted_at ||
    pendaftaran.verified_at ||
    pendaftaran.updated_at;
  if (!raw) return 'Baru saja';
  try {
    return new Date(raw).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}
