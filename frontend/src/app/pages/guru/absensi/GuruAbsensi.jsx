import React from 'react';
import { Save } from 'lucide-react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { useGuruAbsensi } from './hooks/useGuruAbsensi';
import AbsensiFilterForm from './components/AbsensiFilterForm';
import AbsensiSiswaTable from './components/AbsensiSiswaTable';

export default function GuruAbsensiPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  const {
    step,
    meta,
    kelasList,
    mapelList,
    siswaRows,
    loading,
    saving,
    handleMetaChange,
    loadSiswa,
    handleStatusChange,
    saveAbsensi,
    reset,
  } = useGuruAbsensi();

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Kelola Absensi Siswa</h2>
            <p>Catat kehadiran siswa berdasarkan kelas dan mata pelajaran.</p>
          </div>
        </div>

        {step === 'filter' && (
          <div className="mt-4">
            <AbsensiFilterForm
              meta={meta}
              kelasList={kelasList}
              mapelList={mapelList}
              loading={loading}
              onChange={handleMetaChange}
              onSubmit={loadSiswa}
            />
          </div>
        )}

        {step === 'input' && (
          <div className="mt-4 form-panel glass p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Input Kehadiran</h3>
              <button type="button" onClick={reset} className="btn-outline text-sm">
                Batal / Ganti Filter
              </button>
            </div>
            
            <AbsensiSiswaTable rows={siswaRows} onChange={handleStatusChange} />

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="btn-primary"
                onClick={saveAbsensi}
                disabled={saving}
              >
                <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Absensi'}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
