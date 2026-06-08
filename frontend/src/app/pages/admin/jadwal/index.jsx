import AdminPageShell from '@app/shared/components/AdminPageShell';
import JadwalTable from '@app/shared/jadwal/admin/components/JadwalTable';
import JadwalForm from '@app/shared/jadwal/admin/components/JadwalForm';
import { useJadwal } from '@app/shared/jadwal/admin/hooks/useJadwal';

export default function JadwalPage() {
  const {
    view,
    searchQuery,
    setSearchQuery,
    filteredData,
    kelasData,
    mapelData,
    guruData,
    formData,
    loading,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeJadwal,
  } = useJadwal();

  return (
    <AdminPageShell>
      {view === 'list' && (
        <JadwalTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={removeJadwal}
        />
      )}
      {(view === 'add' || view === 'edit') && (
        <JadwalForm
          view={view}
          formData={formData}
          kelasData={kelasData}
          mapelData={mapelData}
          guruData={guruData}
          loading={loading}
          onChange={handleChange}
          onSubmit={submitForm}
          onCancel={cancelForm}
        />
      )}
    </AdminPageShell>
  );
}
