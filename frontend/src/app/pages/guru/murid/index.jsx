import React, { useState } from 'react';
import { Users, Search } from 'lucide-react';
import MainLayout from '@app/shared/layouts/MainLayout';
import PageHeader from '@app/shared/components/PageHeader';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import AbsensiFilterForm from '../absensi/components/AbsensiFilterForm';
import { useGuruAbsensi } from '../absensi/hooks/useGuruAbsensi';

export default function GuruMuridPage() {
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
    handleMetaChange,
    loadSiswa,
    reset,
  } = useGuruAbsensi();

  const [search, setSearch] = useState('');

  const filteredSiswa = siswaRows.filter(s => 
    s.nama_siswa?.toLowerCase().includes(search.toLowerCase()) || 
    s.nisn?.includes(search)
  );

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="data-panel view-list" style={{ paddingTop: '1rem' }}>
        <PageHeader title="Data Murid" subtitle="Daftar murid pada kelas dan mata pelajaran yang Anda ampu." />

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
              <h3 className="font-semibold text-lg">
                Daftar Murid - {kelasList.find(k => k.id_kelas == meta.id_kelas)?.nama_kelas}
              </h3>
              <button type="button" onClick={reset} className="btn-outline text-sm">
                Ganti Kelas
              </button>
            </div>
            
            <div className="mb-4">
              <div className="search-bar relative max-w-sm">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama / NISN..."
                  className="input-field pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th width="50">No</th>
                    <th>NISN</th>
                    <th>Nama Siswa</th>
                    <th>L/P</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSiswa.map((s, idx) => (
                    <tr key={s.id_siswa}>
                      <td>{idx + 1}</td>
                      <td>{s.nisn || '-'}</td>
                      <td>{s.nama_siswa}</td>
                      <td>{s.jenis_kelamin}</td>
                    </tr>
                  ))}
                  {filteredSiswa.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-slate-500 py-4">
                        Tidak ada data murid.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
