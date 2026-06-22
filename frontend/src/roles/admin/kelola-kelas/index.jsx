import AdminPageShell from '@/shared/components/AdminPageShell';
import KelasTable from '@/shared/akademik/kelas/components/KelasTable';
import KelasForm from '@/shared/akademik/kelas/components/KelasForm';
import KelasDetailMurid from '@/shared/akademik/kelas/components/KelasDetailMurid';
import { useKelas } from '@/shared/akademik/kelas/hooks/useKelas';
import { useState } from 'react';

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

  const [selectedKelas, setSelectedKelas] = useState(null);

  return (
    <AdminPageShell>
      {selectedKelas ? (
        <KelasDetailMurid 
          kelas={selectedKelas} 
          onBack={() => setSelectedKelas(null)} 
        />
      ) : view === 'list' ? (
        <KelasTable
          filteredData={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={readOnly ? undefined : openAdd}
          onEdit={readOnly ? undefined : openEdit}
          onDelete={readOnly ? undefined : removeKelas}
          onViewStudents={(kelas) => setSelectedKelas(kelas)}
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
