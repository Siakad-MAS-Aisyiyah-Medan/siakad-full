import EkskulTable from '@app/shared/ekstrakurikuler/components/EkskulTable';
import EkskulForm from '@app/shared/ekstrakurikuler/components/EkskulForm';
import { useEkskul } from '@app/shared/ekstrakurikuler/hooks/useEkskul';

export default function EkskulPage() {
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
  } = useEkskul();

  return (
    <>
      {view === 'list' && (
        <EkskulTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={removeItem}
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
        />
      )}
    </>
  );
}
