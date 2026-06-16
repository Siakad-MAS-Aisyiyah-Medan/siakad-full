import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit2, Trash2 } from 'lucide-react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { useGuruAbsensi } from './hooks/useGuruAbsensi';
import AbsensiFilterForm from './components/AbsensiFilterForm';
import AbsensiSiswaTable from './components/AbsensiSiswaTable';
import Swal from 'sweetalert2';

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

  const [daftarList, setDaftarList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const storedDaftar = JSON.parse(localStorage.getItem('mock_daftar_absensi') || '[]');
    setDaftarList(storedDaftar);
  }, [step]);

  const handleAddDaftar = async (e) => {
    e.preventDefault();
    setShowAddModal(false);
    
    const newList = [...daftarList, { ...meta, id_daftar: Date.now() }];
    localStorage.setItem('mock_daftar_absensi', JSON.stringify(newList));
    setDaftarList(newList);
    
    Swal.fire('Sukses', 'Data Absensi berhasil ditambahkan', 'success');
  };

  const handleDelete = (id_daftar) => {
    Swal.fire({
      title: 'Hapus Data Absensi?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus'
    }).then((res) => {
      if (res.isConfirmed) {
        const newList = daftarList.filter(d => d.id_daftar !== id_daftar);
        localStorage.setItem('mock_daftar_absensi', JSON.stringify(newList));
        setDaftarList(newList);
        Swal.fire('Sukses', 'Data Absensi dihapus', 'success');
      }
    });
  };

  const handleIsi = (daftar) => {
    handleMetaChange({ target: { name: 'id_kelas', value: daftar.id_kelas } });
    handleMetaChange({ target: { name: 'id_mapel', value: daftar.id_mapel } });
    handleMetaChange({ target: { name: 'tanggal', value: daftar.tanggal } });
    handleMetaChange({ target: { name: 'jam_mulai', value: daftar.jam_mulai } });
    handleMetaChange({ target: { name: 'jam_selesai', value: daftar.jam_selesai } });
    
    loadSiswa(daftar);
  };

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Kelola Absensi Siswa</h2>
            <p>Manajemen data absensi murid pada setiap pertemuan.</p>
          </div>
          {step === 'filter' && (
            <div className="header-actions">
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                <Plus size={18} /> Tambah Data Absensi
              </button>
            </div>
          )}
        </div>

        {step === 'filter' && !showAddModal && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal & Waktu</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas & Mapel</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {daftarList.length > 0 ? daftarList.map(daftar => {
                  const kelas = kelasList.find(k => Number(k.id_kelas) === Number(daftar.id_kelas))?.nama_kelas || 'Semua';
                  const mapel = mapelList.find(m => Number(m.id_mapel) === Number(daftar.id_mapel))?.nama_mapel || 'Semua';
                  return (
                    <tr key={daftar.id_daftar} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">{daftar.tanggal}</div>
                        <div className="text-sm text-slate-500">{daftar.jam_mulai} - {daftar.jam_selesai}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{mapel}</div>
                        <div className="text-sm text-slate-500">Kelas: {kelas}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleIsi(daftar)} className="btn-outline h-8 px-3 text-xs">
                            <Edit2 size={14} className="mr-1" /> Isi Absensi
                          </button>
                          <button onClick={() => handleDelete(daftar.id_daftar)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="3" className="text-center py-12 text-slate-500">Belum ada data absensi. Klik Tambah Data Absensi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showAddModal && (
          <div className="mt-4 form-panel glass p-6">
            <h3 className="font-semibold text-lg mb-4">Tambah Data Absensi Baru</h3>
            <form onSubmit={handleAddDaftar}>
              <AbsensiFilterForm
                meta={meta}
                kelasList={kelasList}
                mapelList={mapelList}
                loading={loading}
                onChange={handleMetaChange}
                onSubmit={handleAddDaftar}
              />
              <div className="flex justify-end mt-4 gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-outline">Batal</button>
              </div>
            </form>
          </div>
        )}

        {step === 'input' && (
          <div className="mt-4 form-panel glass p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Mengisi Absensi Murid</h3>
              <button type="button" onClick={reset} className="btn-outline text-sm">
                Kembali
              </button>
            </div>
            
            <AbsensiSiswaTable siswaRows={siswaRows} onStatusChange={handleStatusChange} />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="btn-outline"
                onClick={reset}
              >
                Batal
              </button>
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
