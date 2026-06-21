import AdminPageShell from '@/shared/components/AdminPageShell';
import KelasTable from '@/shared/akademik/kelas/components/KelasTable';
import KelasForm from '@/shared/akademik/kelas/components/KelasForm';
import { useKelas } from '@/shared/akademik/kelas/hooks/useKelas';

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
    tahunAjaranData,
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
          tahunAjaranData={tahunAjaranData}
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
