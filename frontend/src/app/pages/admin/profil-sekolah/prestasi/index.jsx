import PrestasiTable from '@app/shared/berita-prestasi/components/PrestasiTable';
import PrestasiForm from '@app/shared/berita-prestasi/components/PrestasiForm';
import { usePrestasi } from '@app/shared/berita-prestasi/hooks/usePrestasi';

export default function PrestasiPage({ readOnly = false }) {
  const {
    view,
    searchQuery,
    setSearchQuery,
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
  } = usePrestasi();

  return (
    <>
      {view === 'list' && (
        <PrestasiTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={readOnly ? undefined : openAdd}
          onEdit={readOnly ? undefined : openEdit}
          onDelete={readOnly ? undefined : removeItem}
          isFetching={isFetching}
          readOnly={readOnly}
        />
      )}
      {(view === 'add' || view === 'edit') && (
        <PrestasiForm
          view={view}
          formData={formData}
          loading={loading}
          onChange={handleChange}
          onSubmit={submitForm}
          onCancel={cancelForm}
          readOnly={readOnly}
        />
      )}
    </>
  );
}
