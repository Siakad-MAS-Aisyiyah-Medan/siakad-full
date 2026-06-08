import AdminPageShell from '@app/shared/components/AdminPageShell';
import PendaftarTable from '@app/shared/ppdb/components/PendaftarTable';
import { useAdminPpdb } from '@app/shared/ppdb/hooks/useAdminPpdb';

export default function AdminDaftarPendaftar() {
  const ppdb = useAdminPpdb();

  return (
    <AdminPageShell>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <HeaderText />
          <FiltersBar ppdb={ppdb} />
        </div>
        <StatsGrid stats={ppdb.stats} />
        <div className="table-container glass mt-6">
          <PendaftarTable items={ppdb.items} loading={ppdb.loading} />
        </div>
      </div>
    </AdminPageShell>
  );
}

function HeaderText() {
  return (
    <div className="header-text">
      <h2>Daftar Pendaftar PPDB</h2>
      <p>Verifikasi dan kelola calon murid baru.</p>
    </div>
  );
}

function FiltersBar({ ppdb }) {
  return (
    <div className="header-actions" style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        type="search"
        placeholder="Cari nama / NISN / no. registrasi..."
        value={ppdb.searchQuery}
        onChange={(e) => ppdb.setSearchQuery(e.target.value)}
        className="search-input"
      />
      <select
        value={ppdb.statusFilter}
        onChange={(e) => ppdb.setStatusFilter(e.target.value)}
        className="search-input"
      >
        <option value="">Semua Status</option>
        {Object.entries(ppdb.STATUS_LABELS).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatsGrid({ stats }) {
  return (
    <div className="stats-grid" style={{ marginBottom: '1rem' }}>
      <StatCard label="Diajukan" value={stats.diajukan} />
      <StatCard label="Terverifikasi" value={stats.terverifikasi} />
      <StatCard label="Diterima" value={stats.diterima} />
      <StatCard label="Ditolak" value={stats.ditolak} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card glass">
      <h3>{label}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );
}

