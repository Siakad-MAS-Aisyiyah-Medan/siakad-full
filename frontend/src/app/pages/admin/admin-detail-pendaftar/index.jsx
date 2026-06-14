import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminPageShell from '@app/shared/components/AdminPageShell';
import StatusBadge from '@app/shared/ppdb/components/StatusBadge';
import { fetchAdminPendaftarDetail, BERKAS_LABELS } from "@app/shared/services/ppdb.service";
import { useAdminPpdb } from '@app/shared/ppdb/hooks/useAdminPpdb';
import { ArrowLeft, User, GraduationCap, Users, FileText, Check, X, FileSignature } from 'lucide-react';

export default function AdminDetailPendaftar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ppdb = useAdminPpdb();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminPendaftarDetail(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (actionFn) => {
    const success = await actionFn(id);
    if (success) {
      navigate('/admin/ppdb');
    }
  };

  const status = data?.status || data?.ppdb_status;
  const isPending = status === 'submitted' || status === 'diajukan' || status === 'verified' || status === 'terverifikasi';

  return (
    <AdminPageShell>
      <div className="flex flex-col h-full gap-6 px-2 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/ppdb" 
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </Link>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Detail Pendaftar</h2>
              <p className="text-[15px] font-medium text-slate-500 mt-1">
                Tinjau biodata, berkas, dan putuskan status pendaftaran.
              </p>
            </div>
          </div>

          {isPending && (
            <div className="flex gap-3">
              <button
                onClick={() => handleAction(ppdb.terima)}
                className="h-11 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 hover:shadow-emerald-600/50 flex items-center gap-2 transition-all"
              >
                <Check size={18} strokeWidth={2.5} /> Terima
              </button>
              <button
                onClick={() => handleAction(ppdb.tolak)}
                className="h-11 px-6 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/30 hover:shadow-rose-600/50 flex items-center gap-2 transition-all"
              >
                <X size={18} strokeWidth={2.5} /> Tolak
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-slate-100">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-semibold">Memuat detail pendaftar...</p>
          </div>
        ) : !data ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-500 font-semibold">Data pendaftar tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center mx-auto mb-4 text-3xl font-black text-slate-400">
                  {data.nama_lengkap?.charAt(0)?.toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{data.nama_lengkap}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1 mb-4">{data.nisn || data.user?.username}</p>
                <div className="flex justify-center mb-4">
                  <StatusBadge status={status} />
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">No. Registrasi</p>
                  <p className="text-sm font-semibold text-slate-800">{data.no_registrasi || '-'}</p>
                </div>
              </div>

              {data.catatan_admin && (
                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 shadow-sm">
                  <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-2">
                    <FileSignature size={16} /> Catatan Admin
                  </h4>
                  <p className="text-sm font-medium text-amber-700">{data.catatan_admin}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                  <User size={20} className="text-blue-500" /> Informasi Pribadi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <p className="text-[12px] font-bold text-slate-400 mb-1">Email</p>
                    <p className="text-[15px] font-medium text-slate-800">{data.user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-400 mb-1">Tempat, Tanggal Lahir</p>
                    <p className="text-[15px] font-medium text-slate-800">
                      {data.tempat_lahir || '-'}, {data.tanggal_lahir || data.tgl_lahir || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-400 mb-1">Agama</p>
                    <p className="text-[15px] font-medium text-slate-800">{data.agama || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-400 mb-1">Jenis Kelamin</p>
                    <p className="text-[15px] font-medium text-slate-800">{data.jenis_kelamin || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                    <GraduationCap size={20} className="text-blue-500" /> Sekolah Asal
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 mb-1">Nama Sekolah</p>
                      <p className="text-[14px] font-medium text-slate-800">{data.asal_sekolah || data.sekolah_asal || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                    <Users size={20} className="text-blue-500" /> Orang Tua
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 mb-1">Nama Ayah</p>
                      <p className="text-[14px] font-medium text-slate-800">{data.nama_ayah || '-'} <span className="text-slate-400 font-normal">({data.pekerjaan_ayah || '-'})</span></p>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 mb-1">Nama Ibu</p>
                      <p className="text-[14px] font-medium text-slate-800">{data.nama_ibu || '-'} <span className="text-slate-400 font-normal">({data.pekerjaan_ibu || '-'})</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                  <FileText size={20} className="text-blue-500" /> Berkas Pendaftaran
                </h3>
                {data.berkas?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.berkas.map((b) => (
                      <a 
                        key={b.id} 
                        href={b.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <FileText size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-700 line-clamp-1">{BERKAS_LABELS[b.jenis_berkas] || b.jenis_berkas}</p>
                          <p className="text-[11px] font-semibold text-blue-600 mt-0.5">Lihat Berkas</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-500 italic">Belum ada berkas yang diunggah.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}
