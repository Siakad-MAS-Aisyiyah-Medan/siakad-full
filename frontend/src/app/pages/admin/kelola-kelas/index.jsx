import AdminPageShell from '@app/shared/components/AdminPageShell';
import KelasTable from '@app/shared/akademik/kelas/components/KelasTable';
import KelasForm from '@app/shared/akademik/kelas/components/KelasForm';
import { useKelas } from '@app/shared/akademik/kelas/hooks/useKelas';

export default function KelasPage() {
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
    removeKelas,
  } = useKelas();

  return (
    <AdminPageShell>
      {view === 'list' && (
        <KelasTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={removeKelas}
        />
      )}
      {(view === 'add' || view === 'edit') && (
        <KelasForm
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
