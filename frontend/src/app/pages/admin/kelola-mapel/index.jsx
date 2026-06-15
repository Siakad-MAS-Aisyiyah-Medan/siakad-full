import AdminPageShell from '@app/shared/components/AdminPageShell';
import MapelTable from '@app/shared/akademik/mapel/components/MapelTable';
import MapelForm from '@app/shared/akademik/mapel/components/MapelForm';
import { useMapel } from '@app/shared/akademik/mapel/hooks/useMapel';

export default function MapelPage({ readOnly = false }) {
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
    isFetching,
  } = useMapel();

  return (
    <AdminPageShell>
      {view === 'list' && (
        <MapelTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={readOnly ? undefined : openAdd}
          onEdit={readOnly ? undefined : openEdit}
          onDelete={readOnly ? undefined : removeMapel}
          isFetching={isFetching}
          readOnly={readOnly}
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
          readOnly={readOnly}
        />
      )}
    </AdminPageShell>
  );
}
