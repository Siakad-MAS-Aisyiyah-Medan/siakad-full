import AdminPageShell from '@/shared/components/AdminPageShell';
import MuridTable from '@/shared/akademik/murid/components/MuridTable';
import MuridForm from '@/shared/akademik/murid/components/MuridForm';
import ImportExcelModal from '@/shared/components/ImportExcelModal';
import { useMurid } from '@/shared/akademik/murid/hooks/useMurid';
import { useState } from 'react';
import apiClient from '@/shared/services/apiClient';

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
    refreshData,
  } = useMurid();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);

  const handleDownloadTemplate = async () => {
    try {
      const response = await apiClient.get('/murid/template-import', {
        responseType: 'blob'
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Template_Import_Siswa.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mengunduh template: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleImportSubmit = async (file, id_kelas) => {
    setIsImporting(true);
    setImportError(null);
    const formDataObj = new FormData();
    formDataObj.append('file', file);
    formDataObj.append('id_kelas', id_kelas);

    try {
      const response = await apiClient.post('/murid/import', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsImportModalOpen(false);
      if (refreshData) refreshData();
      alert('Berhasil mengimport data siswa');
    } catch (err) {
      setImportError(err.response?.data?.message || err.message);
    } finally {
      setIsImporting(false);
    }
  };

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
          onImport={view === 'add' && !readOnly ? () => setIsImportModalOpen(true) : undefined}
        />
      )}

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Unggah Spreadsheet Murid"
        requiresClass={true}
        loading={isImporting}
        error={importError}
        onDownloadTemplate={handleDownloadTemplate}
        onSubmit={handleImportSubmit}
      />
    </AdminPageShell>
  );
}
