import AdminPageShell from '@app/shared/components/AdminPageShell';
import MuridFilter from '@app/shared/akademik/murid/components/MuridFilter';
import MuridTable from '@app/shared/akademik/murid/components/MuridTable';
import { useMurid } from '@app/shared/akademik/murid/hooks/useMurid';
import { Users, UserCheck, UserPlus, GraduationCap, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

export default function MuridPage() {
  const { searchQuery, setSearchQuery, filteredData, stats, isFetching, promoteMurid, removeMurid } = useMurid();

  const handleAddClick = () => {
    Swal.fire({
      icon: 'info',
      title: 'Fitur Dalam Pengembangan',
      text: 'Fitur penambahan murid manual dari Admin sedang dalam antrean pengembangan backend.',
      confirmButtonColor: '#10b981'
    });
  };

  return (
    <AdminPageShell>
      <div className="mb-8 space-y-6">
        {/* Header & Stats Container */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
          
          {/* Top Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">Kelola Data Murid</h2>
              <p className="text-slate-500 text-sm mt-1">Lihat status siswa aktif dan calon siswa mendaftar di sistem.</p>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <MuridFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              <button 
                onClick={handleAddClick}
                className="btn-primary h-12 px-5 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all shrink-0"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="hidden md:inline">Tambah Murid</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Total Murid</p>
                <p className="text-xl font-extrabold text-slate-800">{stats?.total_murid || 0}</p>
              </div>
            </div>
            
            {/* Stat 2 */}
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Siswa Aktif</p>
                <p className="text-xl font-extrabold text-slate-800">{stats?.siswa_aktif || 0}</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <UserPlus size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Calon Siswa</p>
                <p className="text-xl font-extrabold text-slate-800">{stats?.calon_siswa || 0}</p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <GraduationCap size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Alumni</p>
                <p className="text-xl font-extrabold text-slate-800">{stats?.alumni || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <MuridTable data={filteredData} onPromote={promoteMurid} onDelete={removeMurid} isFetching={isFetching} />
      </div>
    </AdminPageShell>
  );
}
