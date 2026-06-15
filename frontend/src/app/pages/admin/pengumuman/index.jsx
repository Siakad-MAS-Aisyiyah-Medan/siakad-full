import AdminPageShell from '@app/shared/components/AdminPageShell';
import PengumumanTable from '@app/shared/pengumuman/components/PengumumanTable';
import PengumumanForm from '@app/shared/pengumuman/components/PengumumanForm';
import { usePengumuman } from '@app/shared/pengumuman/hooks/usePengumuman';

export default function PengumumanPage({ readOnly = false }) {
  const {
    view,
    items,
    searchQuery,
    setSearchQuery,
    filterAkses,
    setFilterAkses,
    filteredData,
    formData,
    loading,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeItem,
    isFetching,
  } = usePengumuman();

  return (
    <AdminPageShell>
      {view === 'list' && (
        <PengumumanTable
          items={items}
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterAkses={filterAkses}
          setFilterAkses={setFilterAkses}
          onAdd={readOnly ? undefined : openAdd}
          onEdit={readOnly ? undefined : openEdit}
          onDelete={readOnly ? undefined : removeItem}
          isFetching={isFetching}
          readOnly={readOnly}
        />
      )}
      {(view === 'add' || view === 'edit') && (
        <PengumumanForm
          view={view}
          formData={formData}
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
