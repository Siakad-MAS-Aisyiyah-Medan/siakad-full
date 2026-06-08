import { useRef, useState } from 'react';
import { Eye, FileUp, RefreshCw, Trash2, AlertCircle, FileText, UploadCloud } from 'lucide-react';
import Badge from '../portal/Badge';
import Button from '../portal/Button';
import Card from '../portal/Card';
import BerkasPreviewModal from './BerkasPreviewModal';
import { UPLOAD_BERKAS_ITEMS } from '../../config/calonMuridNav';
import { formatFileSize } from '../../utils/berkasValidation';

const STATUS_MAP = {
  belum_upload: { label: 'Belum Upload', tone: 'belum' },
  menunggu_verifikasi: { label: 'Menunggu Verifikasi', tone: 'submitted' },
  valid: { label: 'Valid', tone: 'accepted' },
  ditolak: { label: 'Ditolak', tone: 'rejected' },
};

function resolveStatus(item) {
  if (item?.status && STATUS_MAP[item.status]) {
    return STATUS_MAP[item.status];
  }
  if (item?.status_verifikasi === 'diterima') return STATUS_MAP.valid;
  if (item?.status_verifikasi === 'ditolak') return STATUS_MAP.ditolak;
  if (item?.url) return STATUS_MAP.menunggu_verifikasi;
  return STATUS_MAP.belum_upload;
}

function UploadBerkasCard({
  doc,
  item,
  status,
  disabled,
  isBusy,
  maxLabel,
  onUpload,
  onDelete,
  onPreview,
}) {
  const inputRef = useRef(null);
  const hasFile = Boolean(item?.url);
  const canModify = !disabled && item?.status !== 'valid';

  return (
    <Card padding="p-5" className="flex h-full flex-col border-slate-200 transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${hasFile ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
             <FileUp size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{doc.label}</h3>
            <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">{maxLabel}</p>
          </div>
        </div>
        <Badge tone={status.tone} className="shrink-0">{status.label}</Badge>
      </div>

      {item?.status === 'ditolak' && item?.catatan && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-red-100 bg-red-50 p-3">
           <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
           <p className="text-xs text-red-700">{item.catatan}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        disabled={disabled || isBusy || !canModify}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(doc.key, file);
          e.target.value = '';
        }}
      />

      <div className="mt-auto flex flex-col pt-2">
        {hasFile ? (
          <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/30 p-3">
            <div className="flex min-w-0 items-center gap-3">
               <FileText size={24} className="shrink-0 text-emerald-500" />
               <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">{item.file_name || 'File terunggah'}</p>
                  {item.file_size != null && <p className="text-xs text-slate-500">{formatFileSize(item.file_size)}</p>}
               </div>
            </div>
            
            <div className="ml-3 flex shrink-0 gap-1">
              <button type="button" onClick={() => onPreview(item)} className="rounded-md p-2 text-slate-400 transition-colors hover:bg-emerald-100 hover:text-emerald-700" title="Preview dokumen">
                 <Eye size={18} />
              </button>
              {canModify && (
                <button type="button" onClick={() => inputRef.current?.click()} className="rounded-md p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600" title="Ganti file" disabled={isBusy}>
                   <RefreshCw size={18} className={isBusy ? 'animate-spin' : ''} />
                </button>
              )}
              {canModify && (
                <button type="button" onClick={() => onDelete(doc.key)} className="rounded-md p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Hapus file" disabled={isBusy}>
                   <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div 
             onClick={() => canModify && !isBusy && inputRef.current?.click()}
             className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200
               ${canModify && !isBusy ? 'border-slate-300 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50' : 'border-slate-200 cursor-not-allowed bg-slate-50 opacity-60'}`}
          >
             {isBusy ? (
                <>
                  <RefreshCw size={24} className="mb-2 animate-spin text-emerald-500" />
                  <p className="text-sm font-medium text-slate-600">Sedang mengunggah...</p>
                </>
             ) : (
                <>
                  <UploadCloud size={24} className="mb-2 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">Klik untuk unggah dokumen</p>
                  <p className="mt-1 text-xs text-slate-400">PDF, JPG, PNG didukung</p>
                </>
             )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function UploadBerkasPanel({
  items = [],
  config,
  disabled,
  busyKey,
  onUpload,
  onDelete,
}) {
  const [previewItem, setPreviewItem] = useState(null);

  const maxLabel = config
    ? `PDF, ${config.allowedExtensions?.join(', ').toUpperCase()} — Maks. ${config.maxSizeKb >= 1024 ? `${(config.maxSizeKb / 1024).toFixed(1)} MB` : `${config.maxSizeKb} KB`}`
    : 'PDF, JPG, JPEG, PNG — Maks. 2 MB';

  const byJenis = Object.fromEntries(items.map((i) => [i.jenis_berkas, i]));

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
        {UPLOAD_BERKAS_ITEMS.map((doc) => {
          const item = byJenis[doc.key];
          const status = resolveStatus(item);
          return (
            <UploadBerkasCard
              key={doc.key}
              doc={doc}
              item={item}
              status={status}
              disabled={disabled}
              isBusy={busyKey === doc.key}
              maxLabel={maxLabel}
              onUpload={onUpload}
              onDelete={onDelete}
              onPreview={setPreviewItem}
            />
          );
        })}
      </div>

      <BerkasPreviewModal open={Boolean(previewItem)} item={previewItem} onClose={() => setPreviewItem(null)} />
    </>
  );
}
