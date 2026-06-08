import AdminPageShell from '@app/shared/components/AdminPageShell';
import { useAuditLogs } from '@app/shared/akademik/audit-logs/hooks/useAuditLogs';

export default function AuditLogsPage() {
  const { items, meta, loading, search, setSearch, action, setAction, reload } = useAuditLogs();

  return (
    <AdminPageShell
      title="Audit Log"
      subtitle="Riwayat aksi sensitif administrator (create, update, delete, PPDB, enroll)."
    >
      <div className="glass p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm text-secondary block mb-1">Cari</label>
          <input
            type="search"
            className="form-input w-full"
            placeholder="Aksi, username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="min-w-[180px]">
          <label className="text-sm text-secondary block mb-1">Filter aksi</label>
          <input
            type="text"
            className="form-input w-full"
            placeholder="mis. guru.create"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={reload}>
          Terapkan
        </button>
      </div>

      <div className="table-container glass">
        <table className="data-table">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Aktor</th>
              <th>Aksi</th>
              <th>Subjek</th>
              <th>IP</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6">
                  Memuat...
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((row) => (
                <tr key={row.id}>
                  <td>{row.created_at ? new Date(row.created_at).toLocaleString('id-ID') : '-'}</td>
                  <td>
                    {row.actor?.username || '-'}
                    <br />
                    <small className="text-secondary">{row.actor?.role}</small>
                  </td>
                  <td>
                    <code>{row.action}</code>
                  </td>
                  <td>
                    {row.subject_type || '-'}
                    {row.subject_id ? ` #${row.subject_id}` : ''}
                  </td>
                  <td>{row.ip_address || '-'}</td>
                  <td>
                    <small>{row.meta ? JSON.stringify(row.meta) : '-'}</small>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-secondary">
                  Belum ada log audit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {meta?.total != null && (
          <p className="text-sm text-secondary p-3 border-t border-white/10">
            Total {meta.total} entri
          </p>
        )}
      </div>
    </AdminPageShell>
  );
}

