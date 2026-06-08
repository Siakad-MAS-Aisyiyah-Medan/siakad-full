import Swal from 'sweetalert2';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import AdminModulePlaceholder from '@app/shared/components/AdminModulePlaceholder';
import { useAuditLogs } from '@app/shared/akademik/audit-logs/hooks/useAuditLogs';

export default function HakAksesPage() {
  const { items, meta, loading, search, setSearch, action, setAction, reload } = useAuditLogs();

  const handleAdd = () => {
    Swal.fire('Info', 'Manajemen role akan diintegrasikan dengan backend.', 'info');
  };

  return (
    <AdminPageShell>
      <AdminModulePlaceholder
        title="Akun & Hak Akses"
        subtitle="Kelola role pengguna dan hak akses menu di sistem SIAKAD."
        stats={[
          { label: 'Total Akun', value: '-', color: 'blue' },
          { label: 'Role Aktif', value: '6', color: 'green' },
        ]}
        columns={['No', 'Username', 'Role', 'Status', 'Aksi']}
        emptyMessage="Belum ada data akun ditampilkan"
        addLabel="Tambah Akun"
        onAdd={handleAdd}
      />

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Audit Log (Riwayat Aktivitas)</h2>
            <p style={{ color: '#64748b' }}>Riwayat aksi sensitif administrator (create, update, delete, dll).</p>
          </div>
        </div>

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
      </div>
    </AdminPageShell>
  );
}
