import AdminPageShell from '@app/shared/components/AdminPageShell';
import GuruTable from '@app/shared/akademik/guru/components/GuruTable';
import GuruForm from '@app/shared/akademik/guru/components/GuruForm';
import { useGuru } from '@app/shared/akademik/guru/hooks/useGuru';
import { useState } from 'react';
import AbsensiGuruView from './AbsensiGuruView';

export default function GuruPage() {
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
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={removeGuru}
          isFetching={isFetching}
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
        />
      )}

    </AdminPageShell>
  );
}
