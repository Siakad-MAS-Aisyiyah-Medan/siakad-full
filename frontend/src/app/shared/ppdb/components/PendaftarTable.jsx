import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Eye, Check, X, User } from 'lucide-react';

export default function PendaftarTable({ ppdb }) {
  const { items, loading, isFetching } = ppdb;

  if (loading && !isFetching) {
    return <p className="text-center p-6 text-slate-500 font-medium">Memproses...</p>;
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/80 border-b border-slate-100">
          <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest pl-8 pr-4">Pendaftar</th>
          <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-4">Status</th>
          <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-4 text-center">Detail</th>
          <th className="py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right pr-8 pl-4">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {isFetching ? (
          <tr>
            <td colSpan="4" className="py-16 text-slate-500">
              <div className="flex flex-col items-center justify-center w-full">
                <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3" />
                <p className="font-semibold text-sm text-center">Memuat data pendaftar...</p>
              </div>
            </td>
          </tr>
        ) : !items?.length ? (
          <tr>
            <td colSpan="4" className="text-center py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={24} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-600">Belum ada data pendaftar</p>
            </td>
          </tr>
        ) : (
          items.map((row) => (
            <tr key={row.id || row.id_pendaftaran} className="hover:bg-slate-50/80 transition-colors group">
              <td className="py-4 pl-8 pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 font-bold text-sm border border-slate-300">
                    {row.nama_lengkap?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[14px]">{row.nama_lengkap}</p>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">NISN: {row.nisn || row.user?.username}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <StatusBadge status={row.status || row.ppdb_status} />
              </td>
              <td className="py-4 px-4 text-center">
                <Link 
                  to={`/admin/ppdb/${row.id || row.id_pendaftaran}`} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  <Eye size={14} strokeWidth={2.5} /> Lihat
                </Link>
              </td>
              <td className="py-4 pr-8 pl-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  {(row.status === 'submitted' || row.ppdb_status === 'diajukan' || row.status === 'verified' || row.ppdb_status === 'terverifikasi') && (
                    <>
                      <button
                        onClick={() => ppdb.terima(row.id || row.id_pendaftaran)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm text-xs font-bold"
                      >
                        <Check size={14} strokeWidth={3} /> Terima
                      </button>
                      <button
                        onClick={() => ppdb.tolak(row.id || row.id_pendaftaran)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm text-xs font-bold"
                      >
                        <X size={14} strokeWidth={3} /> Tolak
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
