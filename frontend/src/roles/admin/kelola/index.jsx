import AdminPageShell from '@/shared/components/AdminPageShell';
import GuruTable from '@/shared/akademik/guru/components/GuruTable';
import GuruForm from '@/shared/akademik/guru/components/GuruForm';
import ImportExcelModal from '@/shared/components/ImportExcelModal';
import { useGuru } from '@/shared/akademik/guru/hooks/useGuru';
import { useState } from 'react';
import apiClient from '@/shared/services/apiClient';

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
    refreshData,
  } = useGuru();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);

  const handleDownloadTemplate = async () => {
    try {
      const response = await apiClient.get('/guru/template-import', {
        responseType: 'blob'
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_Import_Guru.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mengunduh template: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImportSubmit = async (file) => {
    setIsImporting(true);
    setImportError(null);
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await apiClient.post('/guru/import', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsImportModalOpen(false);
      if (refreshData) refreshData();
      alert('Berhasil mengimport data guru');
    } catch (err) {
      setImportError(err.response?.data?.message || err.message);
    } finally {
      setIsImporting(false);
    }
  };

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
          onImport={readOnly ? undefined : () => setIsImportModalOpen(true)}
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

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Data Guru"
        requiresClass={false}
        loading={isImporting}
        error={importError}
        onDownloadTemplate={handleDownloadTemplate}
        onSubmit={handleImportSubmit}
      />
    </AdminPageShell>
  );
}
