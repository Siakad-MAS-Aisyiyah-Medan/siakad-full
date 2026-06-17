import { Search, Plus, Edit2, Trash2, UserX, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export default function GuruTable({
  filteredData,
  searchQuery,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
  isFetching = false,
  readOnly = false,
}) {
  const handleExport = () => {
    import('@app/shared/utils/exportCsv').then(({ exportToCsv }) => {
      const dataToExport = filteredData.map(user => ({
        'NIP/NUPTK': user.guru?.nip_nuptk || '',
        'Nama Guru': user.guru?.nama_guru || '',
        'Jenis Kelamin': user.guru?.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
        'No HP': user.guru?.no_hp || '',
        'Alamat': user.guru?.alamat || '',
        'Role': 'Guru',
        'Status': user.guru?.status === 'nonaktif' ? 'Nonaktif' : 'Aktif'
      }));
      exportToCsv('data_guru.csv', dataToExport);
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="px-4 md:px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">
            Data Guru & Pegawai
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manajemen tenaga pendidik beserta hak akses sistem.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={16} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Cari guru..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:w-64 bg-white border border-slate-200 text-slate-800 text-[14px] font-semibold rounded-full pl-10 pr-4 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-medium placeholder:text-slate-400"
            />
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={onAdd}
              className="btn-primary h-10 px-5 rounded-full font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all w-full sm:w-auto"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="inline">Tambah Guru</span>
            </button>
          )}
          {readOnly && (
            <button
              type="button"
              onClick={handleExport}
              className="btn-outline h-10 px-5 rounded-full font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            >
              <span className="inline">Unduh Data</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest" style={{ paddingLeft: '32px', paddingRight: '32px' }}>Profil Guru</th>
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest" style={{ paddingLeft: '32px', paddingRight: '32px' }}>Kontak & Alamat</th>
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest" style={{ paddingLeft: '32px', paddingRight: '32px' }}>Status & Posisi</th>
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right" style={{ paddingLeft: '32px', paddingRight: '32px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isFetching ? (
              <tr>
                <td colSpan="4" className="py-20">
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                    <p className="text-sm font-semibold text-slate-500 text-center">Memuat data guru...</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((user) => {
                const profile = user.guru || user.profile || {};
                return (
                  <tr key={user.id_user} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-5" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-slate-200">
                          {profile.foto ? (
                            <img src={profile.foto} alt="Foto" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg font-bold text-slate-400">
                              {(profile.nama_guru || 'G').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-[15px]">{profile.nama_guru || '-'}</p>
                          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                            <span className="text-slate-700 font-semibold">{profile.nip_nuptk || '-'}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{profile.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-5" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                          <Phone size={12} className="text-slate-400 shrink-0" /> {profile.no_hp || '-'}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500 flex items-start gap-2 max-w-[200px]">
                          <MapPin size={12} className="text-slate-400 mt-0.5 shrink-0" /> <span className="line-clamp-2">{profile.alamat || '-'}</span>
                        </p>
                      </div>
                    </td>

                    <td className="py-5" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                      <div className="flex flex-col gap-2 items-start">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                          Guru
                        </span>
                        
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          (!profile.status || profile.status === 'aktif')
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${(!profile.status || profile.status === 'aktif') ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          {profile.status === 'nonaktif' ? 'Nonaktif' : 'Aktif'}
                        </span>
                      </div>
                    </td>

                    <td className="py-5 text-right" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit && onEdit(user)}
                          className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center transition-colors"
                          title={readOnly ? "Detail Guru" : "Edit Guru"}
                        >
                          {readOnly ? <Search size={14} strokeWidth={2.5} /> : <Edit2 size={14} strokeWidth={2.5} />}
                        </button>
                        {!readOnly && (
                          <button
                            onClick={() => onDelete && onDelete(user.id_user)}
                            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors"
                            title="Hapus Guru"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserX size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">Tidak ada data guru</p>
                  <p className="text-xs font-medium text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
