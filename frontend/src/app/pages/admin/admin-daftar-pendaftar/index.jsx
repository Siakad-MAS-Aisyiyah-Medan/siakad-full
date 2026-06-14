import AdminPageShell from '@app/shared/components/AdminPageShell';
import PendaftarTable from '@app/shared/ppdb/components/PendaftarTable';
import { useAdminPpdb } from '@app/shared/ppdb/hooks/useAdminPpdb';
import { Search, Filter, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdminDaftarPendaftar() {
  const ppdb = useAdminPpdb();

  return (
    <AdminPageShell>
      <div className="flex flex-col h-full gap-6 px-2 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Verifikasi PPDB</h2>
            <p className="text-[15px] font-medium text-slate-500 mt-1">
              Kelola, verifikasi, dan pantau seluruh pendaftaran calon murid baru.
            </p>
          </div>
        </div>

        <StatsGrid stats={ppdb.stats} />

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-800">Daftar Calon Murid</h3>
            <FiltersBar ppdb={ppdb} />
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <PendaftarTable ppdb={ppdb} />
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}

function FiltersBar({ ppdb }) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-3 w-full lg:w-auto">
      <div className="relative flex-1 md:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={16} strokeWidth={2.5} />
        </div>
        <input
          type="search"
          placeholder="Cari nama atau registrasi..."
          value={ppdb.searchQuery}
          onChange={(e) => ppdb.setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 text-slate-800 text-[14px] font-semibold rounded-full pl-9 pr-4 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-medium placeholder:text-slate-400"
        />
      </div>
      <div className="relative w-full sm:w-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Filter size={16} strokeWidth={2.5} />
        </div>
        <select
          value={ppdb.statusFilter}
          onChange={(e) => ppdb.setStatusFilter(e.target.value)}
          className="w-full sm:w-auto bg-white border border-slate-200 text-slate-800 text-[14px] font-semibold rounded-full pl-9 pr-4 h-10 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="submitted">Menunggu</option>
          <option value="diterima">Diterima</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>
    </div>
  );
}

function StatsGrid({ stats }) {
  // Use backend stats
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        label="Menunggu" 
        value={stats.menunggu || 0} 
        icon={<Clock size={24} className="text-amber-500" />} 
        bgColor="bg-amber-50"
        borderColor="border-amber-100"
        textColor="text-amber-700"
      />
      <StatCard 
        label="Diterima" 
        value={stats.diterima || 0} 
        icon={<CheckCircle2 size={24} className="text-emerald-500" />} 
        bgColor="bg-emerald-50"
        borderColor="border-emerald-100"
        textColor="text-emerald-700"
      />
      <StatCard 
        label="Ditolak" 
        value={stats.ditolak || 0} 
        icon={<XCircle size={24} className="text-rose-500" />} 
        bgColor="bg-rose-50"
        borderColor="border-rose-100"
        textColor="text-rose-700"
      />
    </div>
  );
}

function StatCard({ label, value, icon, bgColor, borderColor, textColor }) {
  return (
    <div className={`p-6 rounded-3xl border ${borderColor} ${bgColor} flex items-center justify-between`}>
      <div>
        <p className={`text-sm font-bold ${textColor} opacity-80 mb-1 uppercase tracking-wider`}>{label}</p>
        <p className={`text-3xl font-black ${textColor}`}>{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm`}>
        {icon}
      </div>
    </div>
  );
}
