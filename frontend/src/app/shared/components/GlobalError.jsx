import { AlertCircle } from 'lucide-react';

export default function GlobalError({ title = 'Terjadi kesalahan', message, onRetry }) {
  return (
    <div className="glass p-6 mt-4 text-center" style={{ borderRadius: '12px' }}>
      <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
      <h3 className="font-semibold text-red-600">{title}</h3>
      <p className="text-secondary mt-2">{message || 'Gagal memuat data. Periksa koneksi atau coba lagi.'}</p>
      {onRetry && (
        <button type="button" className="btn-primary mt-4" onClick={onRetry}>
          Coba lagi
        </button>
      )}
    </div>
  );
}
