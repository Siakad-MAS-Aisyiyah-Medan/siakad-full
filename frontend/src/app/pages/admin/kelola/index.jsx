import AdminPageShell from '@app/shared/components/AdminPageShell';
import GuruTable from '@app/shared/akademik/guru/components/GuruTable';
import GuruForm from '@app/shared/akademik/guru/components/GuruForm';
import { useGuru } from '@app/shared/akademik/guru/hooks/useGuru';
import { useState } from 'react';
import AbsensiGuruView from './AbsensiGuruView';

export default function GuruPage({ readOnly = false }) {
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
    removeGuru,
    isFetching,
  } = useGuru();

  return (
    <AdminPageShell>

      {view === 'list' && (
        <GuruTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={readOnly ? undefined : openAdd}
          onEdit={readOnly ? undefined : openEdit}
          onDelete={readOnly ? undefined : removeGuru}
          isFetching={isFetching}
          readOnly={readOnly}
        />
      )}
      {(view === 'add' || view === 'edit') && (
        <GuruForm
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
