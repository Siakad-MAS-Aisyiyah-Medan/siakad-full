import AdminPageShell from '@app/shared/components/AdminPageShell';
import MapelTable from '@app/shared/akademik/mapel/components/MapelTable';
import MapelForm from '@app/shared/akademik/mapel/components/MapelForm';
import { useMapel } from '@app/shared/akademik/mapel/hooks/useMapel';

export default function MapelPage() {
  const {
    view,
    searchQuery,
    setSearchQuery,
    filteredData,
    guruData,
    formData,
    loading,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeMapel,
  } = useMapel();

  return (
    <AdminPageShell>
      {view === 'list' && (
        <MapelTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={removeMapel}
        />
      )}
      {(view === 'add' || view === 'edit') && (
        <MapelForm
          view={view}
          formData={formData}
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
