import { ArrowRight, CheckCircle2, Clock, FileEdit, PlayCircle, XCircle, Loader2 } from 'lucide-react';

const TONE_ICON = {
  info: PlayCircle,
  primary: FileEdit,
  warning: FileEdit,
  pending: Clock,
  success: CheckCircle2,
  danger: XCircle,
};

const CTA_TONE_MAP = {
  info: 'cm-cta-card--info',
  primary: 'cm-cta-card--primary',
  warning: 'cm-cta-card--warning',
  pending: 'cm-cta-card--pending',
  success: 'cm-cta-card--success',
  danger: 'cm-cta-card--danger',
};

export default function DashboardPrimaryAction({
  dashboardState,
  onStart,
  onNavigate,
  starting,
}) {
  const {
    primaryLabel,
    primaryDescription,
    tone,
    primaryHandler,
    primaryPath,
    primaryDisabled,
    phase,
    catatanAdmin,
  } = dashboardState;

  const Icon = TONE_ICON[tone] || PlayCircle;
  const toneClass = CTA_TONE_MAP[tone] || 'cm-cta-card--info';

  const handleClick = () => {
    if (primaryDisabled) {
      if (primaryPath) onNavigate(primaryPath);
      return;
    }
    if (primaryHandler === 'start') {
      onStart();
      return;
    }
    if (primaryPath) onNavigate(primaryPath);
  };

  return (
    <div className={`cm-cta-card ${toneClass}`}>
      <div className="cm-cta-card__icon-wrap">
        {starting ? (
          <Loader2 size={26} className="cm-cta-card__spinner" />
        ) : (
          <Icon size={26} />
        )}
      </div>
      <div className="cm-cta-card__body">
        <p className="cm-cta-card__eyebrow">Aksi Utama</p>
        <h3 className="cm-cta-card__title">{primaryLabel}</h3>
        <p className="cm-cta-card__desc">{primaryDescription}</p>
        {phase === 'revision' && catatanAdmin ? (
          <blockquote className="cm-cta-card__note cm-cta-card__note--warning">{catatanAdmin}</blockquote>
        ) : null}
        {phase === 'rejected' && catatanAdmin ? (
          <blockquote className="cm-cta-card__note cm-cta-card__note--danger">{catatanAdmin}</blockquote>
        ) : null}
      </div>
      <button
        type="button"
        className="cm-cta-card__btn"
        onClick={handleClick}
        disabled={starting && primaryHandler === 'start'}
      >
        {starting && primaryHandler === 'start' ? 'Memulai...' : primaryLabel}
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
