import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export default function KelasTable({
  filteredData,
  onAdd,
  onEdit,
  onDelete,
  isFetching = false,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse kelas-table">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[25%]">Nama Kelas</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Tingkat</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Jurusan</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[20%]">Wali Kelas</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Jumlah Siswa</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right w-[10%]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-secondary">
                  <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #e2e8f0', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <p className="mt-2">Memuat data kelas...</p>
                  <style>
                    {`
                      @keyframes spin {
                        to { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((kelas) => (
                <tr key={kelas.id_kelas} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100 last:border-none">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800">{kelas.nama_kelas}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                      Kelas {kelas.tingkat || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {kelas.jurusan || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {kelas.wali_kelas?.guru?.nama_guru ? (
                      <span className="text-slate-700">{kelas.wali_kelas.guru.nama_guru}</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        Belum Ditentukan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    {kelas.jumlah_siswa} Siswa
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => onEdit(kelas)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Data">
                        <Edit2 size={16} />
                      </button>
                      <button type="button" onClick={() => onDelete(kelas.id_kelas)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Data">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12 px-6">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 mb-1">Data Kelas Tidak Ditemukan</h3>
                  <p className="text-xs text-slate-500">Coba sesuaikan filter pencarian atau tambahkan kelas baru.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
