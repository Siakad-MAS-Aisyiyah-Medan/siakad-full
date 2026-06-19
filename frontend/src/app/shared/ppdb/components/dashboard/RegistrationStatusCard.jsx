import { createElement } from 'react';
import { Hash, Calendar, BadgeCheck, Clock } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { formatLastUpdated } from '../../utils/ppdbProgress';
import { normalizePpdbStatus } from '../../utils/dashboardState';

function StatCard({ icon, label, value, colorClass, isBadge = false }) {
  return (
    <div className={`cm-stat-card ${colorClass}`}>
      <div className="cm-stat-card__icon">
        {createElement(icon, { size: 20 })}
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

export default function RegistrationStatusCard({ pendaftaran, dashboardState }) {
  const phase = dashboardState?.phase ?? normalizePpdbStatus(pendaftaran);
  const statusForBadge = phase === 'none' ? 'belum' : phase;
  const nomor = pendaftaran?.nomor_pendaftaran || '—';
  const tahun = pendaftaran?.tahun_pelajaran || '2026/2027';
  const lastUpdated = formatLastUpdated(pendaftaran);
  const statusMessage = dashboardState?.statusMessage;
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
    </section>
  );
}
