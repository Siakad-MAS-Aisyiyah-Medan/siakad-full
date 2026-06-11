import { Search } from 'lucide-react';

export default function MuridFilter({ searchQuery, onSearchChange }) {
  return (
    <div className="flex items-center bg-white border border-slate-200 hover:border-emerald-300 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] rounded-xl px-4 h-[46px] focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all w-full md:w-[340px] group">
      <Search className="text-slate-400 group-focus-within:text-emerald-500 mr-3 shrink-0 transition-colors" size={18} strokeWidth={2.5} />
      <input
        type="text"
        placeholder="Cari berdasarkan NIS / Nama..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-transparent border-none outline-none w-full text-[14px] font-medium text-slate-700 placeholder:text-slate-400"
      />
    </div>
  );
}
