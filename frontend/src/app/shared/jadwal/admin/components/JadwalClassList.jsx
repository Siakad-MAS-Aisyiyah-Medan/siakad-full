import React from 'react';
import { Search, Calendar, Users, ChevronRight } from 'lucide-react';

export default function JadwalClassList({
  kelasData,
  searchQuery,
  onSearchChange,
  onSelectKelas,
  isFetching = false,
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-8 text-white shadow-lg shadow-emerald-500/20 mb-12">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4 backdrop-blur-sm border border-white/20">
              <Calendar size={14} />
              Manajemen Jadwal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              Jadwal Pelajaran Kelas
            </h1>
            <p className="text-emerald-50 text-sm leading-relaxed">
              Kelola dan susun matriks jadwal pertemuan tatap muka untuk setiap kelas secara efisien.
            </p>
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-emerald-100" />
            </div>
            <input
              type="text"
              placeholder="Cari kelas atau wali..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-emerald-100/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* Grid Kelas */}
      <div style={{ marginTop: '3rem' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isFetching ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200">
            <div style={{ display: 'inline-block', width: '3rem', height: '3rem', border: '4px solid #e2e8f0', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <h3 className="text-lg font-bold text-slate-700 mt-4">Memuat Data Kelas...</h3>
            <style>
              {`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : kelasData.map((kelas) => {
          const isConfigured = kelas.jadwal_count > 0;
          return (
            <div
              key={kelas.id_kelas}
              onClick={() => onSelectKelas(kelas)}
              className="group cursor-pointer bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 flex-grow relative">
                {/* Badge Status */}
                <div
                  className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 uppercase
                    ${isConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></span>
                  {isConfigured ? 'Tersusun' : 'Belum'}
                </div>

                {/* Avatar Kelas */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                  <span className="text-xl font-black text-slate-700">
                    {kelas.nama_kelas.replace(/[^0-9A-Z]/g, '').slice(0, 2)}
                  </span>
                </div>

                {/* Info Kelas */}
                <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors">
                  {kelas.nama_kelas}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                  <Users size={16} className="text-slate-400" />
                  <span className="truncate">Wali: {kelas.wali_kelas?.nama_guru || 'Belum diatur'}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-emerald-50 transition-colors">
                <span className="text-sm font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">
                  {isConfigured ? 'Edit Jadwal' : 'Susun Jadwal'}
                </span>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}

        {!isFetching && kelasData.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">Pencarian Tidak Ditemukan</h3>
            <p className="text-slate-500">Kami tidak dapat menemukan kelas yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
