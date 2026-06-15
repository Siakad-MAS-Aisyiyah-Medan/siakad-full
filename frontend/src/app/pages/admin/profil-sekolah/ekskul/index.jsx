import EkskulTable from '@app/shared/ekstrakurikuler/components/EkskulTable';
import EkskulForm from '@app/shared/ekstrakurikuler/components/EkskulForm';
import { useEkskul } from '@app/shared/ekstrakurikuler/hooks/useEkskul';

export default function EkskulPage({ readOnly = false }) {
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
    removeItem,
    isFetching,
  } = useEkskul();

  return (
    <>
      {view === 'list' && (
        <EkskulTable
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
        <EkskulForm
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
    </>
  );
}
