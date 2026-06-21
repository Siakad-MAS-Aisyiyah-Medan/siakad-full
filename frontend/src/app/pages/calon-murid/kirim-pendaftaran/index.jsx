import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CalonMuridLayout from '@app/shared/ppdb/layouts/CalonMuridLayout';
import { fetchMyRegistration, submitPendaftaran } from '@app/shared/services/ppdb.service';
import { computeWizardPercent, stepIndexFromCurrentStep, buildInitialCompletedSteps } from '@app/shared/ppdb/config/ppdbWizardConfig';
import { calculateFormulirProgress } from '@app/shared/ppdb/utils/ppdbWizardValidation';
import { UPLOAD_BERKAS_ITEMS } from '@app/shared/ppdb/config/calonMuridNav';
import { confirmAction, toastSuccess, toastValidation, toastError } from '@app/shared/hooks/useConfirm';
import { CheckCircle2, FileText, Send, FolderOpen, Loader2, PartyPopper } from 'lucide-react';
import './kirim-pendaftaran.css';

function ProgressCard({ title, value, icon: Icon, description }) {
  const isComplete = value === 100;
  return (
    <div className="kp-card">
      <div className={`kp-card-icon ${isComplete ? 'is-complete' : 'is-pending'}`}>
        {isComplete ? <CheckCircle2 size={32} /> : <Icon size={32} strokeWidth={1.5} />}
      </div>
      <div className="kp-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        
        <div className="kp-progress-wrap">
          <div className="kp-progress-bar">
            <div 
              className={`kp-progress-fill ${isComplete ? 'is-complete' : 'is-pending'}`} 
              style={{ width: `${value}%` }} 
            />
          </div>
          <span className={`kp-progress-text ${isComplete ? 'is-complete' : 'is-pending'}`}>
            {value}%
          </span>
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
    return calculateFormulirProgress(registration);
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
      const result = await submitPendaftaran();
      setRegistration(result?.pendaftaran || result || null);
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
  const isAlreadySubmitted = registration && ['diajukan', 'terverifikasi', 'diterima', 'ditolak'].includes(registration.ppdb_status);

  if (loading) {
    return (
      <CalonMuridLayout title="Kirim Pendaftaran" subtitle="Periksa kembali progres kelengkapan data dan dokumen sebelum mengirim formulir secara final.">
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p>Memuat data pendaftaran...</p>
        </div>
      </CalonMuridLayout>
    );
  }

  return (
    <CalonMuridLayout title="Kirim Pendaftaran" subtitle={isAlreadySubmitted ? "Pendaftaran Anda telah berhasil dikirimkan ke pihak sekolah." : "Periksa kembali progres kelengkapan data dan dokumen sebelum mengirim formulir secara final."}>
      <div className="kp-wrapper">
        
        {isAlreadySubmitted ? (
          <div className="kp-success-box">
            <div className="kp-success-icon">
              <PartyPopper size={48} strokeWidth={1.5} />
            </div>
            <h2>Pendaftaran Berhasil Dikirim!</h2>
            <p>
              Terima kasih, data formulir dan berkas Anda telah kami terima.<br/>
              Pihak sekolah akan segera melakukan verifikasi data Anda.
            </p>
            <Link to="/calon-murid/status" className="kp-success-link">
              Lihat Status Pendaftaran <Send size={18} />
            </Link>
          </div>
        ) : (
          <>
            <ProgressCard 
              title="Formulir Pendaftaran" 
              description="Status kelengkapan data diri, alamat, dan orang tua."
              value={formProgress} 
              icon={FileText}
            />
            <ProgressCard 
              title="Berkas Pendaftaran" 
              description="Status unggah dokumen persyaratan wajib."
              value={berkasProgress} 
              icon={FolderOpen}
            />

            <div className="kp-submit-box">
              <h3>Siap untuk dikirim?</h3>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !isReadyToSubmit}
                className="kp-submit-btn"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {submitting ? 'Sedang Mengirim...' : 'Kirim Pendaftaran Sekarang'}
              </button>
              
              {!isReadyToSubmit && (
                <p className="kp-msg-error">
                  * Anda harus melengkapi 100% formulir dan berkas sebelum dapat mengirim pendaftaran.
                </p>
              )}
              {isReadyToSubmit && (
                <p className="kp-msg-success">
                  ✓ Berkas lengkap! Pendaftaran Anda siap dikirim.
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </CalonMuridLayout>
  );
}
