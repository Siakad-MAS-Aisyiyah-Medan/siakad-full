import { Search, Plus, Edit2, Trash2, MapPin, Users, Building, AlertCircle } from 'lucide-react';

export default function KelasTable({
  filteredData,
  searchQuery,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
  isFetching = false,
  readOnly = false,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest" style={{ paddingLeft: '32px', paddingRight: '16px' }}>Detail Kelas</th>
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-4">Wali Kelas</th>
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-4">Kapasitas & Lokasi</th>
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right" style={{ paddingLeft: '16px', paddingRight: '32px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isFetching ? (
              <tr>
                <td colSpan="4" className="py-20">
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                    <p className="text-sm font-semibold text-slate-500 text-center">Memuat data kelas...</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((kelas) => {
                const overcapacity = kelas.jumlah_siswa > (kelas.kapasitas_maksimal || 36);
                return (
                  <tr key={kelas.id_kelas} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-5" style={{ paddingLeft: '32px', paddingRight: '16px' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 font-black text-lg">
                          {kelas.tingkat || 'X'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-[15px]">{kelas.nama_kelas}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              Kelas {kelas.tingkat || '-'}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                              {kelas.jurusan || '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-5 px-4">
                      {kelas.wali_kelas?.guru?.nama_guru ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs border border-slate-300">
                            {kelas.wali_kelas.guru.foto ? (
                              <img src={kelas.wali_kelas.guru.foto} alt="Wali" className="w-full h-full object-cover" />
                            ) : (
                              kelas.wali_kelas.guru.nama_guru.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{kelas.wali_kelas.guru.nama_guru}</p>
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Wali Kelas Definitif</p>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                          <AlertCircle size={12} strokeWidth={3} /> Belum Ditentukan
                        </span>
                      )}
                    </td>

                    <td className="py-5 px-4">
                      <div className="space-y-2">
                        <p className={`text-xs font-semibold flex items-center gap-2 ${overcapacity ? 'text-rose-600' : 'text-slate-600'}`}>
                          <Users size={14} className={overcapacity ? 'text-rose-500' : 'text-slate-400'} /> 
                          {kelas.jumlah_siswa} / {kelas.kapasitas_maksimal || 36} Siswa 
                          {overcapacity && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-sm font-bold ml-1">Penuh</span>}
                        </p>
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                          <MapPin size={14} className="text-slate-400" /> {kelas.ruangan || <span className="text-slate-400 italic">Ruangan belum diatur</span>}
                        </p>
                      </div>
                    </td>

                    <td className="py-5 text-right" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit && onEdit(kelas)}
                          className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center transition-colors"
                          title={readOnly ? "Detail Kelas" : "Edit Kelas"}
                        >
                          {readOnly ? <Search size={14} strokeWidth={2.5} /> : <Edit2 size={14} strokeWidth={2.5} />}
                        </button>
                        {!readOnly && (
                          <button
                            onClick={() => onDelete && onDelete(kelas.id_kelas)}
                            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors"
                            title="Hapus Kelas"
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
                    <Building size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">Tidak ada data kelas</p>
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
