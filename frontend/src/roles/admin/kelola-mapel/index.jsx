import AdminPageShell from '@/shared/components/AdminPageShell';
import MapelTable from '@/shared/akademik/mapel/components/MapelTable';
import MapelForm from '@/shared/akademik/mapel/components/MapelForm';
import { useMapel } from '@/shared/akademik/mapel/hooks/useMapel';

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
    kelasData,
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
          kelasData={kelasData}
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
