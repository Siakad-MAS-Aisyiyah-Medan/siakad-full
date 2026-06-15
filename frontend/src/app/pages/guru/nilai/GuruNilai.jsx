import React from 'react';
import { Save } from 'lucide-react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { useGuruNilai } from '@app/shared/nilai/guru/hooks/useGuruNilai';
import NilaiFilterForm from '@app/shared/nilai/guru/components/NilaiFilterForm';
import NilaiSiswaTable from '@app/shared/nilai/guru/components/NilaiSiswaTable';

export default function GuruNilaiPage() {
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
    handleNilaiChange,
    loadSiswa,
    saveNilai,
    reset,
  } = useGuruNilai();

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Kelola Nilai Siswa</h2>
            <p>Input nilai tugas, UTS, dan UAS siswa untuk mata pelajaran Anda.</p>
          </div>
        </div>

        {step === 'filter' && (
          <div className="mt-4">
            <NilaiFilterForm
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
              <h3 className="font-semibold text-lg">Input Nilai</h3>
              <button type="button" onClick={reset} className="btn-outline text-sm">
                Batal / Ganti Filter
              </button>
            </div>
            
            <NilaiSiswaTable rows={siswaRows} onChange={handleNilaiChange} />

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="btn-primary"
                onClick={saveNilai}
                disabled={saving}
              >
                <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Nilai'}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
