import { Search, Plus, Edit2, Trash2, BookOpen, User, Layers, GraduationCap } from 'lucide-react';

export default function MapelTable({
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
      <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">
            Mata Pelajaran
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Daftar mata pelajaran, tingkatan, dan guru pengampu.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={16} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Cari mata pelajaran..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full md:w-64 bg-white border border-slate-200 text-slate-800 text-[14px] font-semibold rounded-full pl-10 pr-4 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-medium placeholder:text-slate-400"
            />
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={onAdd}
              className="btn-primary h-10 px-5 rounded-full font-bold flex items-center gap-2 shadow-sm shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden md:inline">Tambah Mapel</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest" style={{ paddingLeft: '32px', paddingRight: '16px' }}>Mata Pelajaran</th>
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-4">Tingkat & Kelompok</th>
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-4">Guru Pengampu</th>
              <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right" style={{ paddingLeft: '16px', paddingRight: '32px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isFetching ? (
              <tr>
                <td colSpan="4" className="text-center py-20">
                  <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-semibold text-slate-500">Memuat mata pelajaran...</p>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((mapel) => (
                <tr key={mapel.id_mapel} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-5" style={{ paddingLeft: '32px', paddingRight: '16px' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <BookOpen size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[15px]">{mapel.nama_mapel}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-5 px-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                        <GraduationCap size={14} className="text-slate-400" /> Kelas {mapel.tingkat || 'Semua'}
                      </p>
                      <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                        <Layers size={14} className="text-slate-400" /> {mapel.kelompok_mapel || <span className="text-slate-400 italic">Umum</span>}
                      </p>
                    </div>
                  </td>

                  <td className="py-5 px-4">
                    {mapel.guru?.guru?.nama_guru ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 overflow-hidden font-bold text-xs border border-slate-300">
                          {mapel.guru.guru.foto ? (
                            <img src={mapel.guru.guru.foto} alt="Guru" className="w-full h-full object-cover" />
                          ) : (
                            mapel.guru.guru.nama_guru.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{mapel.guru.guru.nama_guru}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        <User size={12} strokeWidth={3} /> Belum Ditentukan
                      </span>
                    )}
                  </td>

                  <td className="py-5 text-right" style={{ paddingLeft: '16px', paddingRight: '32px' }}>
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit && onEdit(mapel)}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center transition-colors"
                        title={readOnly ? "Detail Mapel" : "Edit Mapel"}
                      >
                        {readOnly ? <Search size={14} strokeWidth={2.5} /> : <Edit2 size={14} strokeWidth={2.5} />}
                      </button>
                      {!readOnly && (
                        <button
                          onClick={() => onDelete && onDelete(mapel.id_mapel)}
                          className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors"
                          title="Hapus Mapel"
                        >
                          <Trash2 size={14} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">Tidak ada data mata pelajaran</p>
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
