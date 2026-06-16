import { Download } from 'lucide-react';

export default function ExportPlaceholder({ onExport, title }) {
  return (
    <button
      type="button"
      className="btn-outline h-10 px-5 rounded-full font-bold flex items-center gap-2 transition-all shadow-sm"
      onClick={onExport}
    >
      <Download size={18} strokeWidth={2.5} /> {title || 'Unduh Transkrip'}
    </button>
  );
}
