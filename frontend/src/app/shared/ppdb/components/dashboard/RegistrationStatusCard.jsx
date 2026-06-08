import { Hash, Calendar, BadgeCheck, Clock } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { formatLastUpdated } from '../../utils/ppdbProgress';
import { normalizePpdbStatus } from '../../utils/dashboardState';

function StatCard({ icon: Icon, label, value, colorClass, isBadge = false }) {
  return (
    <div className={`cm-stat-card ${colorClass}`}>
      <div className="cm-stat-card__icon">
        <Icon size={20} />
      </div>
      <div className="cm-stat-card__body">
        <span className="cm-stat-card__label">{label}</span>
        {isBadge ? (
          <div className="cm-stat-card__badge-wrap">{value}</div>
        ) : (
          <strong className="cm-stat-card__value">{value}</strong>
        )}
      </div>
    </div>
  );
}

export default function RegistrationStatusCard({ pendaftaran, progressPercent, dashboardState }) {
  const phase = dashboardState?.phase ?? normalizePpdbStatus(pendaftaran);
  const statusForBadge = phase === 'none' ? 'belum' : phase;
  const nomor = pendaftaran?.nomor_pendaftaran || '—';
  const tahun = pendaftaran?.tahun_pelajaran || '2026/2027';
  const lastUpdated = formatLastUpdated(pendaftaran);
  const statusMessage = dashboardState?.statusMessage;
  const showProgress = dashboardState?.showProgress !== false && phase !== 'none';

  return (
    <section className="cm-status-section">
      <div className="cm-stat-cards-grid">
        <StatCard icon={Hash} label="Nomor Pendaftaran" value={nomor} colorClass="cm-stat-card--blue" />
        <StatCard icon={Calendar} label="Tahun Pelajaran" value={tahun} colorClass="cm-stat-card--green" />
        <StatCard icon={BadgeCheck} label="Status Pendaftaran" value={<StatusBadge status={statusForBadge} />} colorClass="cm-stat-card--purple" isBadge />
        <StatCard icon={Clock} label="Terakhir Diperbarui" value={lastUpdated} colorClass="cm-stat-card--orange" />
      </div>

      {statusMessage ? (
        <div className="cm-status-message">
          <span>{statusMessage}</span>
        </div>
      ) : null}

      {showProgress ? (
        <div className="cm-progress-block">
          <div className="cm-progress-block__header">
            <span>Progress Formulir</span>
            <strong>{progressPercent}%</strong>
          </div>
          <div
            className="cm-progress-track"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="cm-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
