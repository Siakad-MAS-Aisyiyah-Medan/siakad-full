import { Search, Plus, Edit2, Trash2, Megaphone, Users, Lock, FileText } from 'lucide-react';

export default function PengumumanTable({
  items = [],
  filteredData,
  searchQuery,
  onSearchChange,
  filterAkses,
  setFilterAkses,
  onAdd,
  onEdit,
  onDelete,
  isFetching = false,
  readOnly = false,
}) {
  const totalPengumuman = items.length;
  const pengumumanUmum = items.filter((p) => p.akses === 'umum').length;
  const pengumumanInternal = items.filter((p) => p.akses === 'internal').length;

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER RINGKAS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pengumuman Sekolah</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola informasi penting untuk ekosistem sekolah.</p>
        </div>
        {!readOnly && (
          <button type="button" onClick={onAdd} className="btn-primary w-full md:w-auto justify-center py-2.5 px-6 rounded-xl font-bold flex items-center gap-2 shadow-sm shadow-primary/30 hover:shadow-primary/50 transition-all">
            <Plus size={18} strokeWidth={2.5} /> Tambah Pengumuman
          </button>
        )}
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
            <Megaphone size={26} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Pengumuman</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-0.5">{totalPengumuman}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Users size={26} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pengumuman Umum</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-0.5">{pengumumanUmum}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Lock size={26} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pengumuman Internal</p>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-0.5">{pengumumanInternal}</h3>
          </div>
        </div>
      </div>

      {/* FILTER & TABEL */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white min-h-[76px] px-4 md:px-8 py-4 md:py-0">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 h-full py-4 overflow-x-auto w-full md:w-auto hide-scrollbar">
            {['semua', 'umum', 'internal'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterAkses(tab)}
                className={`flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold capitalize transition-all ${
                  filterAkses === tab
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center bg-white border border-slate-200 hover:border-emerald-300 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] rounded-xl px-4 h-12 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all w-full md:w-[340px] mt-2 md:mt-0 mr-0 group shrink-0">
            <Search className="text-slate-400 group-focus-within:text-emerald-500 mr-3 shrink-0 transition-colors" size={18} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-[14px] font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto p-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            {filteredData.length > 0 && !isFetching && (
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-500">
                  <th className="py-4 font-bold w-[35%]" style={{ paddingLeft: '32px', paddingRight: '32px' }}>Judul Pengumuman</th>
                  <th className="py-4 font-bold w-[15%] whitespace-nowrap" style={{ paddingLeft: '32px', paddingRight: '32px' }}>Tanggal</th>
                  <th className="py-4 font-bold w-[15%]" style={{ paddingLeft: '32px', paddingRight: '32px' }}>Akses</th>
                  <th className="py-4 font-bold w-[25%]" style={{ paddingLeft: '32px', paddingRight: '32px' }}>Cuplikan</th>
                  <th className="py-4 font-bold text-right w-[10%]" style={{ paddingLeft: '32px', paddingRight: '32px' }}>Aksi</th>
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-100">
              {isFetching ? (
                <tr>
                  <td colSpan="5" className="p-0">
                    <div className="py-20 flex flex-col items-center justify-center w-full">
                      <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-500 font-medium text-center">Memuat data pengumuman...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-5" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                      <p className="font-bold text-slate-800 text-[15px] flex items-center gap-2">
                        {item.thumbnail ? (
                          <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <Megaphone size={16} className="text-slate-400 shrink-0" />
                        )}
                        <span className="truncate max-w-xs md:max-w-sm">{item.judul}</span>
                      </p>
                      <p className="text-xs font-medium text-slate-500 mt-1.5 flex items-center gap-2 ml-10">
                        Oleh: <span className="text-slate-700 font-semibold">{item.penulis?.name || 'Admin System'}</span>
                        {item.kategori && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold tracking-wide uppercase" style={{ fontSize: '10px' }}>{item.kategori}</span>
                          </>
                        )}
                      </p>
                    </td>
                    <td className="py-5 text-sm font-semibold text-slate-600" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                      {item.tanggal_publikasi || '-'}
                    </td>
                    <td className="py-5" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        item.akses === 'umum' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {item.akses === 'umum' ? <Users size={12} strokeWidth={2.5} /> : <Lock size={12} strokeWidth={2.5} />}
                        {item.akses}
                      </span>
                    </td>
                    <td className="py-5 text-sm font-medium text-slate-500 max-w-[200px] truncate" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                      {item.isi}
                    </td>
                    <td className="py-5 text-right" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit && onEdit(item)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title={readOnly ? "Detail" : "Edit"}>
                          {readOnly ? <Search size={18} /> : <Edit2 size={18} />}
                        </button>
                        {!readOnly && (
                          <button onClick={() => onDelete && onDelete(item.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Hapus">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-0">
                    <div className="flex flex-col items-center justify-center text-center" style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50">
                        <Megaphone className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-800 mb-2">
                          {filterAkses !== 'semua' ? `Belum ada pengumuman ${filterAkses}` : 'Belum ada pengumuman'}
                      </h3>
                      <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                          Mulai bagikan informasi, agenda, atau pemberitahuan penting pertama ke seluruh ekosistem sekolah.
                      </p>
                      {!readOnly && (
                        <button type="button" onClick={onAdd} className="btn-primary py-2.5 px-6 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all" style={{ marginBottom: '10px' }}>
                          <Plus size={18} strokeWidth={2.5} /> Buat Pengumuman
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
