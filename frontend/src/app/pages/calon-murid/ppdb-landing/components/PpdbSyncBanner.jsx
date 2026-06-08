import { AlertCircle, RefreshCw } from 'lucide-react';
import { usePpdbContent } from '../context/PpdbContentContext';

export default function PpdbSyncBanner() {
  const { loading, error, refresh } = usePpdbContent();

  if (loading) {
    return (
      <div className="pp-sync-banner pp-sync-banner--loading" role="status">
        <span className="pp-sync-banner__spinner" aria-hidden="true" />
        Memuat informasi terbaru dari server...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pp-sync-banner pp-sync-banner--error" role="alert">
        <AlertCircle size={18} aria-hidden="true" />
        <span>{error}</span>
        <button type="button" className="pp-sync-banner__retry" onClick={refresh}>
          <RefreshCw size={14} aria-hidden="true" />
          Coba lagi
        </button>
      </div>
    );
  }

  return null;
}
