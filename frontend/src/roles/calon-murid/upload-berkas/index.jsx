import { ArrowRight, CheckCircle2, FileText, Loader2, Trash2, Upload, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CalonMuridLayout from '@/shared/ppdb/layouts/CalonMuridLayout';
import { usePpdbBerkas } from '@/shared/ppdb/hooks/usePpdbBerkas';
import './upload-berkas.css';

export default function UploadBerkas() {
  const navigate = useNavigate();
  const { items, canEdit, config, loading, busyKey, upload, remove } = usePpdbBerkas();
  const formats = config.allowedExtensions.map((ext) => ext.toUpperCase()).join(', ');

  const chooseFile = async (jenis, event) => {
    const file = event.target.files?.[0];
    if (file) await upload(jenis, file);
    event.target.value = '';
  };

  const finish = async () => {
    const missing = items.filter((item) => !item.url);
    if (missing.length) {
      await Swal.fire({ icon: 'warning', title: 'Berkas belum lengkap', text: `${missing.length} berkas masih perlu diunggah.` });
      return;
    }
    await Swal.fire({ icon: 'success', title: 'Semua berkas tersimpan', timer: 1200, showConfirmButton: false });
    navigate('/calon-murid/kirim-pendaftaran');
  };

  return (
    <CalonMuridLayout title="Berkas Pendaftaran" subtitle="Upload semua berkas yang diperlukan sesuai dengan ketentuan.">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <Loader2 size={40} className="ub-spin mb-4" />
          <p>Memuat data berkas...</p>
        </div>
      ) : (
        <>
          <div className="ub-grid">
            {items.map((item) => {
              const busy = busyKey === item.jenis_berkas;
              return (
                <article className="ub-card" key={item.jenis_berkas}>
                  <div className="ub-card-icon"><FileText size={42} strokeWidth={1.5} /></div>
                  <div className="ub-card-info">
                    <h2>{item.label} *</h2>
                    <p>Ukuran maksimal: {Math.round(config.maxSizeKb / 1024)} MB</p>
                    <p>Format file: {item.jenis_berkas === 'pas_foto' ? 'JPG, JPEG, PNG' : formats}</p>
                    {item.url ? <a href={item.url} target="_blank" rel="noreferrer">{item.file_name || 'Lihat berkas terunggah'}</a> : null}
                    {canEdit && (
                      <div className="ub-card-actions">
                        <label className={busy ? 'is-disabled' : ''}>
                          {busy ? <Loader2 className="ub-spin" size={18} /> : <Upload size={18} />}
                          {item.url ? 'Ganti' : 'Upload'}
                          <input type="file" accept=".jpg,.jpeg,.png,.pdf" disabled={busy} onChange={(event) => chooseFile(item.jenis_berkas, event)} />
                        </label>
                        <button type="button" disabled={busy || !item.url} onClick={() => remove(item.jenis_berkas)}><Trash2 size={18} /> Hapus</button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="ub-submit">
            <div className="ub-submit-info">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <div>
                {canEdit ? (
                  <>
                    <h3>Selesai Mengunggah?</h3>
                    <p>Pastikan semua berkas wajib (*) telah terunggah dengan benar.</p>
                  </>
                ) : (
                  <>
                    <h3>Berkas Telah Terkirim</h3>
                    <p>Berkas pendaftaran Anda telah dikirim dan tidak dapat diubah lagi.</p>
                  </>
                )}
              </div>
            </div>
            {canEdit ? (
              <button type="button" onClick={finish}>
                Simpan & Lanjutkan
                <ArrowRight size={18} />
              </button>
            ) : (
              <button type="button" onClick={() => navigate('/calon-murid/status')}>
                Status Pendaftaran
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </>
      )}
    </CalonMuridLayout>
  );
}
