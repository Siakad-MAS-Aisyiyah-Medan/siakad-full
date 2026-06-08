import { Plus, Inbox } from 'lucide-react';

export default function AdminModulePlaceholder({
  title,
  subtitle,
  stats = [],
  columns = ['No', 'Keterangan', 'Status'],
  emptyMessage = 'Belum ada data',
  addLabel = 'Tambah Data',
  onAdd,
}) {
  return (
    <div className="data-panel view-list">
      <div className="panel-header glass">
        <div className="header-text">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {onAdd && (
          <div className="header-actions">
            <button type="button" onClick={onAdd} className="btn-primary">
              <Plus size={18} /> {addLabel}
            </button>
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <div className="stats-info-grid mt-6">
          {stats.map((stat) => (
            <div key={stat.label} className={`stat-box glass border-${stat.color || 'blue'}`}>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="table-container glass mt-6">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="text-center p-8 text-secondary">
                <Inbox size={48} className="mx-auto mb-3 opacity-40" />
                <p>{emptyMessage}</p>
                <p className="text-sm mt-2">Fitur ini sedang dalam pengembangan.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
