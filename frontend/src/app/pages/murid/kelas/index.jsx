import React, { useState, useEffect } from 'react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredUser, getStoredProfile } from '@app/shared/services/auth.service';
import { getDisplayName } from '@app/shared/utils/profile';
import { BookOpen, Users, Star } from 'lucide-react';
import apiClient from '@app/shared/services/apiClient';

export default function SiswaKelasPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);
  
  const [kelasData, setKelasData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const { data } = await apiClient.get('/me');
        if (data?.profile?.kelas) {
          setKelasData(data.profile.kelas);
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
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">Informasi Kelas</h2>
        <p className="text-slate-500 mb-6">Melihat data kelas yang Anda masuki saat ini.</p>
        
        {loading ? (
          <div className="py-10 text-center text-slate-400">Memuat data kelas...</div>
        ) : kelasData ? (
          <div className="max-w-xl border border-slate-200 rounded-2xl p-6 bg-blue-50/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <BookOpen size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">{kelasData.nama_kelas}</h3>
                <p className="text-slate-600 font-semibold">Tingkat {kelasData.tingkat} {kelasData.jurusan}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Star size={18} className="text-amber-500" />
                  <span className="font-semibold">Wali Kelas</span>
                </div>
                <span className="font-bold text-slate-800">
                  {kelasData.wali_kelas ? kelasData.wali_kelas.nama_guru : 'Belum Ditugaskan'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Users size={18} className="text-blue-500" />
                  <span className="font-semibold">Kapasitas Murid</span>
                </div>
                <span className="font-bold text-slate-800">
                  {kelasData.jumlah_murid || 0} Siswa
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
            <p>Anda belum dimasukkan ke dalam kelas mana pun.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
