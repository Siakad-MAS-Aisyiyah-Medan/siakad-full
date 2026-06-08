import { Download } from 'lucide-react';

export default function ExportPlaceholder({ message }) {
  return (
    <button
      type="button"
      className="btn-outline opacity-60 cursor-not-allowed"
      disabled
      title={message || 'Export PDF/Excel akan tersedia pada pembaruan berikutnya.'}
    >
      <Download size={18} /> Export PDF/Excel (segera)
    </button>
  );
}
