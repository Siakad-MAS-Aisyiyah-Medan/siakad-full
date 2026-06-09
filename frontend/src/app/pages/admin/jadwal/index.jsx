import React, { useState } from 'react';
import { Calendar, Edit3, BookOpen } from 'lucide-react';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import JadwalClassList from '@app/shared/jadwal/admin/components/JadwalClassList';
import JadwalMatrixUI from '@app/shared/jadwal/admin/components/JadwalMatrixUI';
import MapelTab from '@app/shared/jadwal/admin/components/MapelTab';
import { useJadwal } from '@app/shared/jadwal/admin/hooks/useJadwal';

export default function JadwalPage() {
  const [activeTab, setActiveTab] = useState('lihat'); // 'lihat', 'kelola', 'mapel'

  const {
    view,
    searchQuery,
    setSearchQuery,
    filteredKelas,
    mapelData,
    guruData,
    waktuData,
    matrixData,
    currentKelas,
    tahunAjaran,
    semester,
    loading,
    openMatrix,
    cancelMatrix,
    handleMatrixChange,
    saveMatrix,
    isFetching,
  } = useJadwal();

  // Custom handler to ensure we don't accidentally save in read-only mode
  const handleOpenMatrix = (kelas) => {
    openMatrix(kelas);
  };

  return (
    <AdminPageShell>
      {/* Menu Tab Navigasi */}
      {view === 'list' && (
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('lihat')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'lihat' ? '3px solid #059669' : '3px solid transparent',
              color: activeTab === 'lihat' ? '#059669' : '#64748b',
              fontWeight: activeTab === 'lihat' ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Lihat Jadwal
          </button>
          <button
            onClick={() => setActiveTab('kelola')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'kelola' ? '3px solid #059669' : '3px solid transparent',
              color: activeTab === 'kelola' ? '#059669' : '#64748b',
              fontWeight: activeTab === 'kelola' ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Kelola Jadwal
          </button>
          <button
            onClick={() => setActiveTab('mapel')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'mapel' ? '3px solid #059669' : '3px solid transparent',
              color: activeTab === 'mapel' ? '#059669' : '#64748b',
              fontWeight: activeTab === 'mapel' ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Mata Pelajaran
          </button>
        </div>
      )}

      {/* Konten Tab */}
      {activeTab === 'lihat' && view === 'list' && (
        <JadwalClassList
          kelasData={filteredKelas}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectKelas={handleOpenMatrix}
          isFetching={isFetching}
          isReadOnly={true}
        />
      )}

      {activeTab === 'kelola' && view === 'list' && (
        <JadwalClassList
          kelasData={filteredKelas}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectKelas={handleOpenMatrix}
          isFetching={isFetching}
          isReadOnly={false}
        />
      )}

      {activeTab === 'mapel' && view === 'list' && (
        <MapelTab />
      )}
      
      {view === 'matrix' && (
        <JadwalMatrixUI
          kelas={currentKelas}
          tahunAjaran={tahunAjaran}
          semester={semester}
          waktuData={waktuData}
          matrixData={matrixData}
          mapelData={mapelData}
          guruData={guruData}
          loading={loading}
          onCancel={cancelMatrix}
          onChangeCell={handleMatrixChange}
          onSave={saveMatrix}
          readOnly={activeTab === 'lihat'}
        />
      )}
    </AdminPageShell>
  );
}
