import { Search } from 'lucide-react';

export default function MuridFilter({ searchQuery, onSearchChange }) {
  return (
    <div className="search-box">
      <Search size={18} />
      <input
        type="text"
        placeholder="Cari berdasarkan NIS / Username..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ width: '280px' }}
      />
    </div>
  );
}
