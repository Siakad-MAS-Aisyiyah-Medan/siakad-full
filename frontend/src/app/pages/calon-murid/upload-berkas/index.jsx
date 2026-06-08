import { useNavigate } from 'react-router-dom';
import { FolderOpen, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import PortalPageShell from '@app/shared/ppdb/components/portal/PortalPageShell';
import Button from '@app/shared/ppdb/components/portal/Button';
import UploadBerkasPanel from '@app/shared/ppdb/components/upload/UploadBerkasPanel';
import { usePpdbBerkas } from '@app/shared/ppdb/hooks/usePpdbBerkas';

export default function UploadBerkasCalonMurid() {
  const navigate = useNavigate();
  const berkas = usePpdbBerkas();

  if (berkas.loading) {
    return (
      <CalonMuridLayout>
        <PortalPageShell>
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            <p>Memuat data berkas...</p>
          </div>
        </PortalPageShell>
      </CalonMuridLayout>
    );
  }

  const allDone = berkas.uploadedCount >= berkas.requiredCount;

  return (
    <CalonMuridLayout>
      <PortalPageShell>
        {/* Page Header */}
        <div className="cm-page-header cm-page-header--upload">
          <div className="cm-page-header__icon">
            <FolderOpen size={28} strokeWidth={1.5} />
          </div>
          <div className="cm-page-header__content">
            <h1 className="cm-page-header__title">Upload Berkas</h1>
            <p className="cm-page-header__subtitle">
              Unggah semua dokumen pendukung sebelum mengajukan pendaftaran.
            </p>
          </div>
          {/* Progress Pill */}
          <div className={`cm-upload-progress-pill${allDone ? ' cm-upload-progress-pill--done' : ''}`}>
            {allDone ? (
              <CheckCircle2 size={16} />
            ) : (
              <span className="cm-upload-progress-pill__count">{berkas.uploadedCount}/{berkas.requiredCount}</span>
            )}
            <span>{allDone ? 'Semua berkas terunggah' : 'Berkas terunggah'}</span>
          </div>
        </div>

        {/* Info banner */}
        <div className={`cm-upload-info-bar${berkas.isReadOnly ? ' cm-upload-info-bar--readonly' : ''}`}>
          {berkas.isReadOnly ? (
            <>
              <AlertCircle size={16} className="shrink-0" />
              <span>Pendaftaran sudah diajukan — berkas tidak dapat diubah kecuali admin meminta revisi.</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Format yang didukung: <strong>PDF, JPG, JPEG, PNG</strong>. Maks. 2 MB per file.</span>
            </>
          )}
        </div>

        {/* Upload Panel */}
        <UploadBerkasPanel
          items={berkas.items}
          config={berkas.config}
          disabled={berkas.isReadOnly}
          busyKey={berkas.busyKey}
          onUpload={berkas.upload}
          onDelete={berkas.remove}
        />

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => navigate('/calon-murid/status')}>
            Lihat Status
          </Button>
          {berkas.canEdit && (
            <Button onClick={() => navigate('/ppdb/registrasi')}>
              Lanjut ke Formulir
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </PortalPageShell>
    </CalonMuridLayout>
  );
}
