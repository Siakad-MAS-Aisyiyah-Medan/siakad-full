import { absensiStatusLabel } from '../constants/absensiStatus';

export default function RekapAbsensiCard({ rekap, title = 'Rekap Absensi' }) {
  if (!rekap) return null;

  return (
    <div className="glass p-6 mt-6" style={{ borderRadius: '12px' }}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="stats-info-grid">
        <div className="stat-box glass border-blue">
          <div className="stat-content">
            <div className="stat-value">{rekap.total ?? 0}</div>
            <div className="stat-label">Total Record</div>
          </div>
        </div>
        {(rekap.breakdown || []).map((item) => (
          <div key={item.status} className="stat-box glass border-green">
            <div className="stat-content">
              <div className="stat-value">{item.total}</div>
              <div className="stat-label">{item.label || absensiStatusLabel(item.status)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
