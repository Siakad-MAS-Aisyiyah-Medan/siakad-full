import { BERKAS_LABELS } from '@app/shared/services/ppdb.service';

const JENIS_LIST = Object.keys(BERKAS_LABELS);

export default function UploadDokumen({ berkas = [], onUpload, disabled }) {
  const uploaded = new Set(berkas.map((b) => b.jenis_berkas));

  return (
    <div className="form-section">
      <h3>Unggah Berkas Persyaratan</h3>
      <p className="text-muted">Format: PDF, JPG, JPEG, PNG. Maks. 5MB per file.</p>
      <UploadList uploaded={uploaded} berkas={berkas} onUpload={onUpload} disabled={disabled} />
    </div>
  );
}

function UploadList({ uploaded, berkas, onUpload, disabled }) {
  return (
    <div className="ppdb-upload-grid">
      {JENIS_LIST.map((jenis) => {
        const item = berkas.find((b) => b.jenis_berkas === jenis);
        return (
          <div key={jenis} className="ppdb-upload-card glass">
            <h4>{BERKAS_LABELS[jenis]}</h4>
            {item?.url && (
              <a href={item.url} target="_blank" rel="noreferrer" className="ppdb-file-link">
                Lihat file terunggah
              </a>
            )}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={disabled}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(jenis, file);
                e.target.value = '';
              }}
            />
            {uploaded.has(jenis) && <span className="ppdb-upload-ok">✓ Terunggah</span>}
          </div>
        );
      })}
    </div>
  );
}

