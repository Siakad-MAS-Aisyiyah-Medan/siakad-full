import AdminPageShell from '@app/shared/components/AdminPageShell';
import KelasTable from '@app/shared/akademik/kelas/components/KelasTable';
import KelasForm from '@app/shared/akademik/kelas/components/KelasForm';
import { useKelas } from '@app/shared/akademik/kelas/hooks/useKelas';

export default function KelasPage({ readOnly = false }) {
  const {
    view,
    searchQuery,
    setSearchQuery,
    filteredData,
    openAdd,
    openEdit,
    cancelForm,
    guruData,
    formData,
    loading,
    handleChange,
    submitForm,
    removeKelas,
    isFetching,
  } = useKelas();

  return (
    <AdminPageShell>
      {view === 'list' ? (
        <KelasTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={readOnly ? undefined : openAdd}
          onEdit={readOnly ? undefined : openEdit}
          onDelete={readOnly ? undefined : removeKelas}
          isFetching={isFetching}
          readOnly={readOnly}
        />
      ) : (
        <KelasForm
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
