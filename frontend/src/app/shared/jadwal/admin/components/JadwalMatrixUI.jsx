import React from 'react';
import { ArrowLeft, Save, Info, Clock, CheckCircle2 } from 'lucide-react';

export default function JadwalMatrixUI({
  kelas,
  tahunAjaran,
  semester,
  waktuData,
  matrixData,
  mapelData,
  guruData,
  loading,
  onCancel,
  onChangeCell,
  onSave,
  readOnly = false,
}) {
  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-5">
            <button
              onClick={onCancel}
              className="mt-1 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all backdrop-blur-sm border border-white/10 hover:scale-105"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wider mb-3 border border-emerald-500/30">
                <Clock size={14} />
                {tahunAjaran} • Semester {semester}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Matriks Jadwal <span className="text-emerald-400">{kelas?.nama_kelas}</span>
              </h2>
            </div>
          </div>

          {!readOnly && (
            <button
              onClick={onSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Simpan Jadwal
            </button>
          )}
        </div>
      </div>

      {waktuData.length === 0 ? (
        <div className="bg-amber-50 text-amber-800 p-6 rounded-3xl border border-amber-200 shadow-sm flex items-start gap-4 animate-pulse">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
            <Info size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Waktu Pelajaran Kosong</h3>
            <p className="text-amber-700/80">
              Waktu pelajaran belum diatur. Silakan atur terlebih dahulu di menu <strong>Waktu Pelajaran</strong> agar matriks jadwal dapat ditampilkan.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-5 text-center w-28 text-slate-500 font-bold tracking-wider uppercase text-[10px]">
                    Jam / Waktu
                  </th>
                  {hariList.map((hari) => (
                    <th key={hari} className="px-6 py-5 min-w-[220px] border-l border-slate-200 text-center">
                      <span className="inline-block px-4 py-1.5 bg-white border border-slate-200 rounded-full text-slate-700 font-bold uppercase tracking-wider text-xs shadow-sm">
                        {hari}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matrixData.map((row) => {
                  const w = row.waktu;
                  const isIstirahat = w.tipe === 'istirahat';

                  return (
                    <tr key={w.id_waktu} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 text-center whitespace-nowrap bg-slate-50/50 border-r border-slate-100 relative">
                        {/* Waktu Indikator Line */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isIstirahat ? 'bg-amber-400' : 'bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity'}`}></div>
                        
                        <div className="font-black text-slate-700 text-lg tracking-tight">
                          {isIstirahat ? '☕' : w.jam_ke}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 mt-1 bg-white px-2 py-0.5 rounded-md inline-block border border-slate-200 shadow-sm">
                          {w.jam_mulai.slice(0, 5)} - {w.jam_selesai.slice(0, 5)}
                        </div>
                      </td>

                      {isIstirahat ? (
                        <td colSpan={6} className="px-4 py-6 text-center border-l border-slate-100 bg-striped-slate relative overflow-hidden">
                          <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px]"></div>
                          <span className="relative z-10 px-6 py-2 bg-white rounded-full text-slate-400 font-bold tracking-[0.2em] uppercase text-xs border border-slate-200 shadow-sm flex items-center justify-center max-w-max mx-auto gap-2">
                            <Clock size={14} className="text-amber-400" />
                            Waktu Istirahat
                          </span>
                        </td>
                      ) : (
                        hariList.map((hari) => {
                          const cell = row.jadwal[hari] || {};
                          const isFilled = cell.id_mapel && cell.id_guru;
                          
                          return (
                            <td key={hari} className={`p-3 border-l border-slate-100 align-top transition-colors ${isFilled ? 'bg-emerald-50/10' : ''}`}>
                              <div className="space-y-3 relative">
                                {isFilled && (
                                  <div className="absolute -top-1 -right-1 text-emerald-500 bg-white rounded-full">
                                    <CheckCircle2 size={14} />
                                  </div>
                                )}
                                
                                {/* Select Mapel */}
                                <div className="relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 mb-1 block">Mata Pelajaran</label>
                                  <select
                                    value={cell.id_mapel || ''}
                                    onChange={(e) => onChangeCell(w.id_waktu, hari, 'id_mapel', e.target.value)}
                                    className={`w-full text-sm p-2.5 rounded-xl border-2 appearance-none outline-none transition-all ${!readOnly ? 'cursor-pointer' : 'cursor-default bg-slate-100'} font-medium
                                      ${cell.id_mapel 
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10' 
                                        : 'border-slate-200 bg-slate-50 text-slate-600 focus:border-emerald-500'} ${!readOnly && !cell.id_mapel ? 'hover:border-slate-300 focus:bg-white' : ''}`}
                                    disabled={readOnly}
                                  >
                                    <option value="">-- Pilih Mapel --</option>
                                    {mapelData.map((m) => (
                                      <option key={m.id_mapel} value={m.id_mapel}>
                                        {m.nama_mapel}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Select Guru */}
                                <div className={`transition-all duration-300 ${cell.id_mapel ? 'opacity-100 translate-y-0' : 'opacity-50 -translate-y-1 pointer-events-none'}`}>
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 mb-1 block">Guru Pengampu</label>
                                  <select
                                    value={cell.id_guru || ''}
                                    onChange={(e) => onChangeCell(w.id_waktu, hari, 'id_guru', e.target.value)}
                                    className={`w-full text-sm p-2.5 rounded-xl border-2 appearance-none outline-none transition-all ${!readOnly ? 'cursor-pointer' : 'cursor-default bg-slate-100'} font-medium
                                      ${cell.id_guru 
                                        ? 'border-blue-200 bg-blue-50 text-blue-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                        : 'border-slate-200 bg-slate-50 text-slate-600 focus:border-blue-500'} ${!readOnly && !cell.id_guru ? 'hover:border-slate-300 focus:bg-white' : ''}`}
                                    disabled={readOnly}
                                  >
                                    <option value="">-- Pilih Guru --</option>
                                    {guruData.map((g) => (
                                      <option key={g.id_user} value={g.id_user}>
                                        {g.nama_guru}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </td>
                          );
                        })
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
