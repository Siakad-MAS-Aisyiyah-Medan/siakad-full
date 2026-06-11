import { Search, Filter } from 'lucide-react';

export default function KelasFilter({ 
  searchQuery, 
  onSearchChange, 
  filterTingkat, 
  onTingkatChange, 
  filterJurusan, 
  onJurusanChange 
}) {
  return (
    <div className="flex flex-col md:flex-row items-center w-full lg:w-auto" style={{ gap: '12px' }}>
      {/* Search Box */}
      <div className="flex items-center bg-white border border-slate-200 hover:border-emerald-300 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] rounded-xl px-4 h-[46px] focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all w-full md:w-[340px] group">
        <Search className="text-slate-400 group-focus-within:text-emerald-500 mr-3 shrink-0 transition-colors" size={18} strokeWidth={2.5} />
        <input
          type="text"
          placeholder="Cari berdasarkan Nama Kelas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-[14px] font-medium text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {/* Select Tingkat */}
      <div className="relative w-full md:w-32 shrink-0">
        <select
          value={filterTingkat}
          onChange={(e) => onTingkatChange(e.target.value)}
          className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl h-[46px] pl-4 pr-10 hover:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] cursor-pointer"
        >
          <option value="Semua">Tingkat</option>
          <option value="X">Kelas X</option>
          <option value="XI">Kelas XI</option>
          <option value="XII">Kelas XII</option>
        </select>
        <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>

      {/* Select Jurusan */}
      <div className="relative w-full md:w-32 shrink-0">
        <select
          value={filterJurusan}
          onChange={(e) => onJurusanChange(e.target.value)}
          className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl h-[46px] pl-4 pr-10 hover:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] cursor-pointer"
        >
          <option value="Semua">Jurusan</option>
          <option value="IPA">IPA</option>
          <option value="IPS">IPS</option>
        </select>
        <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
}
