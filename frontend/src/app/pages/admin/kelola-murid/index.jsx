import AdminPageShell from '@app/shared/components/AdminPageShell';
import MuridTable from '@app/shared/akademik/murid/components/MuridTable';
import MuridForm from '@app/shared/akademik/murid/components/MuridForm';
import { useMurid } from '@app/shared/akademik/murid/hooks/useMurid';

export default function MuridPage({ readOnly = false }) {
  const {
    view,
    searchQuery,
    setSearchQuery,
    filteredData,
    isFetching,
    formData,
    loading,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    promoteMurid,
    removeMurid,
  } = useMurid();

  return (
    <AdminPageShell>
      {view === 'list' ? (
        <MuridTable
          data={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPromote={readOnly ? undefined : promoteMurid}
          onDelete={readOnly ? undefined : removeMurid}
          onEdit={readOnly ? undefined : openEdit}
          isFetching={isFetching}
          readOnly={readOnly}
          onAdd={readOnly ? undefined : openAdd}
        />
      ) : (
        <MuridForm
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
