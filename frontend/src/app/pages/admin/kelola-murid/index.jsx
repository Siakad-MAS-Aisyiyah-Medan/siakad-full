import AdminPageShell from '@app/shared/components/AdminPageShell';
import MuridFilter from '@app/shared/akademik/murid/components/MuridFilter';
import MuridTable from '@app/shared/akademik/murid/components/MuridTable';
import { useMurid } from '@app/shared/akademik/murid/hooks/useMurid';

export default function MuridPage() {
  const { searchQuery, setSearchQuery, filteredData, promoteMurid, removeMurid } = useMurid();

  return (
    <AdminPageShell>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Kelola Data Murid</h2>
            <p>Lihat status siswa aktif dan calon siswa mendaftar di sistem.</p>
          </div>
          <div className="header-actions">
            <MuridFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>
        </div>
        <MuridTable data={filteredData} onPromote={promoteMurid} onDelete={removeMurid} />
      </div>
    </AdminPageShell>
  );
}
