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

  const [activeTab, setActiveTab] = useState('data');

  return (
    <AdminPageShell>
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('data')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'data' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'data' ? 'var(--color-primary)' : '#64748b',
            fontWeight: activeTab === 'data' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Data Guru & Pegawai
        </button>
        <button
          onClick={() => setActiveTab('absensi')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'absensi' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'absensi' ? 'var(--color-primary)' : '#64748b',
            fontWeight: activeTab === 'absensi' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Absensi Guru
        </button>
      </div>

      {activeTab === 'data' && view === 'list' && (
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
      {activeTab === 'data' && (view === 'add' || view === 'edit') && (
        <GuruForm
          view={view}
          formData={formData}
          loading={loading}
          onChange={handleChange}
          onSubmit={submitForm}
          onCancel={cancelForm}
        />
      )}

      {activeTab === 'absensi' && <AbsensiGuruView />}
    </AdminPageShell>
  );
}
