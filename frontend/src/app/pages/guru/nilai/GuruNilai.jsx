import { useState } from 'react';
import { Save, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { useGuruNilai } from '@app/shared/nilai/guru/hooks/useGuruNilai';
import NilaiFilterForm from '@app/shared/nilai/guru/components/NilaiFilterForm';
import NilaiSiswaTable from '@app/shared/nilai/guru/components/NilaiSiswaTable';
import Swal from 'sweetalert2';

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

  const [daftarList, setDaftarList] = useState(() =>
    JSON.parse(localStorage.getItem('mock_daftar_nilai') || '[]')
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddDaftar = async (e) => {
    e.preventDefault();
    setShowAddModal(false);
    
    // Save to mock list
    const newList = [...daftarList, { ...meta, id_daftar: Date.now(), status: 'Draft' }];
    localStorage.setItem('mock_daftar_nilai', JSON.stringify(newList));
    setDaftarList(newList);
    
    Swal.fire('Sukses', 'Daftar Nilai berhasil ditambahkan', 'success');
  };

  const handleDelete = (id_daftar) => {
    Swal.fire({
      title: 'Hapus Daftar Nilai?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus'
    }).then((res) => {
      if (res.isConfirmed) {
        const newList = daftarList.filter(d => d.id_daftar !== id_daftar);
        localStorage.setItem('mock_daftar_nilai', JSON.stringify(newList));
        setDaftarList(newList);
        Swal.fire('Sukses', 'Daftar Nilai dihapus', 'success');
      }
    });
  };

  const handleIsi = (daftar) => {
    // Set meta to this daftar
    handleMetaChange({ target: { name: 'id_kelas', value: daftar.id_kelas } });
    handleMetaChange({ target: { name: 'id_mapel', value: daftar.id_mapel } });
    handleMetaChange({ target: { name: 'tahun_ajaran', value: daftar.tahun_ajaran } });
    handleMetaChange({ target: { name: 'semester', value: daftar.semester } });
    
    // Load siswa with forced meta
    loadSiswa(daftar);
  };

  const handleSelesaikan = (daftar) => {
    Swal.fire({
      title: 'Selesaikan Daftar Nilai?',
      text: 'Nilai yang sudah diselesaikan akan masuk ke Transkrip',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Diselesaikan'
    }).then((res) => {
      if (res.isConfirmed) {
        const newList = daftarList.map(d => d.id_daftar === daftar.id_daftar ? { ...d, status: 'Selesai' } : d);
        localStorage.setItem('mock_daftar_nilai', JSON.stringify(newList));
        setDaftarList(newList);
        Swal.fire('Sukses', 'Status Daftar Nilai menjadi selesai', 'success');
      }
    });
  };

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="data-panel view-list">
        <div className="panel-header glass">
          <div className="header-text">
            <h2>Kelola Nilai Akademik</h2>
            <p>Manajemen daftar nilai siswa sesuai tahun ajaran dan kelas.</p>
          </div>
          {step === 'filter' && (
            <div className="header-actions">
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                <Plus size={18} /> Tambah Daftar Nilai
              </button>
            </div>
          )}
        </div>

        {step === 'filter' && !showAddModal && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun/Semester</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas & Mapel</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {daftarList.length > 0 ? daftarList.map(daftar => {
                  const kelas = kelasList.find(k => Number(k.id_kelas) === Number(daftar.id_kelas))?.nama_kelas || 'Semua';
                  const mapel = mapelList.find(m => Number(m.id_mapel) === Number(daftar.id_mapel))?.nama_mapel || 'Semua';
                  return (
                    <tr key={daftar.id_daftar} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-semibold text-slate-700">{daftar.tahun_ajaran} - {daftar.semester}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{mapel}</div>
                        <div className="text-sm text-slate-500">Kelas: {kelas}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${daftar.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {daftar.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleIsi(daftar)} className="btn-outline h-8 px-3 text-xs" disabled={daftar.status === 'Selesai'}>
                            <Edit2 size={14} className="mr-1" /> {daftar.status === 'Selesai' ? 'Lihat' : 'Isi Daftar'}
                          </button>
                          {daftar.status !== 'Selesai' && (
                            <button onClick={() => handleSelesaikan(daftar)} className="btn-primary h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 border-none">
                              <CheckCircle size={14} className="mr-1" /> Diselesaikan
                            </button>
                          )}
                          <button onClick={() => handleDelete(daftar.id_daftar)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-slate-500">Belum ada daftar nilai. Klik Tambah Daftar Nilai.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showAddModal && (
          <div className="mt-4 form-panel glass p-6">
            <h3 className="font-semibold text-lg mb-4">Tambah Daftar Nilai Baru</h3>
            <form onSubmit={handleAddDaftar}>
              <NilaiFilterForm
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
              <h3 className="font-semibold text-lg">Mengisi Daftar Nilai Murid</h3>
              <button type="button" onClick={reset} className="btn-outline text-sm">
                Kembali
              </button>
            </div>
            
            <NilaiSiswaTable siswaRows={siswaRows} onChange={handleNilaiChange} />

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
