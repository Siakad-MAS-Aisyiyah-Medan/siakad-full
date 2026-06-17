import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Layers, Search, User } from 'lucide-react';
import MainLayout from '@app/shared/layouts/MainLayout';
import { getStoredProfile, getStoredUser } from '@app/shared/services/auth.service';
import apiClient from '@app/shared/services/apiClient';
import { getDisplayName } from '@app/shared/utils/profile';

export default function SiswaMapelPage() {
  const user = getStoredUser();
  const profile = getStoredProfile();
  const name = getDisplayName(profile, user?.role, user?.username);

  const [mapelList, setMapelList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMapel = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/mapel');
        const payload = response.data?.data;
        const items = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        setMapelList(items);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat mata pelajaran');
      } finally {
        setLoading(false);
      }
    };

    fetchMapel();
  }, []);

  const filteredMapel = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return mapelList;
    return mapelList.filter((mapel) => {
      const guru = mapel.guru?.guru?.nama_guru || mapel.guru?.profile?.nama_guru || '';
      return [
        mapel.nama_mapel,
        mapel.tingkat,
        mapel.kelompok_mapel,
        guru,
      ].some((value) => String(value || '').toLowerCase().includes(keyword));
    });
  }, [mapelList, search]);

  return (
    <MainLayout role="siswa" name={name}>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 md:px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Mata Pelajaran</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Daftar mata pelajaran yang tersedia dalam sistem akademik sekolah.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari mata pelajaran..."
              className="w-full bg-white border border-slate-200 text-slate-800 text-sm font-semibold rounded-full pl-10 pr-4 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {error && (
          <div className="m-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="p-4 md:p-8">
          {loading ? (
            <div className="py-16 text-center text-slate-400">Memuat mata pelajaran...</div>
          ) : filteredMapel.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMapel.map((mapel) => {
                const guru = mapel.guru?.guru?.nama_guru || mapel.guru?.profile?.nama_guru;
                return (
                  <div key={mapel.id_mapel} className="border border-slate-200 rounded-2xl p-5 bg-white hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <BookOpen size={24} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-slate-800">{mapel.nama_mapel}</h3>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                          <Layers size={14} /> Kelas {mapel.tingkat || 'Semua'} - {mapel.kelompok_mapel || 'Umum'}
                        </p>
                        <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                          <User size={14} /> {guru || 'Guru belum ditentukan'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              <BookOpen size={48} className="mx-auto mb-3 opacity-20" />
              <p>Tidak ada mata pelajaran yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
