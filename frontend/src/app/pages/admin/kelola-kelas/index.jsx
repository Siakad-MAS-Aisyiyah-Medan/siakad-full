import AdminPageShell from '@app/shared/components/AdminPageShell';
import KelasTable from '@app/shared/akademik/kelas/components/KelasTable';
import KelasForm from '@app/shared/akademik/kelas/components/KelasForm';
import KelasFilter from '@app/shared/akademik/kelas/components/KelasFilter';
import { useKelas } from '@app/shared/akademik/kelas/hooks/useKelas';
import { Users, Library, GraduationCap, AlertCircle, Plus } from 'lucide-react';

export default function KelasPage({ readOnly = false }) {
  const {
    view,
    searchQuery,
    setSearchQuery,
    filterTingkat,
    setFilterTingkat,
    filterJurusan,
    setFilterJurusan,
    filteredData,
    stats,
    guruData,
    formData,
    loading,
    openAdd,
    openEdit,
    cancelForm,
    handleChange,
    submitForm,
    removeKelas,
    isFetching,
  } = useKelas();

  return (
    <AdminPageShell>
      {view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
            <div className="bg-white rounded-2xl p-5 safe-p-5 border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex items-center hover:border-blue-300 transition-colors" style={{ gap: '16px' }}>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Library size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Kelas</p>
                <h3 className="text-2xl font-black text-slate-800">{stats?.total_kelas || 0}</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 safe-p-5 border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex items-center hover:border-emerald-300 transition-colors" style={{ gap: '16px' }}>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Users size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Kelas IPA</p>
                <h3 className="text-2xl font-black text-slate-800">{stats?.ipa || 0}</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 safe-p-5 border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex items-center hover:border-violet-300 transition-colors" style={{ gap: '16px' }}>
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <GraduationCap size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Kelas IPS</p>
                <h3 className="text-2xl font-black text-slate-800">{stats?.ips || 0}</h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 safe-p-5 border border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex items-center hover:border-amber-300 transition-colors" style={{ gap: '16px' }}>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Belum Ada Wali</p>
                <h3 className="text-2xl font-black text-slate-800">{stats?.belum_ada_wali || 0}</h3>
              </div>
            </div>
          </div>

          {/* HEADER & FILTERS */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] border border-slate-200 p-5 safe-p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between" style={{ gap: '20px' }}>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Data Kelas</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Kelola pembagian kelas dan penetapan wali kelas.</p>
            </div>
            <div className="flex flex-col lg:flex-row flex-wrap items-center w-full xl:w-auto" style={{ gap: '12px' }}>
              <KelasFilter 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterTingkat={filterTingkat}
                onTingkatChange={setFilterTingkat}
                filterJurusan={filterJurusan}
                onJurusanChange={setFilterJurusan}
              />
              {!readOnly && (
                <button 
                  type="button" 
                  onClick={openAdd} 
                  className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white h-[46px] px-6 rounded-xl font-bold flex items-center justify-center shadow-sm shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all shrink-0"
                  style={{ gap: '8px' }}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span>Tambah Kelas</span>
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <KelasTable
            filteredData={filteredData}
            onAdd={readOnly ? undefined : openAdd}
            onEdit={readOnly ? undefined : openEdit}
            onDelete={readOnly ? undefined : removeKelas}
            isFetching={isFetching}
            readOnly={readOnly}
          />
        </div>
      )}
      {(view === 'add' || view === 'edit') && (
        <KelasForm
          view={view}
          formData={formData}
          guruData={guruData}
          loading={loading}
          onChange={handleChange}
          onSubmit={submitForm}
          onCancel={cancelForm}
          readOnly={readOnly}
        />
      )}
    </AdminPageShell>
  );
}
