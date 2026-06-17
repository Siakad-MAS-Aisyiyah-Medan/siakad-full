import { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Trash2, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import { fetchBerkasList, uploadBerkas, deleteBerkas, BERKAS_LABELS } from '@app/shared/services/ppdb.service';
import { UPLOAD_BERKAS_ITEMS } from '@app/shared/ppdb/config/calonMuridNav';
import './upload-berkas.css';

export default function UploadBerkas() {
  const [berkas, setBerkas] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchBerkasList();
      const items = Array.isArray(data?.items) ? data.items : [];
      const mapped = Object.fromEntries(
        items
          .filter((item) => item?.jenis_berkas && item?.url)
          .map((item) => [item.jenis_berkas, item])
      );
      setBerkas(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (jenisKey, file) => {
    if (!file) return;
    
    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire('Format tidak didukung', 'Harap unggah file JPG, PNG, atau PDF', 'warning');
      return;
    }

    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('File terlalu besar', 'Ukuran maksimal file adalah 2MB', 'warning');
      return;
    }

    setUploading(jenisKey);
    try {
      await uploadBerkas(jenisKey, file);
      await loadData();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data berhasil disimpan',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire('Gagal', err.response?.data?.message || 'Gagal mengunggah berkas', 'error');
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (jenisKey) => {
    const result = await Swal.fire({
      title: 'Hapus berkas?',
      text: 'Berkas yang dihapus harus diunggah ulang.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      setUploading(jenisKey);
      try {
        await deleteBerkas(jenisKey);
        await loadData();
        Swal.fire('Terhapus', 'Berkas berhasil dihapus', 'success');
      } catch (err) {
        Swal.fire('Gagal', 'Gagal menghapus berkas', 'error');
      } finally {
        setUploading(null);
      }
    }
  };

  return (
    <CalonMuridLayout>
      <div className="ub-header animate-stagger-1">
        <div className="ub-header__icon">
          <UploadCloud size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">Upload Berkas Pendukung</h1>
          <p className="text-emerald-700/80">
            Silakan unggah dokumen persyaratan dalam format JPG, PNG, atau PDF (Maksimal 2MB per file).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p>Memuat data berkas...</p>
        </div>
      ) : (
        <div className="ub-grid animate-stagger-2">
          {UPLOAD_BERKAS_ITEMS.map((item) => {
            const uploadedFile = berkas[item.key];
            const isUploading = uploading === item.key;
            const hasFile = Boolean(uploadedFile?.url);

            return (
              <div key={item.key} className="ub-card">
                <div className="ub-card__head">
                  <div className="ub-card__title">
                    <FileText size={18} className="text-slate-400" />
                    <strong>{item.label}</strong>
                  </div>
                  {hasFile && (
                    <span className="ub-badge ub-badge--success">
                      <CheckCircle2 size={14} /> Terunggah
                    </span>
                  )}
                  {!hasFile && (
                    <span className="ub-badge ub-badge--warning">
                      <AlertCircle size={14} /> Wajib
                    </span>
                  )}
                </div>

                <div className="ub-card__body">
                  {hasFile ? (
                    <div className="ub-uploaded">
                      <div className="ub-uploaded__info">
                        <span className="truncate">{uploadedFile.file_name || uploadedFile.file_path?.split('/').pop() || 'File terunggah'}</span>
                        <a href={uploadedFile.url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline text-xs">
                          Lihat file
                        </a>
                      </div>
                      <button 
                        onClick={() => handleDelete(item.key)} 
                        disabled={isUploading}
                        className="ub-btn-delete"
                        title="Hapus berkas"
                      >
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  ) : (
                    <div className="ub-upload-zone">
                      <input 
                        type="file" 
                        id={`file-${item.key}`} 
                        className="hidden" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleUpload(item.key, e.target.files[0])}
                        disabled={isUploading}
                      />
                      <label htmlFor={`file-${item.key}`} className={`ub-upload-label ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {isUploading ? (
                          <>
                            <Loader2 size={24} className="animate-spin text-emerald-500 mb-2" />
                            <span>Mengunggah...</span>
                          </>
                        ) : (
                          <>
                            <div className="ub-upload-icon"><UploadCloud size={24} /></div>
                            <span>Pilih file atau drag ke sini</span>
                            <small>JPG, PNG, atau PDF (Max 2MB)</small>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CalonMuridLayout>
  );
}
