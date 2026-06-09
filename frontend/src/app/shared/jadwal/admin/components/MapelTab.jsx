import React from 'react';
import MapelTable from '@app/shared/akademik/mapel/components/MapelTable';
import MapelForm from '@app/shared/akademik/mapel/components/MapelForm';
import { useMapel } from '@app/shared/akademik/mapel/hooks/useMapel';

export default function MapelTab() {
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
    removeMapel,
    isFetching,
  } = useMapel();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {view === 'list' && (
        <MapelTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={removeMapel}
          isFetching={isFetching}
        />
      )}
      {(view === 'add' || view === 'edit') && (
        <MapelForm
          view={view}
          formData={formData}
          guruData={guruData}
          loading={loading}
          onChange={handleChange}
          onSubmit={submitForm}
          onCancel={cancelForm}
        />
      )}
    </div>
  );
}
