import { Trash2, ShieldCheck, UserSearch, Edit2, Eye } from 'lucide-react';

const PPDB_LABELS = {
  draft: 'Draft',
  diajukan: 'Diajukan',
  revisi: 'Revisi',
  terverifikasi: 'Terverifikasi',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
  daftar_ulang: 'Daftar Ulang',
  menjadi_murid: 'Menjadi Murid',
};

export default function MuridTable({ data, onPromote, onDelete, onEdit, isFetching = false }) {
  return (
    <div className="table-container glass mt-6">
      <table className="data-table">
        <thead>
          <tr>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[5%]">No</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[25%]">Nama Lengkap</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[20%]">NISN / NIS</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Kelas</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[20%]">Status</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right w-[15%]">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isFetching ? (
            <tr>
              <td colSpan="8" className="py-16 text-secondary">
                <div className="flex flex-col items-center justify-center w-full">
                  <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #e2e8f0', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <p className="mt-2 text-center">Memuat data murid...</p>
                </div>
                <style>
                  {`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}
                </style>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((murid, index) => {
              const nama =
                murid.siswa?.nama_siswa || murid.pendaftaran?.nama_lengkap || '-';
              const ppdbStatus = murid.pendaftaran?.ppdb_status;
              const canPromote =
                murid.role === 'calon_siswa' &&
                ['diterima', 'daftar_ulang'].includes(ppdbStatus) &&
                ppdbStatus !== 'menjadi_murid' &&
                !murid.siswa;

              return (
                <tr key={murid.id_user} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{nama}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{murid.email || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700">{murid.siswa?.nisn || '-'}</span>
                      {murid.siswa?.nis && (
                        <span className="text-xs text-slate-500 mt-0.5">NIS: {murid.siswa.nis}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    {murid.siswa?.kelas?.nama_kelas || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {murid.role === 'siswa' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Siswa Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        {ppdbStatus && !['diterima', 'daftar_ulang', 'menjadi_murid'].includes(ppdbStatus) 
                          ? 'Belum Diverifikasi' 
                          : 'Calon Siswa'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detail Murid">
                        <Eye size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => onEdit(murid)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Data"
                      >
                        <Edit2 size={16} />
                      </button>
                      {canPromote && (
                        <button
                          type="button"
                          onClick={() => onPromote(murid)}
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Jadikan Siswa Aktif"
                        >
                          <ShieldCheck size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDelete(murid.id_user)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Permanen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-16 text-secondary">
                <UserSearch size={48} className="mx-auto mb-2 opacity-50" />
                Data murid tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
