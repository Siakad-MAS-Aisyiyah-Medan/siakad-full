import React, { useState, useEffect } from 'react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { Layers } from 'lucide-react';
import apiClient from '@app/shared/services/apiClient';

export default function GuruMapelPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  
  const [mapelList, setMapelList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const { data } = await apiClient.get('/guru/jadwal');
        if (data?.data) {
          const uniqueMapel = [];
          const mapelIds = new Set();
          data.data.forEach(j => {
            if (j.mapel && !mapelIds.has(j.id_mapel)) {
              mapelIds.add(j.id_mapel);
              uniqueMapel.push(j.mapel);
            }
          });
          setMapelList(uniqueMapel);
        }
      } catch (err) {
        console.error('Failed to load mapel', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMapel();
  }, []);

  return (
    <MainLayout role={user?.role} name={name}>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">Mata Pelajaran yang Diampu</h2>
        <p className="text-slate-500 mb-6">Daftar mata pelajaran yang menjadi tanggung jawab Anda.</p>
        
        {loading ? (
          <div className="py-10 text-center text-slate-400">Memuat data mapel...</div>
        ) : mapelList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mapelList.map(mapel => (
              <div key={mapel.id_mapel} className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{mapel.nama_mapel}</h3>
                  <p className="text-sm text-slate-500">Kelompok: {mapel.kelompok_mapel || 'Umum'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            <Layers size={48} className="mx-auto mb-3 opacity-20" />
            <p>Tidak ada mata pelajaran yang diampu.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
