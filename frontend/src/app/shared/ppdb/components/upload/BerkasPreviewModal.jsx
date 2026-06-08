import { X } from 'lucide-react';
import { isImageMime, isPdfMime } from '../../utils/berkasValidation';

export default function BerkasPreviewModal({ open, item, onClose }) {
  if (!open || !item?.url) return null;

  const mime = item.mime_type || '';
  const name = item.file_name || '';
  const showImage = isImageMime(mime) || /\.(jpe?g|png)$/i.test(name);
  const showPdf = isPdfMime(mime, name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{item.label || item.jenis_berkas}</h3>
            {item.file_name && <p className="text-xs text-slate-500">{item.file_name}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex min-h-[200px] flex-1 items-center justify-center overflow-auto bg-slate-50 p-4">
          {showImage && (
            <img src={item.preview_url || item.url} alt={item.label} className="max-h-[70vh] max-w-full object-contain" />
          )}
          {showPdf && !showImage && (
            <iframe title={item.label} src={item.url} className="h-[70vh] w-full rounded-lg border border-slate-200" />
          )}
          {!showImage && !showPdf && (
            <p className="text-sm text-slate-600">
              Pratinjau tidak tersedia.{' '}
              <a href={item.url} target="_blank" rel="noreferrer" className="font-medium text-emerald-700 hover:underline">
                Buka file
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
