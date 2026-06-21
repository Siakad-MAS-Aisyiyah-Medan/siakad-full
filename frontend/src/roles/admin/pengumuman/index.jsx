import AdminPageShell from '@/shared/components/AdminPageShell';
import PengumumanTable from '@/shared/pengumuman/components/PengumumanTable';
import PengumumanForm from '@/shared/pengumuman/components/PengumumanForm';
import { usePengumuman } from '@/shared/pengumuman/hooks/usePengumuman';

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
    openView,
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
          onView={openView}
          isFetching={isFetching}
          readOnly={readOnly}
        />
      )}
      {(view === 'add' || view === 'edit' || view === 'view') && (
        <PengumumanForm
          view={view}
          formData={formData}
          loading={loading}
          onChange={handleChange}
          onSubmit={submitForm}
          onCancel={cancelForm}
          readOnly={readOnly || view === 'view'}
        />
      )}
    </AdminPageShell>
  );
}
