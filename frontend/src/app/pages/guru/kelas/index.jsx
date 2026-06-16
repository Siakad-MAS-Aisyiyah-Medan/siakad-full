import React, { useState, useEffect } from 'react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { BookOpen } from 'lucide-react';
import apiClient from '@app/shared/services/apiClient';

export default function GuruKelasPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        // Fetch jadwal and extract unique classes
        const { data } = await apiClient.get('/guru/jadwal');
        if (data?.data) {
          const uniqueClasses = [];
          const classIds = new Set();
          data.data.forEach(j => {
            if (j.kelas && !classIds.has(j.id_kelas)) {
              classIds.add(j.id_kelas);
              uniqueClasses.push(j.kelas);
            }
          });
          setKelasList(uniqueClasses);
        }
      } catch (err) {
        console.error('Failed to load kelas', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKelas();
  }, []);

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">Data Kelas yang Diajar</h2>
        <p className="text-slate-500 mb-6">Daftar kelas di mana Anda mengajar berdasarkan jadwal pelajaran.</p>
        
        {loading ? (
          <div className="py-10 text-center text-slate-400">Memuat data kelas...</div>
        ) : kelasList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kelasList.map(kelas => (
              <div key={kelas.id_kelas} className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{kelas.nama_kelas}</h3>
                  <p className="text-sm text-slate-500">Tingkat {kelas.tingkat} {kelas.jurusan}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
            <p>Tidak ada kelas yang diajar.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
