import { useEffect, useMemo, useState } from 'react';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import PageHeader from '@app/shared/components/PageHeader';
import { fetchMyRegistration, submitPendaftaran } from '@app/shared/services/ppdb.service';
import { STEP_REQUIRED } from '@app/shared/ppdb/config/ppdbWizardConfig';
import { UPLOAD_BERKAS_ITEMS } from '@app/shared/ppdb/config/calonMuridNav';
import { confirmAction, toastSuccess, toastValidation, toastError } from '@app/shared/hooks/useConfirm';
import { CheckCircle2, FileText, Send, FolderOpen } from 'lucide-react';

function ProgressCard({ title, value, icon: Icon, description }) {
  const isComplete = value === 100;
  return (
    <div className="form-panel" style={{ padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ 
        width: '56px', height: '56px', borderRadius: '16px', 
        background: isComplete ? 'var(--color-primary-soft)' : '#f1f5f9', 
        color: isComplete ? 'var(--color-primary-dark)' : '#64748b', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
      }}>
        {isComplete ? <CheckCircle2 size={28} /> : <Icon size={28} />}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-dark)', margin: 0 }}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0, marginTop: '0.2rem' }}>{description}</p>
        
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '10px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', width: `${value}%`, 
              background: isComplete ? 'var(--color-primary)' : '#3b82f6', 
              borderRadius: '10px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: isComplete ? 'var(--color-primary-dark)' : '#334155', minWidth: '3rem', textAlign: 'right' }}>{value}%</span>
        </div>
      </div>
    </div>
  );
}

export default function KirimPendaftaranPage() {
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyRegistration()
      .then((data) => setRegistration(data?.pendaftaran || data || null))
      .catch(() => setRegistration(null))
      .finally(() => setLoading(false));
  }, []);

  const formProgress = useMemo(() => {
    if (!registration) return 0;
    if (['diajukan', 'terverifikasi', 'diterima', 'ditolak'].includes(registration.ppdb_status)) return 100;
    
    let totalFields = 0;
    let filledFields = 0;

    Object.values(STEP_REQUIRED).forEach((fields) => {
      fields.forEach((field) => {
        totalFields++;
        const val = registration[field];
        if (val !== null && val !== undefined && String(val).trim() !== '') {
          filledFields++;
        }
      });
    });

    if (totalFields === 0) return 0;
    return Math.min(100, Math.round((filledFields / totalFields) * 100));
  }, [registration]);

  const berkasProgress = useMemo(() => {
    if (['diajukan', 'terverifikasi', 'diterima', 'ditolak'].includes(registration?.ppdb_status)) return 100;
    const berkas = Array.isArray(registration?.berkas) ? registration.berkas : [];
    if (berkas.length === 0) return 0;
    
    const uploadedCount = berkas.filter((item) => item.file_path || item.path_file || item.file_url).length;
    const totalRequired = UPLOAD_BERKAS_ITEMS.length;
    
    return Math.min(100, Math.round((uploadedCount / totalRequired) * 100));
  }, [registration]);

  const handleSubmit = async () => {
    const ok = await confirmAction({
      title: 'Kirim Pendaftaran?',
      text: 'Pastikan data Anda sudah benar. Pendaftaran yang sudah dikirim tidak dapat diubah kembali.',
      confirmText: 'Ya, Kirim Sekarang',
      cancelText: 'Batal',
    });
    if (!ok) return;

    setSubmitting(true);
    try {
      await submitPendaftaran();
      toastSuccess('Berhasil', 'Pendaftaran berhasil dikirim');
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengirim pendaftaran';
      if (error.response?.status === 422) {
        toastValidation('Periksa Kembali', message);
      } else {
        toastError('Gagal', message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isReadyToSubmit = formProgress === 100 && berkasProgress === 100;

  return (
    <CalonMuridLayout>
      <PageHeader 
        title="Kirim Pendaftaran"
        subtitle="Periksa kembali progres kelengkapan data dan dokumen sebelum mengirim formulir secara final."
      />
      <div className="admin-page-wrapper animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '1rem' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <ProgressCard 
            title="Formulir Pendaftaran" 
            description="Status kelengkapan data diri, alamat, dan orang tua."
            value={loading ? 0 : formProgress} 
            icon={FileText}
          />
          <ProgressCard 
            title="Berkas Pendaftaran" 
            description="Status unggah dokumen persyaratan wajib."
            value={loading ? 0 : berkasProgress} 
            icon={FolderOpen}
          />

          <div className="form-panel" style={{ padding: '2rem', marginTop: '1rem', background: 'linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0.9))', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '1.5rem' }}>Siap untuk dikirim?</h3>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || loading || !isReadyToSubmit}
              className="btn-primary"
              style={{ 
                margin: '0 auto',
                width: '100%', maxWidth: '400px', padding: '1rem', fontSize: '1.05rem', 
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', 
                opacity: (!isReadyToSubmit || submitting || loading) ? 0.6 : 1,
                cursor: (!isReadyToSubmit || submitting || loading) ? 'not-allowed' : 'pointer'
              }}
            >
              <Send size={18} />
              {submitting ? 'Sedang Mengirim...' : 'Kirim Pendaftaran Sekarang'}
            </button>
            
            {!isReadyToSubmit && !loading && (
              <p style={{ fontSize: '0.85rem', color: '#dc2626', marginTop: '1rem', fontWeight: 600 }}>
                * Anda harus melengkapi 100% formulir dan berkas sebelum dapat mengirim pendaftaran.
              </p>
            )}
            {isReadyToSubmit && !loading && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)', marginTop: '1rem', fontWeight: 600 }}>
                ✓ Berkas lengkap! Pendaftaran Anda siap dikirim.
              </p>
            )}
          </div>
        </div>
      </div>
    </CalonMuridLayout>
  );
}
